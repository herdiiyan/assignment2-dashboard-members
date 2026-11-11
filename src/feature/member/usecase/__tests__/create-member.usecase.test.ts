import { describe, it, expect, vi } from 'vitest';
import { CreateMemberUsecase } from '../create-member.usecase';
import { IMemberRepository } from '../repositories/member.repository.interface';
import { Member } from '../../domain/member.entities';

describe('CreateMemberUsecase', () => {
  it('should validate and create a new member', async () => {
    const createdMember: Member = {
      id: 'mem_new',
      name: 'Bob Ross',
      email: 'bob.ross@art.com',
      role: 'Lead Artist',
      department: 'Design',
      status: 'Active',
      joinedDate: '2024-03-01',
      lastActive: 'Just now',
    };

    const mockRepo: Partial<IMemberRepository> = {
      create: vi.fn().mockResolvedValue(createdMember),
    };

    const usecase = new CreateMemberUsecase(mockRepo as IMemberRepository);
    const result = await usecase.execute({
      name: 'Bob Ross',
      email: 'bob.ross@art.com',
      role: 'Lead Artist',
      department: 'Design',
      status: 'Active',
    });

    expect(result).toEqual(createdMember);
    expect(mockRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Bob Ross',
        email: 'bob.ross@art.com',
        role: 'Lead Artist',
      })
    );
  });

  it('should throw when name is too short', async () => {
    const mockRepo: Partial<IMemberRepository> = {
      create: vi.fn(),
    };
    const usecase = new CreateMemberUsecase(mockRepo as IMemberRepository);

    await expect(
      usecase.execute({
        name: 'A',
        email: 'a@example.com',
        role: 'Dev',
        department: 'Engineering',
        status: 'Active',
      })
    ).rejects.toThrow('Name must be at least 2 characters long');
  });

  it('should throw when email is invalid', async () => {
    const mockRepo: Partial<IMemberRepository> = {
      create: vi.fn(),
    };
    const usecase = new CreateMemberUsecase(mockRepo as IMemberRepository);

    await expect(
      usecase.execute({
        name: 'Alice',
        email: 'invalid-email',
        role: 'Dev',
        department: 'Engineering',
        status: 'Active',
      })
    ).rejects.toThrow('Invalid email format');
  });
});
