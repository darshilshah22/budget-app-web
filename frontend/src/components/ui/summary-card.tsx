import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface SummaryCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    direction: 'up' | 'down';
  };
  icon: LucideIcon;
  color: 'blue' | 'green' | 'purple' | 'red' | 'yellow';
  description?: string;
}

const colorMap = {
  blue: 'from-blue-500 to-blue-600',
  green: 'from-green-500 to-green-600',
  purple: 'from-purple-500 to-purple-600',
  red: 'from-red-500 to-red-600',
  yellow: 'from-yellow-500 to-yellow-600',
};

export function SummaryCard({
  title,
  value,
  change,
  icon: Icon,
  color,
  description,
}: SummaryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6 rounded-xl bg-gray-800/50 hover:bg-gray-800 transition-colors duration-200 shadow-lg hover:shadow-xl"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className={`p-3 rounded-full bg-gradient-to-r ${colorMap[color]} shadow-lg`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-white">{title}</h3>
            {description && (
              <p className="text-sm text-gray-400 mt-1">{description}</p>
            )}
          </div>
        </div>
        {change && (
          <div className="flex items-center space-x-2">
            <span className={`text-sm font-medium ${
              change.direction === 'up' ? 'text-green-400' : 'text-red-400'
            }`}>
              {change.direction === 'up' ? '+' : '-'}{Math.abs(change.value)}%
            </span>
            <Icon
              className={`h-4 w-4 ${
                change.direction === 'up' ? 'text-green-400' : 'text-red-400'
              }`}
            />
          </div>
        )}
      </div>
      <div className="mt-2">
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
    </motion.div>
  );
} 