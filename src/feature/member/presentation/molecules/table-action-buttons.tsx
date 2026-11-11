import React from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/shared/atoms/button';
import { cn } from '@/shared/utils/cn';

export interface TableActionButtonsProps {
  onEdit: () => void;
  onDelete: () => void;
  disabled: boolean;
}

export const TableActionButtons: React.FC<TableActionButtonsProps> = ({
  onEdit,
  onDelete,
  disabled
}) => {
  return (
    <div className="flex items-center justify-end gap-1.5">
      <Button
        variant="ghost"
        size="sm"
        onClick={onEdit}
        disabled={disabled}
        className="text-slate-600 hover:text-blue-600 hover:bg-blue-50 font-medium px-2 py-1 text-xs"
      >
        Edit
      </Button>
      <button
        onClick={onDelete}
        title="Delete Member"
        disabled={disabled}
        className={cn("p-1.5 text-slate-400 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed", disabled === false && "hover:text-red-600 hover:bg-red-50")}
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};
