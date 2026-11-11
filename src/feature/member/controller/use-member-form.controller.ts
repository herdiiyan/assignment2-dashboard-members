'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Member, Department, MemberStatus, EmploymentType } from '../domain/member.entities';
import { MemberApiRepository } from '../infrastructure/member-api.repository';
import { GetMemberByIdUsecase } from '../usecase/get-member-by-id.usecase';
import { CreateMemberUsecase } from '../usecase/create-member.usecase';
import { UpdateMemberUsecase } from '../usecase/update-member.usecase';
import { DeleteMemberUsecase } from '../usecase/delete-member.usecase';
import { CreateMemberInputDTO, UpdateMemberInputDTO } from '../usecase/dtos/member.dto';

const memberRepo = new MemberApiRepository();
const getMemberByIdUsecase = new GetMemberByIdUsecase(memberRepo);
const createMemberUsecase = new CreateMemberUsecase(memberRepo);
const updateMemberUsecase = new UpdateMemberUsecase(memberRepo);
const deleteMemberUsecase = new DeleteMemberUsecase(memberRepo);

export interface FormPopupContent {
  type: 'add' | 'edit' | 'delete';
  title: string;
  memberName?: string;
  memberId?: string;
}

export function useMemberFormController(memberId?: string) {
  const router = useRouter();

  const [initialData, setInitialData] = useState<Member | null>(null);
  const [loading, setLoading] = useState(!!memberId);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Success Feedback state
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [popupContent, setPopupContent] = useState<FormPopupContent>({
    type: memberId ? 'edit' : 'add',
    title: '',
  });

  // Load existing data if editing
  useEffect(() => {
    if (!memberId) return;

    let isMounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await getMemberByIdUsecase.execute(memberId!);
        if (isMounted) setInitialData(data);
      } catch (err: unknown) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Member not found');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, [memberId]);

  // Submit Handler
  const handleSubmit = async (formData: {
    name: string;
    email: string;
    role: string;
    department: Department;
    status: MemberStatus;
    employmentType?: EmploymentType;
    bio?: string;
  }) => {
    setSubmitting(true);
    setError(null);
    try {
      if (memberId) {
        const updated = await updateMemberUsecase.execute(
          memberId,
          formData as UpdateMemberInputDTO
        );
        setInitialData(updated);
        setPopupContent({
          type: 'edit',
          title: 'Member Updated Successfully',
          memberName: updated.name,
          memberId: updated.id,
        });
      } else {
        const created = await createMemberUsecase.execute(
          formData as CreateMemberInputDTO
        );
        setPopupContent({
          type: 'add',
          title: 'Member Added Successfully',
          memberName: created.name,
          memberId: created.id,
        });
      }
      setShowSuccessPopup(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!memberId) return;
    setIsDeleting(true);
    setError(null);
    try {
      await deleteMemberUsecase.execute(memberId);
      setIsDeleteModalOpen(false);
      setPopupContent({
        type: 'delete',
        title: 'Member Deleted Successfully',
        memberName: initialData?.name,
        memberId,
      });
      setShowSuccessPopup(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete member');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClosePopup = () => {
    setShowSuccessPopup(false);
    router.push('/members');
  };

  const handleContinueEditing = () => {
    setShowSuccessPopup(false);
  };

  const handleCancel = () => {
    router.push('/members');
  };

  return {
    initialData,
    loading,
    submitting,
    error,
    submit: handleSubmit,
    cancel: handleCancel,
    isDeleteModalOpen,
    isDeleting,
    openDeleteModal: () => setIsDeleteModalOpen(true),
    closeDeleteModal: () => setIsDeleteModalOpen(false),
    confirmDelete: handleConfirmDelete,
    showSuccessPopup,
    popupContent,
    closeSuccessPopup: handleClosePopup,
    continueEditing: handleContinueEditing,
    isEdit: !!memberId,
  };
}
