'use client'

import { useAuth } from '@/context/AuthContext'
import { useEffect, useState } from 'react'

interface UserData {
  users: any[]
  metadata: {
    requestedBy: string
    timestamp: string
    dataAccess: string
  }
}

export default function UserList() {
  const { user } = useAuth()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users')
        if (!response.ok) {
          throw new Error('Failed to fetch users')
        }
        const data = await response.json()
        setUserData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      }
    }

    fetchUsers()
  }, [])

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded">
        Error: {error}
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded">
        <h3 className="font-medium text-blue-900">Request Metadata</h3>
        <div className="mt-2 text-sm text-blue-800">
          <p>Requested by: {userData.metadata.requestedBy}</p>
          <p>Access Level: {userData.metadata.dataAccess}</p>
          <p>Timestamp: {new Date(userData.metadata.timestamp).toLocaleString()}</p>
        </div>
      </div>

      <div className="grid gap-4">
        {userData.users.map((user) => (
          <div key={user.id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{user.name}</h3>
                <p className="text-gray-600">{user.email}</p>
              </div>
              <span className={`px-2 py-1 rounded text-sm ${
                user.role === 'admin' 
                  ? 'bg-purple-100 text-purple-800' 
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {user.role}
              </span>
            </div>
            
            <div className="mt-4 grid gap-2">
              {user.department && (
                <p className="text-sm">
                  <span className="font-medium">Department:</span> {user.department}
                </p>
              )}
              {user.salary && (
                <p className="text-sm">
                  <span className="font-medium">Salary:</span> ${user.salary.toLocaleString()}
                </p>
              )}
              {user.personalInfo && (
                <div className="mt-2 pt-2 border-t">
                  <p className="text-sm font-medium">Personal Information:</p>
                  <div className="mt-1 text-sm text-gray-600">
                    <p>Address: {user.personalInfo.address}</p>
                    <p>Phone: {user.personalInfo.phoneNumber}</p>
                    <p>SSN: {user.personalInfo.socialSecurity}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
