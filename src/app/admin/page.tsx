'use client'

import { useAuth } from '@/context/AuthContext'
import Navigation from '@/components/Navigation'
import UserList from '@/components/UserList'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AdminPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?from=/admin')
    } else if (user?.role !== 'admin') {
      router.push('/dashboard')
    }
  }, [isAuthenticated, user, router])

  if (!user || user.role !== 'admin') {
    return null
  }

  return (
    <div>
      <Navigation />
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        
        <div className="grid gap-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">System Overview</h2>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded">
                  <h3 className="font-medium">Access Control</h3>
                  <div className="mt-3">
                    <div className="flex justify-between items-center py-2">
                      <span>Dashboard Access</span>
                      <span className="text-green-600">Enabled</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span>API Access</span>
                      <span className="text-green-600">Enabled</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span>User Registration</span>
                      <span className="text-red-600">Disabled</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-4">
                <button className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                  Generate System Report
                </button>
                <button className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors">
                  Manage Permissions
                </button>
                <button className="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors">
                  View Audit Logs
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Complete User Directory</h2>
            <p className="text-gray-600 mb-6">
              As an administrator, you have access to complete user information including sensitive data.
              This includes personal information, salary details, and department information.
            </p>
            <UserList />
          </div>
        </div>
      </div>
    </div>
  )
}
