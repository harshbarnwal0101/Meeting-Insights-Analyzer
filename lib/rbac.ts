import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { NextResponse } from 'next/server';
import { Session } from 'next-auth';

type Role = 'admin' | 'user';

/**
 * Checks if the current user is authenticated and has one of the allowed roles.
 * This is a helper for App Router API routes.
 * @param allowedRoles - An array of roles that are allowed to access the resource.
 * @returns An object containing the user session if authorized, or an error NextResponse if not.
 */
export async function checkAuthorization(
  allowedRoles: Role[]
): Promise<{ session: Session | null; error?: NextResponse }> {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return {
      session: null,
      error: NextResponse.json({ message: 'Unauthorized' }, { status: 401 }),
    };
  }

  if (!session.user.role || !allowedRoles.includes(session.user.role)) {
    return {
      session,
      error: NextResponse.json({ message: 'Forbidden' }, { status: 403 }),
    };
  }

  return { session };
}
