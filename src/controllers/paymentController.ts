import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { calculateRiskScore, generateExplanation, shouldBlockTransaction } from '../services/fraudDetectionService';
import { TransactionInput, createTransaction } from '../models/transaction';

export const processPayment = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const transactionInput: TransactionInput = {
      amount: req.body.amount,
      currency: req.body.currency,
      source: req.body.source,
      email: req.body.email
    };

    // Calculate risk score
    const riskScore = calculateRiskScore(transactionInput);
    
    // Determine if payment should be blocked
    const shouldBlock = shouldBlockTransaction(riskScore);
    
    // Generate human-readable explanation
    const explanation = generateExplanation(
      transactionInput,
      riskScore,
      shouldBlock ? 'failed' : 'success' 
    );

    // IF shouldBlock is false then send payment request to stripe

    // Create transaction record
    const transaction = createTransaction(
      transactionInput,
      shouldBlock ? 'failed' : 'success',
      riskScore,
      shouldBlock ? null : 'stripe'
    );
        
    // Return response based on transaction status
    return res.status(shouldBlock ? 400 : 200).json({
      transactionId: transaction.id,
      provider: transaction.provider,
      status: transaction.status,
      riskScore: transaction.riskScore,
      explanation
    });
  } catch (error) {
    console.error('Error processing payment:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: 'There was an error processing your payment request.'
    });
  }
};


