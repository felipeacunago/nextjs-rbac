'use client'

import { useAuth } from '@/context/AuthContext'
import Navigation from '@/components/Navigation'
import UserList from '@/components/UserList'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  // useEffect(() => {
  //   if (!isAuthenticated && !isLoading) {
  //     router.push('/login?from=/dashboard')
  //   }
  // }, [isAuthenticated, isLoading, router])

  if (isLoading || !user) {
    return <>Loading</>
  }

  return (
    <div>
      <Navigation />
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        
        <div className="grid gap-8">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Welcome, {user.name}</h2>
            <div className="space-y-4">
              <div className="border-b pb-4">
                <h3 className="text-lg font-medium mb-2">Your Information</h3>
                <p className="text-gray-600">Email: {user.email}</p>
                <p className="text-gray-600">Role: {user.role}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Available Actions</h3>
                <ul className="list-disc list-inside text-gray-600">
                  <li>View dashboard statistics</li>
                  <li>Update profile information</li>
                  {user.role === 'admin' && (
                    <>
                      <li>Access admin panel</li>
                      <li>Manage user permissions</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">User Directory</h2>
            <p className="text-gray-600 mb-6">
              {user.role === 'admin' 
                ? 'As an admin, you can view complete user information including sensitive data.'
                : 'As a regular user, you can view basic user information.'}
            </p>
            <UserList />
          </div>
        </div>
      </div>
    </div>
  )
}
