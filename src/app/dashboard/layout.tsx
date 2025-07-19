'use client'

import { DashboardHeader } from '@/components/ui/dashboard-header'
import { useAuth } from '@/hooks/use-auth'
import { useEffect, useState } from 'react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = useAuth()
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

  if (!user) {
    return null // AuthProvider will handle redirect
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader
        title="🐟 NaviPesca Comerciante"
        subtitle="Dashboard"
        isOnline={isOnline}
        userRole={user.user_metadata?.rol || 'usuario'}
      />
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
} 