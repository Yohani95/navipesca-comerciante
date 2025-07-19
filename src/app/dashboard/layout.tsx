'use client'

import { DashboardHeader } from '@/components/ui/dashboard-header'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { useAuth } from '@/hooks/use-auth'
import { useEffect, useState } from 'react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    // Monitor online status
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <DashboardHeader
          title="🐟 NaviPesca Comerciante"
          subtitle="Dashboard"
          isOnline={isOnline}
          userRole={user?.user_metadata?.rol || 'usuario'}
        />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  )
} 