import mongoose from 'mongoose';
import crypto from 'crypto';

const participantSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  role: {
    type: String,
    enum: ['creator', 'scorer', 'viewer'],
    default: 'viewer',
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
});

const gameSchema = new mongoose.Schema(
  {
    gameType: {
      type: String,
      required: [true, 'Game type is required'],
      enum: {
        values: ['cricket', 'football', 'basketball', 'custom'],
        message: '{VALUE} is not a supported game type',
      },
    },
    name: {
      type: String,
      required: [true, 'Game name is required'],
      trim: true,
      maxlength: [100, 'Game name cannot exceed 100 characters'],
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    participants: [participantSchema],
    roomCode: {
      type: String,
      unique: true,
      required: true,
      uppercase: true,
    },
    status: {
      type: String,
      enum: ['waiting', 'live', 'completed', 'cancelled'],
      default: 'waiting',
    },
    currentScore: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    startTime: {
      type: Date,
    },
    endTime: {
      type: Date,
    },
    metadata: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for performance
gameSchema.index({ roomCode: 1 });
gameSchema.index({ creator: 1, status: 1 });
gameSchema.index({ status: 1, createdAt: -1 });
gameSchema.index({ 'participants.userId': 1 });

// Virtual for participant count
gameSchema.virtual('participantCount').get(function () {
  return this.participants.length;
});

// Static method to generate unique room code
gameSchema.statics.generateRoomCode = async function () {
  let roomCode;
  let isUnique = false;

  while (!isUnique) {
    roomCode = crypto.randomBytes(3).toString('hex').toUpperCase();
    const existingGame = await this.findOne({ roomCode });
    if (!existingGame) isUnique = true;
  }

  return roomCode;
};

// Method to check if user is participant
gameSchema.methods.isParticipant = function (userId) {
  return this.participants.some(
    (p) => p.userId.toString() === userId.toString()
  );
};

// Method to get user role in game
gameSchema.methods.getUserRole = function (userId) {
  const participant = this.participants.find(
    (p) => p.userId.toString() === userId.toString()
  );
  return participant?.role || null;
};

// Method to initialize score based on game type
gameSchema.methods.initializeScore = function () {
  switch (this.gameType) {
    case 'cricket':
      this.currentScore = {
        team1: { runs: 0, wickets: 0, overs: 0 },
        team2: { runs: 0, wickets: 0, overs: 0 },
        currentInnings: 1,
      };
      break;
    case 'basketball':
      this.currentScore = {
        team1: 0,
        team2: 0,
        quarter: 1,
      };
      break;
    case 'football':
      this.currentScore = {
        team1: 0,
        team2: 0,
        half: 1,
      };
      break;
    default:
      this.currentScore = {};
  }
};

const Game = mongoose.model('Game', gameSchema);

export default Game;
