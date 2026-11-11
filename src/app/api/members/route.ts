import { NextRequest, NextResponse } from 'next/server';
import {
  getMembers,
  calculateMetrics,
  createMember,
  bulkDeleteMembers,
} from './member-storage';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get('q') || undefined;

    const [members, metrics] = await Promise.all([
      getMembers(searchQuery),
      calculateMetrics(),
    ]);

    return NextResponse.json(
      {
        success: true,
        data: members,
        metrics,
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name || !body.email || !body.role || !body.department || !body.status) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: name, email, role, department, status',
        },
        { status: 400 }
      );
    }

    const newMember = await createMember(body);
    return NextResponse.json({ success: true, data: newMember }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create member';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    if (!Array.isArray(body.ids) || body.ids.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Expected non-empty ids array in request body' },
        { status: 400 }
      );
    }

    const deletedCount = await bulkDeleteMembers(body.ids);
    return NextResponse.json(
      {
        success: true,
        deletedCount,
        message: `${deletedCount} members deleted successfully`,
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Failed to bulk delete members';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
