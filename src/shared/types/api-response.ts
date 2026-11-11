import { MemberMetrics } from '@/feature/member/domain/member.entities';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  metrics?: MemberMetrics;
  message?: string;
  error?: string;
  deletedCount?: number;
}
