import { Router } from 'express';
import { processPayment } from '../controllers/paymentController';
import { validateChargeRequest } from '../middleware/validation';

const router = Router();

// POST /charge endpoint
router.post('/charge', validateChargeRequest, processPayment);

export default router;
