import { expect } from 'chai';
import { calculateRiskScore, generateExplanation, shouldBlockTransaction } from '../services/fraudDetectionService';
import { TransactionInput, createTransaction } from '../models/transaction';
import config from '../config';

describe('Fraud Detection Service', () => {
  beforeEach(() => {
    // Clear transactions before each test
    createTransaction({
      amount: 100,
      currency: 'USD',
      source: 'card',
      email: 'test@safe.com'
    }, 'success', 0.2, 'stripe');
  });

  describe('calculateRiskScore', () => {
    it('should calculate high risk score for blocked email domain', () => {
      const input: TransactionInput = {
        amount: 100,
        currency: 'USD',
        source: 'card',
        email: `test@${config.blockedEmailDomains[0]}`
      };

      const riskScore = calculateRiskScore(input);
      expect(riskScore).to.be.greaterThan(0.6);
    });

    it('should calculate low risk score for normal transaction', () => {
      const input: TransactionInput = {
        amount: 100,
        currency: 'USD',
        source: 'card',
        email: 'test@safe.com'
      };

      const riskScore = calculateRiskScore(input);
      expect(riskScore).to.be.at.most(0.3);
    });

    it('should calculate high risk score for large first-time transaction', () => {
      const input: TransactionInput = {
        amount: config.maxFirstTimeTransactionAmount + 1000,
        currency: 'USD',
        source: 'card',
        email: 'newuser@safe.com'
      };

      const riskScore = calculateRiskScore(input);
      expect(riskScore).to.be.greaterThan(0.6);
    });
  });

  describe('generateExplanation', () => {
    it('should generate explanation for failed transaction', () => {
      const input: TransactionInput = {
        amount: 1000,
        currency: 'USD',
        source: 'card',
        email: 'test@example.com'
      };

      const explanation = generateExplanation(input, 0.8, 'failed');
      expect(explanation).to.include('Transaction rejected');
      expect(explanation).to.include('risk score: 0.80');
    });

    it('should generate explanation for successful transaction', () => {
      const input: TransactionInput = {
        amount: 100,
        currency: 'USD',
        source: 'card',
        email: 'test@example.com'
      };

      const explanation = generateExplanation(input, 0.2, 'success');
      expect(explanation).to.include('Transaction approved');
      expect(explanation).to.include('risk score: 0.20');
    });
  });

  describe('shouldBlockTransaction', () => {
    it('should block transaction with high risk score', () => {
      const shouldBlock = shouldBlockTransaction(0.8);
      expect(shouldBlock).to.be.true;
    });

    it('should not block transaction with low risk score', () => {
      const shouldBlock = shouldBlockTransaction(0.2);
      expect(shouldBlock).to.be.false;
    });
  });
}); 