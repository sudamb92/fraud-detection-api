import { expect } from 'chai';
import { Request, Response } from 'express';
import { processPayment } from '../controllers/paymentController';
import { getTransactions } from '../models/transaction';

describe('Payment Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseObject: any;

  beforeEach(() => {
    mockRequest = {
      body: {
        amount: 100,
        currency: 'USD',
        source: 'card',
        email: 'user@safe.com'
      }
    };

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
    getTransactions().length = 0;
  });

  describe('processPayment', () => {
    it('should process valid payment successfully', async () => {
      await processPayment(mockRequest as Request, mockResponse as Response);

      expect(responseObject).to.have.property('transactionId');
      expect(responseObject).to.have.property('status');
      expect(responseObject).to.have.property('riskScore');
      expect(responseObject).to.have.property('explanation');
      expect(responseObject.status).to.equal('success');
    });

    it('should reject payment with blocked email domain', async () => {
      mockRequest.body = {
        ...mockRequest.body,
        email: 'user@example.com'
      };

      await processPayment(mockRequest as Request, mockResponse as Response);

      expect(responseObject).to.have.property('status');
      expect(responseObject.status).to.equal('failed');
    });
  });
}); 