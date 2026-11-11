import { IMemberRepository } from './repositories/member.repository.interface';

export class DeleteMemberUsecase {
  constructor(private readonly memberRepo: IMemberRepository) {}

  async execute(id: string): Promise<boolean> {
    return this.memberRepo.delete(id);
  }
}
