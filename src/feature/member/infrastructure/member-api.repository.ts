import { Member, MemberMetrics } from '../domain/member.entities';
import { GetMembersResultDTO } from '../usecase/dtos/member.dto';
import { IMemberRepository } from '../usecase/repositories/member.repository.interface';

const DEFAULT_METRICS: MemberMetrics = {
  totalMembers: 0,
  activeNow: 0,
  activePercentage: 0,
  departmentsCount: 0,
  pendingInvites: 0,
  expiringSoon: 0,
};

export class MemberApiRepository implements IMemberRepository {
  private baseUrl: string;
  private inFlightRequests = new Map<string, Promise<GetMembersResultDTO>>();

  constructor(baseUrl = '/api/members') {
    this.baseUrl = baseUrl;
  }

  async getAll(searchQuery?: string): Promise<GetMembersResultDTO> {
    const url = searchQuery && searchQuery.trim() !== ''
      ? `${this.baseUrl}?q=${encodeURIComponent(searchQuery.trim())}`
      : this.baseUrl;
      
    const existingPromise = this.inFlightRequests.get(url);
    if (existingPromise) {
      return existingPromise;
    }

    const fetchPromise = (async () => {
      try {
        const res = await fetch(url);
        const json = await res.json();
        return {
          members: json.data || [],
          metrics: json.metrics || DEFAULT_METRICS,
        };
      } finally {
        this.inFlightRequests.delete(url);
      }
    })();

    this.inFlightRequests.set(url, fetchPromise);
    return fetchPromise;
  }

  async getById(id: string): Promise<Member | null> {
    const res = await fetch(`${this.baseUrl}/${id}`);
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  }

  async create(data: Omit<Member, 'id' | 'joinedDate'>): Promise<Member> {
    const res = await fetch(this.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || 'Failed to create member');
    }
    return json.data;
  }

  async update(
    id: string,
    data: Partial<Omit<Member, 'id' | 'joinedDate'>>
  ): Promise<Member> {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || 'Failed to update member');
    }
    return json.data;
  }

  async delete(id: string): Promise<boolean> {
    const res = await fetch(`${this.baseUrl}/${id}`, { method: 'DELETE' });
    return res.ok;
  }

  async deleteMany(ids: string[]): Promise<number> {
    const res = await fetch(this.baseUrl, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids }),
    });
    const json = await res.json();
    return json.deletedCount || ids.length;
  }
}
