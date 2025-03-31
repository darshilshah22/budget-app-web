import { useState, useEffect } from "react";
import { Plus, Search, Filter, Download, Edit, Trash2 } from "lucide-react";
import { Card } from "../components/ui/card";
import { Modal } from "../components/ui/modal";
import { Pagination } from "../components/ui/pagination";
import { AddTransactionForm } from "../components/transactions/add-transaction-form";
import { motion } from "framer-motion";
import { Transaction, CreateTransactionData } from "../services/api";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchTransactions, createTransaction, deleteTransaction } from '../store/slices/transactionSlice';
import { formatDateReadable } from "../utils";

export default function Transactions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const dispatch = useAppDispatch();
  const { transactions, isLoading, pagination } = useAppSelector((state: any) => state.transactions);

  useEffect(() => {
    dispatch(fetchTransactions({ page: 1, limit: 10 }));
  }, [dispatch]);

  const handlePageChange = (newPage: number) => {
    dispatch(fetchTransactions({ page: newPage, limit: pagination.limit }));
  };

  const filteredTransactions = transactions.filter(
    (transaction: Transaction) =>
      transaction.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = async (transaction: Transaction) => {
    // Implement edit functionality
    console.log("Edit transaction:", transaction);
  };

  const handleDelete = async (id: string) => {
    await dispatch(deleteTransaction(id)).unwrap();
    toast.success("Transaction deleted successfully");
  };

  const handleAddTransaction = async (data: CreateTransactionData) => {
    await dispatch(createTransaction(data)).unwrap();
    toast.success("Transaction added successfully");
    setShowAddTransaction(false);
  };

  return (
    <>
      <div className="space-y-8 py-4 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-white">Transactions</h1>
          <p className="text-gray-400 mt-1">
            Manage and track your financial transactions.
          </p>
        </div>

        {/* Filters and Search */}
        <Card className="hover-card">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div className="flex gap-2">
              <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-300 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all duration-200 hover-button">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </button>
              <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-300 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all duration-200 hover-button">
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </Card>

        {/* Transactions Table */}
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">
              All Transactions
            </h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddTransaction(true)}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Transaction
            </motion.button>
          </div>
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">
                        Date
                      </th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">
                        Description
                      </th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">
                        Category
                      </th>
                      <th className="text-right py-4 px-6 text-sm font-medium text-gray-400">
                        Amount
                      </th>
                      <th className="text-center py-4 px-6 text-sm font-medium text-gray-400">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((transaction: Transaction) => (
                      <tr
                        key={transaction._id}
                        className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors duration-200"
                      >
                        <td className="py-4 px-6 text-sm text-gray-300">
                          {formatDateReadable(transaction.date)}
                        </td>
                        <td className="py-4 px-6 text-sm text-white">
                          {transaction.description}
                        </td>
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-300">
                            {transaction.category}
                          </span>
                        </td>
                        <td
                          className={`py-4 px-6 text-sm font-medium text-right ${
                            transaction.type === "income"
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {transaction.type === "income" ? "+" : "-"}₹
                          {Math.abs(transaction.amount).toFixed(2)}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-center space-x-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleEdit(transaction)}
                              className="p-2 text-blue-400 hover:text-blue-300 transition-colors duration-200"
                            >
                              <Edit className="h-4 w-4 cursor-pointer" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDelete(transaction._id)}
                              className="p-2 text-red-400 hover:text-red-300 transition-colors duration-200"
                            >
                              <Trash2 className="h-4 w-4 cursor-pointer" />
                            </motion.button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                  hasNextPage={pagination.hasNextPage}
                  hasPrevPage={pagination.hasPrevPage}
                />
                <div className="text-center text-sm text-gray-400 mt-4">
                  Showing {transactions.length} of {pagination.total} transactions
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      {/* Add Transaction Modal */}
      <Modal
        isOpen={showAddTransaction}
        onClose={() => setShowAddTransaction(false)}
        title="Add New Transaction"
      >
        <AddTransactionForm
          onSubmit={handleAddTransaction}
          onCancel={() => setShowAddTransaction(false)}
        />
      </Modal>
    </>
  );
}
