'use client'

import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'

export default function Navigation() {
  const { user, logout } = useAuth()

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex space-x-4">
          <Link href="/" className="hover:text-gray-300">
            Home
          </Link>
          <Link href="/dashboard" className="hover:text-gray-300">
            Dashboard
          </Link>
          {user?.role === 'admin' && (
            <Link href="/admin" className="hover:text-gray-300">
              Admin
            </Link>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm">
            Logged in as: {user?.name} ({user?.role})
          </span>
          <button
            onClick={logout}
            className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 text-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}
