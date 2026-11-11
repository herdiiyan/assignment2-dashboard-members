import { Member } from '../../domain/member.entities';
import { GetMembersResultDTO } from '../dtos/member.dto';

export interface IMemberRepository {
  getAll(searchQuery?: string): Promise<GetMembersResultDTO>;
  getById(id: string): Promise<Member | null>;
  create(data: Omit<Member, 'id' | 'joinedDate'>): Promise<Member>;
  update(id: string, data: Partial<Omit<Member, 'id' | 'joinedDate'>>): Promise<Member>;
  delete(id: string): Promise<boolean>;
  deleteMany(ids: string[]): Promise<number>;
}
