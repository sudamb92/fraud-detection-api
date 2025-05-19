# Fraud Detection Based Payment Routing System

A robust backend API built with Express.js and TypeScript that simulates routing payment requests to Stripe based on a fraud risk score. The system includes comprehensive fraud detection, transaction management, and automated testing.

## Features

- Advanced fraud detection algorithm based on multiple risk factors
- Payment routing to Stripe for low-risk transactions
- Blocking of high-risk transactions
- Request validation with express-validator
- In-memory transaction logging
- Comprehensive test suite with Mocha and Chai
- Transaction history management
- Email domain risk assessment
- Amount-based risk scoring
- Failed transaction tracking

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/sudamb92/fraud-detection-api.git
```

2. Install dependencies
```bash
cd fraud-detection-api
npm install
```

3. Start the development server
```bash
npm run dev
```

The API will be available at http://localhost:3000

## API Endpoints

### POST /api/charge

Process a payment and route it based on fraud risk analysis.

#### Request Body

```json
{
  "amount": 1000,
  "currency": "USD",
  "source": "tok_test",
  "email": "donor@example.com"
}
```

- `amount`: Number - Payment amount
- `currency`: String - Three-letter currency code
- `source`: String - Payment source token
- `email`: String - Customer email address

#### Success Response (200 OK)

```json
{
  "transactionId": "txn_abc123",
  "provider": "stripe",
  "status": "success",
  "riskScore": 0.32,
  "explanation": "This payment was routed to stripe due to a moderately low risk score based on a large amount and a suspicious email domain."
}
```

#### Failed Response (400 Bad Request)

```json
{
    "transactionId": "txn_abc345",
    "provider": null,
    "status": "failed",
    "riskScore": 0.8,
    "explanation": "Transaction rejected (risk score: 0.80). Risk factors: large first-time transaction."
}
```

### GET /api/transactions

Retrieve all transactions.

#### Success Response (200 OK)

```json
{
  "transactions": [
    {
      "id": "txn_abc123",
      "amount": 1000,
      "currency": "USD",
      "email": "donor@example.com",
      "status": "success",
      "riskScore": 0.32,
      "timestamp": "2024-03-20T10:00:00Z"
    }
  ]
}
```

### GET /api/transactions/:email

Retrieve transactions for a specific email address.

#### Success Response (200 OK)

```json
{
  "transactions": [
    {
      "id": "txn_abc123",
      "amount": 1000,
      "currency": "USD",
      "email": "donor@example.com",
      "status": "success",
      "riskScore": 0.32,
      "timestamp": "2024-03-20T10:00:00Z"
    }
  ]
}
```

## Assumption
As I have not maintain user records so not checked some most mandatory checks like
1. User is present in DB or not
2. User status is active or inactive. Based on user status perform further operation.

## Fraud Detection Logic

The API calculates a fraud risk score based on multiple factors:

1. Suspicious email domains
2. Transaction amount comparison with recent payment history
3. Failed transaction history
4. Email domain risk assessment
5. Amount-based risk scoring
6. Historical transaction patterns

## Testing

The project includes a comprehensive test suite using Mocha and Chai. Run the tests using:

```bash
npm test
```

Test coverage includes:
- Transaction model tests
- Fraud detection service tests
- Payment controller tests
- Transaction controller tests
- API endpoint integration tests

## Configuration

Fraud detection settings are managed in `src/config/index.ts`:

- `blockedEmailDomains`: List of suspicious email domains
- `blockedCountries`: List of blocked country codes
- `riskScoreThreshold`: Threshold for blocking transactions (default: 0.5)
- `maxAmount`: Maximum allowed transaction amount
- `suspiciousAmountThreshold`: Threshold for suspicious transaction amounts

## Project Structure

```
src/
├── config/         # Configuration files
├── controllers/    # API controllers
├── models/         # Data models
├── services/       # Business logic
├── routes/         # API routes
├── types/          # TypeScript type definitions
└── utils/          # Utility functions

test/
├── unit/          # Unit tests
└── integration/   # Integration tests
```

## Error Handling

The API implements comprehensive error handling for:
- Invalid request payloads
- Missing required fields
- Invalid amount values
- Invalid email formats
- High-risk transactions
- System errors

## License

MIT 