import { NextRequest, NextResponse } from 'next/server';
import {
  getMemberById,
  updateMember,
  deleteMember,
} from '../member-storage';

interface RouteContext {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const member = await getMemberById(params.id);
    if (!member) {
      return NextResponse.json(
        { success: false, error: 'Member not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: member }, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    const body = await request.json();
    const updated = await updateMember(params.id, body);
    return NextResponse.json({ success: true, data: updated }, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update member';
    const status = message.includes('not found') ? 404 : 400;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    const success = await deleteMember(params.id);
    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Member not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { success: true, message: 'Member deleted successfully' },
      { status: 200 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to delete member';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
