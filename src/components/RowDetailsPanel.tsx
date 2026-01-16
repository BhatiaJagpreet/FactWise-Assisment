'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Employee } from '@/types/dashboard';
import { formatCurrency, formatDate, getStatusColor, formatFullName } from '@/lib/formatters';

interface RowDetailsPanelProps {
  row: Employee | null;
  onClose: () => void;
}

export default function RowDetailsPanel({
  row,
  onClose,
}: RowDetailsPanelProps) {
  if (!row) return null;

  return (
    <AnimatePresence>
      {row && (
        <motion.div
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="w-96 bg-white border-l border-gray-200 p-6 overflow-y-auto shadow-xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">
              Employee Details
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="space-y-5">
            <div className="pb-4 border-b border-gray-200">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Employee ID
              </label>
              <p className="text-lg font-bold text-gray-900 mt-1">{row.id}</p>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Full Name
              </label>
              <p className="text-base text-gray-900 mt-1 font-semibold">
                {formatFullName(row.firstName, row.lastName)}
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Email
              </label>
              <p className="text-sm text-gray-700 mt-1">{row.email}</p>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Department
              </label>
              <p className="text-sm text-gray-900 mt-1 font-medium">{row.department}</p>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Position
              </label>
              <p className="text-sm text-gray-900 mt-1 font-medium">{row.position}</p>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Location
              </label>
              <p className="text-sm text-gray-700 mt-1">{row.location}</p>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Salary
              </label>
              <p className="text-lg font-bold text-blue-600 mt-1">
                {formatCurrency(row.salary)}
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Status
              </label>
              <div className="mt-1">
                <span
                  className={`inline-block px-3 py-1.5 rounded-full text-xs font-semibold border ${getStatusColor(
                    row.isActive
                  )}`}
                >
                  {row.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Performance Rating
              </label>
              <div className="mt-2">
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${getStatusColor(row.isActive)}`}
                      style={{ width: `${(row.performanceRating / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-base font-bold text-gray-900 min-w-[3rem] text-right">
                    {row.performanceRating.toFixed(1)}/5.0
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Projects Completed
              </label>
              <p className="text-lg font-bold text-gray-900 mt-1">{row.projectsCompleted}</p>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Hire Date
              </label>
              <p className="text-sm text-gray-700 mt-1">
                {formatDate(row.hireDate)}
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Age
              </label>
              <p className="text-sm text-gray-700 mt-1">{row.age} years</p>
            </div>

            {row.manager && (
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Manager
                </label>
                <p className="text-sm text-gray-900 mt-1 font-medium">{row.manager}</p>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Skills
              </label>
              <div className="mt-2 flex flex-wrap gap-2">
                {row.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg border border-blue-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
