import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { User, UserRole } from './types/auth'
import { cookies } from 'next/headers';
import { getIronSession } from 'iron-session';
import { sessionOptions, SessionData } from '@/lib/session';
import { UserProtectedData } from '@/lib/session';

const routePermissions: Record<string, UserRole[]> = {
  '/admin': ['admin'],
  '/dashboard': ['admin', 'user'],
  '/api/admin': ['admin'],
  '/api/user': ['admin', 'user'],
}

async function getUser(): Promise<UserProtectedData> {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions);

  if (!session.user) {
    throw new Error('User role is undefined')
  }
  const user = session.user as UserProtectedData;
  if (!user.role) {
    throw new Error('User role is undefined')
  }
  return user;
}

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === '/api/auth/get-user') {
    return NextResponse.json(await getUser())
  }
  if (request.nextUrl.pathname.includes('/api/auth/')) {
    return NextResponse.next()
  }

  if (request.nextUrl.pathname === '/api/users') {
    return NextResponse.next()
  }

  const path = request.nextUrl.pathname
  
  // Check if the path requires authorization
  const requiredRoles = Object.entries(routePermissions).find(([route]) => 
    path.startsWith(route)
  )?.[1]

  // If no roles required, allow access
  if (!requiredRoles) {
    return NextResponse.next()
  }

  const user = await getUser();
  const userRole = user.role as UserRole;

  // Check if user has required role
  if (!requiredRoles.includes(userRole)) {
    // Redirect to login or show unauthorized based on path type
    if (path.startsWith('/api/')) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401,
          headers: { 'content-type': 'application/json' }
        }
      )
    }
    
    // Redirect to login for page routes
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Add role to headers for use in API routes
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-user-role', userRole)

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    }
  })
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/dashboard/:path*',
    '/api/:path*',
    '/((?!api/auth/verify).*)'  // Match all paths except /api/auth/verify
  ]
}