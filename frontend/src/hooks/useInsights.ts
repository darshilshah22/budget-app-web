import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import {
  fetchInsights,
  fetchInsightsByType,
  fetchInsightsByCategory,
  fetchInsightsByPriority,
  setTypeFilter,
  setCategoryFilter,
  setPriorityFilter,
  clearFilters,
  generateInsights,
} from '../store/slices/insightSlice';
import { Insight } from '../services/insightService';

export const useInsights = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { insights, isLoading, error, filters } = useSelector(
    (state: RootState) => state.insights
  );

  useEffect(() => {
    dispatch(fetchInsights());
  }, [dispatch]);

  const filterByType = (type: Insight['type']) => {
    dispatch(setTypeFilter(type));
    dispatch(fetchInsightsByType(type));
  };

  const filterByCategory = (category: string) => {
    dispatch(setCategoryFilter(category));
    dispatch(fetchInsightsByCategory(category));
  };

  const filterByPriority = (priority: Insight['priority']) => {
    dispatch(setPriorityFilter(priority));
    dispatch(fetchInsightsByPriority(priority));
  };

  const clearAllFilters = () => {
    dispatch(clearFilters());
    dispatch(fetchInsights());
  };

  const refreshInsights = () => {
    dispatch(fetchInsights());
  };

  const generateNewInsights = () => {
    dispatch(generateInsights());
  };

  return {
    insights,
    isLoading,
    error,
    filters,
    filterByType,
    filterByCategory,
    filterByPriority,
    clearAllFilters,
    refreshInsights,
    generateNewInsights,
  };
};
