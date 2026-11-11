import React from 'react';
import { SearchX } from 'lucide-react';
import { Button } from '@/shared/atoms/button';

export interface MemberEmptyStateProps {
  searchQuery?: string;
  onClearSearch?: () => void;
}

export const MemberEmptyState: React.FC<MemberEmptyStateProps> = ({
  searchQuery,
  onClearSearch,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
        <SearchX className="w-7 h-7" />
      </div>
      <h3 className="text-base font-semibold text-slate-900">No members found</h3>
      <p className="mt-1 text-sm text-slate-500 max-w-sm">
        {searchQuery
          ? `No members matching "${searchQuery}". Please check for typos or try searching by role or department.`
          : 'There are currently no members available in the directory.'}
      </p>
      {searchQuery && onClearSearch && (
        <div className="mt-4">
          <Button variant="secondary" size="sm" onClick={onClearSearch}>
            Clear Search
          </Button>
        </div>
      )}
    </div>
  );
};
