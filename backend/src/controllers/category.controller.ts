import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Category from '../models/category.model';
import logger from '../utils/logger';
import { initializeCategories } from '../utils/initializeData';
import { successResponse, errorResponse } from '../utils/response';

// Create category
export const createCategory = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errorResponse('Validation error', errors.array()));
    }

    const { name, type, icon, color } = req.body;
    
    // Check if category already exists for this user
    const existingCategory = await Category.findOne({
      userId: req.user?._id,
      name: name.toLowerCase()
    });

    if (existingCategory) {
      return res.status(400).json(errorResponse('Category already exists'));
    }

    const category = new Category({
      userId: req.user?._id,
      name: name.toLowerCase(),
      type,
      icon,
      color
    });

    await category.save();
    res.status(201).json(successResponse('Category created successfully', category));
  } catch (error) {
    logger.error('Error creating category:', error);
    res.status(500).json(errorResponse('Server error', error));
  }
};

// Get all categories
export const getCategories = async (req: Request, res: Response) => {
  try {
    const { type } = req.query;
    const query: any = { 
      userId: req.user?._id,
      isActive: true
    };

    if (type) {
      query.type = type;
    }

    const categories = await Category.find(query).sort({ name: 1 });
    res.json(successResponse('Categories retrieved successfully', categories));
  } catch (error) {
    logger.error('Error getting categories:', error);
    res.status(500).json(errorResponse('Server error', error));
  }
};

// Get category by ID
export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
      userId: req.user?._id,
      isActive: true
    });

    if (!category) {
      return res.status(404).json(errorResponse('Category not found'));
    }

    res.json(successResponse('Category retrieved successfully', category));
  } catch (error) {
    logger.error('Error getting category:', error);
    res.status(500).json(errorResponse('Server error', error));
  }
};

// Update category
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errorResponse('Validation error', errors.array()));
    }

    const { name, icon, color } = req.body;
    const category = await Category.findOne({
      _id: req.params.id,
      userId: req.user?._id,
      isActive: true
    });

    if (!category) {
      return res.status(404).json(errorResponse('Category not found'));
    }

    if (name) {
      const existingCategory = await Category.findOne({
        userId: req.user?._id,
        name: name.toLowerCase(),
        _id: { $ne: req.params.id }
      });

      if (existingCategory) {
        return res.status(400).json(errorResponse('Category name already exists'));
      }
      category.name = name.toLowerCase();
    }

    if (icon) category.icon = icon;
    if (color) category.color = color;

    await category.save();
    res.json(successResponse('Category updated successfully', category));
  } catch (error) {
    logger.error('Error updating category:', error);
    res.status(500).json(errorResponse('Server error', error));
  }
};

// Delete category
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
      userId: req.user?._id,
      isDefault: false,
      isActive: true
    });

    if (!category) {
      return res.status(404).json(errorResponse('Category not found or cannot be deleted'));
    }

    category.isActive = false;
    await category.save();
    
    logger.info(`Category soft deleted: ${category.name}`);
    res.json(successResponse('Category deleted successfully'));
  } catch (error) {
    logger.error('Error deleting category:', error);
    res.status(500).json(errorResponse('Server error', error));
  }
};

export const initializeUserCategories = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    
    // Check if user already has categories
    const existingCategories = await Category.find({ userId });
    if (existingCategories.length > 0) {
      return res.status(400).json(errorResponse('Categories already initialized for this user'));
    }

    // Initialize categories
    await initializeCategories(userId?.toString() || '');
    
    // Fetch the created categories
    const categories = await Category.find({ userId });
    
    logger.info(`Categories initialized for user: ${userId}`);
    
    res.status(201).json(successResponse('Categories initialized successfully', categories));
  } catch (error) {
    logger.error('Error initializing categories:', error);
    res.status(500).json(errorResponse('Server error', error));
  }
}; 