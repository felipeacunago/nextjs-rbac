import './globals.css'
import { AuthProvider } from '@/context/AuthContext'
import { Suspense } from 'react'

export const metadata = {
  title: 'Next.js RBAC Example',
  description: 'Role-based access control with Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Suspense fallback={<div>Loading...</div>}>
            {children}
          </Suspense>
        </AuthProvider>
      </body>
    </html>
  )
}
