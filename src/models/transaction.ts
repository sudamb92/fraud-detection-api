import { v4 as uuidv4 } from 'uuid';

export interface TransactionInput {
  amount: number;
  currency: string;
  source: string;
  email: string;
}

export interface Transaction extends TransactionInput {
  id: string;
  timestamp: Date;
  status: 'success' | 'failed';
  riskScore: number;
  provider: 'stripe' | null;
}

// In-memory storage for transactions
const transactions: Transaction[] = [];

export const createTransaction = (input: TransactionInput, status: 'success' | 'failed', riskScore: number, provider: 'stripe' | null): Transaction => {
  const transaction: Transaction = {
    ...input,
    id: uuidv4(),
    timestamp: new Date(),
    status,
    riskScore,
    provider
  };
  
  transactions.push(transaction);
  return transaction;
};

export const getTransactions = (): Transaction[] => {
  return [...transactions];
};

export const getTransactionsByEmail = (email: string): Transaction[] => {
  return transactions.filter(t => t.email === email);
};

export const clearTransactions = (): void => {
  transactions.length = 0;
}; 
