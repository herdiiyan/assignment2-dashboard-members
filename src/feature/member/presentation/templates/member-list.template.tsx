'use client';

import React from 'react';
import { Download, Plus } from 'lucide-react';
import { Member, MemberMetrics } from '../../domain/member.entities';
import { MetricsGrid } from '../organisms/metrics-grid';
import { MembersToolbar } from '../organisms/members-toolbar';
import { MembersTable } from '../organisms/members-table';
import { DeleteModal } from '../organisms/delete-modal';
import { SuccessPopup } from '../organisms/success-popup';
import { Button } from '@/shared/atoms/button';

export interface MemberListTemplateProps {
  members: Member[];
  metrics: MemberMetrics;
  loading: boolean;
  error: string | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;
  refresh: () => Promise<void>;

  selectedIds: string[];
  toggleSelect: (id: string) => void;
  toggleSelectAll: () => void;
  clearSelection: () => void;

  navigateToAdd: () => void;
  navigateToEdit: (id: string) => void;
  exportCSV: () => void;

  targetMember?: Member;
  isSingleDeleteOpen: boolean;
  isBulkDeleteOpen: boolean;
  isDeleting: boolean;
  openSingleDelete: (id: string) => void;
  closeSingleDelete: () => void;
  openBulkDelete: () => void;
  closeBulkDelete: () => void;
  confirmSingleDelete: () => Promise<void>;
  confirmBulkDelete: () => Promise<void>;

  successPopup: {
    isOpen: boolean;
    title: string;
    memberName?: string;
    memberId?: string;
    deletedCount?: number;
  };
  closeSuccessPopup: () => void;
}

export const MemberListTemplate: React.FC<MemberListTemplateProps> = ({
  members,
  metrics,
  loading,
  error,
  searchQuery,
  setSearchQuery,
  clearSearch,
  selectedIds,
  toggleSelect,
  toggleSelectAll,
  clearSelection,
  navigateToAdd,
  navigateToEdit,
  exportCSV,
  targetMember,
  isSingleDeleteOpen,
  isBulkDeleteOpen,
  isDeleting,
  openSingleDelete,
  closeSingleDelete,
  openBulkDelete,
  closeBulkDelete,
  confirmSingleDelete,
  confirmBulkDelete,
  successPopup,
  closeSuccessPopup,
}) => {
  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header (Page Top Bar & Global Actions Frame 306:20) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-2xl font-semibold tracking-[-0.6px] text-[#0b1c30] leading-8">
            Members Directory
          </h1>
          <p className="text-sm font-normal text-[#464555] leading-5 max-w-2xl">
            Manage your organization team members, cross-functional roles, and workspace access levels.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            onClick={exportCSV}
            className="h-9 px-3 rounded text-xs font-medium bg-white text-[#0b1c30] border border-slate-200/80 drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] hover:bg-slate-50 flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </Button>

          <Button
            variant="primary"
            onClick={navigateToAdd}
            className="h-9 px-3 rounded text-xs font-medium bg-[#3525cd] hover:bg-[#2c1ea8] text-white drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Member</span>
          </Button>
        </div>
      </div>

      {/* KPI Metrics Grid */}
      <MetricsGrid metrics={metrics} />

      {/* Main Members Section */}
      <div className="space-y-4">
        {/* Toolbar: Search & Bulk Action Controls */}
        <MembersToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCount={selectedIds.length}
          onClearSelection={clearSelection}
          onBulkDelete={openBulkDelete}
        />

        {/* Members Data Table */}
        <MembersTable
          members={members}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelect}
          onToggleSelectAll={toggleSelectAll}
          onEditMember={navigateToEdit}
          onDeleteMember={openSingleDelete}
          searchQuery={searchQuery}
          onClearSearch={clearSearch}
        />
      </div>

      {/* Single Delete Confirmation Modal */}
      <DeleteModal
        isOpen={isSingleDeleteOpen}
        title="Delete Member"
        description="Are you sure you want to delete this member? All permissions and profile history will be permanently revoked. This action cannot be undone."
        memberName={targetMember ? `${targetMember.name} (${targetMember.email})` : undefined}
        onConfirm={confirmSingleDelete}
        onCancel={closeSingleDelete}
        isDeleting={isDeleting}
      />

      {/* Bulk Delete Confirmation Modal */}
      <DeleteModal
        isOpen={isBulkDeleteOpen}
        title="Delete Selected Members"
        count={selectedIds.length}
        description={`Are you sure you want to delete ${selectedIds.length} selected member${
          selectedIds.length > 1 ? 's' : ''
        }? Their records and permissions will be permanently removed. This action cannot be undone.`}
        onConfirm={confirmBulkDelete}
        onCancel={closeBulkDelete}
        isDeleting={isDeleting}
      />

      {/* Success Notification Popup */}
      <SuccessPopup
        isOpen={successPopup.isOpen}
        variant="danger"
        title={successPopup.title}
        description={
          successPopup.deletedCount && successPopup.deletedCount > 1 ? (
            <>
              <span className="font-bold text-[#0b1c30]">
                {successPopup.deletedCount} members
              </span>{' '}
              has been permanently removed from the workspace. All assigned
              permissions, active sessions, and access tokens have been revoked.
            </>
          ) : (
            <>
              <span className="font-bold text-[#0b1c30]">
                {successPopup.memberName || 'The member'}
              </span>
              {successPopup.memberId && (
                <>
                  {' '}
                  (
                  <span className="font-mono text-xs text-[#3525cd]">
                    #{successPopup.memberId.toUpperCase()}
                  </span>
                  )
                </>
              )}{' '}
              has been permanently removed from the workspace. All assigned
              permissions, active sessions, and access tokens have been revoked.
            </>
          )
        }
        onClose={closeSuccessPopup}
        actionText="Dismiss"
      />
    </div>
  );
};
