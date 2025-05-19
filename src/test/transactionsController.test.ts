import { expect } from 'chai';
import { Request, Response } from 'express';
import { processTransactions, processTransactionsByEmail } from '../controllers/transactionsController';
import { createTransaction, getTransactions, clearTransactions } from '../models/transaction';

describe('Transactions Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseObject: any;

  beforeEach(() => {
    mockRequest = {};
    responseObject = {};
    mockResponse = {
      json: (result: any) => {
        responseObject = result;
        return mockResponse as Response;
      },
      status: (code: number) => {
        responseObject.status = code;
        return mockResponse as Response;
      }
    };

    // Clear transactions before each test
    clearTransactions();
  });

  describe('processTransactions', () => {
    it('should return all transactions', async () => {
      // Create some test transactions
      createTransaction({
        amount: 100,
        currency: 'USD',
        source: 'card',
        email: 'test1@example.com'
      }, 'success', 0.2, 'stripe');

      createTransaction({
        amount: 200,
        currency: 'USD',
        source: 'card',
        email: 'test2@example.com'
      }, 'success', 0.3, 'stripe');

      await processTransactions(mockRequest as Request, mockResponse as Response);

      expect(responseObject).to.be.an('array');
      expect(responseObject).to.have.length(2);
    });

    it('should return empty array when no transactions exist', async () => {
      await processTransactions(mockRequest as Request, mockResponse as Response);

      expect(responseObject).to.be.an('array');
      expect(responseObject).to.be.empty;
    });
  });

  describe('processTransactionsByEmail', () => {
    it('should return transactions for specific email', async () => {
      // Create test transactions
      createTransaction({
        amount: 100,
        currency: 'USD',
        source: 'card',
        email: 'test@example.com'
      }, 'success', 0.2, 'stripe');

      createTransaction({
        amount: 200,
        currency: 'USD',
        source: 'card',
        email: 'other@example.com'
      }, 'success', 0.3, 'stripe');

      mockRequest.params = { email: 'test@example.com' };

      await processTransactionsByEmail(mockRequest as Request, mockResponse as Response);

      expect(responseObject).to.be.an('array');
      expect(responseObject).to.have.length(1);
      expect(responseObject[0].email).to.equal('test@example.com');
    });

    it('should return empty array for non-existent email', async () => {
      mockRequest.params = { email: 'nonexistent@example.com' };

      await processTransactionsByEmail(mockRequest as Request, mockResponse as Response);

      expect(responseObject).to.be.an('array');
      expect(responseObject).to.be.empty;
    });
  });
}); 