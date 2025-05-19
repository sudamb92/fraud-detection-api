import { expect } from 'chai';
import { TransactionInput, createTransaction, getTransactions, getTransactionsByEmail, clearTransactions } from '../models/transaction';

describe('Transaction Model', () => {
  beforeEach(() => {
    // Clear transactions before each test
    clearTransactions();
  });

  describe('createTransaction', () => {
    it('should create a transaction with valid input', () => {
      const input: TransactionInput = {
        amount: 100,
        currency: 'USD',
        source: 'card',
        email: 'test@example.com'
      };

      const transaction = createTransaction(input, 'success', 0.2, 'stripe');

      expect(transaction).to.have.property('id');
      expect(transaction.amount).to.equal(100);
      expect(transaction.currency).to.equal('USD');
      expect(transaction.source).to.equal('card');
      expect(transaction.email).to.equal('test@example.com');
      expect(transaction.status).to.equal('success');
      expect(transaction.riskScore).to.equal(0.2);
      expect(transaction.provider).to.equal('stripe');
      expect(transaction).to.have.property('timestamp');
    });
  });

  describe('getTransactions', () => {
    it('should return all transactions', () => {
      const input1: TransactionInput = {
        amount: 100,
        currency: 'USD',
        source: 'card',
        email: 'test1@example.com'
      };

      const input2: TransactionInput = {
        amount: 200,
        currency: 'USD',
        source: 'card',
        email: 'test2@example.com'
      };

      createTransaction(input1, 'success', 0.2, 'stripe');
      createTransaction(input2, 'success', 0.3, 'stripe');

      const transactions = getTransactions();
      console.log(transactions);
      expect(transactions).to.have.length(2);
    });
  });

  describe('getTransactionsByEmail', () => {
    it('should return transactions for specific email', () => {
      const input1: TransactionInput = {
        amount: 100,
        currency: 'USD',
        source: 'card',
        email: 'test@example.com'
      };

      const input2: TransactionInput = {
        amount: 200,
        currency: 'USD',
        source: 'card',
        email: 'other@example.com'
      };

      createTransaction(input1, 'success', 0.2, 'stripe');
      createTransaction(input2, 'success', 0.3, 'stripe');

      const transactions = getTransactionsByEmail('test@example.com');
      expect(transactions).to.have.length(1);
      expect(transactions[0].email).to.equal('test@example.com');
    });

  });
}); 