'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Toaster, toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Tabs from '@/components/Tabs';
import SummaryCard from '@/components/SummaryCard';
import DataGrid from '@/components/DataGrid';
import RowFormModal from '@/components/RowFormModal';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';
import { Employee } from '@/types/dashboard';
import { calculateSummaryStats, formatCurrency } from '@/lib/formatters';
import sampleData from '@/data/sample-data.json';

export default function Dashboard() {
  const [data, setData] = useState<Employee[]>((sampleData as { employees: Employee[] }).employees || []);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Employee | null>(null);
  const [editingRow, setEditingRow] = useState<Employee | null>(null);
  const [deletingRow, setDeletingRow] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const summaryStats = useMemo(() => calculateSummaryStats(data), [data]);

  const handleAddRow = useCallback((formData: Partial<Employee>) => {
    setIsLoading(true);
    setTimeout(() => {
      const newEmployee = {
        ...formData,
        id: Math.max(...data.map(e => e.id)) + 1,
      } as Employee;
      setData((prev) => [...prev, newEmployee]);
      setIsLoading(false);
      setIsAddModalOpen(false);
      toast.success('Employee added successfully!');
    }, 500);
  }, [data]);

  const handleEditRow = useCallback((formData: Partial<Employee>) => {
    setIsLoading(true);
    setTimeout(() => {
      setData((prev) =>
        prev.map((emp) => (emp.id === formData.id ? { ...emp, ...formData } : emp))
      );
      setIsLoading(false);
      setIsEditModalOpen(false);
      setEditingRow(null);
      toast.success('Employee updated successfully!');
    }, 500);
  }, []);

  const handleDeleteRow = useCallback(() => {
    if (!deletingRow) return;
    
    setIsLoading(true);
    setError(null);
    
    // Simulate API call
    setTimeout(() => {
      setData((prev) => prev.filter((row) => row.id !== deletingRow.id));
      setIsLoading(false);
      setIsDeleteModalOpen(false);
      setDeletingRow(null);
      if (selectedRow?.id === deletingRow.id) {
        setSelectedRow(null);
      }
      toast.success('Row deleted successfully!');
    }, 500);
  }, [deletingRow, selectedRow]);

  const handleEditClick = useCallback((row: Employee) => {
    setEditingRow(row);
    setIsEditModalOpen(true);
  }, []);

  const handleDeleteClick = useCallback((row: Employee) => {
    setDeletingRow(row);
    setIsDeleteModalOpen(true);
  }, []);

  const handleRowSelected = useCallback((row: Employee | null) => {
    setSelectedRow(row);
  }, []);

  const handleRetry = useCallback(() => {
    setError(null);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Data loaded successfully!');
    }, 1000);
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Error Loading Data
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleRetry}
            className="px-6 py-2 bg-gradient-to-r from-slate-700 to-slate-900 text-white rounded-lg hover:from-slate-800 hover:to-slate-950 transition-all font-medium shadow-lg shadow-slate-500/30"
          >
            Retry
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" richColors />
      <Navbar />
      <Tabs />
      <main className="p-6">
        <div className="w-full mx-auto px-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-2xl font-bold text-gray-900"
              >
                Dashboard Overview
              </motion.h2>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="rainbow-border-btn cursor-pointer"
                onClick={() => setIsAddModalOpen(true)}
              >
                <div className="px-5 py-2.5 bg-white text-gray-900 rounded-[47px] font-semibold flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add New Row
                </div>
              </motion.div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
              <SummaryCard
                title="Total Employees"
                value={summaryStats.totalEmployees}
                icon={
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
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                }
                index={0}
              />
              <SummaryCard
                title="Active Employees"
                value={summaryStats.activeEmployees}
                icon={
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
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                }
                index={1}
              />
              <SummaryCard
                title="Avg Performance"
                value={summaryStats.avgPerformanceRating}
                icon={
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
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                }
                index={2}
              />
              <SummaryCard
                title="Avg Salary"
                value={formatCurrency(summaryStats.avgSalary)}
                icon={
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
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                }
                index={3}
              />
              {summaryStats.totalDepartments && (
                <SummaryCard
                  title="Departments"
                  value={summaryStats.totalDepartments}
                  icon={
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
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  }
                  index={4}
                />
              )}
            </div>

            {/* Employee List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <DataGrid
                rowData={data}
                onRowSelected={handleRowSelected}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
              />
            </motion.div>
          </div>
        </main>

      {/* Modals */}
      <RowFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddRow}
        mode="add"
      />
      <RowFormModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingRow(null);
        }}
        onSubmit={handleEditRow}
        initialData={editingRow || undefined}
        mode="edit"
      />
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingRow(null);
        }}
        onConfirm={handleDeleteRow}
        row={deletingRow}
      />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-6 rounded-xl shadow-lg"
          >
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-slate-700 border-t-transparent rounded-full animate-spin" />
              <span className="text-gray-700 font-medium">Processing...</span>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
