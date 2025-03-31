import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DollarSign,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  ChevronDown,
  Tag,
  CreditCard,
  Wallet,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { CreateTransactionData } from "../../services/api";

interface AddTransactionFormProps {
  onSubmit: (transaction: CreateTransactionData) => void;
  onCancel: () => void;
}

// Predefined categories for expenses and income
const expenseCategories = [
  "Groceries",
  "Rent",
  "Utilities",
  "Transportation",
  "Entertainment",
  "Healthcare",
  "Shopping",
  "Dining Out",
  "Education",
  "Travel",
  "Insurance",
  "Personal Care",
  "Gifts",
  "Other",
];

const incomeCategories = [
  "Salary",
  "Freelance",
  "Investments",
  "Business",
  "Rental Income",
  "Side Projects",
  "Bonus",
  "Other",
];

const paymentTypes = [
  { id: "cash", name: "Cash", icon: Wallet },
  { id: "online", name: "Online", icon: CreditCard },
];

export function AddTransactionForm({
  onSubmit,
  onCancel,
}: AddTransactionFormProps) {
  const [type, setType] = useState<"income" | "expense">("expense");
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category: "",
    customCategory: "",
    date: new Date().toISOString().split("T")[0],
    paymentType: "cash",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      category: formData.category === "Other" ? formData.customCategory : formData.category,
      amount: Number(formData.amount),
      type,
      paymentType: formData.paymentType,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Transaction Type Dropdown */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Transaction Type
        </label>
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowTypeDropdown(!showTypeDropdown)}
            className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
          >
            <div className="flex items-center gap-2">
              {type === "expense" ? (
                <ArrowDownRight className="h-4 w-4 text-red-500" />
              ) : (
                <ArrowUpRight className="h-4 w-4 text-green-500" />
              )}
              <span className={cn(
                "font-medium",
                type === "expense" ? "text-red-500" : "text-green-500"
              )}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </span>
            </div>
            <ChevronDown className={cn(
              "h-4 w-4 text-gray-400 transition-transform duration-200",
              showTypeDropdown && "transform rotate-180"
            )} />
          </button>

          <AnimatePresence>
            {showTypeDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute z-50 w-full mt-1 bg-gray-900 border border-gray-800 rounded-lg shadow-xl overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => {
                    setType("expense");
                    setShowTypeDropdown(false);
                  }}
                  className={cn(
                    "w-full px-4 py-2 flex items-center gap-2 transition-colors duration-200",
                    type === "expense" 
                      ? "bg-gray-800 text-red-500"
                      : "text-gray-300 hover:bg-gray-800"
                  )}
                >
                  <ArrowDownRight className="h-4 w-4" />
                  Expense
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setType("income");
                    setShowTypeDropdown(false);
                  }}
                  className={cn(
                    "w-full px-4 py-2 flex items-center gap-2 transition-colors duration-200",
                    type === "income"
                      ? "bg-gray-800 text-green-500"
                      : "text-gray-300 hover:bg-gray-800"
                  )}
                >
                  <ArrowUpRight className="h-4 w-4" />
                  Income
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Description Input */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Description
        </label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            required
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
            placeholder="Enter transaction description"
          />
        </div>
      </div>

      {/* Amount Input */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Amount
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            ₹
          </span>
          <input
            type="number"
            required
            min="0"
            step="0.01"
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
            className="w-full pl-7 pr-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
            placeholder="0.00"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-300">
          Category
        </label>
        <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
          {(type === "expense" ? expenseCategories : incomeCategories).map(
            (category) => (
              <button
                key={category}
                type="button"
                onClick={() => setFormData({ 
                  ...formData, 
                  category,
                  customCategory: category === "Other" ? formData.customCategory : ""
                })}
                className={cn(
                  "py-2 px-3 text-sm font-medium rounded-lg transition-all duration-200 text-center",
                  formData.category === category
                    ? type === "expense"
                      ? "bg-gray-800 text-white border border-white"
                      : "bg-gray-800 text-white border border-white"
                    : "bg-gray-900 text-gray-400 hover:text-white hover:border-white border border-gray-800"
                )}
              >
                {category}
              </button>
            )
          )}
        </div>

        {/* Custom Category Input */}
        {formData.category === "Other" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              required
              value={formData.customCategory}
              onChange={(e) =>
                setFormData({ ...formData, customCategory: e.target.value })
              }
              placeholder="Enter custom category"
              className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
            />
          </motion.div>
        )}
      </div>

      {/* Payment Type */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-300">
          Payment Type
        </label>
        <div className="grid grid-cols-4 gap-2">
          {paymentTypes.map((paymentType) => {
            return (
              <button
                key={paymentType.id}
                type="button"
                onClick={() => setFormData({ ...formData, paymentType: paymentType.id })}
                className={cn(
                  "py-2 px-3 text-sm font-medium rounded-lg transition-all duration-200 text-center",
                  formData.paymentType === paymentType.id
                    ? "bg-gray-800 text-white border border-white"
                    : "bg-gray-900 text-gray-400 hover:text-white hover:border-white border border-gray-800"
                )}
              >
                <span className="text-xs font-medium">{paymentType.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Date Input */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Date
        </label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"/>
          <input
            type="date"
            required
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2 px-4 text-sm font-medium text-gray-300 bg-gray-900 rounded-lg border border-gray-800 hover:bg-gray-800 transition-all duration-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 py-2 px-4 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-200"
        >
          Add Transaction
        </button>
      </div>
    </form>
  );
}
