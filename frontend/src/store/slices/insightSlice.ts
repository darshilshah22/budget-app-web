import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { insightService, Insight } from '../../services/insightService';

interface InsightState {
  insights: Insight[];
  isLoading: boolean;
  error: string | null;
  filters: {
    type: Insight['type'] | null;
    category: string | null;
    priority: Insight['priority'] | null;
  };
}

const initialState: InsightState = {
  insights: [],
  isLoading: false,
  error: null,
  filters: {
    type: null,
    category: null,
    priority: null,
  },
};

// Async thunks
export const fetchInsights = createAsyncThunk(
  'insights/fetchInsights',
  async () => {
    const response = await insightService.getInsights();
    return response;
  }
);

export const fetchInsightsByType = createAsyncThunk(
  'insights/fetchInsightsByType',
  async (type: Insight['type']) => {
    const response = await insightService.getInsightsByType(type);
    return response;
  }
);

export const fetchInsightsByCategory = createAsyncThunk(
  'insights/fetchInsightsByCategory',
  async (category: string) => {
    const response = await insightService.getInsightsByCategory(category);
    return response;
  }
);

export const fetchInsightsByPriority = createAsyncThunk(
  'insights/fetchInsightsByPriority',
  async (priority: Insight['priority']) => {
    const response = await insightService.getInsightsByPriority(priority);
    return response;
  }
);

export const generateInsights = createAsyncThunk(
  'insights/generateInsights',
  async () => {
    const response = await insightService.generateInsights();
    return response;
  }
);

const insightSlice = createSlice({
  name: 'insights',
  initialState,
  reducers: {
    setTypeFilter: (state, action) => {
      state.filters.type = action.payload;
    },
    setCategoryFilter: (state, action) => {
      state.filters.category = action.payload;
    },
    setPriorityFilter: (state, action) => {
      state.filters.priority = action.payload;
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all insights
      .addCase(fetchInsights.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchInsights.fulfilled, (state, action) => {
        state.isLoading = false;
        state.insights = action.payload;
      })
      .addCase(fetchInsights.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch insights';
      })
      // Fetch insights by type
      .addCase(fetchInsightsByType.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchInsightsByType.fulfilled, (state, action) => {
        state.isLoading = false;
        state.insights = action.payload;
      })
      .addCase(fetchInsightsByType.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch insights by type';
      })
      // Fetch insights by category
      .addCase(fetchInsightsByCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchInsightsByCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.insights = action.payload;
      })
      .addCase(fetchInsightsByCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch insights by category';
      })
      // Fetch insights by priority
      .addCase(fetchInsightsByPriority.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchInsightsByPriority.fulfilled, (state, action) => {
        state.isLoading = false;
        state.insights = action.payload;
      })
      .addCase(fetchInsightsByPriority.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch insights by priority';
      })
      // Generate insights
      .addCase(generateInsights.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(generateInsights.fulfilled, (state, action) => {
        state.isLoading = false;
        state.insights = action.payload;
      })
      .addCase(generateInsights.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to generate insights';
      });
  },
});

export const {
  setTypeFilter,
  setCategoryFilter,
  setPriorityFilter,
  clearFilters,
} = insightSlice.actions;

export default insightSlice.reducer; 