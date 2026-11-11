'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Member, MemberMetrics } from '../domain/member.entities';
import { MemberApiRepository } from '../infrastructure/member-api.repository';
import { GetMemberUsecase } from '../usecase/get-member.usecase';
import { DeleteMemberUsecase } from '../usecase/delete-member.usecase';
import { BulkDeleteMembersUsecase } from '../usecase/bulk-delete-members.usecase';
import { downloadMembersCSV } from '@/shared/utils/csv';

// Single repository instance for the controller
const memberRepo = new MemberApiRepository();
const getMemberUsecase = new GetMemberUsecase(memberRepo);
const deleteMemberUsecase = new DeleteMemberUsecase(memberRepo);
const bulkDeleteMembersUsecase = new BulkDeleteMembersUsecase(memberRepo);

export function useMemberListController() {
  const router = useRouter();

  // State
  const [members, setMembers] = useState<Member[]>([]);
  const [metrics, setMetrics] = useState<MemberMetrics>({
    totalMembers: 0,
    activeNow: 0,
    activePercentage: 0,
    departmentsCount: 0,
    pendingInvites: 0,
    expiringSoon: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Selection & Modal States
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [targetDeleteId, setTargetDeleteId] = useState<string | null>(null);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Success Feedback Modal State
  const [successPopup, setSuccessPopup] = useState<{
    isOpen: boolean;
    title: string;
    memberName?: string;
    memberId?: string;
    deletedCount?: number;
  }>({
    isOpen: false,
    title: '',
  });

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch data
  const fetchData = useCallback(async (query?: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getMemberUsecase.execute(query);
      setMembers(result.members);
      setMetrics(result.metrics);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch members');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Debounced search
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      fetchData(query);
    }, 300);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    fetchData('');
  };

  // Selection
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (members.length > 0 && selectedIds.length === members.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(members.map((m) => m.id));
    }
  };

  const clearSelection = () => {
    setSelectedIds([]);
  };

  // Actions
  const handleNavigateToAdd = () => {
    router.push('/members/new');
  };

  const handleNavigateToEdit = (id: string) => {
    router.push(`/members/${id}/edit`);
  };

  const handleExportCSV = () => {
    const targetMembers =
      selectedIds.length > 0
        ? members.filter((m) => selectedIds.includes(m.id))
        : members;
    downloadMembersCSV(targetMembers);
  };

  // Delete Handlers
  const handleOpenSingleDelete = (id: string) => {
    setTargetDeleteId(id);
  };

  const handleConfirmSingleDelete = async () => {
    if (!targetDeleteId) return;
    const deletedTarget = members.find((m) => m.id === targetDeleteId);
    setIsDeleting(true);
    try {
      await deleteMemberUsecase.execute(targetDeleteId);
      setTargetDeleteId(null);
      await fetchData(searchQuery);
      setSuccessPopup({
        isOpen: true,
        title: 'Member Deleted Successfully',
        memberName: deletedTarget?.name,
        memberId: deletedTarget?.id,
        deletedCount: 1,
      });
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to delete member');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleConfirmBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    setIsDeleting(true);
    try {
      const deletedCount = await bulkDeleteMembersUsecase.execute(selectedIds);
      setIsBulkDeleteModalOpen(false);
      clearSelection();
      await fetchData(searchQuery);
      setSuccessPopup({
        isOpen: true,
        title: 'Members Deleted Successfully',
        deletedCount,
      });
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to delete members');
    } finally {
      setIsDeleting(false);
    }
  };

  const targetMember = members.find((m) => m.id === targetDeleteId);

  return {
    // Data & state
    members,
    metrics,
    loading,
    error,
    searchQuery,
    setSearchQuery: handleSearchChange,
    clearSearch: handleClearSearch,
    refresh: () => fetchData(searchQuery),

    // Selection
    selectedIds,
    toggleSelect,
    toggleSelectAll,
    clearSelection,

    // Navigation & Export
    navigateToAdd: handleNavigateToAdd,
    navigateToEdit: handleNavigateToEdit,
    exportCSV: handleExportCSV,

    // Deletion
    targetMember,
    isSingleDeleteOpen: !!targetDeleteId,
    isBulkDeleteOpen: isBulkDeleteModalOpen,
    isDeleting,
    openSingleDelete: handleOpenSingleDelete,
    closeSingleDelete: () => setTargetDeleteId(null),
    openBulkDelete: () => setIsBulkDeleteModalOpen(true),
    closeBulkDelete: () => setIsBulkDeleteModalOpen(false),
    confirmSingleDelete: handleConfirmSingleDelete,
    confirmBulkDelete: handleConfirmBulkDelete,

    // Success popup
    successPopup,
    closeSuccessPopup: () => setSuccessPopup((p) => ({ ...p, isOpen: false })),
  };
}
