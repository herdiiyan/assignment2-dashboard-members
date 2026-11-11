import { Member } from '@/feature/member/domain/member.entities';

export function formatMembersToCSV(members: Member[]): string {
  const headers = ['ID', 'Name', 'Email', 'Role', 'Department', 'Status', 'Joined Date', 'Last Active'];
  const rows = members.map((m) => [
    m.id,
    `"${m.name.replace(/"/g, '""')}"`,
    m.email,
    `"${m.role.replace(/"/g, '""')}"`,
    m.department,
    m.status,
    m.joinedDate,
    m.lastActive,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

export function downloadMembersCSV(members: Member[], filename?: string): void {
  const csvContent = formatMembersToCSV(members);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  const defaultFilename = `members-export-${new Date().toISOString().split('T')[0]}.csv`;
  link.href = url;
  link.setAttribute('download', filename || defaultFilename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
