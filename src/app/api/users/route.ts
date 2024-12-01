import { NextRequest, NextResponse } from 'next/server'
import { UserRole } from '@/types/auth'

// Mock user database
const users = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user',
    salary: 75000,
    department: 'Engineering',
    personalInfo: {
      address: '123 Main St',
      phoneNumber: '555-0123',
      socialSecurity: '123-45-6789'
    }
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'admin',
    salary: 95000,
    department: 'Management',
    personalInfo: {
      address: '456 Oak Ave',
      phoneNumber: '555-0456',
      socialSecurity: '987-65-4321'
    }
  },
  {
    id: '3',
    name: 'Bob Wilson',
    email: 'bob@example.com',
    role: 'user',
    salary: 70000,
    department: 'Marketing',
    personalInfo: {
      address: '789 Pine St',
      phoneNumber: '555-0789',
      socialSecurity: '456-78-9012'
    }
  }
]

// Filter sensitive data based on user role
function filterUserData(user: any, requestingUserRole: UserRole) {
  if (requestingUserRole === 'admin') {
    // Admins see all data
    return user
  } else {
    // Regular users see limited data
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department
    }
  }
}

export async function GET(request: NextRequest) {
  // Get user role from header (set by middleware)
  const userRole = request.headers.get('x-user-role') as UserRole

  if (!userRole) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  // Filter users based on role
  const filteredUsers = users.map(user => filterUserData(user, userRole))

  return NextResponse.json({
    users: filteredUsers,
    // Include metadata about the request
    metadata: {
      requestedBy: userRole,
      timestamp: new Date().toISOString(),
      dataAccess: userRole === 'admin' ? 'full' : 'limited'
    }
  })
}
