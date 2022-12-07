import { Router } from 'express';
import { getCustomers, getCustomersById, postCustomers, putCustomers } from '../controllers/customersController.js';
import { customersValidation } from '../middlewares/customersValidationMiddleware.js';
const router = Router();

router.get('/customers', getCustomers);
router.get('/customers/:id', getCustomersById);
router.post('/customers', customersValidation, postCustomers);
router.put('/customers/:id', customersValidation, putCustomers);

export default router;
