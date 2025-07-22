'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { useAuth } from '@/hooks/use-auth'
import { useOfflineStorage } from '@/hooks/use-offline-storage'
import { OfflineActions } from '@/components/ui/offline-actions'
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
  List,
  Play,
  Square,
  Zap
} from 'lucide-react'
import Link from 'next/link'
import { formatWeight, formatDateTime } from '@/lib/utils'
import { getPesadorStats, getPesajesEnProceso, startPesaje, closePesaje, changePesajeState } from '@/lib/client-actions'
import toast from 'react-hot-toast'

interface PesajeStats {
  embarcacionesActivas: number
  binsPendientes: number
  kilosHoy: number
  ultimoPesaje: string | null
}

interface PesajeEnProceso {
  id: string
  embarcacionId: string
  embarcacionNombre: string
  estado: 'tara' | 'pesaje' | 'completado'
  bins_pesaje: BinPesaje[]
  fechaInicio: string
  fechaCierre?: string
  observaciones?: string
}

interface BinPesaje {
  id: string
  codigo: string
  tara: number
  pesoBruto?: number
  pesoNeto?: number
  estado: 'pendiente' | 'tara_completada' | 'pesaje_completado'
  observaciones?: string
}

export default function PesadorDashboard() {
  const { user } = useAuth()
  const { 
    isOnline, 
    pendingActions, 
    offlineData, 
    syncPendingActions, 
    updateOfflineData,
    executeWithOfflineSupport 
  } = useOfflineStorage()
  
  const [stats, setStats] = useState<PesajeStats | null>(null)
  const [pesajesEnProceso, setPesajesEnProceso] = useState<PesajeEnProceso[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [changingState, setChangingState] = useState<string | null>(null)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      // Cargar estadísticas
      const statsResult = await getPesadorStats()
      setStats(statsResult.data || {
        embarcacionesActivas: 0,
        binsPendientes: 0,
        kilosHoy: 0,
        ultimoPesaje: null
      })

      // Cargar pesajes en proceso
      const pesajesResult = await getPesajesEnProceso()
      setPesajesEnProceso(pesajesResult.data || [])

    } catch (error) {
      console.error('Error loading dashboard data:', error)
      toast.error('Error al cargar los datos del dashboard')
    } finally {
      setLoading(false)
    }
  }

  const handleSync = async () => {
    setSyncing(true)
    try {
      // Sincronizar acciones pendientes
      await syncPendingActions()
      
      // Recargar datos después de sincronizar
      await loadDashboardData()
      
      toast.success('Datos sincronizados correctamente')
    } catch (error) {
      console.error('Sync error:', error)
      toast.error('Error al sincronizar')
    } finally {
      setSyncing(false)
    }
  }

  const handleIniciarPesaje = async (embarcacionId: string) => {
    const result = await executeWithOfflineSupport(
      () => startPesaje(embarcacionId),
      {
        type: 'iniciar_pesaje',
        data: { embarcacionId }
      }
    )
    
    if (result.error) {
      toast.error(result.error)
    } else if (result.offline) {
      toast.success('Pesaje guardado para sincronización')
      // Actualizar datos offline
      updateOfflineData('pesajesEnProceso', [...offlineData.pesajesEnProceso, {
        id: `offline-${Date.now()}`,
        embarcacionId,
        estado: 'tara',
        fechaInicio: new Date().toISOString()
      }])
    } else {
      toast.success('Pesaje iniciado correctamente')
      await loadDashboardData()
    }
  }

  const handleCambiarAPesaje = async (pesajeId: string) => {
    try {
      setChangingState(pesajeId)
      // Mostrar toast de carga
      const loadingToast = toast.loading('Cambiando estado...')
      
      const result = await changePesajeState(pesajeId)
      
      // Cerrar toast de carga
      toast.dismiss(loadingToast)
      
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Pesaje listo para pesar')
        await loadDashboardData()
      }
    } catch (error) {
      console.error('Error cambiando estado:', error)
      toast.error('Error al cambiar estado')
    } finally {
      setChangingState(null)
    }
  }

  const handleCerrarPesaje = async (pesajeId: string) => {
    try {
      const result = await closePesaje(pesajeId)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Pesaje cerrado correctamente')
        await loadDashboardData()
      }
    } catch (error) {
      console.error('Error cerrando pesaje:', error)
      toast.error('Error al cerrar pesaje')
    }
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'tara':
        return 'text-warning-600 bg-warning-50 dark:bg-warning-900/20'
      case 'pesaje':
        return 'text-aqua-600 bg-aqua-50 dark:bg-aqua-900/20'
      case 'completado':
        return 'text-success-600 bg-success-50 dark:bg-success-900/20'
      default:
        return 'text-muted-foreground bg-muted'
    }
  }

  const getEstadoText = (estado: string) => {
    switch (estado) {
      case 'tara':
        return 'En Tara'
      case 'pesaje':
        return 'En Pesaje'
      case 'completado':
        return 'Completado'
      default:
        return estado
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
      title: "Embarcaciones Activas",
      value: stats?.embarcacionesActivas || 0,
      description: "En proceso de pesaje",
      icon: Ship,
      color: "text-aqua-600"
    },
    {
      title: "Bins Pendientes",
      value: stats?.binsPendientes || 0,
      description: "Por procesar",
      icon: Package,
      color: "text-navy-600"
    },
    {
      title: "Kilos Hoy",
      value: stats ? formatWeight(stats.kilosHoy) : "0 kg",
      description: "Total registrado",
      icon: Scale,
      color: "text-blue-600"
    },
    {
      title: "Estado",
      value: isOnline ? "Online" : "Offline",
      description: isOnline ? "Conectado" : `${pendingActions.length} acciones pendientes`,
      icon: isOnline ? Wifi : WifiOff,
      color: isOnline ? "text-aqua-600" : "text-destructive"
    }
  ]

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
      <div className={`grid gap-6 mb-8 ${
        pendingActions.length > 0 || !isOnline 
          ? 'grid-cols-1 md:grid-cols-3' 
          : 'grid-cols-1 md:grid-cols-2'
      }`}>
        <Button variant="aqua" size="lg" className="h-20" asChild>
          <Link href="/dashboard/pesador/pesaje-nuevo" className="flex flex-col items-center gap-2">
            <Plus className="h-8 w-8" />
            <span className="text-lg font-semibold">Nuevo Pesaje</span>
          </Link>
        </Button>

        {/* Mostrar botón de sincronizar solo cuando hay acciones pendientes o está offline */}
        {(pendingActions.length > 0 || !isOnline) && (
          <Button 
            variant="navy" 
            size="lg" 
            className="h-20" 
            onClick={handleSync}
            disabled={syncing}
            loading={syncing}
          >
            <div className="flex flex-col items-center gap-2">
              <RefreshCw className="h-8 w-8" />
              <span className="text-lg font-semibold">
                {syncing ? 'Sincronizando...' : 'Sincronizar'}
              </span>
              {pendingActions.length > 0 && (
                <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full">
                  {pendingActions.length} pendiente{pendingActions.length > 1 ? 's' : ''}
                </span>
              )}
            </div>
          </Button>
        )}

        <Button variant="outline" size="lg" className="h-20" asChild>
          <Link href="/dashboard/pesador/historial" className="flex flex-col items-center gap-2">
            <List className="h-8 w-8" />
            <span className="text-lg font-semibold">Ver Historial</span>
          </Link>
        </Button>
      </div>

      {/* Acciones Pendientes */}
      <OfflineActions 
        actions={pendingActions}
        onSync={handleSync}
        syncing={syncing}
      />

      {/* Pesajes en Proceso */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Pesajes en Proceso
          </CardTitle>
          <CardDescription>
            Embarcaciones con pesajes activos - {stats?.ultimoPesaje && `Último: ${formatDateTime(stats.ultimoPesaje)}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pesajesEnProceso.length > 0 ? (
              pesajesEnProceso.map((pesaje) => (
                <div key={pesaje.id} className="border rounded-lg p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                    <div className="flex items-center gap-4">
                      <Ship className="h-8 w-8 text-blue-600" />
                      <div>
                        <p className="font-semibold text-lg">{pesaje.embarcacionNombre}</p>
                        <p className="text-sm text-muted-foreground">
                          Iniciado: {formatDateTime(pesaje.fechaInicio)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEstadoColor(pesaje.estado)}`}>
                        {getEstadoText(pesaje.estado)}
                      </span>
                      
                      <div className="flex flex-wrap gap-2">
                        {pesaje.estado === 'tara' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCambiarAPesaje(pesaje.id)}
                            disabled={changingState === pesaje.id}
                            className="text-xs sm:text-sm"
                          >
                            <Play className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            {changingState === pesaje.id ? 'Cambiando...' : 'Iniciar'}
                          </Button>
                        )}
                        
                        {pesaje.estado === 'pesaje' && (
                          <Button
                            size="sm"
                            variant="aqua"
                            onClick={() => handleCerrarPesaje(pesaje.id)}
                            className="text-xs sm:text-sm"
                          >
                            <Square className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            Cerrar
                          </Button>
                        )}
                        
                        <Button size="sm" variant="outline" asChild className="text-xs sm:text-sm">
                          <Link href={`/dashboard/pesador/pesaje/${pesaje.id}`}>
                            Ver Detalles
                          </Link>
                        </Button>
                        
                        <Button size="sm"  asChild className="text-xs sm:text-sm">
                          <Link href={`/dashboard/pesador/pesaje-nuevo?pesajeId=${pesaje.id}`}>
                            Continuar
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Bins del pesaje */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {pesaje.bins_pesaje?.map((bin) => (
                      <div key={bin.id} className="bg-muted/50 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div className="min-w-0 flex-1">
                            <p className="font-medium truncate">Bin {bin.codigo}</p>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                              Tara: {formatWeight(bin.tara)}
                            </p>
                            {bin.pesoBruto && (
                              <p className="text-xs sm:text-sm text-muted-foreground">
                                Bruto: {formatWeight(bin.pesoBruto)}
                              </p>
                            )}
                            {bin.pesoNeto && (
                              <p className="text-xs sm:text-sm font-medium text-aqua-600">
                                Neto: {formatWeight(bin.pesoNeto)}
                              </p>
                            )}
                          </div>
                          <div className="text-right flex-shrink-0 ml-2">
                            {bin.estado === 'tara_completada' && (
                              <CheckCircle className="h-4 w-4 text-warning-600" />
                            )}
                            {bin.estado === 'pesaje_completado' && (
                              <CheckCircle className="h-4 w-4 text-aqua-600" />
                            )}
                            {bin.estado === 'pendiente' && (
                              <Clock className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Ship className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No hay pesajes en proceso</p>
                <p className="text-sm">Inicia un nuevo pesaje para comenzar</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}