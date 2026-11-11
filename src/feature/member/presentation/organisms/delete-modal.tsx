import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';

export interface DeleteModalProps {
  isOpen: boolean;
  title?: string;
  description?: React.ReactNode;
  count?: number;
  memberName?: string;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  isDeleting?: boolean;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  title,
  description,
  count = 1,
  memberName,
  onConfirm,
  onCancel,
  isDeleting = false,
}) => {
  if (!isOpen) return null;

  const modalTitle =
    title || (count > 1 ? `Delete ${count} Members?` : 'Delete Member?');

  const modalDescription =
    description ||
    (count > 1 ? (
      <>
        Are you sure you want to delete{' '}
        <span className="font-semibold text-[#0b1c30]">{count} selected members</span>?
        All permissions and active workspace sessions will be permanently revoked. This action cannot be undone.
      </>
    ) : memberName ? (
      <>
        Are you sure you want to delete{' '}
        <span className="font-semibold text-[#0b1c30]">{memberName}</span>? All
        associated access and credentials will be permanently revoked. This action cannot be undone.
      </>
    ) : (
      'Are you sure you want to delete this member? This action cannot be undone.'
    ));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-[rgba(33,49,69,0.4)] backdrop-blur-[2px] animate-in fade-in duration-150">
      <div className="w-full max-w-[500px] bg-white rounded-[8px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] overflow-hidden">
        {/* Modal Top Visual Content */}
        <div className="px-6 pt-6 pb-4 flex flex-col items-center text-center">
          <div className="pb-3">
            <div className="size-14 rounded-[12px] bg-[#ffe4e6] flex items-center justify-center drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
              <AlertTriangle className="w-6 h-6 text-[#be123c]" />
            </div>
          </div>

          <h3 className="text-[20px] font-semibold text-[#0b1c30] tracking-[-0.5px] leading-7">
            {modalTitle}
          </h3>

          <div className="mt-2 max-w-[420px] text-sm text-[#464555] leading-5">
            {modalDescription}
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="bg-[#eff4ff] px-6 py-3 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="bg-[#e5eeff] hover:bg-[#d8e5ff] text-[#464555] h-9 px-3 rounded-[4px] text-sm font-medium transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-[#ba1a1a] hover:bg-[#991b1b] text-white h-9 px-4 rounded-[4px] text-sm font-medium inline-flex items-center gap-1.5 drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>
              {isDeleting
                ? 'Deleting...'
                : count > 1
                ? `Delete ${count} Members`
                : 'Delete Member'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
