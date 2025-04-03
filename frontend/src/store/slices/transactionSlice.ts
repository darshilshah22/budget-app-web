import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  transactionService,
  Transaction,
  CreateTransactionData,
  PaginationData,
} from "../../services/api";
import { generateInsights } from "./insightSlice";

interface TransactionState {
  transactions: Transaction[];
  allTransactions: Transaction[];
  pagination: PaginationData;
  isLoading: boolean;
  error: string | null;
}

const initialState: TransactionState = {
  transactions: [],
  allTransactions: [],
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  },
  isLoading: false,
  error: null,
};

export const fetchTransactions = createAsyncThunk(
  "transactions/fetchTransactions",
  async (
    { page, limit }: { page: number; limit: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await transactionService.getTransactions(page, limit);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch transactions"
      );
    }
  }
);

export const fetchAllTransactions = createAsyncThunk(
  "transactions/fetchAllTransactions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await transactionService.getAllTransactions();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch all transactions"
      );
    }
  }
);

export const createTransaction = createAsyncThunk(
  "transactions/createTransaction",
  async (
    data: CreateTransactionData,
    { rejectWithValue, dispatch, getState }
  ) => {
    try {
      const response = await transactionService.createTransaction(data);
      // Refresh the transactions list after creating a new transaction
      const state = getState() as { transactions: TransactionState };
      dispatch(
        fetchTransactions({
          page: state.transactions.pagination.page,
          limit: state.transactions.pagination.limit,
        })
      );
      dispatch(generateInsights());
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create transaction"
      );
    }
  }
);

export const updateTransaction = createAsyncThunk(
  "transactions/updateTransaction",
  async (
    { id, data }: { id: string; data: Transaction },
    { rejectWithValue, dispatch, getState }
  ) => {
    try {
      const response = await transactionService.updateTransaction(id, data);
      // Refresh the transactions list after updating
      const state = getState() as { transactions: TransactionState };
      dispatch(
        fetchTransactions({
          page: state.transactions.pagination.page,
          limit: state.transactions.pagination.limit,
        })
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update transaction"
      );
    }
  }
);

export const deleteTransaction = createAsyncThunk(
  "transactions/deleteTransaction",
  async (id: string, { rejectWithValue, dispatch, getState }) => {
    try {
      await transactionService.deleteTransaction(id);
      // Refresh the transactions list after deleting
      const state = getState() as { transactions: TransactionState };
      dispatch(
        fetchTransactions({
          page: state.transactions.pagination.page,
          limit: state.transactions.pagination.limit,
        })
      );
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete transaction"
      );
    }
  }
);

const transactionSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    },
    setLimit: (state, action) => {
      state.pagination.limit = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Transactions
      .addCase(fetchTransactions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transactions = action.payload.transactions;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch All Transactions
      .addCase(fetchAllTransactions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllTransactions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allTransactions = action.payload.transactions;
      })
      .addCase(fetchAllTransactions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create Transaction
      .addCase(createTransaction.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createTransaction.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update Transaction
      .addCase(updateTransaction.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateTransaction.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(updateTransaction.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Delete Transaction
      .addCase(deleteTransaction.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteTransaction.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteTransaction.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setPage, setLimit, clearError } = transactionSlice.actions;
export default transactionSlice.reducer;
