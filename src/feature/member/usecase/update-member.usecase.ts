import { Member } from '../domain/member.entities';
import { UpdateMemberInputDTO } from './dtos/member.dto';
import { IMemberRepository } from './repositories/member.repository.interface';

export class UpdateMemberUsecase {
  constructor(private readonly memberRepo: IMemberRepository) {}

  async execute(id: string, dto: UpdateMemberInputDTO): Promise<Member> {
    if (dto.name !== undefined && dto.name.trim().length < 2) {
      throw new Error('Name must be at least 2 characters long');
    }

    if (dto.email !== undefined) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(dto.email.trim())) {
        throw new Error('Invalid email format');
      }
    }

    if (dto.role !== undefined && dto.role.trim().length === 0) {
      throw new Error('Role is required');
    }

    const payload: Partial<Omit<Member, 'id' | 'joinedDate'>> = {
      ...(dto.name ? { name: dto.name.trim() } : {}),
      ...(dto.email ? { email: dto.email.trim().toLowerCase() } : {}),
      ...(dto.role ? { role: dto.role.trim() } : {}),
      ...(dto.department ? { department: dto.department } : {}),
      ...(dto.status ? { status: dto.status } : {}),
      ...(dto.employmentType ? { employmentType: dto.employmentType } : {}),
      ...(dto.bio !== undefined ? { bio: dto.bio.trim() } : {}),
    };

    return this.memberRepo.update(id, payload);
  }
}
