import { Member } from '../domain/member.entities';
import { CreateMemberInputDTO } from './dtos/member.dto';
import { IMemberRepository } from './repositories/member.repository.interface';

const PASTEL_COLORS = [
  'bg-indigo-100 text-indigo-700',
  'bg-emerald-100 text-emerald-700',
  'bg-purple-100 text-purple-700',
  'bg-amber-100 text-amber-700',
  'bg-blue-100 text-blue-700',
  'bg-pink-100 text-pink-700',
  'bg-cyan-100 text-cyan-700',
];

export class CreateMemberUsecase {
  constructor(private readonly memberRepo: IMemberRepository) {}

  async execute(dto: CreateMemberInputDTO): Promise<Member> {
    if (!dto.name || dto.name.trim().length < 2) {
      throw new Error('Name must be at least 2 characters long');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!dto.email || !emailRegex.test(dto.email.trim())) {
      throw new Error('Invalid email format');
    }

    if (!dto.role || dto.role.trim().length === 0) {
      throw new Error('Role is required');
    }

    const colorIndex =
      Math.abs(
        dto.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
      ) % PASTEL_COLORS.length;

    const newMemberPayload: Omit<Member, 'id' | 'joinedDate'> = {
      name: dto.name.trim(),
      email: dto.email.trim().toLowerCase(),
      role: dto.role.trim(),
      department: dto.department,
      status: dto.status || 'Active',
      employmentType: dto.employmentType || 'Full-time',
      bio: dto.bio?.trim() || '',
      lastActive: 'Just now',
      avatarBgColor: PASTEL_COLORS[colorIndex],
    };

    return this.memberRepo.create(newMemberPayload);
  }
}
