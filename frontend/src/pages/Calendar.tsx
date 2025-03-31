import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  DollarSign,
  Tag,
  Clock,
  X,
} from "lucide-react";
import { Card } from "../components/ui/card";
import { Transaction } from "../services/api";
import { formatDate, formatDateReadable } from "../utils";
import { useAppSelector } from "../store/hooks";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const currentDate = new Date();
// const currentMonth = currentDate.getMonth();
// const currentYear = currentDate.getFullYear();

function getDaysInMonth(month: number, year: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDay = firstDay.getDay();
  const days = [];

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startingDay; i++) {
    days.push(null);
  }

  // Add days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  return days;
}

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState<Date>(currentDate);
  const [selectedEvent, setSelectedEvent] = useState<Transaction | null>(null);
  // const [showAddTransaction, setShowAddTransaction] = useState(false);

  const { allTransactions } = useAppSelector((state: any) => state.transactions);

  const handlePrevMonth = () => {
    setSelectedDate(
      new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setSelectedDate(
      new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1)
    );
  };

  const getEventsForDate = (date: Date) => {
    return allTransactions.filter(
      (transaction: Transaction) => formatDate(transaction.date) === formatDate(date)
    );
  };

  const daysInMonth = getDaysInMonth(
    selectedDate.getMonth(),
    selectedDate.getFullYear()
  );
  const monthName = selectedDate.toLocaleString("default", { month: "long" });
  const year = selectedDate.getFullYear();

  // const handleAddTransaction = (transaction: Omit<Transaction, "id">) => {
  //   // Implement add functionality
  //   console.log("New transaction:", transaction);
  //   setShowAddTransaction(false);
  // };

  return (
    <>
      <div className="space-y-8 py-4 animate-fade-in">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white">Calendar</h1>
            <p className="text-gray-400 mt-1">
              Track your financial events and transactions.
            </p>
          </div>
        </div>

        {/* Calendar Header */}
        <Card className="p-6 hover-card border border-gray-700">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handlePrevMonth}
                className="p-2 rounded-full hover:bg-gray-800 transition-colors duration-200"
              >
                <ChevronLeft className="h-6 w-6 text-gray-400" />
              </motion.button>
              <h2 className="text-2xl font-semibold text-white">
                {monthName} {year}
              </h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleNextMonth}
                className="p-2 rounded-full hover:bg-gray-800 transition-colors duration-200"
              >
                <ChevronRight className="h-6 w-6 text-gray-400" />
              </motion.button>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <CalendarIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  value={selectedDate.toISOString().split("T")[0]}
                  onChange={(e) => setSelectedDate(new Date(e.target.value))}
                  className="pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-inner"
                />
              </div>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-4">
            {days.map((day) => (
              <div
                key={day}
                className="text-center text-sm font-medium text-gray-400 py-2"
              >
                {day}
              </div>
            ))}
            {daysInMonth.map((day) => (
              <motion.div
                key={day}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                className={`min-h-[100px] p-2 rounded-lg ${
                  day === null
                    ? "bg-gray-800/30"
                    : "bg-gray-800/50 hover:bg-gray-800 transition-colors duration-200"
                }`}
              >
                {day && (
                  <>
                    <div className="text-sm font-medium text-white mb-2">
                      {day}
                    </div>
                    <div className="space-y-1">
                      {getEventsForDate(
                        new Date(
                          selectedDate.getFullYear(),
                          selectedDate.getMonth(),
                          day
                        )
                      ).map((event: Transaction) => (
                        <motion.div
                          key={event._id}
                          whileHover={{ scale: 1.02 }}
                          onClick={() => setSelectedEvent(event)}
                          className="p-2 rounded bg-gray-700/50 cursor-pointer hover:bg-gray-700 transition-colors duration-200"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-white truncate">
                              {event.description}
                            </span>
                            <span
                              className={`text-xs font-medium ${
                                event.type === "income"
                                  ? "text-green-400"
                                  : "text-red-400"
                              }`}
                            >
                              ₹{event.amount.toFixed(2)}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Event Details Modal */}
        <AnimatePresence>
          {selectedEvent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gray-900 rounded-lg p-8 max-w-md w-full shadow-xl"
              >
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-xl font-semibold text-white">
                    Event Details
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedEvent(null)}
                    className="p-2 rounded-full hover:bg-gray-800 transition-colors duration-200"
                  >
                    <X className="h-5 w-5 text-gray-400" />
                  </motion.button>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Tag className="h-5 w-5 text-gray-400" />
                    <span className="text-white">{selectedEvent.category}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <span className="text-white">{formatDateReadable(selectedEvent.date)}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                    <span
                      className={`text-lg font-medium ${
                        selectedEvent.type === "income"
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      ₹{selectedEvent.amount.toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="mt-8 flex justify-end space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all duration-200"
                  >
                    Edit
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
                  >
                    View Details
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
