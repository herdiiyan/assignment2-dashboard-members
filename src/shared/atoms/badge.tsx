import React from 'react';
import { cn } from '../utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'info' | 'neutral' | 'purple';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'neutral',
  children,
  ...props
}) => {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide',
        variant === 'success' && 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
        variant === 'warning' && 'bg-amber-50 text-amber-700 border border-amber-200/60',
        variant === 'info' && 'bg-blue-50 text-blue-700 border border-blue-200/60',
        variant === 'purple' && 'bg-purple-50 text-purple-700 border border-purple-200/60',
        variant === 'neutral' && 'bg-rose-100 text-rose-700 border border-rose-200/60',
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
