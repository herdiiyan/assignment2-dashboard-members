import React from 'react';
import { cn } from '../utils/cn';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  bgColor?: string;
}

export function getInitials(name: string): string {
  if (!name) return '';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export const Avatar: React.FC<AvatarProps> = ({
  name,
  size = 'md',
  bgColor,
  className,
  ...props
}) => {
  const initials = getInitials(name);

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center font-semibold select-none shrink-0',
        size === 'sm' && 'w-7 h-7 text-xs',
        size === 'md' && 'w-9 h-9 text-xs',
        size === 'lg' && 'w-11 h-11 text-sm',
        bgColor || 'bg-indigo-100 text-indigo-700',
        className
      )}
      {...props}
    >
      {initials}
    </div>
  );
};
