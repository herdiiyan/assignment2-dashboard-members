import React from 'react';
import { Badge } from '@/shared/atoms/badge';
import { MemberStatus, Department } from '../../domain/member.entities';
import { cn } from '@/shared/utils/cn';

export const StatusBadge: React.FC<{ status: MemberStatus; className?: string }> = ({
  status,
  className,
}) => {
  const variantMap = {
    Active: 'success',
    Pending: 'warning',
    Inactive: 'neutral',
  } as const;

  return (
    <Badge variant={variantMap[status]} className={cn('gap-1.5', className)}>
      <span
        className={cn(
          'w-1.5 h-1.5 rounded-full',
          status === 'Active' && 'bg-emerald-500',
          status === 'Pending' && 'bg-amber-500',
          status === 'Inactive' && 'bg-rose-400'
        )}
      />
      {status}
    </Badge>
  );
};

export const DepartmentBadge: React.FC<{ department: Department; className?: string }> = ({
  department,
  className,
}) => {
  const colorMap: Record<Department, string> = {
    Engineering: 'bg-indigo-50 text-indigo-700 border-indigo-200/60',
    Design: 'bg-purple-50 text-purple-700 border-purple-200/60',
    Product: 'bg-blue-50 text-blue-700 border-blue-200/60',
    Marketing: 'bg-pink-50 text-pink-700 border-pink-200/60',
    Sales: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    HR: 'bg-amber-50 text-amber-700 border-amber-200/60',
    Finance: 'bg-cyan-50 text-cyan-700 border-cyan-200/60',
    Operations: 'bg-slate-100 text-slate-700 border-slate-200/60',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        colorMap[department] || 'bg-slate-100 text-slate-700',
        className
      )}
    >
      {department}
    </span>
  );
};
