import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  DollarSign,
  Download,
  Upload,
  AlertCircle,
  CheckCircle,
  Info,
} from 'lucide-react';
import { Card } from '../components/ui/card';
import { Modal } from '../components/ui/modal';
import { BudgetForm } from '../components/budgets/budget-form';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchBudgets, createBudget, updateBudget } from '../store/slices/budgetSlice';
import { fetchInsights } from '../store/slices/insightSlice';
import { Budget, Insight } from '../services/api';
import toast from 'react-hot-toast';

const colorMap = {
  blue: 'from-blue-500 to-blue-600',
  green: 'from-green-500 to-green-600',
  purple: 'from-purple-500 to-purple-600',
  red: 'from-red-500 to-red-600',
  yellow: 'from-yellow-500 to-yellow-600',
};

export default function Budgets() {
  const dispatch = useAppDispatch();
  const { budgets, isLoading: budgetsLoading, error: budgetsError } = useAppSelector((state) => state.budgets);
  const { insights, isLoading: insightsLoading, error: insightsError } = useAppSelector((state) => state.insights);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [showAddBudget, setShowAddBudget] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);

  useEffect(() => {
    dispatch(fetchBudgets());
    dispatch(fetchInsights());
  }, [dispatch]);

  useEffect(() => {
    if (budgetsError) {
      toast.error(budgetsError);
    }
    if (insightsError) {
      toast.error(insightsError);
    }
  }, [budgetsError, insightsError]);

  const handleAddBudget = async (data: Pick<Budget, 'category' | 'amount' | 'startDate' | 'endDate'>) => {
    try {
      await dispatch(createBudget(data)).unwrap();
      toast.success('Budget created successfully');
      setShowAddBudget(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create budget');
    }
  };

  const handleUpdateBudget = async (data: Pick<Budget, 'category' | 'amount' | 'startDate' | 'endDate'>) => {
    if (!selectedBudget) return;
    try {
      await dispatch(updateBudget({ id: selectedBudget._id, data })).unwrap();
      toast.success('Budget updated successfully');
      setSelectedBudget(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update budget');
    }
  };

  // const handleDeleteBudget = async (id: string) => {
  //   try {
  //     await dispatch(deleteBudget(id)).unwrap();
  //     toast.success('Budget deleted successfully');
  //   } catch (error: any) {
  //     toast.error(error.message || 'Failed to delete budget');
  //   }
  // };

  const filteredBudgets = budgets.filter(budget =>
    budget.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInsightIcon = (type: Insight['type']) => {
    switch (type) {
      case 'warning':
        return AlertCircle;
      case 'success':
        return CheckCircle;
      case 'info':
        return Info;
      default:
        return Info;
    }
  };

  return (
    <>
      <div className="space-y-8 py-4 animate-fade-in">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white">Budgets</h1>
            <p className="text-gray-400 mt-1">
              Track and manage your spending across categories.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-6 py-3 text-sm font-medium text-gray-300 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Download className="h-5 w-5 mr-2" />
              Export
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-6 py-3 text-sm font-medium text-gray-300 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Upload className="h-5 w-5 mr-2" />
              Import
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddBudget(true)}
              className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Plus className="h-5 w-5 mr-2" />
              New Budget
            </motion.button>
          </div>
        </div>

        {/* Filters Section */}
        <Card className="hover-card">
          <div className="flex items-center justify-between">
            <div className="flex rounded-lg overflow-hidden">
              {(['week', 'month', 'year'] as const).map((period) => (
                <motion.button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-8 py-3 text-sm font-medium transition-all duration-200 ${
                    selectedPeriod === period
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800 bg-gray-800'
                  }`}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </motion.button>
              ))}
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search budgets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 w-72"
                />
              </div>
              <motion.button
                className="inline-flex items-center px-6 py-3 text-sm font-medium text-gray-300 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Filter className="h-5 w-5 mr-2" />
                Filters
              </motion.button>
            </div>
          </div>
        </Card>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Budget Overview */}
          <div className="lg:col-span-3">
            <div className="relative p-8 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-gray-700/50 shadow-xl backdrop-blur-sm overflow-hidden">
              {/* Decorative Elements */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 pointer-events-none" />
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl" />
              
              {/* Content */}
              <div className="relative">
                <div className="flex items-center justify-between mb-10">
                  <div>
                    <h2 className="text-2xl font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                      Budget Overview
                    </h2>
                    <p className="text-gray-400 mt-1">Track your spending across categories</p>
                  </div>
                </div>

                {budgetsLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                ) : filteredBudgets.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="p-4 rounded-full bg-gray-800/50 mb-4">
                      <DollarSign className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-medium text-white mb-2">No Budgets Found</h3>
                    <p className="text-gray-400 mb-6">Create your first budget to start tracking your spending</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowAddBudget(true)}
                      className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Create Budget
                    </motion.button>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {filteredBudgets.map((budget) => (
                      <motion.div
                        key={budget._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="group relative p-6 bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 hover:shadow-lg cursor-pointer"
                        onClick={() => setSelectedBudget(budget)}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-800/0 via-gray-800/0 to-gray-800/0 group-hover:from-blue-500/5 group-hover:via-purple-500/5 group-hover:to-blue-500/5 rounded-xl transition-all duration-500" />
                        
                        <div className="relative space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-5">
                              <div className={`p-3.5 rounded-xl bg-gradient-to-br ${colorMap.blue} shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                                <span className="text-white text-xl font-medium">₹</span>
                              </div>
                              <div>
                                <h3 className="text-xl font-medium text-white group-hover:text-blue-300 transition-colors duration-300">
                                  {budget.category}
                                </h3>
                                <p className="text-base text-gray-400 mt-1 flex items-center gap-2">
                                  <span className="font-medium">₹{budget.spent.toFixed(2)}</span>
                                  <span className="text-gray-500">/</span>
                                  <span>₹{budget.amount.toFixed(2)}</span>
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div className="relative h-3 bg-gray-700/50 rounded-full overflow-hidden shadow-inner">
                            <div className="absolute inset-0 bg-gradient-to-r from-gray-700/20 to-gray-700/0 z-10" />
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(budget.spent / budget.amount) * 100}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className={`h-full bg-gradient-to-r ${colorMap.blue} relative`}
                            >
                              <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/10" />
                            </motion.div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Budget Insights */}
          <div className="lg:col-span-2">
            <div className="relative p-8 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-gray-700/50 shadow-xl backdrop-blur-sm overflow-hidden">
              {/* Decorative Elements */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 pointer-events-none" />
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl" />
              
              {/* Content */}
              <div className="relative">
                <div className="flex items-center justify-between mb-10">
                  <div>
                    <h2 className="text-2xl font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                      Budget Insights
                    </h2>
                    <p className="text-gray-400 mt-1">Smart recommendations for your budgets</p>
                  </div>
                </div>

                {insightsLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                  </div>
                ) : insightsError ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="p-4 rounded-full bg-red-500/10 mb-4">
                      <AlertCircle className="h-8 w-8 text-red-400" />
                    </div>
                    <h3 className="text-xl font-medium text-white mb-2">Error Loading Insights</h3>
                    <p className="text-gray-400 mb-6">{insightsError}</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => dispatch(fetchInsights())}
                      className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      Try Again
                    </motion.button>
                  </div>
                ) : insights.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="p-4 rounded-full bg-gray-800/50 mb-4">
                      <Info className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-medium text-white mb-2">No Insights Available</h3>
                    <p className="text-gray-400 mb-6">Add some budgets and transactions to generate insights</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => dispatch(fetchInsights())}
                      className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      Refresh Insights
                    </motion.button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {insights.map((insight) => {
                      const Icon = getInsightIcon(insight.type);
                      return (
                        <motion.div
                          key={insight._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="group relative p-6 bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 hover:shadow-lg"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-gray-800/0 via-gray-800/0 to-gray-800/0 group-hover:from-purple-500/5 group-hover:via-blue-500/5 group-hover:to-purple-500/5 rounded-xl transition-all duration-500" />
                          
                          <div className="relative space-y-4">
                            <div className="flex items-start space-x-4">
                              <div className={`p-3 rounded-xl bg-gradient-to-br ${
                                insight.type === 'warning' ? 'from-red-500 to-red-600' :
                                insight.type === 'success' ? 'from-green-500 to-green-600' :
                                'from-blue-500 to-blue-600'
                              } shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                                <Icon className="h-6 w-6 text-white" />
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
                                  <span className={`text-sm font-medium ${
                                    insight.percentage > 0 ? 'text-red-400' : 'text-green-400'
                                  }`}>
                                    {insight.percentage > 0 ? '+' : ''}{insight.percentage.toFixed(1)}%
                                  </span>
                                </div>
                              </div>
                            </div>

                            {insight.actionItems && insight.actionItems.length > 0 && (
                              <div className="mt-4 pt-4 border-t border-gray-700/50">
                                <h4 className="text-sm font-medium text-gray-300 mb-2">Recommended Actions:</h4>
                                <ul className="space-y-2">
                                  {insight.actionItems.map((action, index) => (
                                    <li key={index} className="flex items-center text-sm text-gray-400">
                                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"></span>
                                      {action}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Budget Modal */}
      <Modal
        isOpen={showAddBudget || !!selectedBudget}
        onClose={() => {
          setShowAddBudget(false);
          setSelectedBudget(null);
        }}
        title={selectedBudget ? 'Edit Budget' : 'New Budget'}
      >
        <BudgetForm
          onSubmit={selectedBudget ? handleUpdateBudget : handleAddBudget}
          onCancel={() => {
            setShowAddBudget(false);
            setSelectedBudget(null);
          }}
          initialData={selectedBudget || undefined}
        />
      </Modal>
    </>
  );
} 