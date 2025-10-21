import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
    
    gameType: {
        type: String,
        required: true,
        enum: ['cricket', 'football', 'basketball', 'custom']
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    participants: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        role: {
            type: String,
            enum: ['creator', 'scorer', 'viewer'],
            default: 'viewer'
        },
        joinedAt: {
            type: Date,
            default: Date.now
        }
    }],

    roomCode: {
        type: String,
        required: true,
        unique: true,
    },
    currentScore: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    startTime: Date,
    endTime: Date
}, {
    timestamps: true
})

// Create indexes for performance
gameSchema.index({ roomCode: 1 });
gameSchema.index({ creator: 1, status: 1 });
gameSchema.index({ createdAt: -1 });

const Game = mongoose.model('Game', gameSchema);
export default Game;