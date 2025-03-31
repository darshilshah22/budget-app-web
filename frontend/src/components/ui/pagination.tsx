import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  hasNextPage,
  hasPrevPage,
}: PaginationProps) {
  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <motion.button
          key={i}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onPageChange(i)}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            currentPage === i
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
              : "text-gray-400 hover:text-white hover:bg-gray-800"
          }`}
        >
          {i}
        </motion.button>
      );
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center space-x-2 mt-6">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrevPage}
        className={`p-2 rounded-lg transition-all duration-200 ${
          hasPrevPage
            ? "text-gray-400 hover:text-white hover:bg-gray-800"
            : "text-gray-600 cursor-not-allowed"
        }`}
      >
        <ChevronLeft className="h-5 w-5" />
      </motion.button>

      {renderPageNumbers()}

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNextPage}
        className={`p-2 rounded-lg transition-all duration-200 ${
          hasNextPage
            ? "text-gray-400 hover:text-white hover:bg-gray-800"
            : "text-gray-600 cursor-not-allowed"
        }`}
      >
        <ChevronRight className="h-5 w-5" />
      </motion.button>
    </div>
  );
} 