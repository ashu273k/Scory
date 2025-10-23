import express from 'express';
import {
  createGame,
  getGames,
  getGame,
  joinGame,
  leaveGame,
  updateGameStatus,
  updateScore,
  getGameEvents,
  deleteGame,
} from '../controllers/gameController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateRequest, validateQuery } from '../middleware/validationMiddleware.js';
import {
  createGameSchema,
  joinGameSchema,
  updateGameStatusSchema,
  updateScoreSchema,
  gameQuerySchema,
} from '../validators/gameValidators.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.post('/', validateRequest(createGameSchema), createGame);
router.get('/', validateQuery(gameQuerySchema), getGames);
router.get('/:id', getGame);
router.post('/join', validateRequest(joinGameSchema), joinGame);
router.post('/:id/leave', leaveGame);
router.put('/:id/status', validateRequest(updateGameStatusSchema), updateGameStatus);
router.put('/:id/score', validateRequest(updateScoreSchema), updateScore);
router.get('/:id/events', getGameEvents);
router.delete('/:id', deleteGame);

export default router;
