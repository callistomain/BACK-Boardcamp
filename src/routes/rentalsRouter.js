import { Router } from 'express';
import { deleteRentals, getRentals, postRentals, postRentalsReturn } from '../controllers/rentalsController.js';
import { rentalsValidation } from '../middlewares/rentalsValidationMiddleware.js';
const router = Router();

router.get('/rentals', getRentals);
router.post('/rentals', rentalsValidation, postRentals);
router.post('/rentals/:id/return', postRentalsReturn);
router.delete('/rentals/:id', deleteRentals);

export default router;
