import React from 'react';
import { Trash2, X } from 'lucide-react';
import { SearchInput } from '../molecules/search-input';
import { Button } from '@/shared/atoms/button';

export interface MembersToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedCount?: number;
  onBulkDelete?: () => void;
  onClearSelection?: () => void;
}

export const MembersToolbar: React.FC<MembersToolbarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCount = 0,
  onBulkDelete,
  onClearSelection,
}) => {
  const isMultiSelect = selectedCount > 0;

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
      {isMultiSelect ? (
        <div className="flex items-center justify-between w-full bg-blue-50/70 border border-blue-200/80 rounded-lg px-4 py-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-blue-900">{selectedCount}</span>
            <span className="text-blue-700">members selected</span>
          </div>
          <div className="flex items-center gap-2">
            {onClearSelection && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearSelection}
                className="text-blue-700 hover:bg-blue-100/80 gap-1 text-xs"
              >
                <X className="w-3.5 h-3.5" />
                Cancel
              </Button>
            )}
            {onBulkDelete && (
              <Button
                variant="danger"
                size="sm"
                onClick={onBulkDelete}
                className="gap-1.5 text-xs font-semibold"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete Selected
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="w-full sm:w-96">
          <SearchInput
            value={searchQuery}
            onChangeValue={onSearchChange}
            placeholder="Search by name, email, or role..."
          />
        </div>
      )}
    </div>
  );
};
