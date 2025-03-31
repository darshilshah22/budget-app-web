import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import budgetReducer from './slices/budgetSlice';
import transactionReducer from './slices/transactionSlice';
import insightReducer from './slices/insightSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    budgets: budgetReducer,
    transactions: transactionReducer,
    insights: insightReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 