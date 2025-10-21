import Game from '../models/Game.js';
import crypto from 'crypto';

// Generate unique 6-character room code
const generateRoomCode = () => {
  return crypto.randomBytes(3).toString('hex').toUpperCase();
};

export const createGame = async (req, res, next) => {
  try {
    const { gameType, name } = req.body;
    const roomCode = generateRoomCode();

    const game = await Game.create({
      gameType,
      name,
      creator: req.userId,
      roomCode,
      participants: [{
        userId: req.userId,
        role: 'creator'
      }],
      currentScore: initializeScore(gameType)
    });

    const populatedGame = await Game.findById(game._id)
      .populate('creator', 'username profilePicture')
      .populate('participants.userId', 'username profilePicture');

    res.status(201).json({ 
      success: true, 
      game: populatedGame 
    });
  } catch (error) {
    next(error);
  }
};

export const getGames = async (req, res, next) => {
  try {
    const { status, gameType } = req.query;
    const filter = {};
    
    if (status) filter.status = status;
    if (gameType) filter.gameType = gameType;

    const games = await Game.find(filter)
      .populate('creator', 'username profilePicture')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ success: true, games });
  } catch (error) {
    next(error);
  }
};

export const getGame = async (req, res, next) => {
  try {
    const game = await Game.findById(req.params.id)
      .populate('creator', 'username profilePicture')
      .populate('participants.userId', 'username profilePicture');

    if (!game) {
      return res.status(404).json({ 
        message: 'Game not found' 
      });
    }

    res.json({ success: true, game });
  } catch (error) {
    next(error);
  }
};

export const joinGame = async (req, res, next) => {
  try {
    const { roomCode } = req.body;

    const game = await Game.findOne({ roomCode });
    
    if (!game) {
      return res.status(404).json({ 
        message: 'Game not found with this room code' 
      });
    }

    // Check if user already in game
    const alreadyJoined = game.participants.some(
      p => p.userId.toString() === req.userId
    );

    if (alreadyJoined) {
      return res.status(400).json({ 
        message: 'Already joined this game' 
      });
    }

    game.participants.push({
      userId: req.userId,
      role: 'viewer'
    });

    await game.save();

    const populatedGame = await Game.findById(game._id)
      .populate('creator', 'username profilePicture')
      .populate('participants.userId', 'username profilePicture');

    res.json({ success: true, game: populatedGame });
  } catch (error) {
    next(error);
  }
};

export const updateGameStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const game = await Game.findById(req.params.id);

    if (!game) {
      return res.status(404).json({ 
        message: 'Game not found' 
      });
    }

    // Only creator can update status
    if (game.creator.toString() !== req.userId) {
      return res.status(403).json({ 
        message: 'Not authorized' 
      });
    }

    game.status = status;
    if (status === 'live' && !game.startTime) {
      game.startTime = new Date();
    }
    if (status === 'completed' && !game.endTime) {
      game.endTime = new Date();
    }

    await game.save();

    res.json({ success: true, game });
  } catch (error) {
    next(error);
  }
};

// Helper function to initialize score based on game type
function initializeScore(gameType) {
  switch(gameType) {
    case 'cricket':
      return { runs: 0, wickets: 0, overs: 0, balls: 0 };
    case 'basketball':
      return { team1: 0, team2: 0 };
    case 'football':
      return { team1: 0, team2: 0 };
    default:
      return {};
  }
}
