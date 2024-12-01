import './globals.css'
import { AuthProvider } from '@/context/AuthContext'

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
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
