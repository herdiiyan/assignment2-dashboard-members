'use client';

import { useMemberFormController } from '@/feature/member/controller/use-member-form.controller';
import { MemberEditTemplate } from '@/feature/member/presentation/templates/member-edit.template';

interface EditMemberPageProps {
  params: { id: string };
}

export default function EditMemberPage({ params }: EditMemberPageProps) {
  const controller = useMemberFormController(params.id);

  return (
    <MemberEditTemplate
      initialData={controller.initialData}
      loading={controller.loading}
      submitting={controller.submitting}
      error={controller.error}
      onSubmit={controller.submit}
      onCancel={controller.cancel}
      isDeleteModalOpen={controller.isDeleteModalOpen}
      isDeleting={controller.isDeleting}
      onOpenDeleteModal={controller.openDeleteModal}
      onCloseDeleteModal={controller.closeDeleteModal}
      onConfirmDelete={controller.confirmDelete}
      showSuccessPopup={controller.showSuccessPopup}
      popupContent={controller.popupContent}
      onCloseSuccessPopup={controller.closeSuccessPopup}
      onContinueEditing={controller.continueEditing}
    />
  );
}
