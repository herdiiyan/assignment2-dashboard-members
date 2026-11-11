import { describe, it, expect, vi } from 'vitest';
import { BulkDeleteMembersUsecase } from '../bulk-delete-members.usecase';
import { IMemberRepository } from '../repositories/member.repository.interface';

describe('BulkDeleteMembersUsecase', () => {
  it('should call repository deleteMany with given ids', async () => {
    const mockRepo: Partial<IMemberRepository> = {
      deleteMany: vi.fn().mockResolvedValue(2),
    };

    const usecase = new BulkDeleteMembersUsecase(mockRepo as IMemberRepository);
    const result = await usecase.execute(['mem_1', 'mem_2']);

    expect(result).toBe(2);
    expect(mockRepo.deleteMany).toHaveBeenCalledWith(['mem_1', 'mem_2']);
  });

  it('should return 0 when ids is empty', async () => {
    const mockRepo: Partial<IMemberRepository> = {
      deleteMany: vi.fn(),
    };

    const usecase = new BulkDeleteMembersUsecase(mockRepo as IMemberRepository);
    const result = await usecase.execute([]);

    expect(result).toBe(0);
    expect(mockRepo.deleteMany).not.toHaveBeenCalled();
  });
});
