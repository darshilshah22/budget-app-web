import express from 'express';
import { body } from 'express-validator';
import {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  getAllTransactions
} from '../controllers/transaction.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

// Validation middleware for create operation
const createTransactionValidation = [
  body('type')
    .isIn(['income', 'expense'])
    .withMessage('Type must be either income or expense'),
  body('amount')
    .isNumeric()
    .withMessage('Amount must be a number')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be greater than 0'),
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isString()
    .withMessage('Category must be a string')
    .trim(),
  body('description')
    .notEmpty()
    .withMessage('Description is required')
    .trim(),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format'),
  body('paymentType')
    .isIn(['online', 'cash'])
    .withMessage('Payment type must be either online or cash')
];

// Validation middleware for update operation
const updateTransactionValidation = [
  body('type')
    .optional()
    .isIn(['income', 'expense'])
    .withMessage('Type must be either income or expense'),
  body('amount')
    .optional()
    .isNumeric()
    .withMessage('Amount must be a number')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be greater than 0'),
  body('category')
    .optional()
    .isString()
    .withMessage('Category must be a string')
    .trim(),
  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string')
    .trim(),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format'),
  body('paymentType')
    .optional()
    .isIn(['online', 'cash'])
    .withMessage('Payment type must be either online or cash')
];

// Routes
router.use(protect); // Protect all transaction routes

router.route('/')
  .post(createTransactionValidation, createTransaction)
  .get(getTransactions);

router.route('/all')
  .get(getAllTransactions);

router.route('/:id')
  .get(getTransactionById)
  .put(updateTransactionValidation, updateTransaction)
  .delete(deleteTransaction);

export default router; 