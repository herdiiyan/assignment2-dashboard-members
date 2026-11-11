import React from 'react';
import { Search } from 'lucide-react';
import { Input, InputProps } from '@/shared/atoms/input';

export interface SearchInputProps extends Omit<InputProps, 'icon'> {
  value: string;
  onChangeValue: (value: string) => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChangeValue,
  placeholder = 'Search by name, email, or role...',
  className,
  ...props
}) => {
  return (
    <Input
      icon={<Search className="w-4 h-4 text-slate-400" />}
      value={value}
      onChange={(e) => onChangeValue(e.target.value)}
      placeholder={placeholder}
      className={className}
      {...props}
    />
  );
};
