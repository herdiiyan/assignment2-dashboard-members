import { GetMembersResultDTO } from './dtos/member.dto';
import { IMemberRepository } from './repositories/member.repository.interface';

export class GetMemberUsecase {
  constructor(private readonly memberRepo: IMemberRepository) {}

  async execute(searchQuery?: string): Promise<GetMembersResultDTO> {
    return this.memberRepo.getAll(searchQuery);
  }
}
