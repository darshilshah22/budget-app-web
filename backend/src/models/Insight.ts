import mongoose, { Schema, Document } from 'mongoose';

export interface IInsight extends Document {
  type: 'warning' | 'success' | 'info' | 'trend' | 'recommendation' | 'alert';
  title: string;
  description: string;
  category: string;
  amount: number;
  percentage: number;
  createdAt: Date;
  priority: 'low' | 'medium' | 'high';
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
}

const insightSchema = new Schema<IInsight>({
  type: {
    type: String,
    enum: ['warning', 'success', 'info', 'trend', 'recommendation', 'alert'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  percentage: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    required: true
  },
  tags: [{
    type: String
  }],
  relatedBudgets: [{
    type: Schema.Types.ObjectId,
    ref: 'Budget'
  }],
  actionItems: [{
    type: String
  }],
  trendData: {
    previousAmount: Number,
    currentAmount: Number,
    period: String
  },
  recommendation: {
    suggestedAmount: Number,
    reason: String,
    impact: String
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

export const Insight = mongoose.model<IInsight>('Insight', insightSchema); 