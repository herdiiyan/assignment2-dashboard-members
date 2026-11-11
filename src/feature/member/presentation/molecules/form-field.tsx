import React from 'react';
import { cn } from '@/shared/utils/cn';

export interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  required,
  error,
  description,
  children,
  className,
}) => {
  return (
    <div className={cn('space-y-1.5', className)}>
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-[#0b1c30] leading-4">
          {label}
          {required && <span className="text-[#ba1a1a] ml-1">*</span>}
        </label>
      </div>
      {children}
      {description && !error && (
        <p className="text-xs text-[#464555] leading-4">{description}</p>
      )}
      {error && <p className="text-xs text-[#ba1a1a] font-medium leading-4">{error}</p>}
    </div>
  );
};
