'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import type { User, AuthState } from '@/types/auth'

interface AuthContextType extends AuthState {
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const validateToken = async (token: string): Promise<User | null> => {
  // Mock user data based on token
  if (token === 'admin-token') {
    return {
      id: '1',
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin'
    }
  } else if (token === 'user-token') {
    return {
      id: '2',
      name: 'Regular User',
      email: 'user@example.com',
      role: 'user'
    }
  }
  return null
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false
  })

  useEffect(() => {
    // Check for existing token on mount
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('auth-token='))
      ?.split('=')[1]

    if (token) {
      validateToken(token).then(user => {
        if (user) {
          setAuthState({ user, isAuthenticated: true })
        }
      })
    }
  }, [])

  const login = async (token: string) => {
    // Set cookie
    document.cookie = `auth-token=${token}; path=/`
    const user = await validateToken(token)
    if (user) {
      setAuthState({ user, isAuthenticated: true })
    }
  }

  const logout = () => {
    // Remove cookie
    document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
    setAuthState({ user: null, isAuthenticated: false })
  }

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
