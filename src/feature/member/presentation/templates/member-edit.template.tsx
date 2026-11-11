'use client';

import React, { useState } from 'react';
import { ArrowLeft, Calendar, Copy, Check } from 'lucide-react';
import { Member } from '../../domain/member.entities';
import { FormPopupContent } from '../../controller/use-member-form.controller';
import { MemberForm, MemberFormData } from '../organisms/member-form';
import { DeleteModal } from '../organisms/delete-modal';
import { SuccessPopup } from '../organisms/success-popup';
import { Button } from '@/shared/atoms/button';

export interface MemberEditTemplateProps {
  initialData: Member | null;
  loading: boolean;
  submitting: boolean;
  error: string | null;
  onSubmit: (data: MemberFormData) => Promise<void>;
  onCancel: () => void;
  isDeleteModalOpen: boolean;
  isDeleting: boolean;
  onOpenDeleteModal: () => void;
  onCloseDeleteModal: () => void;
  onConfirmDelete: () => Promise<void>;
  showSuccessPopup: boolean;
  popupContent: FormPopupContent;
  onCloseSuccessPopup: () => void;
  onContinueEditing: () => void;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function formatJoinedDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export const MemberEditTemplate: React.FC<MemberEditTemplateProps> = ({
  initialData,
  loading,
  submitting,
  error,
  onSubmit,
  onCancel,
  isDeleteModalOpen,
  isDeleting,
  onOpenDeleteModal,
  onCloseDeleteModal,
  onConfirmDelete,
  showSuccessPopup,
  popupContent,
  onCloseSuccessPopup,
  onContinueEditing,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyId = async () => {
    if (!initialData) return;
    try {
      await navigator.clipboard.writeText(initialData.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback ignored in unsupported environments
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-[#464555]">
        <div className="inline-block animate-spin w-6 h-6 border-2 border-[#3525cd] border-t-transparent rounded-full mb-2" />
        <p className="text-sm">Loading member profile...</p>
      </div>
    );
  }

  if (!initialData) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <p className="text-[#ba1a1a] font-medium">{error || 'Member not found'}</p>
        <Button variant="secondary" onClick={onCancel}>
          Back to Members
        </Button>
      </div>
    );
  }

  const statusBadgeColors: Record<string, { bg: string; dot: string; text: string }> = {
    Active: { bg: 'bg-[#dce9ff]', dot: 'bg-[#006591]', text: 'text-[#006591]' },
    Pending: { bg: 'bg-amber-50', dot: 'bg-amber-600', text: 'text-amber-800' },
    Inactive: { bg: 'bg-slate-100', dot: 'bg-slate-500', text: 'text-slate-600' },
  };
  const badgeStyle = statusBadgeColors[initialData.status] || statusBadgeColors.Active;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Action & Identity Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="bg-[#eff4ff] hover:bg-[#e5eeff] rounded-[4px] size-8 flex items-center justify-center text-[#0b1c30] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] transition-colors shrink-0"
            aria-label="Back to Members"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-[24px] font-semibold tracking-[-0.6px] text-[#0b1c30] leading-8">
                {initialData.name}
              </h1>
              <span
                className={`${badgeStyle.bg} ${badgeStyle.text} inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[12px] text-[11px] font-medium tracking-[0.22px]`}
              >
                <span className={`${badgeStyle.dot} size-1.5 rounded-full`} />
                {initialData.status}
              </span>
            </div>

            <div className="flex items-center gap-3 mt-0.5 text-xs text-[#464555]">
              <span className="bg-[#e5eeff] px-1.5 py-0.5 rounded-[2px] font-mono text-xs text-[#464555]">
                ID: #{initialData.id.toUpperCase()}
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Joined {formatJoinedDate(initialData.joinedDate)}
              </span>
            </div>
          </div>
        </div>

        {/* Copy ID Button */}
        <button
          type="button"
          onClick={handleCopyId}
          className="bg-[#eff4ff] hover:bg-[#e5eeff] h-9 px-3 rounded-[4px] flex items-center gap-1.5 text-sm font-medium text-[#0b1c30] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-[#464555]" />
              <span>Copy ID</span>
            </>
          )}
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Main 12-Column Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Member Identity Card (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-[8px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] p-6 flex flex-col items-center text-center">
          <div className="pt-2 pb-3">
            <div className="bg-[#3525cd] size-[96px] rounded-[12px] flex items-center justify-center text-white text-[40px] font-bold ring-4 ring-white shadow-md">
              {getInitials(initialData.name)}
            </div>
          </div>

          <h2 className="text-base font-semibold text-[#0b1c30] tracking-[-0.08px] leading-6 mt-1">
            {initialData.name}
          </h2>
          <p className="text-xs font-medium text-[#3525cd] leading-4 mt-0.5">
            {initialData.role}
          </p>
          <p className="text-xs text-[#464555] leading-4 mt-1">
            {initialData.email}
          </p>

          {/* Quick Stats Bento */}
          <div className="w-full mt-5 pt-4">
            <div className="bg-[#eff4ff] rounded-[4px] py-3.5 px-3 grid grid-cols-2 divide-x divide-[#c7c4d8]/30">
              <div className="flex flex-col items-center">
                <span className="text-base font-semibold text-[#0b1c30] tracking-[-0.08px] leading-6">
                  42
                </span>
                <span className="text-[11px] font-semibold text-[#464555] tracking-[0.55px] uppercase leading-[14px]">
                  REPOSITORIES
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-base font-semibold text-[#0b1c30] tracking-[-0.08px] leading-6">
                  1,489
                </span>
                <span className="text-[11px] font-semibold text-[#464555] tracking-[0.55px] uppercase leading-[14px]">
                  DEPLOYMENTS
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Comprehensive Edit Form (8 cols) */}
        <div className="lg:col-span-8">
          <MemberForm
            initialValues={{
              name: initialData.name,
              email: initialData.email,
              role: initialData.role,
              department: initialData.department,
              status: initialData.status,
              employmentType: initialData.employmentType,
              bio: initialData.bio,
            }}
            onSubmit={onSubmit}
            onCancel={onCancel}
            onDelete={onOpenDeleteModal}
            isSubmitting={submitting}
            submitLabel="Save Changes"
            generalInfoSubtitle="Update personal records, contact credentials, and communication metadata."
          />
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        title="Delete Member"
        description="Are you sure you want to delete this member? All permissions and profile history will be permanently revoked. This action cannot be undone."
        memberName={`${initialData.name} (${initialData.email})`}
        onConfirm={onConfirmDelete}
        onCancel={onCloseDeleteModal}
        isDeleting={isDeleting}
      />

      {/* Success Popup Feedback (Figma Frame 308:150 & 311:1046) */}
      <SuccessPopup
        isOpen={showSuccessPopup}
        variant={popupContent.type === 'delete' ? 'danger' : 'success'}
        title={popupContent.title || 'Member Updated Successfully'}
        description={
          popupContent.type === 'delete' ? (
            <>
              <span className="font-bold text-[#0b1c30]">
                {popupContent.memberName || initialData.name}
              </span>{' '}
              (
              <span className="font-mono text-xs text-[#3525cd]">
                #{(popupContent.memberId || initialData.id).toUpperCase()}
              </span>
              ) has been permanently removed from the workspace. All assigned
              permissions, active sessions, and access tokens have been revoked.
            </>
          ) : (
            <>
              The profile information for{' '}
              <span className="font-medium text-[#0b1c30]">
                {popupContent.memberName || initialData.name}
              </span>{' '}
              (
              <span className="font-mono text-xs text-[#3525cd]">
                #{(popupContent.memberId || initialData.id).toUpperCase()}
              </span>
              ) has been updated and synchronized across all workspace services.
            </>
          )
        }
        secondaryActionText={
          popupContent.type === 'edit' ? 'Continue Editing' : undefined
        }
        onSecondaryAction={
          popupContent.type === 'edit' ? onContinueEditing : undefined
        }
        onClose={onCloseSuccessPopup}
        actionText={
          popupContent.type === 'delete' ? 'Dismiss' : 'Back to Dashboard'
        }
      />
    </div>
  );
};
