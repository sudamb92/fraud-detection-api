import { body } from 'express-validator';

export const validateChargeRequest = [
  body('amount')
    .isNumeric()
    .withMessage('Amount must be a number')
    .custom(value => value >= 0)
    .withMessage('Amount must be greater than 0'),
  
  body('currency')
    .isString()
    .withMessage('Currency must be a string')
    .isLength({ min: 3, max: 3 })
    .withMessage('Currency must be a 3-letter ISO code'),
  
  body('source')
    .isString()
    .withMessage('Source must be a string')
    .notEmpty()
    .withMessage('Source cannot be empty'),
  
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
]; 