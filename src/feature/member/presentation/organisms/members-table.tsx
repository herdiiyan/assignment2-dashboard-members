import React from 'react';
import { Member } from '../../domain/member.entities';
import { Checkbox } from '@/shared/atoms/checkbox';
import { MemberCellInfo } from '../molecules/member-cell-info';
import { StatusBadge, DepartmentBadge } from '../molecules/member-badge';
import { TableActionButtons } from '../molecules/table-action-buttons';
import { MemberEmptyState } from './member-empty-state';
import { Card } from '@/shared/atoms/card';

export interface MembersTableProps {
  members: Member[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onEditMember: (id: string) => void;
  onDeleteMember: (id: string) => void;
  searchQuery?: string;
  onClearSearch?: () => void;
}

function formatJoinedDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export const MembersTable: React.FC<MembersTableProps> = ({
  members,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onEditMember,
  onDeleteMember,
  searchQuery,
  onClearSearch,
}) => {
  const isAllSelected = members.length > 0 && selectedIds.length === members.length;
  const isIndeterminate = selectedIds.length > 0 && selectedIds.length < members.length;

  if (members.length === 0) {
    return (
      <Card className="overflow-hidden">
        <MemberEmptyState searchQuery={searchQuery} onClearSearch={onClearSearch} />
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/75 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <th scope="col" className="w-12 px-4 py-3.5">
                <div className="flex items-center">
                  <Checkbox
                    checked={isAllSelected}
                    indeterminate={isIndeterminate}
                    onChange={onToggleSelectAll}
                    aria-label="Select all members"
                  />
                </div>
              </th>
              <th scope="col" className="px-4 py-3.5">Member</th>
              <th scope="col" className="px-4 py-3.5">Role</th>
              <th scope="col" className="px-4 py-3.5">Department</th>
              <th scope="col" className="px-4 py-3.5">Status</th>
              <th scope="col" className="px-4 py-3.5">Joined Date</th>
              <th scope="col" className="px-4 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/70 text-sm">
            {members.map((member) => {
              const isSelected = selectedIds.includes(member.id);
              return (
                <tr
                  key={member.id}
                  className={`hover:bg-slate-50/80 transition-colors ${
                    isSelected ? 'bg-blue-50/40' : ''
                  }`}
                >
                  <td className="px-4 py-4 whitespace-nowrap">
                    <Checkbox
                      checked={isSelected}
                      onChange={() => onToggleSelect(member.id)}
                      aria-label={`Select ${member.name}`}
                    />
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <MemberCellInfo
                      name={member.name}
                      email={member.email}
                      avatarBgColor={member.avatarBgColor}
                    />
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-slate-700 font-medium">
                    {member.role}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <DepartmentBadge department={member.department} />
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <StatusBadge status={member.status} />
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-[#464555] font-mono text-xs">
                    {formatJoinedDate(member.joinedDate)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right">
                    <TableActionButtons
                      onEdit={() => onEditMember(member.id)}
                      onDelete={() => onDeleteMember(member.id)}
                      disabled={selectedIds.length ? true : false}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
