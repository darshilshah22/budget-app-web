import { Request, Response } from 'express';
import { Budget } from '../models/budget.model';
import { BudgetService } from '../services/budgetService';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { validationResult } from 'express-validator';

// Create budget
export const createBudget = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(new ApiError(400, 'Validation error', errors.array()));
    }

    if (!req.user?._id) {
      return res.status(401).json(new ApiError(401, 'User not authenticated'));
    }

    // Check if a budget with the same category already exists
    const existingBudget = await Budget.findOne({
      user: req.user._id,
      category: req.body.category,
      isActive: true
    });

    if (existingBudget) {
      return res.status(400).json(new ApiError(400, `A budget for category "${req.body.category}" already exists`));
    }

    const budget = await BudgetService.createBudget(req.user._id.toString(), req.body);
    res.status(201).json(new ApiResponse(201, 'Budget created successfully', budget));
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json(new ApiError(400, error.message));
    } else {
      res.status(500).json(new ApiError(500, 'Internal server error'));
    }
  }
};

// Get all budgets
export const getBudgets = async (req: Request, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json(new ApiError(401, 'User not authenticated'));
    }

    const budgets = await BudgetService.getBudgets(req.user._id.toString());
    res.status(200).json(new ApiResponse(200, 'Budgets retrieved successfully', budgets));
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json(new ApiError(400, error.message));
    } else {
      res.status(500).json(new ApiError(500, 'Internal server error'));
    }
  }
};

// Get budget by ID
export const getBudgetById = async (req: Request, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json(new ApiError(401, 'User not authenticated'));
    }

    const budget = await BudgetService.getBudgetById(req.user._id.toString(), req.params.id);

    if (!budget) {
      return res.status(404).json(new ApiError(404, 'Budget not found'));
    }

    res.status(200).json(new ApiResponse(200, 'Budget retrieved successfully', budget));
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json(new ApiError(400, error.message));
    } else {
      res.status(500).json(new ApiError(500, 'Internal server error'));
    }
  }
};

// Update budget
export const updateBudget = async (req: Request, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json(new ApiError(401, 'User not authenticated'));
    }

    const budget = await BudgetService.updateBudget(req.user._id.toString(), req.params.id, req.body);

    if (!budget) {
      return res.status(404).json(new ApiError(404, 'Budget not found'));
    }

    res.status(200).json(new ApiResponse(200, 'Budget updated successfully', budget));
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json(new ApiError(400, error.message));
    } else {
      res.status(500).json(new ApiError(500, 'Internal server error'));
    }
  }
};

// Delete budget
export const deleteBudget = async (req: Request, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json(new ApiError(401, 'User not authenticated'));
    }

    const budget = await BudgetService.deleteBudget(req.user._id.toString(), req.params.id);

    if (!budget) {
      return res.status(404).json(new ApiError(404, 'Budget not found'));
    }

    res.status(200).json(new ApiResponse(200, 'Budget deleted successfully', budget));
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json(new ApiError(400, error.message));
    } else {
      res.status(500).json(new ApiError(500, 'Internal server error'));
    }
  }
}; 