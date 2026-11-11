'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { FormPopupContent } from '../../controller/use-member-form.controller';
import { MemberForm, MemberFormData } from '../organisms/member-form';
import { SuccessPopup } from '../organisms/success-popup';

export interface MemberCreateTemplateProps {
  submitting: boolean;
  error: string | null;
  onSubmit: (data: MemberFormData) => Promise<void>;
  onCancel: () => void;
  showSuccessPopup: boolean;
  popupContent: FormPopupContent;
  onCloseSuccessPopup: () => void;
}

export const MemberCreateTemplate: React.FC<MemberCreateTemplateProps> = ({
  submitting,
  error,
  onSubmit,
  onCancel,
  showSuccessPopup,
  popupContent,
  onCloseSuccessPopup,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Action & Identity Bar */}
      <div className="flex items-center gap-3 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="bg-[#eff4ff] hover:bg-[#e5eeff] rounded-[4px] size-8 flex items-center justify-center text-[#0b1c30] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] transition-colors"
          aria-label="Back to Members"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-[24px] font-semibold tracking-[-0.6px] text-[#0b1c30] leading-8">
          Add New Member
        </h1>
      </div>

      {/* Error message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Form Section */}
      <MemberForm
        onSubmit={onSubmit}
        onCancel={onCancel}
        isSubmitting={submitting}
        submitLabel="Save Changes"
      />

      {/* Success Popup Feedback (Figma Frame 318:1550) */}
      <SuccessPopup
        isOpen={showSuccessPopup}
        variant="success"
        title={popupContent.title || 'Member Added Successfully'}
        description={
          <>
            The profile information for{' '}
            <span className="font-medium text-[#0b1c30]">
              {popupContent.memberName || 'the member'}
            </span>
            {popupContent.memberId && (
              <>
                {' '}
                (
                <span className="font-mono text-xs text-[#3525cd]">
                  #{popupContent.memberId.toUpperCase()}
                </span>
                )
              </>
            )}{' '}
            has been added and synchronized across all workspace services.
          </>
        }
        onClose={onCloseSuccessPopup}
        actionText="Back to Dashboard"
      />
    </div>
  );
};
