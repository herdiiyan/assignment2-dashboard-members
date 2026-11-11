import React from 'react';
import { cn } from '../utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-colors rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed',
          // Variants
          variant === 'primary' &&
            'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm',
          variant === 'secondary' &&
            'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 focus:ring-slate-400 shadow-sm',
          variant === 'danger' &&
            'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm',
          variant === 'ghost' &&
            'text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-300',
          variant === 'outline' &&
            'border border-slate-200 text-slate-700 hover:bg-slate-50',
          // Sizes
          size === 'sm' && 'text-xs px-2.5 py-1.5 gap-1.5',
          size === 'md' && 'text-sm px-3.5 py-2 gap-2',
          size === 'lg' && 'text-base px-4 py-2.5 gap-2.5',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
