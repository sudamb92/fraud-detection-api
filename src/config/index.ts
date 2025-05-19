export interface Config {
  blockedEmailDomains: string[];
  blockedCountries: string[];
  maxFirstTimeTransactionAmount: number;
  riskScoreThreshold: number;
  maxFailedTransactions: number;
}

const config: Config = {
  blockedEmailDomains: ['example.com', 'test.com'],
  blockedCountries: ['PK', 'BD', 'NG', 'VN'],
  maxFirstTimeTransactionAmount: 1000,
  riskScoreThreshold: 0.5,
  maxFailedTransactions: 3,
};

export default config; 