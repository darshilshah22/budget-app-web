import { motion } from "framer-motion";
import { PlusCircle, AlertCircle, CreditCard } from "lucide-react";

const EmptyTransactionsView = ({ onAddTransaction }: { onAddTransaction: () => void }) => {
  // Animation variants for container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  // Animation variants for children elements
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  // Animation for floating effect
  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        variants={itemVariants}
        animate={floatingAnimation}
        className="mb-6"
      >
        <div className="relative">
          <CreditCard className="h-24 w-24 text-blue-400 opacity-80" />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.5,
              type: "spring",
              stiffness: 300,
              damping: 15,
            }}
            className="absolute -top-2 -right-2"
          >
            <AlertCircle className="h-8 w-8 text-gray-400" />
          </motion.div>
        </div>
      </motion.div>

      <motion.h3
        variants={itemVariants}
        className="text-xl font-bold text-white mb-3"
      >
        No Transactions Yet
      </motion.h3>

      <motion.p variants={itemVariants} className="text-gray-400 mb-8 max-w-md">
        Start tracking your finances by adding your first income or expense
        transaction.
      </motion.p>

      <motion.button
        variants={itemVariants}
        whileHover={{
          scale: 1.05,
          boxShadow: "0 0 15px rgba(59, 130, 246, 0.5)",
        }}
        whileTap={{ scale: 0.95 }}
        onClick={onAddTransaction}
        className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
      >
        <PlusCircle className="h-5 w-5 mr-2" />
        Add Your First Transaction
      </motion.button>

      <motion.div
        variants={itemVariants}
        className="mt-12 p-4 bg-gray-700/30 rounded-lg border border-gray-700"
      >
        <p className="text-sm text-gray-400">
          <span className="font-medium text-blue-400">Tip:</span> Regular
          tracking of transactions helps you gain better insights into your
          spending habits.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default EmptyTransactionsView;
