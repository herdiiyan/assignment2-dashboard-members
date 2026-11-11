import React from 'react';
import { Card } from '@/shared/atoms/card';
import { cn } from '@/shared/utils/cn';

export interface MetricCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  iconBgColor?: string;
  badgeText?: string;
  badgeColor?: string;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  icon,
  iconBgColor = 'bg-blue-50 text-blue-600',
  badgeText,
  badgeColor = 'text-emerald-700 bg-emerald-50',
  className
}) => {
  return (
    <Card className={cn('p-5 flex flex-col justify-between hover:shadow-md transition-shadow', className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500">{label}</span>
        <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center', iconBgColor)}>
          {icon}
        </div>
      </div>
      <div className="mt-3">
        <div className="text-3xl font-bold tracking-tight text-slate-900">{value}</div>
        {badgeText && (
          <div className="mt-2 flex items-center">
            <span className={cn('inline-flex items-center px-2 py-0.5 rounded text-xs font-medium', badgeColor)} style={{fontWeight: '600'}}>
              {badgeText}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
};
