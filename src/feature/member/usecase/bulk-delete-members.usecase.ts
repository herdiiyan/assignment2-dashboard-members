import { IMemberRepository } from './repositories/member.repository.interface';

export class BulkDeleteMembersUsecase {
  constructor(private readonly memberRepo: IMemberRepository) {}

  async execute(ids: string[]): Promise<number> {
    if (!ids || ids.length === 0) return 0;
    return this.memberRepo.deleteMany(ids);
  }
}
