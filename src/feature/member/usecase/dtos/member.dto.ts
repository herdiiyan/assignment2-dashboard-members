import { Department, MemberStatus, EmploymentType, Member, MemberMetrics } from '../../domain/member.entities';

export interface GetMembersResultDTO {
  members: Member[];
  metrics: MemberMetrics;
}

export interface CreateMemberInputDTO {
  name: string;
  email: string;
  role: string;
  department: Department;
  status?: MemberStatus;
  employmentType?: EmploymentType;
  bio?: string;
}

export interface UpdateMemberInputDTO {
  name?: string;
  email?: string;
  role?: string;
  department?: Department;
  status?: MemberStatus;
  employmentType?: EmploymentType;
  bio?: string;
}
