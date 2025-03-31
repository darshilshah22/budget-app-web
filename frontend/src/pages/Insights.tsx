import { useState } from "react";
import { motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle,
  Info,
  TrendingUp,
  Lightbulb,
  Bell,
  Filter,
  RefreshCw,
  X,
} from "lucide-react";
import { useInsights } from "../hooks/useInsights";
import { Insight } from "../services/insightService";
import AnimatedDropdown from "../components/ui/dropdown";
const priorityOrder = {
  high: 0,
  medium: 1,
  low: 2,
};

const typeIcons = {
  warning: AlertCircle,
  success: CheckCircle,
  info: Info,
  trend: TrendingUp,
  recommendation: Lightbulb,
  alert: Bell,
};

const typeColors = {
  warning: "from-red-500 to-red-600",
  success: "from-green-500 to-green-600",
  info: "from-blue-500 to-blue-600",
  trend: "from-purple-500 to-purple-600",
  recommendation: "from-yellow-500 to-yellow-600",
  alert: "from-orange-500 to-orange-600",
};

export default function Insights() {
  const {
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
  } = useInsights();

  const [sortBy, setSortBy] = useState<"priority" | "date" | "amount">(
    "priority"
  );
  const [showFilters, setShowFilters] = useState(false);

  const sortedInsights = [...insights].sort((a, b) => {
    switch (sortBy) {
      case "priority":
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      case "date":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "amount":
        return b.amount - a.amount;
      default:
        return 0;
    }
  });

  const categories = Array.from(
    new Set(insights.map((insight) => insight.category))
  );

  const getInsightIcon = (type: Insight["type"]) => {
    const Icon = typeIcons[type];
    return Icon ? <Icon className="h-6 w-6 text-white" /> : null;
  };

  const dropdownOptions = [
    { value: "priority", label: "Priority" },
    { value: "date", label: "Date" },
    { value: "amount", label: "Amount" },
  ];

  const typeDropdownOptions = [
    { value: "warning", label: "Warning" },
    { value: "success", label: "Success" },
    { value: "info", label: "Info" },
    { value: "trend", label: "Trend" },
    { value: "recommendation", label: "Recommendation" },
    { value: "alert", label: "Alert" },
    { value: "all", label: "All" },
  ];

  const priorityOptions = [
    { value: "high", label: "High" },
    { value: "medium", label: "Medium" },
    { value: "low", label: "Low" },
    { value: "all", label: "All" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Budget Insights</h1>
          <p className="text-gray-400 mt-1">
            Smart recommendations for your budgets
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={refreshInsights}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <RefreshCw className="h-5 w-5 mr-2" />
          Refresh Insights
        </motion.button>
      </div>

      {/* Filters and Sort */}
      <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-4 mb-8 w-full">
        <div className="flex items-center justify-between mb-4 w-full">
          <div className="flex items-center space-x-4 w-1/3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-700/50 rounded-lg hover:bg-gray-700/70 transition-colors duration-200"
            >
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </button>
            <AnimatedDropdown
              options={dropdownOptions}
              onSelect={(e) => setSortBy(e as "priority" | "date" | "amount")}
              placeholder="Sort"
            />
          </div>
          {(filters.type || filters.category || filters.priority) && (
            <button
              onClick={clearAllFilters}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors duration-200"
            >
              <X className="h-5 w-5 mr-2" />
              Clear Filters
            </button>
          )}
        </div>

        {showFilters && (
          <div className="flex items-center justify-start gap-8 mt-8 w-full">
            {/* Type Filter */}
            <div className="relative group w-1/3">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Type
              </label>
              <AnimatedDropdown
                options={typeDropdownOptions}
                onSelect={(e) => filterByType(e as Insight["type"])}
                placeholder="Type"
              />
            </div>

            {/* Category Filter */}
            <div className="relative group w-1/3">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Category
              </label>
              <AnimatedDropdown
                options={categories.map((category) => ({
                  value: category,
                  label: category,
                }))}
                onSelect={(e) => filterByCategory(e)}
                placeholder="Category"
              />
            </div>

            {/* Priority Filter */}
            <div className="relative group w-1/3">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Priority
              </label>
              <AnimatedDropdown
                options={priorityOptions}
                onSelect={(e) =>
                  filterByPriority(e as Insight["priority"])
                }
                placeholder="Priority"
              />
            </div>
          </div>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-white mb-2">
            Error Loading Insights
          </h3>
          <p className="text-gray-400 mb-6">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={generateNewInsights}
            className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Try Again
          </motion.button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && insights.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="p-4 rounded-full bg-gray-800/50 mb-4">
            <Info className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-medium text-white mb-2">
            No Insights Available
          </h3>
          <p className="text-gray-400 mb-6">
            Add some budgets and transactions to generate insights
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={generateNewInsights}
            className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Generate Insights
          </motion.button>
        </div>
      )}

      {/* Insights Grid */}
      {!isLoading && !error && insights.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedInsights.map((insight) => (
            <motion.div
              key={insight._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="group relative p-6 bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 hover:shadow-lg"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${
                  typeColors[insight.type]
                } opacity-0 group-hover:opacity-5 rounded-xl transition-opacity duration-300`}
              />

              <div className="relative space-y-4">
                <div className="flex items-start space-x-4">
                  <div
                    className={`p-3 rounded-xl bg-gradient-to-br ${
                      typeColors[insight.type]
                    } shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
                  >
                    {getInsightIcon(insight.type)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-white group-hover:text-blue-300 transition-colors duration-300">
                      {insight.title}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">
                      {insight.description}
                    </p>
                    <div className="flex items-center gap-4 mt-4">
                      <span className="text-sm font-medium text-gray-300">
                        ₹{insight.amount.toFixed(2)}
                      </span>
                      <span
                        className={`text-sm font-medium ${
                          insight.percentage > 0
                            ? "text-red-400"
                            : "text-green-400"
                        }`}
                      >
                        {insight.percentage > 0 ? "+" : ""}
                        {insight.percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>

                {insight.actionItems && insight.actionItems.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-700/50">
                    <h4 className="text-sm font-medium text-gray-300 mb-2">
                      Recommended Actions:
                    </h4>
                    <ul className="space-y-2">
                      {insight.actionItems.map((action, index) => (
                        <li
                          key={index}
                          className="flex items-center text-sm text-gray-400"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"></span>
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {insight.trendData && (
                  <div className="mt-4 pt-4 border-t border-gray-700/50">
                    <h4 className="text-sm font-medium text-gray-300 mb-2">
                      Trend Analysis:
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Previous Period:</span>
                        <span className="text-white">
                          ₹{insight.trendData.previousAmount.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Current Period:</span>
                        <span className="text-white">
                          ₹{insight.trendData.currentAmount.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Period:</span>
                        <span className="text-white">
                          {insight.trendData.period}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {insight.recommendation && (
                  <div className="mt-4 pt-4 border-t border-gray-700/50">
                    <h4 className="text-sm font-medium text-gray-300 mb-2">
                      Recommendation:
                    </h4>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-400">
                        {insight.recommendation.reason}
                      </p>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Suggested Amount:</span>
                        <span className="text-white">
                          ₹{insight.recommendation.suggestedAmount.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400">
                        {insight.recommendation.impact}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
