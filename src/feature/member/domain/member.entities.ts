export type MemberStatus = 'Active' | 'Pending' | 'Inactive';

export type EmploymentType = 'Full-time' | 'Part-time' | 'Contract' | 'Internship';

export type Department =
  | 'Engineering'
  | 'Design'
  | 'Product'
  | 'Marketing'
  | 'Sales'
  | 'HR'
  | 'Finance'
  | 'Operations';

export interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  department: Department;
  status: MemberStatus;
  employmentType?: EmploymentType;
  bio?: string;
  joinedDate: string;
  lastActive: string;
  avatarBgColor?: string;
}

export interface MemberMetrics {
  totalMembers: number;
  activeNow: number;
  activePercentage: number;
  departmentsCount: number;
  pendingInvites: number;
  expiringSoon: number;
}
