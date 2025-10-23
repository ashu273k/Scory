import mongoose from 'mongoose';

const scoreEventSchema = new mongoose.Schema(
  {
    gameId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Game',
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    eventType: {
      type: String,
      required: true,
      enum: [
        'score',
        'wicket',
        'goal',
        'foul',
        'timeout',
        'substitution',
        'custom',
      ],
    },
    eventData: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient queries
scoreEventSchema.index({ gameId: 1, timestamp: -1 });
scoreEventSchema.index({ gameId: 1, eventType: 1 });

const ScoreEvent = mongoose.model('ScoreEvent', scoreEventSchema);

export default ScoreEvent;
