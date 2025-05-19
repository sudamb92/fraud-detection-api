import { Router } from 'express';
import { processTransactions, processTransactionsByEmail } from '../controllers/transactionsController';
const router = Router();

// GET /transactions endpoint - returns all transactions
router.get('/', processTransactions);

// GET /transactions/:email endpoint - returns transactions by email
router.get('/:email', processTransactionsByEmail);

export default router;
