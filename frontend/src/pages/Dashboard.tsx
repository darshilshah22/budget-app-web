import {
  Calendar,
  Plus,
  Settings,
  PiggyBank,
  ArrowUpRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Pie,
  PieChart,
  Cell,
} from "recharts";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { monthlyData, categoryData, summaryCards } from "../data/sample-data";
import { RootState } from "../store";
import { useSelector } from "react-redux";
import { useAppSelector } from "../store/hooks";
import { Transaction } from "../services/api";
import { formatDateReadable } from "../utils";

const COLORS = ["#4ade80", "#f87171", "#fbbf24", "#60a5fa", "#a78bfa"];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-gray-800 border border-gray-700/50 rounded-lg shadow-xl p-4 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: payload[0].payload.fill }}
          />
          <span className="text-base font-medium text-white">{data.name}</span>
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-gray-400">Percentage:</span>
            <span className="text-sm font-medium text-white">
              {data.value}%
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-gray-400">Amount:</span>
            <span className="text-sm font-medium text-white">
              ₹{(data.value * 50).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const { user } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  const quickActions = [
    {
      icon: Plus,
      label: "Add Transaction",
      onClick: () => navigate("/transactions"),
    },
    {
      icon: PiggyBank,
      label: "Set Budget",
      onClick: () => navigate("/budgets"),
    },
    { icon: Calendar, label: "Schedule", onClick: () => navigate("/calendar") },
    { icon: Settings, label: "Settings", onClick: () => navigate("/settings") },
  ];

  const { allTransactions } = useAppSelector(
    (state: any) => state.transactions
  );

  return (
    <div className="space-y-8 py-4 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user?.firstName}
          </h1>
          <p className="text-gray-400">
            Here's what's happening with your finances today.
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto space-y-8">
        {/* Quick Actions */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className="group bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-center gap-3 text-gray-200 hover:bg-gray-700 hover:scale-105"
            >
              <div className="p-3 rounded-full bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors duration-300">
                <action.icon className="w-6 h-6 text-blue-500" />
              </div>
              <span className="font-medium">{action.label}</span>
            </button>
          ))}
        </section>

        {/* Summary Cards */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {summaryCards.map((card) => (
            <div
              className="bg-gray-800 px-6 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
              key={card.title}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-gray-400 text-sm">{card.title}</h3>
                <div className="p-2 rounded-full bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors duration-300">
                  <card.icon className="w-5 h-5 text-blue-500" />
                </div>
              </div>
              <p className="text-2xl font-bold text-white mb-4">{card.value}</p>
              <div className="flex items-center text-green-400 text-sm">
                <ArrowUpRight
                  className={`w-4 h-4 mr-1 ${
                    card.change.direction === "up"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                />
                <span
                  className={`${
                    card.change.direction === "up"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {card.change.direction === "up" ? "+" : "-"}
                  {card.change.value}% from last month
                </span>
              </div>
            </div>
          ))}
        </section>

        {/* Charts */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-semibold text-white mb-6">
              Monthly Overview
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "1px solid #374151",
                      borderRadius: "0.5rem",
                      color: "#F3F4F6",
                    }}
                  />
                  <Bar dataKey="income" fill="#4ade80" />
                  <Bar dataKey="expenses" fill="#f87171" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-semibold text-white mb-6">
              Expense Categories
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {categoryData.map((entry: any, index: number) => (
                      <Cell
                        key={`cell-${entry}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    content={<CustomTooltip />}
                    wrapperStyle={{ outline: "none" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Recent Transactions Table */}
        {allTransactions.length > 0 && (
          <section className="bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">
                Recent Transactions
              </h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center"
              >
                View All
                <ChevronRight className="w-4 h-4 ml-1" />
              </motion.button>
            </div>
            <div className="overflow-x-auto">
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
                  </tr>
                </thead>
                <tbody>
                  {allTransactions.map((transaction: Transaction) => (
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
                        {transaction.type === "income" ? "+" : "-"}₹{" "}
                        {transaction.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
