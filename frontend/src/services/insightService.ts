import { api } from './api';

export interface Insight {
  _id: string;
  type: 'warning' | 'success' | 'info' | 'trend' | 'recommendation' | 'alert';
  title: string;
  description: string;
  category: string;
  amount: number;
  percentage: number;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  relatedBudgets: string[];
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
  user: string;
  createdAt: string;
}

class InsightService {
  async getInsights(): Promise<Insight[]> {
    const response = await api.get('/insights');
    return response.data.data;
  }

  async getInsightsByType(type: Insight['type']): Promise<Insight[]> {
    const response = await api.get(`/insights/type/${type}`);
    return response.data.data;
  }

  async getInsightsByCategory(category: string): Promise<Insight[]> {
    const response = await api.get(`/insights/category/${category}`);
    return response.data.data;
  }

  async getInsightsByPriority(priority: Insight['priority']): Promise<Insight[]> {
    const response = await api.get(`/insights/priority/${priority}`);
    return response.data.data;
  }

  async generateInsights(): Promise<Insight[]> {
    const response = await api.post('/insights/generate');
    return response.data.data;
  }

  async deleteOldInsights(days: number): Promise<void> {
    await api.delete(`/insights/old/${days}`);
  }
}

export const insightService = new InsightService(); 