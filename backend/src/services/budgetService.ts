import { Budget, IBudget } from "../models/budget.model";
import { Transaction } from "../models/transaction.model";
import mongoose from "mongoose";

export class BudgetService {
  static async getBudgets(userId: string): Promise<IBudget[]> {
    try {
      const budgets = await Budget.find({ user: userId }).sort({
        createdAt: -1,
      });

      // Calculate spent and remaining amounts for each budget
      const budgetsWithCalculations = await Promise.all(
        budgets.map(async (budget) => {
          if (!budget.startDate || !budget.endDate) {
            return budget;
          }

          // Get transactions for this budget's category within the date range
          const transactions = await Transaction.find({
            userId: budget.user,
            category: budget.category,
            isActive: true,
            date: {
              $gte: budget.startDate,
              $lte: budget.endDate,
            },
          });

          // Calculate total spent
          const totalSpent = transactions.reduce(
            (sum, transaction) => sum + transaction.amount,
            0
          );

          // Calculate remaining amount
          const remaining = budget.amount - totalSpent;

          // Update budget with calculated values
          budget.spent = totalSpent;
          budget.remaining = remaining;

          return budget;
        })
      );

      return budgetsWithCalculations;
    } catch (error) {
      console.error("Error fetching budgets:", error);
      throw error;
    }
  }

  static async getBudgetById(
    userId: string,
    budgetId: string
  ): Promise<IBudget | null> {
    const budget = await Budget.findOne({
      _id: budgetId,
      user: userId,
    });

    if (!budget || !budget.startDate || !budget.endDate) {
      return budget;
    }

    // Get transactions for this budget's category within the date range
    const transactions = await Transaction.find({
      user: userId,
      category: budget.category,
      date: {
        $gte: budget.startDate,
        $lte: budget.endDate,
      },
    });

    // Calculate total spent
    const totalSpent = transactions.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );

    // Calculate remaining amount
    const remaining = budget.amount - totalSpent;

    // Update budget with calculated values
    budget.spent = totalSpent;
    budget.remaining = remaining;

    return budget;
  }

  static async createBudget(
    userId: string,
    budgetData: Partial<IBudget>
  ): Promise<IBudget> {
    const budget = await Budget.create({
      ...budgetData,
      user: userId,
      spent: 0,
      remaining: budgetData.amount || 0,
      isActive: true,
    });

    return budget;
  }

  static async updateBudget(
    userId: string,
    budgetId: string,
    updateData: Partial<IBudget>
  ): Promise<IBudget | null> {
    const budget = await Budget.findOneAndUpdate(
      { _id: budgetId, user: userId },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!budget) {
      return null;
    }

    // If amount was updated, recalculate remaining
    if (updateData.amount !== undefined) {
      budget.remaining = budget.amount - budget.spent;
      await budget.save();
    }

    return budget;
  }

  static async deleteBudget(
    userId: string,
    budgetId: string
  ): Promise<IBudget | null> {
    return Budget.findOneAndDelete({
      _id: budgetId,
      user: userId,
    });
  }
}
