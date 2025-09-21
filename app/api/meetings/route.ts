import { NextResponse } from 'next/server';
import { checkAuthorization } from '@/lib/rbac';
import dbConnect from '@/lib/mongoose';
import Meeting from '@/models/Meeting';

// GET /api/meetings -> recent meetings for current user
export async function GET() {
  const { session, error } = await checkAuthorization(['admin', 'user']);
  if (error) return error;

  await dbConnect();
  const meetings = await Meeting.find({ userId: session!.user.id })
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

  return NextResponse.json({ meetings });
}
