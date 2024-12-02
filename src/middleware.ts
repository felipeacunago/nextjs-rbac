import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { UserRole } from './types/auth'

const routePermissions: Record<string, UserRole[]> = {
  '/admin': ['admin'],
  '/dashboard': ['admin', 'user'],
  '/api/admin': ['admin'],
  '/api/user': ['admin', 'user'],
}

async function getUserRole(request: NextRequest): Promise<UserRole> {
  try {
    const protocol = request.nextUrl.protocol
    const host = request.headers.get('host')
    const baseUrl = `${protocol}//${host}`
    
    const response = await fetch(`${baseUrl}/api/auth/verify`, {
      headers: {
        cookie: request.headers.get('cookie') || '' 
      }
    })

    if (!response.ok) {
      throw new Error('Failed to verify token')
    }

    const data = await response.json()
    return data.role as UserRole
  } catch (error) {
    console.error('Error verifying token:', error)
    return 'guest'
  }
}

export async function middleware(request: NextRequest) {
  // Skip middleware for the verify endpoint to avoid infinite loop
  if (request.nextUrl.pathname === '/api/auth/verify') {
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

  const userRole = await getUserRole(request)

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
