import { Request, Response } from 'express';
import { getTransactions, getTransactionsByEmail } from '../models/transaction';

export const processTransactions = async (req: Request, res: Response) => {
    try {
        const transactions = getTransactions();
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
};

export const processTransactionsByEmail = async (req: Request, res: Response) => {
    try {
      const { email } = req.params;
      const transactions = getTransactionsByEmail(email);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch transactions' });
    }
  }