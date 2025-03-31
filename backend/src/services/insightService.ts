import { Budget } from "../models/budget.model";
import { Insight, IInsight } from "../models/Insight";
import { Transaction } from "../models/transaction.model";
import mongoose from "mongoose";

type InsightInput = {
  type: IInsight["type"];
  title: string;
  description: string;
  category: string;
  amount: number;
  percentage: number;
  priority: IInsight["priority"];
  tags: string[];
  relatedBudgets: mongoose.Types.ObjectId[];
  actionItems?: string[];
  trendData?: {
    previousAmount: number;
    currentAmount: number;
    period: string;
  };
  recommendation?: {
    suggestedAmount: number;
    reason: string;
    impact: string;
  };
  user: mongoose.Types.ObjectId;
};

export class InsightService {
  static async generateBudgetInsights(userId: string): Promise<IInsight[]> {
    const budgets = await Budget.find({ user: userId }).lean();
    const insights: InsightInput[] = [];

    for (const budget of budgets) {
      if (!budget.startDate || !budget.endDate) {
        continue; // Skip budgets without valid dates
      }

      // Get transactions for this budget's category
      const transactions = await Transaction.find({
        userId: budget.user,
        category: budget.category,
        isActive: true,
        date: {
          $gte: budget.startDate,
          $lte: budget.endDate,
        },
      });

      const totalSpent = transactions.reduce(
        (sum: number, t: any) => sum + t.amount,
        0
      );
      const percentageUsed = (totalSpent / budget.amount) * 100;

      // Generate warning insight if spending is high
      if (percentageUsed > 80) {
        //if there is already this type of insights it should not add another, please write code
        //find the existing insight from Mongodb, and if it exists, do not add it to the insights array
        const existingInsight = await Insight.findOne({
          user: new mongoose.Types.ObjectId(userId),
          type: "warning",
          category: budget.category,
        });

        if (!existingInsight) {
          insights.push({
            type: "warning",
            title: `High Spending Alert: ${budget.category}`,
            description: `You've used ${percentageUsed.toFixed(1)}% of your ${budget.category} budget`,
            category: budget.category,
            amount: totalSpent,
            percentage: percentageUsed,
            priority: percentageUsed > 90 ? "high" : "medium",
            tags: ["overspending", budget.category],
            relatedBudgets: [
              new mongoose.Types.ObjectId(budget._id.toString()),
            ],
            actionItems: [
              "Review your recent transactions",
              "Consider reducing spending in this category",
              "Look for potential savings opportunities",
            ],
            user: new mongoose.Types.ObjectId(userId),
          });
        }
      }

      // Generate success insight if spending is well managed
      if (percentageUsed < 70) {
        const existingInsight = insights.find(
          (insight) =>
            insight.type === "success" && insight.category === budget.category
        );

        if (!existingInsight) {
          insights.push({
            type: "success",
            title: `Well Managed: ${budget.category}`,
            description: `You're managing your ${budget.category} budget well, using only ${percentageUsed.toFixed(1)}%`,
            category: budget.category,
            amount: totalSpent,
            percentage: percentageUsed,
            priority: "low",
            tags: ["well-managed", budget.category],
            relatedBudgets: [
              new mongoose.Types.ObjectId(budget._id.toString()),
            ],
            user: new mongoose.Types.ObjectId(userId),
          });
        }
      }

      // Generate trend insight
      const previousPeriodTransactions = await Transaction.find({
        userId: budget.user,
        category: budget.category,
        isActive: true,
        date: {
          $gte: new Date(budget.startDate.getTime() - 30 * 24 * 60 * 60 * 1000),
          $lt: budget.startDate,
        },
      });

      if (previousPeriodTransactions.length > 0) {
        const previousSpent = previousPeriodTransactions.reduce(
          (sum: number, t: any) => sum + t.amount,
          0
        );
        const spendingChange =
          ((totalSpent - previousSpent) / previousSpent) * 100;

        const existingInsight = insights.find(
          (insight) =>
            insight.type === "trend" && insight.category === budget.category
        );

        if (!existingInsight) {
          insights.push({
            type: "trend",
            title: `Spending Trend: ${budget.category}`,
            description: `Your spending in ${budget.category} has ${spendingChange > 0 ? "increased" : "decreased"} by ${Math.abs(spendingChange).toFixed(1)}%`,
            category: budget.category,
            amount: totalSpent,
            percentage: spendingChange,
            priority: "medium",
            tags: ["trend", budget.category],
            relatedBudgets: [
              new mongoose.Types.ObjectId(budget._id.toString()),
            ],
            trendData: {
              previousAmount: previousSpent,
              currentAmount: totalSpent,
              period: "30 days",
            },
            user: new mongoose.Types.ObjectId(userId),
          });
        }

        // Generate recommendation insight
        if (spendingChange > 20) {
          const existingInsight = insights.find(
            (insight) =>
              insight.type === "recommendation" &&
              insight.category === budget.category
          );

          if (!existingInsight) {
            insights.push({
              type: "recommendation",
              title: `Budget Adjustment Recommended: ${budget.category}`,
              description: `Consider adjusting your ${budget.category} budget based on recent spending patterns`,
              category: budget.category,
              amount: totalSpent,
              percentage: spendingChange,
              priority: "medium",
              tags: ["recommendation", budget.category],
              relatedBudgets: [
                new mongoose.Types.ObjectId(budget._id.toString()),
              ],
              recommendation: {
                suggestedAmount: budget.amount * 1.2,
                reason: "Recent spending shows a significant increase",
                impact:
                  "This adjustment will help accommodate your current spending patterns",
              },
              user: new mongoose.Types.ObjectId(userId),
            });
          }
        }
      }
    }

    // Save all generated insights
    const savedInsights = await Insight.insertMany(insights);
    return savedInsights;
  }

  static async getInsights(userId: string): Promise<IInsight[]> {
    return Insight.find({ user: new mongoose.Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .populate("relatedBudgets");
  }

  static async getInsightsByType(
    userId: string,
    type: IInsight["type"]
  ): Promise<IInsight[]> {
    return Insight.find({ user: new mongoose.Types.ObjectId(userId), type })
      .sort({ createdAt: -1 })
      .populate("relatedBudgets");
  }

  static async getInsightsByCategory(
    userId: string,
    category: string
  ): Promise<IInsight[]> {
    return Insight.find({ user: new mongoose.Types.ObjectId(userId), category })
      .sort({ createdAt: -1 })
      .populate("relatedBudgets");
  }

  static async getInsightsByPriority(
    userId: string,
    priority: IInsight["priority"]
  ): Promise<IInsight[]> {
    return Insight.find({ user: new mongoose.Types.ObjectId(userId), priority })
      .sort({ createdAt: -1 })
      .populate("relatedBudgets");
  }

  static async deleteOldInsights(
    userId: string,
    daysOld: number = 30
  ): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    await Insight.deleteMany({
      user: new mongoose.Types.ObjectId(userId),
      createdAt: { $lt: cutoffDate },
    });
  }
}
