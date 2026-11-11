import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemberApiRepository } from '../member-api.repository';
import { Member } from '../../domain/member.entities';

describe('MemberApiRepository', () => {
  let repository: MemberApiRepository;

  beforeEach(() => {
    repository = new MemberApiRepository('/api/members');
    vi.restoreAllMocks();
  });

  it('should fetch all members via GET /api/members', async () => {
    const mockMembers: Member[] = [
      {
        id: '1',
        name: 'Sarah',
        email: 'sarah@example.com',
        role: 'Dev',
        department: 'Engineering',
        status: 'Active',
        joinedDate: '2024-01-01',
        lastActive: 'Just now',
      },
    ];

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: mockMembers }),
    });

    const result = await repository.getAll();
    expect(result.members).toEqual(mockMembers);
    expect(global.fetch).toHaveBeenCalledWith('/api/members');
  });

  it('should deduplicate concurrent in-flight requests to the same URL', async () => {
    global.fetch = vi.fn().mockImplementation(() =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            ok: true,
            json: async () => ({ success: true, data: [] }),
          });
        }, 10);
      })
    );

    const [res1, res2] = await Promise.all([
      repository.getAll(),
      repository.getAll(),
    ]);

    expect(res1.members).toEqual([]);
    expect(res2.members).toEqual([]);
    // Even though getAll was called twice concurrently, fetch was only called ONCE!
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('should append query string when searching', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: [] }),
    });

    await repository.getAll('sarah');
    expect(global.fetch).toHaveBeenCalledWith('/api/members?q=sarah');
  });

  it('should create member via POST /api/members', async () => {
    const newMemberPayload = {
      name: 'Bob',
      email: 'bob@example.com',
      role: 'Designer',
      department: 'Design' as const,
      status: 'Active' as const,
      lastActive: 'Just now',
    };

    const mockResponse: Member = {
      ...newMemberPayload,
      id: 'mem_99',
      joinedDate: '2024-02-01',
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: mockResponse }),
    });

    const result = await repository.create(newMemberPayload);
    expect(result).toEqual(mockResponse);
    expect(global.fetch).toHaveBeenCalledWith('/api/members', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMemberPayload),
    });
  });

  it('should delete member via DELETE /api/members/:id', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });

    const result = await repository.delete('mem_1');
    expect(result).toBe(true);
    expect(global.fetch).toHaveBeenCalledWith('/api/members/mem_1', {
      method: 'DELETE',
    });
  });
});
