'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { useAuth } from '@/hooks/use-auth'
import { 
  Scale,
  Ship,
  Package,
  Clock,
  CheckCircle,
  AlertCircle,
  Wifi,
  WifiOff,
  Plus,
  RefreshCw,
  List
} from 'lucide-react'
import Link from 'next/link'
import { formatWeight, formatDateTime } from '@/lib/utils'

interface PesadorStats {
  pesajesHoy: number
  kilosHoy: number
  pendientesSinc: number
  erroresSinc: number
  ultimoPesaje: string | null
}

interface RecentWeighing {
  id: string
  embarcacion: string
  bins: number
  peso: number
  fecha: string
  estado: 'pendiente' | 'sincronizado' | 'error'
}

export default function PesadorDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<PesadorStats | null>(null)
  const [recentWeighings, setRecentWeighings] = useState<RecentWeighing[]>([])
  const [loading, setLoading] = useState(true)
  const [isOnline, setIsOnline] = useState(true)
  const [syncing, setSyncing] = useState(false)

  useEffect(() => {
    // Simulate loading stats - replace with actual API calls
    const loadStats = async () => {
      try {
        // Mock data - replace with actual API calls
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        setStats({
          pesajesHoy: 42,
          kilosHoy: 3250.8,
          pendientesSinc: 8,
          erroresSinc: 1,
          ultimoPesaje: new Date(Date.now() - 15 * 60 * 1000).toISOString()
        })

        setRecentWeighings([
          {
            id: '1',
            embarcacion: 'Esperanza III',
            bins: 6,
            peso: 445.2,
            fecha: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
            estado: 'sincronizado'
          },
          {
            id: '2',
            embarcacion: 'Mar Azul',
            bins: 4,
            peso: 320.5,
            fecha: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
            estado: 'pendiente'
          },
          {
            id: '3',
            embarcacion: 'Gaviota',
            bins: 8,
            peso: 625.1,
            fecha: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            estado: 'sincronizado'
          },
          {
            id: '4',
            embarcacion: 'Nuevo Amanecer',
            bins: 3,
            peso: 280.0,
            fecha: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
            estado: 'error'
          }
        ])

      } catch (error) {
        console.error('Error loading dashboard stats:', error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()

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

  const handleSync = async () => {
    setSyncing(true)
    try {
      // Simulate sync process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Update stats after sync
      setStats(prev => prev ? {
        ...prev,
        pendientesSinc: Math.max(0, prev.pendientesSinc - 3),
        erroresSinc: Math.max(0, prev.erroresSinc - 1)
      } : null)

      // Update recent weighings status
      setRecentWeighings(prev => 
        prev.map(w => w.estado === 'pendiente' ? { ...w, estado: 'sincronizado' } : w)
      )
      
    } catch (error) {
      console.error('Sync error:', error)
    } finally {
      setSyncing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const statCards = [
    {
      title: "Pesajes Hoy",
      value: stats?.pesajesHoy || 0,
      description: "Registros completados",
      icon: Scale,
      color: "text-aqua-600"
    },
    {
      title: "Kilos Registrados",
      value: stats ? formatWeight(stats.kilosHoy) : "0 kg",
      description: "Total del día",
      icon: Package,
      color: "text-navy-600"
    },
    {
      title: "Pendientes",
      value: stats?.pendientesSinc || 0,
      description: "Por sincronizar",
      icon: Clock,
      color: "text-warning-600"
    },
    {
      title: "Estado",
      value: isOnline ? "Online" : "Offline",
      description: isOnline ? "Conectado" : "Sin conexión",
      icon: isOnline ? Wifi : WifiOff,
      color: isOnline ? "text-aqua-600" : "text-destructive"
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sincronizado':
        return <CheckCircle className="h-4 w-4 text-aqua-600" />
      case 'pendiente':
        return <Clock className="h-4 w-4 text-warning-600" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-destructive" />
      default:
        return null
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'sincronizado':
        return 'Sincronizado'
      case 'pendiente':
        return 'Pendiente'
      case 'error':
        return 'Error'
      default:
        return status
    }
  }

  return (
      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <Card key={index} className="fade-in">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">
                      {stat.description}
                    </p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Button variant="aqua" size="lg" className="h-20" asChild>
            <Link href="/dashboard/pesador/pesaje-nuevo" className="flex flex-col items-center gap-2">
              <Plus className="h-8 w-8" />
              <span className="text-lg font-semibold">Nuevo Pesaje</span>
            </Link>
          </Button>

          <Button 
            variant="navy" 
            size="lg" 
            className="h-20" 
            onClick={handleSync}
            disabled={syncing || !isOnline}
            loading={syncing}
          >
            <div className="flex flex-col items-center gap-2">
              <RefreshCw className="h-8 w-8" />
              <span className="text-lg font-semibold">
                {syncing ? 'Sincronizando...' : 'Sincronizar'}
              </span>
            </div>
          </Button>

          <Button variant="outline" size="lg" className="h-20" asChild>
            <Link href="/dashboard/pesador/historial" className="flex flex-col items-center gap-2">
              <List className="h-8 w-8" />
              <span className="text-lg font-semibold">Ver Historial</span>
            </Link>
          </Button>
        </div>

        {/* Recent Weighings */}
        <Card>
          <CardHeader>
            <CardTitle>Pesajes Recientes</CardTitle>
            <CardDescription>
              Últimos registros del día - {stats?.ultimoPesaje && `Último: ${formatDateTime(stats.ultimoPesaje)}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentWeighings.map((weighing) => (
                <div key={weighing.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <Ship className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="font-semibold">{weighing.embarcacion}</p>
                      <p className="text-sm text-muted-foreground">
                        {weighing.bins} bins • {formatDateTime(weighing.fecha)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-bold text-lg">{formatWeight(weighing.peso)}</p>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(weighing.estado)}
                        <span className="text-sm">{getStatusText(weighing.estado)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {recentWeighings.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Scale className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No hay pesajes registrados hoy</p>
                  <p className="text-sm">Comienza registrando un nuevo pesaje</p>
                </div>
              )}
            </div>

            {stats && (stats.pendientesSinc > 0 || stats.erroresSinc > 0) && (
              <div className="mt-6 p-4 bg-warning-50 dark:bg-warning-900/20 rounded-lg border border-warning-200 dark:border-warning-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-warning-800 dark:text-warning-200">
                      Datos pendientes de sincronización
                    </p>
                    <p className="text-sm text-warning-700 dark:text-warning-300">
                      {stats.pendientesSinc} registros pendientes
                      {stats.erroresSinc > 0 && ` • ${stats.erroresSinc} con errores`}
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={handleSync}
                    disabled={syncing || !isOnline}
                    loading={syncing}
                  >
                    Sincronizar
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
    </div>
  )
}