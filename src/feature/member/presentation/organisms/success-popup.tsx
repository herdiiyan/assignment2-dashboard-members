import React from 'react';
import { Check, LayoutGrid, Trash2 } from 'lucide-react';

export interface SuccessPopupProps {
  isOpen: boolean;
  title: string;
  description: React.ReactNode;
  variant?: 'success' | 'danger';
  onClose: () => void;
  actionText?: string;
  actionIcon?: React.ReactNode;
  secondaryActionText?: string;
  onSecondaryAction?: () => void;
}

export const SuccessPopup: React.FC<SuccessPopupProps> = ({
  isOpen,
  title,
  description,
  variant = 'success',
  onClose,
  actionText = 'Back to Dashboard',
  actionIcon,
  secondaryActionText,
  onSecondaryAction,
}) => {
  if (!isOpen) return null;

  const isDanger = variant === 'danger';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-[rgba(33,49,69,0.4)] backdrop-blur-[2px] animate-in fade-in duration-150">
      <div className="w-full max-w-[500px] bg-white rounded-[8px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] overflow-hidden">
        {/* Modal Top Visual Content */}
        <div className="px-6 pt-6 pb-4 flex flex-col items-center text-center">
          {/* Icon Badge */}
          <div className="pb-3">
            {isDanger ? (
              <div className="size-14 rounded-[12px] bg-[#ffe4e6] flex items-center justify-center drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
                <Trash2 className="w-6 h-6 text-[#be123c]" />
              </div>
            ) : (
              <div className="size-14 rounded-[12px] bg-[#c9e6ff] flex items-center justify-center drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
                <div className="size-7 rounded-full bg-[#003b5c] flex items-center justify-center text-white">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              </div>
            )}
          </div>

          {/* Title */}
          <h3 className="text-[20px] font-semibold text-[#0b1c30] tracking-[-0.5px] leading-7">
            {title}
          </h3>

          {/* Description */}
          <div className="mt-2 max-w-[420px] text-sm text-[#464555] leading-5">
            {description}
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="bg-[#eff4ff] px-6 py-3 flex items-center justify-center gap-2">
          {secondaryActionText && onSecondaryAction && (
            <button
              type="button"
              onClick={onSecondaryAction}
              className="bg-[#e5eeff] hover:bg-[#d8e5ff] text-[#0b1c30] h-9 px-3 rounded-[4px] text-sm font-medium transition-colors"
            >
              {secondaryActionText}
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="bg-[#4f46e5] hover:bg-[#4338ca] text-white h-9 px-4 rounded-[4px] text-sm font-medium inline-flex items-center gap-1.5 drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] transition-colors"
          >
            {actionIcon ??
              (isDanger ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <LayoutGrid className="w-3.5 h-3.5" />
              ))}
            <span>{actionText}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
