import Game from '../models/Game.js';
import ScoreEvent from '../models/ScoreEvent.js';

// Create game
export const createGame = async (req, res) => {
  const { gameType, name } = req.body;

  const roomCode = await Game.generateRoomCode();

  const game = await Game.create({
    gameType,
    name,
    creator: req.userId,
    roomCode,
    participants: [
      {
        userId: req.userId,
        role: 'creator',
      },
    ],
  });

  game.initializeScore();
  await game.save();

  const populatedGame = await Game.findById(game._id)
    .populate('creator', 'username email profilePicture')
    .populate('participants.userId', 'username profilePicture');

  // Emit socket event (will be handled by socket middleware)
  req.app.get('io')?.emit('gameCreated', { game: populatedGame });

  res.status(201).json({
    success: true,
    message: 'Game created successfully',
    game: populatedGame,
  });
};
// Get all games with filters
export const getGames = async (req, res) => {
  // Use validatedQuery if available, otherwise use defaults
  const { status, gameType, limit = 50, page = 1 } = req.validatedQuery || {
    status: undefined,
    gameType: undefined,
    limit: 50,
    page: 1,
  };

  const filter = {};
  if (status) filter.status = status;
  if (gameType) filter.gameType = gameType;

  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 50;
  const skip = (pageNum - 1) * limitNum;

  const [games, total] = await Promise.all([
    Game.find(filter)
      .populate('creator', 'username profilePicture')
      .populate('participants.userId', 'username profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Game.countDocuments(filter),
  ]);

  res.json({
    success: true,
    games,
    pagination: {
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      limit: limitNum,
    },
  });
};

// Get single game
export const getGame = async (req, res) => {
  const { id } = req.params;

  const game = await Game.findById(id)
    .populate('creator', 'username email profilePicture')
    .populate('participants.userId', 'username profilePicture');

  if (!game) {
    return res.status(404).json({
      success: false,
      message: 'Game not found',
    });
  }

  res.json({
    success: true,
    game,
  });
};

// Join game with room code
export const joinGame = async (req, res) => {
  const { roomCode } = req.body;

  const game = await Game.findOne({ roomCode });

  if (!game) {
    return res.status(404).json({
      success: false,
      message: 'Game not found with this room code',
    });
  }

  if (game.isParticipant(req.userId)) {
    return res.status(400).json({
      success: false,
      message: 'You have already joined this game',
    });
  }

  if (game.status === 'completed' || game.status === 'cancelled') {
    return res.status(400).json({
      success: false,
      message: `Cannot join a ${game.status} game`,
    });
  }

  game.participants.push({
    userId: req.userId,
    role: 'viewer',
  });

  await game.save();

  const populatedGame = await Game.findById(game._id)
    .populate('creator', 'username profilePicture')
    .populate('participants.userId', 'username profilePicture');

  // Emit socket event
  req.app.get('io')?.to(game._id.toString()).emit('userJoined', {
    gameId: game._id,
    user: req.user.toSafeObject(),
  });

  res.json({
    success: true,
    message: 'Joined game successfully',
    game: populatedGame,
  });
};

// Leave game
export const leaveGame = async (req, res) => {
  const { id } = req.params;

  const game = await Game.findById(id);

  if (!game) {
    return res.status(404).json({
      success: false,
      message: 'Game not found',
    });
  }

  if (game.creator.toString() === req.userId) {
    return res.status(400).json({
      success: false,
      message: 'Creator cannot leave the game. Delete it instead.',
    });
  }

  game.participants = game.participants.filter(
    (p) => p.userId.toString() !== req.userId
  );

  await game.save();

  // Emit socket event
  req.app.get('io')?.to(id).emit('userLeft', {
    gameId: id,
    userId: req.userId,
  });

  res.json({
    success: true,
    message: 'Left game successfully',
  });
};

// Update game status
export const updateGameStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const game = await Game.findById(id);

  if (!game) {
    return res.status(404).json({
      success: false,
      message: 'Game not found',
    });
  }

  if (game.creator.toString() !== req.userId) {
    return res.status(403).json({
      success: false,
      message: 'Only the creator can update game status',
    });
  }

  game.status = status;

  if (status === 'live' && !game.startTime) {
    game.startTime = new Date();
  }

  if ((status === 'completed' || status === 'cancelled') && !game.endTime) {
    game.endTime = new Date();
  }

  await game.save();

  // Emit socket event
  req.app.get('io')?.to(id).emit('gameStatusUpdated', {
    gameId: id,
    status,
  });

  res.json({
    success: true,
    message: 'Game status updated successfully',
    game,
  });
};

// Update score
export const updateScore = async (req, res) => {
  const { id } = req.params;
  const { currentScore, eventType, eventData } = req.body;

  const game = await Game.findById(id);

  if (!game) {
    return res.status(404).json({
      success: false,
      message: 'Game not found',
    });
  }

  const userRole = game.getUserRole(req.userId);

  if (!['creator', 'scorer'].includes(userRole)) {
    return res.status(403).json({
      success: false,
      message: 'You do not have permission to update scores',
    });
  }

  if (game.status !== 'live') {
    return res.status(400).json({
      success: false,
      message: 'Can only update scores for live games',
    });
  }

  game.currentScore = currentScore;
  await game.save();

  // Create score event
  if (eventType && eventData) {
    await ScoreEvent.create({
      gameId: id,
      userId: req.userId,
      eventType,
      eventData,
    });
  }

  // Emit socket event
  req.app.get('io')?.to(id).emit('scoreUpdated', {
    gameId: id,
    currentScore,
    eventType,
    eventData,
    userId: req.userId,
  });

  res.json({
    success: true,
    message: 'Score updated successfully',
    currentScore,
  });
};

// Get game events
export const getGameEvents = async (req, res) => {
  const { id } = req.params;
  const limit = parseInt(req.query.limit) || 50;

  const events = await ScoreEvent.find({ gameId: id })
    .populate('userId', 'username profilePicture')
    .sort({ timestamp: -1 })
    .limit(limit);

  res.json({
    success: true,
    events,
  });
};

// Delete game
export const deleteGame = async (req, res) => {
  const { id } = req.params;

  const game = await Game.findById(id);

  if (!game) {
    return res.status(404).json({
      success: false,
      message: 'Game not found',
    });
  }

  if (game.creator.toString() !== req.userId) {
    return res.status(403).json({
      success: false,
      message: 'Only the creator can delete the game',
    });
  }

  await Promise.all([
    Game.findByIdAndDelete(id),
    ScoreEvent.deleteMany({ gameId: id }),
  ]);

  // Emit socket event
  req.app.get('io')?.to(id).emit('gameDeleted', { gameId: id });

  res.json({
    success: true,
    message: 'Game deleted successfully',
  });
};
