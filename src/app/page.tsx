'use client'

import { useAuth } from '@/context/AuthContext'
import Navigation from '@/components/Navigation'
import Link from 'next/link'

export default function HomePage() {
  const { isAuthenticated } = useAuth()

  return (
    <div>
      {isAuthenticated ? (
        <Navigation />
      ) : null}
      
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">
              Next.js RBAC Example
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              A demonstration of Role-Based Access Control using Next.js App Router and Middleware
            </p>
            
            {!isAuthenticated ? (
              <Link
                href="/login"
                className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                Sign In
              </Link>
            ) : (
              <Link
                href="/dashboard"
                className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                Go to Dashboard
              </Link>
            )}
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">User Role</h2>
              <p className="text-gray-600">
                Regular users can access the dashboard and view their profile information.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Admin Role</h2>
              <p className="text-gray-600">
                Administrators have access to all user features plus the admin panel and user management.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Middleware Protection</h2>
              <p className="text-gray-600">
                Routes are protected by Next.js middleware that checks user roles and permissions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
