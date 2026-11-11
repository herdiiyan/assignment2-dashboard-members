import { describe, it, expect } from 'vitest';
import { GetMemberByIdUsecase } from '../get-member-by-id.usecase';
import { IMemberRepository } from '../repositories/member.repository.interface';
import { Member } from '../../domain/member.entities';

describe('GetMemberByIdUsecase', () => {
  const dummyMember: Member = {
    id: 'mem_1',
    name: 'Alice',
    email: 'alice@example.com',
    role: 'Engineer',
    department: 'Engineering',
    status: 'Active',
    joinedDate: '2024-01-01',
    lastActive: 'Just now',
  };

  it('should return member when found', async () => {
    const mockRepo: Partial<IMemberRepository> = {
      getById: async (id: string) => (id === 'mem_1' ? dummyMember : null),
    };

    const usecase = new GetMemberByIdUsecase(mockRepo as IMemberRepository);
    const result = await usecase.execute('mem_1');

    expect(result).toEqual(dummyMember);
  });

  it('should throw an error when member not found', async () => {
    const mockRepo: Partial<IMemberRepository> = {
      getById: async () => null,
    };

    const usecase = new GetMemberByIdUsecase(mockRepo as IMemberRepository);
    await expect(usecase.execute('non_existent')).rejects.toThrow(
      'Member with id non_existent not found'
    );
  });
});
