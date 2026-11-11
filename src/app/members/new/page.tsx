'use client';

import { useMemberFormController } from '@/feature/member/controller/use-member-form.controller';
import { MemberCreateTemplate } from '@/feature/member/presentation/templates/member-create.template';

export default function NewMemberPage() {
  const controller = useMemberFormController();

  return (
    <MemberCreateTemplate
      submitting={controller.submitting}
      error={controller.error}
      onSubmit={controller.submit}
      onCancel={controller.cancel}
      showSuccessPopup={controller.showSuccessPopup}
      popupContent={controller.popupContent}
      onCloseSuccessPopup={controller.closeSuccessPopup}
    />
  );
}
