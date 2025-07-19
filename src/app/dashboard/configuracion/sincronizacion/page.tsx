'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { 
  Upload,
  Download,
  RefreshCw,
  Settings,
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowLeft,
  Database,
  Wifi,
  WifiOff,
  Smartphone,
  Cloud,
  CloudOff,
  AlertCircle,
  Play,
  Pause,
  StopCircle
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

interface SyncJob {
  id: string
  name: string
  type: 'upload' | 'download' | 'bidirectional'
  status: 'running' | 'completed' | 'failed' | 'paused'
  progress: number
  totalItems: number
  processedItems: number
  startTime: string
  estimatedTime: string
}

export default function SincronizacionPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [syncJobs, setSyncJobs] = useState<SyncJob[]>([])
  const [syncSettings, setSyncSettings] = useState({
    autoSync: true,
    syncInterval: 5,
    syncOnWifiOnly: true,
    backgroundSync: true,
    maxRetries: 3,
    compression: true,
    encryption: false
  })

  useEffect(() => {
    loadSyncJobs()
  }, [])

  const loadSyncJobs = async () => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSyncJobs([
        {
          id: '1',
          name: 'Sincronización de Pesajes',
          type: 'upload',
          status: 'running',
          progress: 65,
          totalItems: 150,
          processedItems: 97,
          startTime: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
          estimatedTime: '5 min'
        },
        {
          id: '2',
          name: 'Descarga de Configuraciones',
          type: 'download',
          status: 'completed',
          progress: 100,
          totalItems: 25,
          processedItems: 25,
          startTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          estimatedTime: 'Completado'
        },
        {
          id: '3',
          name: 'Sincronización de Inventario',
          type: 'bidirectional',
          status: 'failed',
          progress: 0,
          totalItems: 300,
          processedItems: 0,
          startTime: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          estimatedTime: 'Error'
        }
      ])
    } catch (error) {
      toast.error('Error al cargar trabajos de sincronización')
    } finally {
      setLoading(false)
    }
  }

  const handleSyncSettingChange = async (setting: string, value: any) => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      setSyncSettings(prev => ({ ...prev, [setting]: value }))
      toast.success('Configuración actualizada')
    } catch (error) {
      toast.error('Error al actualizar configuración')
    } finally {
      setLoading(false)
    }
  }

  const handleStartSync = async (jobId: string) => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSyncJobs(prev => 
        prev.map(job => 
          job.id === jobId ? { ...job, status: 'running' as const, progress: 0 } : job
        )
      )
      toast.success('Sincronización iniciada')
    } catch (error) {
      toast.error('Error al iniciar sincronización')
    } finally {
      setLoading(false)
    }
  }

  const handlePauseSync = async (jobId: string) => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      setSyncJobs(prev => 
        prev.map(job => 
          job.id === jobId ? { ...job, status: 'paused' as const } : job
        )
      )
      toast.success('Sincronización pausada')
    } catch (error) {
      toast.error('Error al pausar sincronización')
    } finally {
      setLoading(false)
    }
  }

  const handleStopSync = async (jobId: string) => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      setSyncJobs(prev => 
        prev.map(job => 
          job.id === jobId ? { ...job, status: 'failed' as const, progress: 0 } : job
        )
      )
      toast.success('Sincronización detenida')
    } catch (error) {
      toast.error('Error al detener sincronización')
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <RefreshCw className="h-4 w-4 text-aqua-600 animate-spin" />
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-600" />
      case 'paused':
        return <Pause className="h-4 w-4 text-yellow-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'running':
        return 'Ejecutándose'
      case 'completed':
        return 'Completado'
      case 'failed':
        return 'Falló'
      case 'paused':
        return 'Pausado'
      default:
        return 'Desconocido'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'upload':
        return <Upload className="h-4 w-4" />
      case 'download':
        return <Download className="h-4 w-4" />
      case 'bidirectional':
        return <RefreshCw className="h-4 w-4" />
      default:
        return <Database className="h-4 w-4" />
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case 'upload':
        return 'Subida'
      case 'download':
        return 'Descarga'
      case 'bidirectional':
        return 'Bidireccional'
      default:
        return 'Desconocido'
    }
  }

  const formatStartTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString()
  }

  const runningJobs = syncJobs.filter(job => job.status === 'running').length
  const completedJobs = syncJobs.filter(job => job.status === 'completed').length
  const failedJobs = syncJobs.filter(job => job.status === 'failed').length

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
        <h1 className="text-2xl font-bold">Configuración de Sincronización</h1>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ejecutándose</p>
                <p className="text-2xl font-bold">{runningJobs}</p>
              </div>
              <RefreshCw className="h-8 w-8 text-aqua-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completados</p>
                <p className="text-2xl font-bold">{completedJobs}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Fallidos</p>
                <p className="text-2xl font-bold">{failedJobs}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuración General */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configuración General
            </CardTitle>
            <CardDescription>
              Configura el comportamiento de sincronización
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Sincronización Automática</p>
                  <p className="text-sm text-muted-foreground">
                    Sincronizar automáticamente
                  </p>
                </div>
                <Button
                  variant={syncSettings.autoSync ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleSyncSettingChange('autoSync', !syncSettings.autoSync)}
                  disabled={loading}
                >
                  {syncSettings.autoSync ? 'Activada' : 'Desactivada'}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Solo en WiFi</p>
                  <p className="text-sm text-muted-foreground">
                    Sincronizar solo con WiFi
                  </p>
                </div>
                <Button
                  variant={syncSettings.syncOnWifiOnly ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleSyncSettingChange('syncOnWifiOnly', !syncSettings.syncOnWifiOnly)}
                  disabled={loading}
                >
                  {syncSettings.syncOnWifiOnly ? 'Activado' : 'Desactivado'}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Sincronización en Segundo Plano</p>
                  <p className="text-sm text-muted-foreground">
                    Sincronizar cuando la app está cerrada
                  </p>
                </div>
                <Button
                  variant={syncSettings.backgroundSync ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleSyncSettingChange('backgroundSync', !syncSettings.backgroundSync)}
                  disabled={loading}
                >
                  {syncSettings.backgroundSync ? 'Activado' : 'Desactivado'}
                </Button>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Intervalo de Sincronización</label>
                <select
                  value={syncSettings.syncInterval}
                  onChange={(e) => handleSyncSettingChange('syncInterval', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border rounded-md"
                  disabled={loading}
                >
                  <option value={1}>Cada 1 minuto</option>
                  <option value={5}>Cada 5 minutos</option>
                  <option value={15}>Cada 15 minutos</option>
                  <option value={30}>Cada 30 minutos</option>
                  <option value={60}>Cada hora</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configuración Avanzada */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configuración Avanzada
            </CardTitle>
            <CardDescription>
              Opciones avanzadas de sincronización
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Compresión</p>
                  <p className="text-sm text-muted-foreground">
                    Comprimir datos para ahorrar ancho de banda
                  </p>
                </div>
                <Button
                  variant={syncSettings.compression ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleSyncSettingChange('compression', !syncSettings.compression)}
                  disabled={loading}
                >
                  {syncSettings.compression ? 'Activada' : 'Desactivada'}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Encriptación</p>
                  <p className="text-sm text-muted-foreground">
                    Encriptar datos durante la sincronización
                  </p>
                </div>
                <Button
                  variant={syncSettings.encryption ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleSyncSettingChange('encryption', !syncSettings.encryption)}
                  disabled={loading}
                >
                  {syncSettings.encryption ? 'Activada' : 'Desactivada'}
                </Button>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Intentos Máximos</label>
                <select
                  value={syncSettings.maxRetries}
                  onChange={(e) => handleSyncSettingChange('maxRetries', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border rounded-md"
                  disabled={loading}
                >
                  <option value={1}>1 intento</option>
                  <option value={3}>3 intentos</option>
                  <option value={5}>5 intentos</option>
                  <option value={10}>10 intentos</option>
                </select>
              </div>

              <div className="space-y-2">
                <Button
                  variant="outline"
                  onClick={() => toast('Configuración de proxy próximamente')}
                  className="w-full justify-start"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Configurar Proxy
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => toast('Configuración de VPN próximamente')}
                  className="w-full justify-start"
                >
                  <Cloud className="h-4 w-4 mr-2" />
                  Configurar VPN
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trabajos de Sincronización */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Trabajos de Sincronización
            </CardTitle>
            <CardDescription>
              Gestiona los trabajos de sincronización activos
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <LoadingSpinner size="lg" />
              </div>
            ) : (
              <div className="space-y-3">
                {syncJobs.map((job) => (
                  <div key={job.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-aqua-100 dark:bg-aqua-900/20">
                          {getTypeIcon(job.type)}
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{job.name}</h3>
                            <span className="text-xs px-2 py-1 rounded-full bg-muted">
                              {getTypeText(job.type)}
                            </span>
                            {getStatusIcon(job.status)}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Iniciado: {formatStartTime(job.startTime)} • {job.processedItems}/{job.totalItems} elementos
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {job.status === 'running' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePauseSync(job.id)}
                              disabled={loading}
                            >
                              <Pause className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStopSync(job.id)}
                              disabled={loading}
                            >
                              <StopCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        
                        {job.status === 'paused' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStartSync(job.id)}
                            disabled={loading}
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                        )}
                        
                        {job.status === 'failed' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStartSync(job.id)}
                            disabled={loading}
                          >
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    {job.status === 'running' && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progreso</span>
                          <span>{job.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-aqua-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${job.progress}%` }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Tiempo estimado: {job.estimatedTime}
                        </p>
                      </div>
                    )}
                  </div>
                ))}

                {syncJobs.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <RefreshCw className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No hay trabajos de sincronización</p>
                    <p className="text-sm">Los trabajos aparecerán aquí cuando se inicien</p>
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
            <Cloud className="h-5 w-5 text-aqua-600 mt-0.5" />
            <div>
              <h4 className="font-medium mb-1">Sincronización Inteligente</h4>
              <p className="text-sm text-muted-foreground">
                La aplicación optimiza automáticamente la sincronización para minimizar el uso de datos 
                y maximizar la velocidad. Los datos se sincronizan de forma inteligente basándose en 
                la conectividad y las prioridades configuradas.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 