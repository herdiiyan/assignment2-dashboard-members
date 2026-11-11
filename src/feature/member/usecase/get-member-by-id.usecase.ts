import { Member } from '../domain/member.entities';
import { IMemberRepository } from './repositories/member.repository.interface';

export class GetMemberByIdUsecase {
  constructor(private readonly memberRepo: IMemberRepository) {}

  async execute(id: string): Promise<Member | null> {
    const member = await this.memberRepo.getById(id);
    if (!member) {
      throw new Error(`Member with id ${id} not found`);
    }
    return member;
  }
}
