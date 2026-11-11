'use client';

import { useMemberListController } from '@/feature/member/controller/use-member-list.controller';
import { MemberListTemplate } from '@/feature/member/presentation/templates/member-list.template';

export default function MembersPage() {
  const controller = useMemberListController();

  return (
    <MemberListTemplate
      members={controller.members}
      metrics={controller.metrics}
      loading={controller.loading}
      error={controller.error}
      searchQuery={controller.searchQuery}
      setSearchQuery={controller.setSearchQuery}
      clearSearch={controller.clearSearch}
      refresh={controller.refresh}
      selectedIds={controller.selectedIds}
      toggleSelect={controller.toggleSelect}
      toggleSelectAll={controller.toggleSelectAll}
      clearSelection={controller.clearSelection}
      navigateToAdd={controller.navigateToAdd}
      navigateToEdit={controller.navigateToEdit}
      exportCSV={controller.exportCSV}
      targetMember={controller.targetMember}
      isSingleDeleteOpen={controller.isSingleDeleteOpen}
      isBulkDeleteOpen={controller.isBulkDeleteOpen}
      isDeleting={controller.isDeleting}
      openSingleDelete={controller.openSingleDelete}
      closeSingleDelete={controller.closeSingleDelete}
      openBulkDelete={controller.openBulkDelete}
      closeBulkDelete={controller.closeBulkDelete}
      confirmSingleDelete={controller.confirmSingleDelete}
      confirmBulkDelete={controller.confirmBulkDelete}
      successPopup={controller.successPopup}
      closeSuccessPopup={controller.closeSuccessPopup}
    />
  );
}
