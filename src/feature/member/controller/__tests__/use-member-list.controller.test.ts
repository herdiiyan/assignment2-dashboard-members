import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useMemberListController } from '../use-member-list.controller';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

const mockMembers = [
  {
    id: 'mem_1',
    name: 'Sarah Jenkins',
    email: 'sarah@example.com',
    role: 'Engineer',
    department: 'Engineering' as const,
    status: 'Active' as const,
    joinedDate: '2024-01-01',
  },
  {
    id: 'mem_2',
    name: 'Alex Rivera',
    email: 'alex@example.com',
    role: 'Lead',
    department: 'Engineering' as const,
    status: 'Active' as const,
    joinedDate: '2024-01-02',
  },
];

const mockMetrics = {
  totalMembers: 2,
  activeNow: 2,
  activePercentage: 100,
  departmentsCount: 1,
  pendingInvites: 0,
  expiringSoon: 0,
};

describe('useMemberListController', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockPush.mockClear();

    global.fetch = vi.fn().mockImplementation((url: string) => {
      return Promise.resolve({
        ok: true,
        json: async () => ({
          success: true,
          data: mockMembers,
          metrics: mockMetrics,
        }),
      });
    });
  });

  it('should load members and metrics on mount', async () => {
    const { result } = renderHook(() => useMemberListController());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.members).toHaveLength(2);
    expect(result.current.metrics.totalMembers).toBe(2);
  });

  it('should handle selection toggling', async () => {
    const { result } = renderHook(() => useMemberListController());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.toggleSelect('mem_1');
    });
    expect(result.current.selectedIds).toEqual(['mem_1']);

    act(() => {
      result.current.toggleSelectAll();
    });
    expect(result.current.selectedIds).toEqual(['mem_1', 'mem_2']);

    act(() => {
      result.current.clearSelection();
    });
    expect(result.current.selectedIds).toEqual([]);
  });

  it('should navigate to add page', async () => {
    const { result } = renderHook(() => useMemberListController());
    act(() => {
      result.current.navigateToAdd();
    });
    expect(mockPush).toHaveBeenCalledWith('/members/new');
  });

  it('should navigate to edit page', async () => {
    const { result } = renderHook(() => useMemberListController());
    act(() => {
      result.current.navigateToEdit('mem_1');
    });
    expect(mockPush).toHaveBeenCalledWith('/members/mem_1/edit');
  });
});
