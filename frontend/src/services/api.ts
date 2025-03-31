import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

console.log(API_URL);
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to add the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export interface SignUpData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthResponse {
  data: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    token: string;
  };
}

export const authService = {
  signUp: async (data: SignUpData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/users/register", data);
    if (response.data.data.token) {
      localStorage.setItem("token", response.data.data.token);
    }
    return response.data;
  },

  signIn: async (data: SignInData): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>("/users/login", data);
      console.log(response.data.data.token);
      if (response.data.data.token) {
        localStorage.setItem("token", response.data.data.token);
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  signOut: () => {
    localStorage.removeItem("token");
  },

  getCurrentUser: async (): Promise<AuthResponse> => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }
      const response = await api.get("/users/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        localStorage.removeItem("token");
      }
      throw error;
    }
  },
};

export interface Transaction {
  _id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  type: "income" | "expense";
  paymentType: string;
}

export interface CreateTransactionData {
  description: string;
  amount: number;
  category: string;
  date: string;
  type: "income" | "expense";
  paymentType: string;
}

export interface TransactionResponse {
  data: Transaction;
}

export interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface TransactionsResponse {
  data: {
    transactions: Transaction[];
    pagination: PaginationData;
  };
}

export const transactionService = {
  getTransactions: async (page: number = 1, limit: number = 10): Promise<TransactionsResponse> => {
    const response = await api.get<TransactionsResponse>(`/transactions?page=${page}&limit=${limit}`);
    return response.data;
  },

  getAllTransactions: async (): Promise<TransactionsResponse> => {
    const response = await api.get<TransactionsResponse>("/transactions/all");
    return response.data;
  },

  getTransactionById: async (id: string): Promise<TransactionResponse> => {
    const response = await api.get<TransactionResponse>(`/transactions/${id}`);
    return response.data;
  },

  createTransaction: async (data: CreateTransactionData): Promise<TransactionResponse> => {
    const response = await api.post<TransactionResponse>("/transactions", data);
    return response.data;
  },

  updateTransaction: async (id: string, data: Partial<CreateTransactionData>): Promise<TransactionResponse> => {
    const response = await api.patch<TransactionResponse>(`/transactions/${id}`, data);
    return response.data;
  },

  deleteTransaction: async (id: string): Promise<void> => {
    await api.delete(`/transactions/${id}`);
  },
};

export interface Budget {
  _id: string;
  user: string;
  category: string;
  amount: number;
  spent: number;
  remaining: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface BudgetResponse {
  data: Budget;
}

export interface BudgetsResponse {
  data: Budget[];
}

export const budgetService = {
  getBudgets: async (): Promise<BudgetsResponse> => {
    const response = await api.get<BudgetsResponse>("/budgets");
    return response.data;
  },

  getBudgetById: async (id: string): Promise<BudgetResponse> => {
    const response = await api.get<BudgetResponse>(`/budgets/${id}`);
    return response.data;
  },

  createBudget: async (data: Omit<Budget, '_id'>): Promise<BudgetResponse> => {
    const response = await api.post<BudgetResponse>("/budgets", data);
    return response.data;
  },

  updateBudget: async (id: string, data: Partial<Budget>): Promise<BudgetResponse> => {
    const response = await api.patch<BudgetResponse>(`/budgets/${id}`, data);
    return response.data;
  },

  deleteBudget: async (id: string): Promise<void> => {
    await api.delete(`/budgets/${id}`);
  },
};

export interface Insight {
  _id: string;
  type: 'warning' | 'success' | 'info' | 'trend' | 'recommendation' | 'alert';
  title: string;
  description: string;
  category: string;
  amount: number;
  percentage: number;
  createdAt: string;
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
}

export interface InsightsResponse {
  data: Insight[];
}

export const insightService = {
  getInsights: async (): Promise<InsightsResponse> => {
    const response = await api.get<InsightsResponse>("/insights");
    return response.data;
  },
};
