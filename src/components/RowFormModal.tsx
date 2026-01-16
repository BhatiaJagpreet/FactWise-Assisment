'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Employee } from '@/types/dashboard';
import { useEffect, useState, useMemo } from 'react';

const employeeSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  department: z.string().min(1, 'Department is required'),
  position: z.string().min(1, 'Position is required'),
  salary: z.number().min(0, 'Salary must be positive'),
  location: z.string().min(1, 'Location is required'),
  age: z.number().min(18, 'Age must be at least 18').max(100),
  performanceRating: z.number().min(0).max(5),
  projectsCompleted: z.number().min(0),
  isActive: z.boolean(),
  hireDate: z.string().min(1, 'Hire date is required'),
  manager: z.string().nullable().optional(),
  skills: z.array(z.string()).optional(),
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

interface RowFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Employee>) => void;
  initialData?: Employee | null;
  mode: 'add' | 'edit';
}

export default function RowFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode,
}: RowFormModalProps) {
  const [hasChanges, setHasChanges] = useState(false);
  const [skillsInput, setSkillsInput] = useState('');

  const defaultValues: EmployeeFormData = useMemo(() => initialData
    ? {
        firstName: initialData.firstName,
        lastName: initialData.lastName,
        email: initialData.email,
        department: initialData.department,
        position: initialData.position,
        salary: initialData.salary,
        location: initialData.location,
        age: initialData.age,
        performanceRating: initialData.performanceRating,
        projectsCompleted: initialData.projectsCompleted,
        isActive: initialData.isActive,
        hireDate: initialData.hireDate,
        manager: initialData.manager,
        skills: initialData.skills,
      }
    : {
        firstName: '',
        lastName: '',
        email: '',
        department: 'Engineering',
        position: '',
        salary: 50000,
        location: '',
        age: 25,
        performanceRating: 3.5,
        projectsCompleted: 0,
        isActive: true,
        hireDate: new Date().toISOString().split('T')[0],
        manager: null,
        skills: [],
      }, [initialData]);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues,
  });

  // Watch all fields for changes
  const watchedFields = watch();

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      const changed = JSON.stringify(watchedFields) !== JSON.stringify(defaultValues);
      setHasChanges(changed || isDirty);
    } else {
      setHasChanges(isDirty);
    }
  }, [watchedFields, isDirty, mode, initialData, defaultValues]);

  useEffect(() => {
    if (isOpen && initialData) {
      reset(defaultValues);
      setSkillsInput(initialData.skills?.join(', ') || '');
    }
  }, [isOpen, initialData, reset, defaultValues]);

  const handleFormSubmit = (data: EmployeeFormData) => {
    const skills = skillsInput.split(',').map(s => s.trim()).filter(s => s);
    onSubmit({
      ...data,
      id: initialData?.id || Date.now(),
      skills,
    });
    reset();
    setHasChanges(false);
    onClose();
  };

  const handleClose = () => {
    reset();
    setHasChanges(false);
    onClose();
  };

  const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance'];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {mode === 'add' ? 'Add New Employee' : 'Edit Employee'}
                  </h2>
                  {mode === 'edit' && initialData && (
                    <p className="text-sm text-gray-500 mt-0.5">
                      ID: {initialData.id} • {initialData.firstName} {initialData.lastName}
                    </p>
                  )}
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(handleFormSubmit)} className="overflow-y-auto max-h-[calc(90vh-140px)]">
                <div className="p-6 space-y-6">
                  {/* Personal Information */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                        <input
                          {...register('firstName')}
                          type="text"
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 text-sm"
                          placeholder="John"
                        />
                        {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                        <input
                          {...register('lastName')}
                          type="text"
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 text-sm"
                          placeholder="Doe"
                        />
                        {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Age *</label>
                        <input
                          {...register('age', { valueAsNumber: true })}
                          type="number"
                          min="18"
                          max="100"
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 text-sm"
                        />
                        {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age.message}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                        <input
                          {...register('email')}
                          type="email"
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 text-sm"
                          placeholder="john.doe@company.com"
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                        <input
                          {...register('location')}
                          type="text"
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 text-sm"
                          placeholder="New York"
                        />
                        {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Job Information */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Job Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                        <select
                          {...register('department')}
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 text-sm"
                        >
                          {departments.map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                          ))}
                        </select>
                        {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Position *</label>
                        <input
                          {...register('position')}
                          type="text"
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 text-sm"
                          placeholder="Senior Developer"
                        />
                        {errors.position && <p className="text-red-500 text-xs mt-1">{errors.position.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Salary *</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                          <input
                            {...register('salary', { valueAsNumber: true })}
                            type="number"
                            min="0"
                            className="w-full pl-7 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 text-sm"
                          />
                        </div>
                        {errors.salary && <p className="text-red-500 text-xs mt-1">{errors.salary.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Hire Date *</label>
                        <input
                          {...register('hireDate')}
                          type="date"
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 text-sm"
                        />
                        {errors.hireDate && <p className="text-red-500 text-xs mt-1">{errors.hireDate.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Manager</label>
                        <input
                          {...register('manager')}
                          type="text"
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 text-sm"
                          placeholder="Sarah Johnson"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                        <select
                          {...register('isActive', { setValueAs: (v) => v === 'true' })}
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 text-sm"
                          defaultValue={initialData?.isActive ? 'true' : 'false'}
                        >
                          <option value="true">Active</option>
                          <option value="false">Inactive</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Performance */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Performance</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Performance Rating (0-5) *</label>
                        <input
                          {...register('performanceRating', { valueAsNumber: true })}
                          type="number"
                          min="0"
                          max="5"
                          step="0.1"
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 text-sm"
                        />
                        {errors.performanceRating && <p className="text-red-500 text-xs mt-1">{errors.performanceRating.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Projects Completed *</label>
                        <input
                          {...register('projectsCompleted', { valueAsNumber: true })}
                          type="number"
                          min="0"
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 text-sm"
                        />
                        {errors.projectsCompleted && <p className="text-red-500 text-xs mt-1">{errors.projectsCompleted.message}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Skills */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Skills</h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Skills (comma separated)</label>
                      <input
                        type="text"
                        value={skillsInput}
                        onChange={(e) => {
                          setSkillsInput(e.target.value);
                          setHasChanges(true);
                        }}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 text-sm"
                        placeholder="JavaScript, React, Node.js"
                      />
                      <p className="text-xs text-gray-500 mt-1">Enter skills separated by commas</p>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-5 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all font-medium text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={mode === 'edit' && !hasChanges}
                    className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all ${
                      mode === 'edit' && !hasChanges
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30'
                    }`}
                  >
                    {mode === 'add' ? 'Add Employee' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
