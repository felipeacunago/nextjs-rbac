import { NextRequest, NextResponse } from 'next/server'
import { UserRole } from '@/types/auth'

export async function GET(request: NextRequest) {
  const token = request.cookies.get('auth-token')
  
  // Mock token verification
  // In production, this would verify a JWT token or session
  const role: UserRole = token?.value === 'admin-token' ? 'admin' : 
                        token?.value === 'user-token' ? 'user' : 'guest'

  return NextResponse.json({
    role,
    isAuthenticated: role !== 'guest'
  })
}
