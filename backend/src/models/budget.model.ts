import mongoose, { Schema, Document } from 'mongoose';

export interface IBudget extends Document {
  user: mongoose.Types.ObjectId;
  name: string;
  amount: number;
  category: string;
  startDate?: Date;
  endDate?: Date;
  description?: string;
  isActive: boolean;
  spent: number;
  remaining: number;
  notifications?: {
    enabled: boolean;
    threshold: number;
    frequency: 'daily' | 'weekly' | 'monthly';
  };
  createdAt: Date;
  updatedAt: Date;
}

const budgetSchema = new Schema<IBudget>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  description: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  spent: {
    type: Number,
    default: 0,
    min: 0
  },
  remaining: {
    type: Number,
    default: 0,
    min: 0
  },
  notifications: {
    enabled: {
      type: Boolean,
      default: false
    },
    threshold: {
      type: Number,
      min: 0,
      max: 100
    },
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly']
    }
  }
}, {
  timestamps: true
});

// Indexes
budgetSchema.index({ user: 1, category: 1 });
budgetSchema.index({ user: 1, period: 1 });
budgetSchema.index({ user: 1, type: 1 });

export const Budget = mongoose.model<IBudget>('Budget', budgetSchema); 