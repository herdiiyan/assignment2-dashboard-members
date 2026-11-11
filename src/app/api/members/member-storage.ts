import fs from 'fs/promises';
import path from 'path';
import { Member, MemberMetrics } from '@/feature/member/domain/member.entities';

const FILE_PATH = path.resolve(process.cwd(), 'data/members.json');

const AVATAR_BG_COLORS = [
  'bg-indigo-100 text-indigo-700',
  'bg-emerald-100 text-emerald-700',
  'bg-purple-100 text-purple-700',
  'bg-amber-100 text-amber-700',
  'bg-blue-100 text-blue-700',
  'bg-rose-100 text-rose-700',
  'bg-teal-100 text-teal-700',
];

export async function readMembersFromFile(): Promise<Member[]> {
  try {
    const raw = await fs.readFile(FILE_PATH, 'utf-8');
    return JSON.parse(raw) as Member[];
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }
    throw err;
  }
}

export async function writeMembersToFile(members: Member[]): Promise<void> {
  await fs.mkdir(path.dirname(FILE_PATH), { recursive: true });
  await fs.writeFile(FILE_PATH, JSON.stringify(members, null, 2), 'utf-8');
}

export async function getMembers(searchQuery?: string): Promise<Member[]> {
  const members = await readMembersFromFile();
  if (!searchQuery || searchQuery.trim() === '') {
    return members;
  }
  const q = searchQuery.toLowerCase().trim();
  return members.filter((m) => {
    return (
      m.name.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.role.toLowerCase().includes(q)
    );
  });
}

export async function calculateMetrics(): Promise<MemberMetrics> {
  const members = await readMembersFromFile();
  const totalMembers = members.length;
  const activeNow = members.filter((m) => m.status === 'Active').length;
  const activePercentage =
    totalMembers > 0 ? Math.round((activeNow / totalMembers) * 100) : 0;
  const departments = new Set(members.map((m) => m.department));
  const pendingMembers = members.filter((m) => m.status === 'Pending');
  const pendingInvites = pendingMembers.length;

  const now = Date.now();
  const FIVE_DAYS_MS = 5 * 24 * 60 * 60 * 1000;
  const expiringSoon = pendingMembers.filter((m) => {
    const joinedTime = new Date(m.joinedDate).getTime();
    if (Number.isNaN(joinedTime)) return false;
    return now - joinedTime >= FIVE_DAYS_MS;
  }).length;

  return {
    totalMembers,
    activeNow,
    activePercentage,
    departmentsCount: departments.size,
    pendingInvites,
    expiringSoon,
  };
}

export async function getMemberById(id: string): Promise<Member | null> {
  const members = await readMembersFromFile();
  return members.find((m) => m.id === id) || null;
}

export async function createMember(
  data: Omit<Member, 'id' | 'joinedDate'>
): Promise<Member> {
  const members = await readMembersFromFile();

  // Validate duplicate email
  const existing = members.find(
    (m) => m.email.toLowerCase() === data.email.toLowerCase()
  );
  if (existing) {
    throw new Error('Member with this email already exists');
  }

  const randomColor =
    AVATAR_BG_COLORS[Math.floor(Math.random() * AVATAR_BG_COLORS.length)];
  const newId = `mem_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const today = new Date().toISOString().split('T')[0];

  const newMember: Member = {
    ...data,
    id: newId,
    joinedDate: today,
    lastActive: data.lastActive || 'Just now',
    avatarBgColor: data.avatarBgColor || randomColor,
  };

  members.unshift(newMember);
  await writeMembersToFile(members);
  return newMember;
}

export async function updateMember(
  id: string,
  data: Partial<Omit<Member, 'id' | 'joinedDate'>>
): Promise<Member> {
  const members = await readMembersFromFile();
  const index = members.findIndex((m) => m.id === id);

  if (index === -1) {
    throw new Error(`Member with id '${id}' not found`);
  }

  // Validate email uniqueness if email is changed
  if (data.email) {
    const existing = members.find(
      (m) => m.email.toLowerCase() === data.email!.toLowerCase() && m.id !== id
    );
    if (existing) {
      throw new Error('Member with this email already exists');
    }
  }

  const updated: Member = {
    ...members[index],
    ...data,
  };

  members[index] = updated;
  await writeMembersToFile(members);
  return updated;
}

export async function deleteMember(id: string): Promise<boolean> {
  const members = await readMembersFromFile();
  const index = members.findIndex((m) => m.id === id);
  if (index === -1) {
    return false;
  }
  members.splice(index, 1);
  await writeMembersToFile(members);
  return true;
}

export async function bulkDeleteMembers(ids: string[]): Promise<number> {
  const members = await readMembersFromFile();
  const idSet = new Set(ids);
  const remaining = members.filter((m) => !idSet.has(m.id));
  const deletedCount = members.length - remaining.length;

  await writeMembersToFile(remaining);
  return deletedCount;
}
