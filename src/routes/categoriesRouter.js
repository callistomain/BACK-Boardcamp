import { Router } from 'express';
import { getCategories, postCategories } from '../controllers/categoriesController.js';
import { categoriesValidation } from '../middlewares/categoriesValidationMiddleware.js';
const router = Router();

router.get('/categories', getCategories);
router.post('/categories', categoriesValidation, postCategories);

export default router;
