import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useMemberFormController } from '../use-member-form.controller';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

const dummyMember = {
  id: 'mem_1',
  name: 'Sarah Jenkins',
  email: 'sarah@example.com',
  role: 'Engineer',
  department: 'Engineering' as const,
  status: 'Active' as const,
  joinedDate: '2024-01-01',
};

describe('useMemberFormController', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockPush.mockClear();
  });

  it('should initialize empty state in create mode', () => {
    const { result } = renderHook(() => useMemberFormController());
    expect(result.current.isEdit).toBe(false);
    expect(result.current.initialData).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('should load initial data in edit mode', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: dummyMember }),
    });

    const { result } = renderHook(() => useMemberFormController('mem_1'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.initialData).toEqual(dummyMember);
    expect(result.current.isEdit).toBe(true);
  });

  it('should handle cancel navigation', () => {
    const { result } = renderHook(() => useMemberFormController());
    act(() => {
      result.current.cancel();
    });
    expect(mockPush).toHaveBeenCalledWith('/members');
  });
});
