import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Budget, budgetService } from "../../services/api";

interface BudgetState {
  budgets: Budget[];
  isLoading: boolean;
  error: string | null;
}

const initialState: BudgetState = {
  budgets: [],
  isLoading: false,
  error: null,
};

export const fetchBudgets = createAsyncThunk(
  "budgets/fetchBudgets",
  async () => {
    const response = await budgetService.getBudgets();
    return response.data;
  }
);

export const createBudget = createAsyncThunk(
  "budgets/createBudget",
  async (data: Budget, { rejectWithValue }) => {
    try {
      const response = await budgetService.createBudget({
        ...data,
        user: "", // Will be set by the backend
        spent: 0,
        remaining: data.amount,
        isActive: true,
      });
      console.log(response);
      return response.data;
    } catch (error: any) {
      console.log(error.response.data.data[0].msg);
      return rejectWithValue(error.response.data.data[0].msg || "Login failed");
    }
  }
);

export const updateBudget = createAsyncThunk(
  "budgets/updateBudget",
  async ({
    id,
    data,
  }: {
    id: string;
    data: Pick<Budget, "category" | "amount" | "startDate" | "endDate">;
  }) => {
    const response = await budgetService.updateBudget(id, data);
    return response.data;
  }
);

export const deleteBudget = createAsyncThunk(
  "budgets/deleteBudget",
  async (id: string) => {
    await budgetService.deleteBudget(id);
    return id;
  }
);

const budgetSlice = createSlice({
  name: "budgets",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Budgets
      .addCase(fetchBudgets.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBudgets.fulfilled, (state, action) => {
        state.isLoading = false;
        state.budgets = action.payload;
      })
      .addCase(fetchBudgets.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch budgets";
      })
      // Create Budget
      .addCase(createBudget.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createBudget.fulfilled, (state, action) => {
        state.isLoading = false;
        state.budgets.push(action.payload);
      })
      .addCase(createBudget.rejected, (state, action) => {
        state.isLoading = false;
        console.log(action);
        state.error = action.payload as any || "Failed to create budget";
      })
      // Update Budget
      .addCase(updateBudget.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateBudget.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.budgets.findIndex(
          (budget) => budget._id === action.payload._id
        );
        if (index !== -1) {
          state.budgets[index] = action.payload;
        }
      })
      .addCase(updateBudget.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to update budget";
      })
      // Delete Budget
      .addCase(deleteBudget.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteBudget.fulfilled, (state, action) => {
        state.isLoading = false;
        state.budgets = state.budgets.filter(
          (budget) => budget._id !== action.payload
        );
      })
      .addCase(deleteBudget.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to delete budget";
      });
  },
});

export default budgetSlice.reducer;
