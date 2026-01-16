'use client';

import { useMemo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Employee } from '@/types/dashboard';
import { formatCurrency, formatDate, getPerformanceColor, formatFullName } from '@/lib/formatters';

interface DataGridProps {
  rowData: Employee[];
  onRowSelected?: (row: Employee | null) => void;
  onEdit?: (row: Employee) => void;
  onDelete?: (row: Employee) => void;
}

export default function DataGrid({
  rowData,
  onRowSelected,
  onEdit,
  onDelete,
}: DataGridProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [sortField, setSortField] = useState<keyof Employee>('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Get unique departments
  const departments = useMemo(() => {
    const deptSet = new Set(rowData.map(emp => emp.department));
    return Array.from(deptSet).sort();
  }, [rowData]);

  const filteredData = useMemo(() => {
    const filtered = rowData.filter((emp) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = (
        emp.firstName.toLowerCase().includes(searchLower) ||
        emp.lastName.toLowerCase().includes(searchLower) ||
        emp.email.toLowerCase().includes(searchLower) ||
        emp.department.toLowerCase().includes(searchLower) ||
        emp.position.toLowerCase().includes(searchLower)
      );
      const matchesDepartment = selectedDepartment === 'all' || emp.department === selectedDepartment;
      return matchesSearch && matchesDepartment;
    });

    filtered.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });

    return filtered;
  }, [rowData, searchTerm, selectedDepartment, sortField, sortDirection]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = useCallback((field: keyof Employee) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  }, [sortField]);

  const handleRowClick = useCallback((emp: Employee) => {
    setExpandedRow(expandedRow === emp.id ? null : emp.id);
    onRowSelected?.(emp);
  }, [expandedRow, onRowSelected]);

  const exportToCSV = useCallback(() => {
    const headers = ['ID', 'Name', 'Email', 'Department', 'Position', 'Location', 'Salary', 'Performance', 'Status'];
    const csvContent = [
      headers.join(','),
      ...filteredData.map(emp => [
        emp.id,
        `"${formatFullName(emp.firstName, emp.lastName)}"`,
        emp.email,
        emp.department,
        emp.position,
        emp.location,
        emp.salary,
        emp.performanceRating,
        emp.isActive ? 'Active' : 'Inactive'
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'employees.csv';
    a.click();
  }, [filteredData]);

  return (
    <div className="space-y-6">
      {/* Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors text-gray-900 placeholder-gray-400"
            />
          </div>

          {/* Department Dropdown */}
          <div className="relative">
            <select
              value={selectedDepartment}
              onChange={(e) => {
                setSelectedDepartment(e.target.value);
                setCurrentPage(1);
              }}
              className="appearance-none w-full sm:w-48 px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors text-gray-900 font-medium cursor-pointer pr-10"
            >
              <option value="all">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            <svg
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedDepartment('all');
              setCurrentPage(1);
            }}
            className="px-5 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-semibold text-sm"
          >
            Clear
          </button>
          <div
            onClick={exportToCSV}
            className="rainbow-border-btn cursor-pointer hover:scale-105 transition-transform"
          >
            <div className="px-5 py-2.5 bg-white text-gray-900 rounded-[47px] font-semibold text-sm flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export
            </div>
          </div>
        </div>
      </div>

      {/* Sort Options */}
      <div className="flex flex-wrap gap-2">
        <span className="text-sm text-gray-500 font-medium py-2">Sort by:</span>
        {(['firstName', 'department', 'salary', 'performanceRating'] as const).map((field) => (
          <button
            key={field}
            onClick={() => handleSort(field)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              sortField === field
                ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'
            }`}
          >
            {field === 'firstName' ? 'Name' : field === 'performanceRating' ? 'Performance' : field.charAt(0).toUpperCase() + field.slice(1)}
            {sortField === field && (
              <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
            )}
          </button>
        ))}
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-500">
        Showing {paginatedData.length} of {filteredData.length} employees
      </div>

      {/* Employee Cards */}
      <div className="space-y-2">
        <AnimatePresence>
          {paginatedData.map((emp, index) => (
            <motion.div
              key={emp.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2, delay: index * 0.03 }}
              className="bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer overflow-hidden"
              onClick={() => handleRowClick(emp)}
            >
              {/* Main Row */}
              <div className="px-4 py-3 flex items-center gap-4">
                {/* Avatar */}
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm ${
                  emp.department === 'Engineering' ? 'bg-blue-500' :
                  emp.department === 'Marketing' ? 'bg-purple-500' :
                  emp.department === 'Sales' ? 'bg-green-500' :
                  emp.department === 'HR' ? 'bg-pink-500' :
                  'bg-orange-500'
                }`}>
                  {emp.firstName[0]}{emp.lastName[0]}
                </div>

                {/* Name & Email */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm truncate">
                    {formatFullName(emp.firstName, emp.lastName)}
                  </h3>
                  <p className="text-gray-400 text-xs truncate">{emp.email}</p>
                </div>

                {/* Department Badge */}
                <div className="hidden md:block">
                  <span className={`px-3 py-1 rounded-md text-xs font-semibold ${
                    emp.department === 'Engineering' ? 'bg-blue-50 text-blue-600' :
                    emp.department === 'Marketing' ? 'bg-purple-50 text-purple-600' :
                    emp.department === 'Sales' ? 'bg-green-50 text-green-600' :
                    emp.department === 'HR' ? 'bg-pink-50 text-pink-600' :
                    'bg-orange-50 text-orange-600'
                  }`}>
                    {emp.department}
                  </span>
                </div>

                {/* Position */}
                <div className="hidden lg:block text-gray-500 text-sm w-40 truncate">
                  {emp.position}
                </div>

                {/* Salary */}
                <div className="hidden sm:block text-right w-24">
                  <span className="text-gray-900 font-semibold text-sm">{formatCurrency(emp.salary)}</span>
                </div>

                {/* Performance */}
                <div className="hidden md:flex items-center gap-2 w-24">
                  <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full ${getPerformanceColor(emp.performanceRating)}`}
                      style={{ width: `${(emp.performanceRating / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-gray-600 w-6">{emp.performanceRating}</span>
                </div>

                {/* Status */}
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${emp.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  <span className={`text-xs font-medium ${emp.isActive ? 'text-green-600' : 'text-red-600'}`}>
                    {emp.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {/* Expand Icon */}
                <motion.div
                  animate={{ rotate: expandedRow === emp.id ? 180 : 0 }}
                  className="text-gray-400"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </motion.div>
              </div>

              {/* Expanded Details */}
              <AnimatePresence>
                {expandedRow === emp.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-gray-100 bg-gray-50"
                  >
                    <div className="px-4 py-3">
                      <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                        <div>
                          <span className="text-[10px] text-gray-500 uppercase tracking-wide font-semibold">Location</span>
                          <p className="text-gray-900 font-medium text-sm">{emp.location}</p>
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-500 uppercase tracking-wide font-semibold">Hire Date</span>
                          <p className="text-gray-900 font-medium text-sm">{formatDate(emp.hireDate)}</p>
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-500 uppercase tracking-wide font-semibold">Age</span>
                          <p className="text-gray-900 font-medium text-sm">{emp.age} yrs</p>
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-500 uppercase tracking-wide font-semibold">Projects</span>
                          <p className="text-gray-900 font-medium text-sm">{emp.projectsCompleted}</p>
                        </div>
                        {emp.manager && (
                          <div>
                            <span className="text-[10px] text-gray-500 uppercase tracking-wide font-semibold">Manager</span>
                            <p className="text-gray-900 font-medium text-sm">{emp.manager}</p>
                          </div>
                        )}
                        <div className="col-span-3 md:col-span-2">
                          <span className="text-[10px] text-gray-500 uppercase tracking-wide font-semibold">Skills</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {emp.skills.map((skill, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 bg-white text-gray-600 text-xs rounded border border-gray-200"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit?.(emp);
                          }}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium text-xs"
                        >
                          Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete?.(emp);
                          }}
                          className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all font-medium text-xs border border-red-200"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {paginatedData.length === 0 && (
        <div className="text-center py-16">
          <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-600 mb-1">No employees found</h3>
          <p className="text-gray-400">Try adjusting your search criteria</p>
        </div>
      )}

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-5 mt-4 border-t border-gray-200">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Rows per page:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
          <div className="text-sm text-gray-500">
            Page <span className="font-semibold text-gray-900">{currentPage}</span> of <span className="font-semibold text-gray-900">{totalPages || 1}</span>
            <span className="mx-2">•</span>
            <span className="font-semibold text-gray-900">{filteredData.length}</span> employees
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all text-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            First
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all text-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Prev
          </button>
          
          {totalPages > 0 && Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-9 h-9 rounded-lg font-semibold text-sm transition-all ${
                  currentPage === pageNum
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages || 1, prev + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all text-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
          >
            Next
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <button
            onClick={() => setCurrentPage(totalPages || 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all text-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Last
          </button>
        </div>
      </div>
    </div>
  );
}
