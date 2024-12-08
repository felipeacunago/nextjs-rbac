'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import type { User, AuthState, UserRole } from '@/types/auth'
    

interface AuthContextType extends AuthState {
  login: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const validateToken = async (): Promise<User | null> => {
  // request to /api/auth/get-user
  const response = await fetch('/api/auth/get-user')
  if (response.ok) {
    const user = await response.json()
    return user as Promise<User>
  } else {
    return null
  }

  
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  })

  useEffect(() => {
    const fetchData = async () => {
      const user = await validateToken()
      if (user) {
        setAuthState({ user, isAuthenticated: true, isLoading: false })
      }
    }
    // check if token rbac-session exists
    fetchData()
  }, [])

  const login = async (role: UserRole) => {
    if (role === 'admin') {
      await fetch('/api/auth/authorize/admin')
    } else if (role === 'user') {
      await fetch('/api/auth/authorize/user')
    }
  }

  const logout = async () => {
    const response = await fetch('/api/auth/logout')
    if (response.ok) {
      setAuthState({ user: null, isAuthenticated: false, isLoading: false })
    }
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
