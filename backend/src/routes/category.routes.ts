import express from 'express';
import { body } from 'express-validator';
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  initializeUserCategories
} from '../controllers/category.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

// Validation middleware
const categoryValidation = [
  body('name')
    .notEmpty()
    .withMessage('Category name is required')
    .trim(),
  body('type')
    .isIn(['income', 'expense'])
    .withMessage('Type must be either income or expense'),
  body('icon')
    .optional()
    .isString()
    .withMessage('Icon must be a string'),
  body('color')
    .optional()
    .isString()
    .withMessage('Color must be a string')
    .matches(/^#[0-9A-Fa-f]{6}$/)
    .withMessage('Color must be a valid hex color code')
];

const updateCategoryValidation = [
  body('name')
    .optional()
    .notEmpty()
    .withMessage('Category name cannot be empty')
    .trim(),
  body('icon')
    .optional()
    .isString()
    .withMessage('Icon must be a string'),
  body('color')
    .optional()
    .isString()
    .withMessage('Color must be a string')
    .matches(/^#[0-9A-Fa-f]{6}$/)
    .withMessage('Color must be a valid hex color code')
];

// Routes
router.use(protect); // Protect all category routes

router.route('/')
  .post(categoryValidation, createCategory)
  .get(getCategories);

router.route('/:id')
  .get(getCategoryById)
  .put(updateCategoryValidation, updateCategory)
  .delete(deleteCategory);

// Initialize categories for user
router.post('/initialize', protect, initializeUserCategories);

export default router; 