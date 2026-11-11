import { describe, it, expect, vi } from 'vitest';
import { UpdateMemberUsecase } from '../update-member.usecase';
import { IMemberRepository } from '../repositories/member.repository.interface';
import { Member } from '../../domain/member.entities';

describe('UpdateMemberUsecase', () => {
  const updatedMember: Member = {
    id: 'mem_1',
    name: 'Alice Updated',
    email: 'alice.updated@example.com',
    role: 'Senior Engineer',
    department: 'Engineering',
    status: 'Active',
    joinedDate: '2024-01-01',
    lastActive: 'Just now',
  };

  it('should validate and update member', async () => {
    const mockRepo: Partial<IMemberRepository> = {
      update: vi.fn().mockResolvedValue(updatedMember),
    };

    const usecase = new UpdateMemberUsecase(mockRepo as IMemberRepository);
    const result = await usecase.execute('mem_1', {
      name: 'Alice Updated',
      email: 'alice.updated@example.com',
    });

    expect(result).toEqual(updatedMember);
    expect(mockRepo.update).toHaveBeenCalledWith('mem_1', {
      name: 'Alice Updated',
      email: 'alice.updated@example.com',
    });
  });

  it('should throw when updated email is invalid', async () => {
    const mockRepo: Partial<IMemberRepository> = {
      update: vi.fn(),
    };
    const usecase = new UpdateMemberUsecase(mockRepo as IMemberRepository);

    await expect(
      usecase.execute('mem_1', {
        email: 'invalid-email',
      })
    ).rejects.toThrow('Invalid email format');
  });
});
