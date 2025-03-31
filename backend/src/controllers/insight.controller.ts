import { Request, Response } from 'express';
import { InsightService } from '../services/insightService';
import { catchAsync } from '../utils/catchAsync';
import { IInsight } from '../models/Insight';
import { IUser } from '../models/user.model';

// Extend the Express Request type to include user
interface AuthenticatedRequest extends Request {
  user?: IUser;
}

export const getInsights = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user?._id) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  const insights = await InsightService.getInsights(req.user._id.toString());
  res.json({ data: insights });
});

export const generateInsights = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user?._id) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  const insights = await InsightService.generateBudgetInsights(req.user._id.toString());
  res.json({ data: insights });
});

export const getInsightsByType = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user?._id) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  const { type } = req.params;
  const validTypes: IInsight['type'][] = ['warning', 'success', 'info', 'trend', 'recommendation', 'alert'];

  if (!validTypes.includes(type as IInsight['type'])) {
    return res.status(400).json({ 
      message: 'Invalid insight type',
      validTypes 
    });
  }

  const insights = await InsightService.getInsightsByType(req.user._id.toString(), type as IInsight['type']);
  res.json({ data: insights });
});

export const getInsightsByCategory = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user?._id) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  const { category } = req.params;
  
  if (!category || typeof category !== 'string') {
    return res.status(400).json({ message: 'Category is required' });
  }

  const insights = await InsightService.getInsightsByCategory(req.user._id.toString(), category);
  res.json({ data: insights });
});

export const getInsightsByPriority = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user?._id) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  const { priority } = req.params;
  const validPriorities: IInsight['priority'][] = ['low', 'medium', 'high'];

  if (!validPriorities.includes(priority as IInsight['priority'])) {
    return res.status(400).json({ 
      message: 'Invalid priority level',
      validPriorities 
    });
  }

  const insights = await InsightService.getInsightsByPriority(req.user._id.toString(), priority as IInsight['priority']);
  res.json({ data: insights });
});

export const deleteOldInsights = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user?._id) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  const { days } = req.body;
  const daysToDelete = Number(days);

  if (isNaN(daysToDelete) || daysToDelete < 1 || daysToDelete > 90) {
    return res.status(400).json({ 
      message: 'Days must be a number between 1 and 90',
      default: 30
    });
  }

  await InsightService.deleteOldInsights(req.user._id.toString(), daysToDelete);
  res.json({ message: 'Old insights deleted successfully' });
}); 