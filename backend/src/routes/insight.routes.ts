import express from 'express';
import { body } from 'express-validator';
import {
  getInsights,
  generateInsights,
  getInsightsByType,
  getInsightsByCategory,
  getInsightsByPriority,
  deleteOldInsights
} from '../controllers/insight.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

// Validation middleware
const generateInsightsValidation = [
  body('days')
    .optional()
    .isInt({ min: 1, max: 90 })
    .withMessage('Days must be between 1 and 90')
];

// Routes
router.use(protect); // Protect all insight routes

// Get all insights
router.get('/', getInsights);

// Generate new insights
router.post('/generate', generateInsights);

// Get insights by type
router.get('/type/:type', getInsightsByType);

// Get insights by category
router.get('/category/:category', getInsightsByCategory);

// Get insights by priority
router.get('/priority/:priority', getInsightsByPriority);

// Delete old insights
router.delete('/cleanup', generateInsightsValidation, deleteOldInsights);

export default router; 