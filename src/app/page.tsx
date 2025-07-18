'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { AuthForm } from '@/components/auth/auth-form'

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      // Redirect to appropriate dashboard based on user role
      const userRole = localStorage.getItem('userRole')
      if (userRole === 'comprador') {
        router.push('/dashboard/comprador')
      } else if (userRole === 'pesador') {
        router.push('/dashboard/pesador')
      } else if (userRole === 'admin') {
        router.push('/dashboard/admin')
      } else {
        router.push('/dashboard/comprador') // Default fallback
      }
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-navy-500 dark:text-white mb-2">
              🐟 NaviPesca
            </h1>
            <h2 className="text-xl font-semibold text-navy-400 dark:text-gray-300 mb-4">
              Comerciante
            </h2>
            <p className="text-muted-foreground">
              Sistema de gestión comercial para compradores de pesca
            </p>
          </div>
          <AuthForm />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  )
}