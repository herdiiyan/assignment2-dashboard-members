import { describe, it, expect, vi } from 'vitest';
import { DeleteMemberUsecase } from '../delete-member.usecase';
import { IMemberRepository } from '../repositories/member.repository.interface';

describe('DeleteMemberUsecase', () => {
  it('should call repository delete', async () => {
    const mockRepo: Partial<IMemberRepository> = {
      delete: vi.fn().mockResolvedValue(true),
    };

    const usecase = new DeleteMemberUsecase(mockRepo as IMemberRepository);
    const result = await usecase.execute('mem_1');

    expect(result).toBe(true);
    expect(mockRepo.delete).toHaveBeenCalledWith('mem_1');
  });
});
