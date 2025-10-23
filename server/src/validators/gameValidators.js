import { z } from 'zod';

export const createGameSchema = z.object({
  gameType: z.enum(['cricket', 'football', 'basketball', 'custom'], {
    errorMap: () => ({ message: 'Invalid game type' }),
  }),
  name: z
    .string()
    .min(3, 'Game name must be at least 3 characters')
    .max(100, 'Game name cannot exceed 100 characters')
    .trim(),
});

export const joinGameSchema = z.object({
  roomCode: z
    .string()
    .length(6, 'Room code must be exactly 6 characters')
    .toUpperCase(),
});

export const updateGameStatusSchema = z.object({
  status: z.enum(['waiting', 'live', 'completed', 'cancelled']),
});

export const updateScoreSchema = z.object({
  currentScore: z.record(z.any()),
  eventType: z.string().optional(),
  eventData: z.record(z.any()).optional(),
});

export const gameQuerySchema = z.object({
  status: z.string().optional(),
  gameType: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  page: z.coerce.number().int().min(1).default(1),
});