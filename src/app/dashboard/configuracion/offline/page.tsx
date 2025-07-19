'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { 
  WifiOff,
  Wifi,
  Download,
  Upload,
  Database,
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowLeft,
  Settings,
  RefreshCw,
  HardDrive,
  Smartphone,
  Cloud,
  CloudOff,
  AlertCircle
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

interface OfflineData {
  id: string
  type: 'pesaje' | 'venta' | 'inventario' | 'configuracion'
  title: string
  size: string
  lastSync: string
  status: 'pending' | 'synced' | 'error'
  priority: 'high' | 'medium' | 'low'
}

export default function OfflinePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const [offlineMode, setOfflineMode] = useState(false)
  const [offlineData, setOfflineData] = useState<OfflineData[]>([])
  const [syncProgress, setSyncProgress] = useState(0)
  const [isSyncing, setIsSyncing] = useState(false)

  useEffect(() => {
    // Monitorear estado de conexión
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    loadOfflineData()
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const loadOfflineData = async () => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setOfflineData([
        {
          id: '1',
          type: 'pesaje',
          title: 'Pesaje - Embarcación Esperanza III',
          size: '2.3 MB',
          lastSync: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          status: 'pending',
          priority: 'high'
        },
        {
          id: '2',
          type: 'venta',
          title: 'Venta - Lote de Merluza',
          size: '1.8 MB',
          lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          status: 'synced',
          priority: 'medium'
        },
        {
          id: '3',
          type: 'inventario',
          title: 'Actualización de Inventario',
          size: '4.1 MB',
          lastSync: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          status: 'error',
          priority: 'high'
        },
        {
          id: '4',
          type: 'configuracion',
          title: 'Configuración de Usuario',
          size: '0.5 MB',
          lastSync: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          status: 'synced',
          priority: 'low'
        }
      ])
    } catch (error) {
      toast.error('Error al cargar datos offline')
    } finally {
      setLoading(false)
    }
  }

  const handleOfflineModeToggle = async () => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setOfflineMode(!offlineMode)
      toast.success(offlineMode ? 'Modo online activado' : 'Modo offline activado')
    } catch (error) {
      toast.error('Error al cambiar modo')
    } finally {
      setLoading(false)
    }
  }

  const handleSyncAll = async () => {
    setIsSyncing(true)
    setSyncProgress(0)
    
    try {
      // Simular proceso de sincronización
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200))
        setSyncProgress(i)
      }
      
      // Actualizar estado de datos
      setOfflineData(prev => 
        prev.map(item => ({ ...item, status: 'synced' as const }))
      )
      
      toast.success('Sincronización completada')
    } catch (error) {
      toast.error('Error durante la sincronización')
    } finally {
      setIsSyncing(false)
      setSyncProgress(0)
    }
  }

  const handleSyncItem = async (itemId: string) => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      setOfflineData(prev => 
        prev.map(item => 
          item.id === itemId ? { ...item, status: 'synced' as const } : item
        )
      )
      toast.success('Elemento sincronizado correctamente')
    } catch (error) {
      toast.error('Error al sincronizar elemento')
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'synced':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'synced':
        return 'Sincronizado'
      case 'pending':
        return 'Pendiente'
      case 'error':
        return 'Error'
      default:
        return 'Desconocido'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20'
      case 'medium':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20'
      case 'low':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20'
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pesaje':
        return <Database className="h-4 w-4" />
      case 'venta':
        return <Upload className="h-4 w-4" />
      case 'inventario':
        return <HardDrive className="h-4 w-4" />
      case 'configuracion':
        return <Settings className="h-4 w-4" />
      default:
        return <Database className="h-4 w-4" />
    }
  }

  const formatLastSync = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Ahora mismo'
    if (diffMins < 60) return `Hace ${diffMins} min`
    if (diffHours < 24) return `Hace ${diffHours} horas`
    if (diffDays < 7) return `Hace ${diffDays} días`
    return date.toLocaleDateString()
  }

  const pendingItems = offlineData.filter(item => item.status === 'pending').length
  const errorItems = offlineData.filter(item => item.status === 'error').length
  const syncedItems = offlineData.filter(item => item.status === 'synced').length

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <h1 className="text-2xl font-bold">Modo Offline</h1>
      </div>

      {/* Estado de Conexión */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Estado</p>
                <p className="text-2xl font-bold">{isOnline ? 'Online' : 'Offline'}</p>
              </div>
              {isOnline ? (
                <Wifi className="h-8 w-8 text-green-600" />
              ) : (
                <WifiOff className="h-8 w-8 text-red-600" />
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pendientes</p>
                <p className="text-2xl font-bold">{pendingItems}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Errores</p>
                <p className="text-2xl font-bold">{errorItems}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuración de Modo Offline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <WifiOff className="h-5 w-5" />
              Configuración Offline
            </CardTitle>
            <CardDescription>
              Gestiona el comportamiento offline de la aplicación
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Modo Offline</p>
                  <p className="text-sm text-muted-foreground">
                    Trabaja sin conexión a internet
                  </p>
                </div>
                <Button
                  variant={offlineMode ? "default" : "outline"}
                  size="sm"
                  onClick={handleOfflineModeToggle}
                  disabled={loading}
                >
                  {loading ? (
                    <LoadingSpinner size="sm" />
                  ) : offlineMode ? (
                    'Activado'
                  ) : (
                    'Desactivado'
                  )}
                </Button>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
                <div className="flex items-start gap-3">
                  <Cloud className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-1">
                      Sincronización Automática
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Los datos se sincronizarán automáticamente cuando recuperes la conexión.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Button
                  variant="outline"
                  onClick={() => toast('Configuración de almacenamiento próximamente')}
                  className="w-full justify-start"
                >
                  <HardDrive className="h-4 w-4 mr-2" />
                  Configurar Almacenamiento
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => toast('Configuración de sincronización próximamente')}
                  className="w-full justify-start"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Configurar Sincronización
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sincronización */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Sincronización
            </CardTitle>
            <CardDescription>
              Gestiona la sincronización de datos offline
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Button
                onClick={handleSyncAll}
                disabled={isSyncing || !isOnline}
                className="w-full"
              >
                {isSyncing ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Sincronizando... {syncProgress}%
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Sincronizar Todo
                  </>
                )}
              </Button>

              {isSyncing && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-aqua-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${syncProgress}%` }}
                  />
                </div>
              )}

              <div className="text-sm text-muted-foreground">
                <p>• {syncedItems} elementos sincronizados</p>
                <p>• {pendingItems} elementos pendientes</p>
                <p>• {errorItems} elementos con errores</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Datos Offline */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Datos Offline
            </CardTitle>
            <CardDescription>
              Lista de datos almacenados localmente
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <LoadingSpinner size="lg" />
              </div>
            ) : (
              <div className="space-y-3">
                {offlineData.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-aqua-100 dark:bg-aqua-900/20">
                        {getTypeIcon(item.type)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{item.title}</h3>
                          <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(item.priority)}`}>
                            {item.priority === 'high' ? 'Alta' : item.priority === 'medium' ? 'Media' : 'Baja'}
                          </span>
                          {getStatusIcon(item.status)}
                        </div>
                        
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>Tamaño: {item.size}</p>
                          <p>Última sincronización: {formatLastSync(item.lastSync)}</p>
                          <p>Estado: {getStatusText(item.status)}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {item.status === 'pending' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSyncItem(item.id)}
                          disabled={loading || !isOnline}
                        >
                          <Upload className="h-4 w-4" />
                        </Button>
                      )}
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toast('Ver detalles próximamente')}
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                {offlineData.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No hay datos offline</p>
                    <p className="text-sm">Los datos aparecerán aquí cuando trabajes sin conexión</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Información Adicional */}
      <Card className="mt-6">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-warning-600 mt-0.5" />
            <div>
              <h4 className="font-medium mb-1">Trabajo Offline</h4>
              <p className="text-sm text-muted-foreground">
                Puedes continuar trabajando sin conexión. Los datos se guardarán localmente y se sincronizarán 
                automáticamente cuando recuperes la conexión. Asegúrate de tener suficiente espacio de almacenamiento.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 