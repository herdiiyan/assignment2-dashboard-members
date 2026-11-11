import { describe, it, expect, beforeEach } from 'vitest';
import { GetMemberUsecase } from '../get-member.usecase';
import { IMemberRepository } from '../repositories/member.repository.interface';
import { Member, MemberMetrics } from '../../domain/member.entities';
import { GetMembersResultDTO } from '../dtos/member.dto';

class MockMemberRepository implements IMemberRepository {
  public members: Member[] = [];

  async getAll(searchQuery?: string): Promise<GetMembersResultDTO> {
    const metrics: MemberMetrics = {
      totalMembers: this.members.length,
      activeNow: this.members.filter((m) => m.status === 'Active').length,
      activePercentage: 100,
      departmentsCount: 1,
      pendingInvites: 0,
      expiringSoon: 0,
    };

    if (!searchQuery) return { members: this.members, metrics };
    const q = searchQuery.toLowerCase();
    const filtered = this.members.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.role.toLowerCase().includes(q)
    );
    return { members: filtered, metrics };
  }

  async getById(id: string): Promise<Member | null> {
    return this.members.find((m) => m.id === id) || null;
  }

  async create(data: Omit<Member, 'id' | 'joinedDate'>): Promise<Member> {
    const member: Member = { ...data, id: 'test_id', joinedDate: '2024-01-01' };
    this.members.push(member);
    return member;
  }

  async update(id: string, data: Partial<Omit<Member, 'id' | 'joinedDate'>>): Promise<Member> {
    const idx = this.members.findIndex((m) => m.id === id);
    this.members[idx] = { ...this.members[idx], ...data };
    return this.members[idx];
  }

  async delete(id: string): Promise<boolean> {
    this.members = this.members.filter((m) => m.id !== id);
    return true;
  }

  async deleteMany(ids: string[]): Promise<number> {
    const prev = this.members.length;
    this.members = this.members.filter((m) => !ids.includes(m.id));
    return prev - this.members.length;
  }
}

describe('GetMemberUsecase', () => {
  let mockRepo: MockMemberRepository;
  let useCase: GetMemberUsecase;

  beforeEach(() => {
    mockRepo = new MockMemberRepository();
    useCase = new GetMemberUsecase(mockRepo);
    mockRepo.members = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'Frontend Dev',
        department: 'Engineering',
        status: 'Active',
        joinedDate: '2024-01-01',
        lastActive: 'Just now',
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'Designer',
        department: 'Design',
        status: 'Active',
        joinedDate: '2024-01-02',
        lastActive: 'Just now',
      },
    ];
  });

  it('should return all members when no search query provided', async () => {
    const result = await useCase.execute();
    expect(result.members).toHaveLength(2);
    expect(result.members[0].name).toBe('John Doe');
  });

  it('should filter members matching search query', async () => {
    const result = await useCase.execute('jane');
    expect(result.members).toHaveLength(1);
    expect(result.members[0].name).toBe('Jane Smith');
  });
});
