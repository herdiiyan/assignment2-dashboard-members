import { describe, it, expect } from 'vitest';
import { formatMembersToCSV } from '../csv';
import { Member } from '@/feature/member/domain/member.entities';

describe('CSV Utility', () => {
  const members: Member[] = [
    {
      id: 'mem_01',
      name: 'Sarah Jenkins',
      email: 'sarah.jenkins@company.com',
      role: 'Staff Frontend Engineer',
      department: 'Engineering',
      status: 'Active',
      joinedDate: '2024-01-15',
      lastActive: 'Just now',
    },
  ];

  it('should format members array to a valid CSV string with headers', () => {
    const csv = formatMembersToCSV(members);

    expect(csv).toContain('ID,Name,Email,Role,Department,Status,Joined Date,Last Active');
    expect(csv).toContain('mem_01,"Sarah Jenkins",sarah.jenkins@company.com,"Staff Frontend Engineer",Engineering,Active,2024-01-15,Just now');
  });

  it('should handle empty members array with only headers', () => {
    const csv = formatMembersToCSV([]);
    expect(csv).toBe('ID,Name,Email,Role,Department,Status,Joined Date,Last Active');
  });
});
