import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { sessionOptions, SessionData } from '@/lib/session';
import { UserRole } from '@/types/auth';

export async function GET() {
  try {
    let role: UserRole = 'guest';
    let organizationId = '';
    
    role = 'admin';
    organizationId = 'admin-123';
    const cookieStore = await cookies();
    const session = await getIronSession<SessionData>(cookieStore, sessionOptions);

    // Set session data
    session.user = {
      role: role,
      organizationId: organizationId
    };

    // Save session
    await session.save();

    return NextResponse.json({
      role,
      isAuthenticated: true
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
