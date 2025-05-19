import config from '../config';
import { TransactionInput, Transaction, getTransactionsByEmail } from '../models/transaction';

export const calculateRiskScore = (input: TransactionInput): number => {
  let riskScore = 0;
  const userTransactions = getTransactionsByEmail(input.email);
  
  // Check for suspicious email domain
  const emailDomain = input.email.split('@')[1];
  if (config.blockedEmailDomains.some(domain => 
    emailDomain === domain || 
    (domain.startsWith('.') && emailDomain.endsWith(domain))
  )) {
    riskScore += 0.6; // High risk if email domain is blocked
  } else {
     /**
     * Here we can add more filters for domain age using ipQualityScore API 
     * If domain age is less than 3 months then we can add more risk score
     * If domain age is more than 6 months then we can add moderate risk score
     * If domain age is more than 1 year then we can add less risk score
     */
    riskScore += 0.1; // Low risk if email domain is not blocked
  }

  // Transaction amount check
  const filterSuccessTransactions = userTransactions.filter(transaction => transaction.status === 'success');
  if (filterSuccessTransactions.length > 0) {
    const avgAmount = filterSuccessTransactions.reduce((sum, tx) => sum + tx.amount, 0) / filterSuccessTransactions.length;
    /**
     * Here we can add more filters for large transaction amount:
     * 1. Transaction request location (country, region, city)
     * 2. Transaction request IP address(ipQualityScore API can help us)
     * 3. Transaction request device ID
     * 4. Transaction request user pattern
    */
    if (input.amount > avgAmount) {
      riskScore += 0.3; // High risk if transaction amount is more than twice the average amount of recent transactions
    } else {
      riskScore += 0.1; // Low risk if transaction amount is less than twice the average amount of recent transactions
    }
  } else {
    // Check if the transaction is the first time transaction
    if (input.amount > config.maxFirstTimeTransactionAmount) {
      riskScore += 0.6; // High risk if transaction amount is more than the max first time transaction amount
    } else {
      riskScore += 0.1; // Low risk if transaction amount is less than the max first time transaction amount
    }
  }

  // Transaction history check
  if (userTransactions.length >= 3) {
    const lastThree = userTransactions.slice(-config.maxFailedTransactions);
    
    // Check if all last three transactions were failed
    if (lastThree.every(tx => tx.status === 'failed')) {
      const lastTxTime = lastThree[lastThree.length - 1].timestamp;
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

      // Check if the last transaction was within the last 24 hours      
      if (lastTxTime > twentyFourHoursAgo) {
        riskScore += 0.6; // High risk if all recent transactions failed and attempted within the 24 hours
      } else {
        riskScore += 0.1; // Low risk if all recent transactions failed but not within the 24 hours
      }
    }
  } else {
    riskScore += 0.1; // Low risk if there are less than 3 transactions failed
  }

  riskScore = Number(riskScore.toFixed(2));

  // Ensure risk score is within 0-1 range
  return Math.min(Math.max(riskScore, 0), 1);
};


export const generateExplanation = (transaction: TransactionInput, riskScore: number, status: 'success' | 'failed'): string => {
  const score = riskScore;
  const formattedScore = score.toFixed(2);
  const userTransactions = getTransactionsByEmail(transaction.email);

  if (status === 'failed') {
    let explanation = `Transaction rejected (risk score: ${formattedScore}). `;
    
    // Add specific risk factors based on score components
    const riskFactors = [];
    
    // Check email domain (potentially contributed 0.6)
    const emailDomain = transaction.email.split('@')[1];
    if (config.blockedEmailDomains.some(domain => 
      emailDomain === domain || 
      (domain.startsWith('.') && emailDomain.endsWith(domain))
    )) {
      riskFactors.push("suspicious email domain");
    }
    
    // Check transaction amount
    const filterSuccessTransactions = userTransactions.filter(transaction => transaction.status === 'success');
    if (filterSuccessTransactions.length > 0) {
      const avgAmount = filterSuccessTransactions.reduce((sum, tx) => sum + tx.amount, 0) / filterSuccessTransactions.length;
      if (transaction.amount > 2 * avgAmount) {
        riskFactors.push("unusually large transaction amount");
      }
    } else if (transaction.amount > config.maxFirstTimeTransactionAmount) {
      riskFactors.push("large first-time transaction");
    }
    
    // Check transaction history
    if (userTransactions.length >= 3) {
      const lastThree = userTransactions.slice(-config.maxFailedTransactions);
      if (lastThree.every(tx => tx.status === 'failed')) {
        const lastTxTime = lastThree[lastThree.length - 1].timestamp;
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        
        if (lastTxTime > twentyFourHoursAgo) {
          riskFactors.push("multiple failed transactions in the last 24 hours");
        }
      }
    }
    
    // Create final explanation
    if (riskFactors.length > 0) {
      explanation += `Risk factors: ${riskFactors.join(", ")}.`;
    } else {
      explanation += "Multiple small risk factors combined to exceed our threshold.";
    }
    
    return explanation;
  } else {
    let explanation = `Transaction approved (risk score: ${formattedScore}). `;
    
    if (score < 0.3) {
      return explanation + "Transaction shows normal patterns with minimal risk factors.";
    } else {
      return explanation + "Transaction passed our checks but showed some elevated risk patterns.";
    }
  }
};

export const shouldBlockTransaction = (riskScore: number): boolean => {
  return riskScore > config.riskScoreThreshold;
}; 