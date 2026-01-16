'use client';

import { motion } from 'framer-motion';

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  index: number;
  trend?: string;
}

export default function SummaryCard({
  title,
  value,
  icon,
  index,
  trend,
}: SummaryCardProps) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all hover:scale-[1.02]"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <p className="text-xs text-gray-500 mt-1">{trend}</p>
          )}
        </div>
        <motion.div 
          className="relative w-14 h-14 rounded-xl flex items-center justify-center text-white shadow-lg overflow-hidden"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {/* Animated gradient background */}
          <div className="absolute inset-0 animated-gradient" />
          
          {/* Floating orbs */}
          <motion.div
            className="absolute w-8 h-8 bg-white/20 rounded-full blur-sm"
            animate={{
              x: [0, 10, -5, 0],
              y: [0, -8, 5, 0],
              scale: [1, 1.2, 0.9, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute w-4 h-4 bg-white/30 rounded-full blur-[2px]"
            animate={{
              x: [0, -8, 6, 0],
              y: [0, 6, -4, 0],
              scale: [1, 0.8, 1.1, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          />
          
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{
              x: [-100, 100],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
              ease: "easeInOut",
            }}
          />
          
          {/* Icon */}
          <motion.div 
            className="relative z-10"
            animate={{
              y: [0, -2, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {icon}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
