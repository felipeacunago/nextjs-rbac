import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { UserRole } from './types/auth'

// Define route permissions
const routePermissions: Record<string, UserRole[]> = {
  '/admin': ['admin'],
  '/dashboard': ['admin', 'user'],
  '/api/admin': ['admin'],
  '/api/user': ['admin', 'user'],
}

// Mock function to get user role from token
// In a real app, this would verify a JWT token or session
function getUserRoleFromToken(request: NextRequest): UserRole {
  const token = request.cookies.get('auth-token')
  // For demo purposes, we'll use a mock role
  // In production, decode and verify the token
  return token?.value === 'admin-token' ? 'admin' : 
         token?.value === 'user-token' ? 'user' : 'guest'
}

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  
  // Check if the path requires authorization
  const requiredRoles = Object.entries(routePermissions).find(([route]) => 
    path.startsWith(route)
  )?.[1]

  // If no roles required, allow access
  if (!requiredRoles) {
    return NextResponse.next()
  }

  const userRole = getUserRoleFromToken(request)

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
    '/api/:path*'
  ]
}
