import { Router } from 'express';
import { getGames, postGames } from '../controllers/gamesController.js';
import { gamesValidation } from '../middlewares/gamesValidationMiddleware.js';
const router = Router();

router.get('/games', getGames);
router.post('/games', gamesValidation, postGames);

export default router;
