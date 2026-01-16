import { Employee, SummaryStats } from '@/types/dashboard';

export function formatCurrency(value: number | undefined): string {
  if (value === undefined || isNaN(value)) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(dateString: string | undefined): string {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  } catch {
    return 'N/A';
  }
}

export function calculateSummaryStats(data: Employee[]): SummaryStats {
  const totalEmployees = data.length;
  const activeEmployees = data.filter((emp) => emp.isActive).length;
  const avgSalary =
    data.reduce((sum, emp) => sum + (emp.salary || 0), 0) / totalEmployees;
  const avgPerformanceRating =
    data.reduce((sum, emp) => sum + (emp.performanceRating || 0), 0) / totalEmployees;
  const departments = new Set(data.map((emp) => emp.department));
  const totalDepartments = departments.size;

  return {
    totalEmployees,
    activeEmployees,
    avgSalary: Math.round(avgSalary),
    avgPerformanceRating: Math.round(avgPerformanceRating * 10) / 10,
    totalDepartments,
  };
}

export function getStatusColor(isActive: boolean): string {
  return isActive
    ? 'bg-green-100 text-green-800 border-green-200'
    : 'bg-red-100 text-red-800 border-red-200';
}

export function getPerformanceColor(rating: number): string {
  if (rating >= 4.5) return 'bg-green-500';
  if (rating >= 4.0) return 'bg-blue-500';
  if (rating >= 3.5) return 'bg-yellow-500';
  return 'bg-orange-500';
}

export function formatFullName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`;
}
