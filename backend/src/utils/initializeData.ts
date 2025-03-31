import Category from '../models/category.model';
import logger from './logger';

const defaultCategories = {
  expense: [
    { name: 'food', icon: '🍽️', color: '#FF5733' },
    { name: 'transportation', icon: '🚗', color: '#33FF57' },
    { name: 'housing', icon: '🏠', color: '#3357FF' },
    { name: 'utilities', icon: '💡', color: '#FF33F6' },
    { name: 'healthcare', icon: '🏥', color: '#33FFF6' },
    { name: 'entertainment', icon: '🎮', color: '#F6FF33' },
    { name: 'shopping', icon: '🛍️', color: '#FF3333' },
    { name: 'education', icon: '📚', color: '#33FF33' },
    { name: 'personal care', icon: '💅', color: '#3333FF' },
    { name: 'other', icon: '📦', color: '#CCCCCC' }
  ],
  income: [
    { name: 'salary', icon: '💰', color: '#33FF57' },
    { name: 'freelance', icon: '💻', color: '#3357FF' },
    { name: 'investments', icon: '📈', color: '#FF5733' },
    { name: 'gifts', icon: '🎁', color: '#FF33F6' },
    { name: 'other', icon: '📦', color: '#CCCCCC' }
  ]
};

export const initializeCategories = async (userId: string) => {
  try {
    // Check if user already has default categories
    const existingCategories = await Category.find({ userId, isDefault: true });
    if (existingCategories.length > 0) {
      return;
    }

    // Create expense categories
    const expenseCategories = defaultCategories.expense.map(cat => ({
      userId,
      name: cat.name,
      type: 'expense',
      icon: cat.icon,
      color: cat.color,
      isDefault: true
    }));

    // Create income categories
    const incomeCategories = defaultCategories.income.map(cat => ({
      userId,
      name: cat.name,
      type: 'income',
      icon: cat.icon,
      color: cat.color,
      isDefault: true
    }));

    await Category.insertMany([...expenseCategories, ...incomeCategories]);
    logger.info(`Default categories created for user ${userId}`);
  } catch (error) {
    logger.error('Error creating default categories:', error);
    throw error;
  }
}; 