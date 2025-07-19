'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { 
  Globe,
  Wifi,
  WifiOff,
  Signal,
  SignalHigh,
  SignalMedium,
  SignalLow,
  RefreshCw,
  Settings,
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  Download,
  Upload,
  Clock,
  Shield
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

interface NetworkStatus {
  isOnline: boolean
  connectionType: 'wifi' | 'mobile' | 'ethernet' | 'offline'
  signalStrength: number
  downloadSpeed: number
  uploadSpeed: number
  latency: number
}

export default function RedPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isOnline: true,
    connectionType: 'wifi',
    signalStrength: 85,
    downloadSpeed: 25.5,
    uploadSpeed: 12.3,
    latency: 45
  })
  const [syncSettings, setSyncSettings] = useState({
    autoSync: true,
    syncInterval: 5,
    syncOnWifiOnly: true,
    backgroundSync: true
  })

  useEffect(() => {
    // Simular monitoreo de red
    const interval = setInterval(() => {
      setNetworkStatus(prev => ({
        ...prev,
        signalStrength: Math.max(0, Math.min(100, prev.signalStrength + (Math.random() - 0.5) * 10)),
        latency: Math.max(20, Math.min(100, prev.latency + (Math.random() - 0.5) * 5))
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

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

  const handleTestConnection = async () => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success('Conexión estable. Velocidad: 25.5 Mbps')
    } catch (error) {
      toast.error('Error al probar conexión')
    } finally {
      setLoading(false)
    }
  }

  const getSignalIcon = (strength: number) => {
    if (strength >= 80) return <SignalHigh className="h-5 w-5 text-green-600" />
    if (strength >= 60) return <SignalMedium className="h-5 w-5 text-yellow-600" />
    if (strength >= 40) return <SignalLow className="h-5 w-5 text-orange-600" />
    return <Signal className="h-5 w-5 text-red-600" />
  }

  const getConnectionTypeName = (type: string) => {
    switch (type) {
      case 'wifi':
        return 'WiFi'
      case 'mobile':
        return 'Datos Móviles'
      case 'ethernet':
        return 'Ethernet'
      case 'offline':
        return 'Sin Conexión'
      default:
        return 'Desconocido'
    }
  }

  const getConnectionTypeIcon = (type: string) => {
    switch (type) {
      case 'wifi':
        return <Wifi className="h-5 w-5" />
      case 'mobile':
        return <Signal className="h-5 w-5" />
      case 'ethernet':
        return <Globe className="h-5 w-5" />
      case 'offline':
        return <WifiOff className="h-5 w-5" />
      default:
        return <Globe className="h-5 w-5" />
    }
  }

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
        <h1 className="text-2xl font-bold">Configuración de Red</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Estado de la Red */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Estado de la Red
            </CardTitle>
            <CardDescription>
              Información sobre tu conexión actual
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getConnectionTypeIcon(networkStatus.connectionType)}
                  <div>
                    <p className="font-medium">{getConnectionTypeName(networkStatus.connectionType)}</p>
                    <p className="text-sm text-muted-foreground">
                      {networkStatus.isOnline ? 'Conectado' : 'Desconectado'}
                    </p>
                  </div>
                </div>
                {networkStatus.isOnline ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    {getSignalIcon(networkStatus.signalStrength)}
                    <span className="text-sm font-medium">Señal</span>
                  </div>
                  <p className="text-lg font-bold">{networkStatus.signalStrength}%</p>
                </div>

                <div className="p-3 border rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm font-medium">Latencia</span>
                  </div>
                  <p className="text-lg font-bold">{networkStatus.latency}ms</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Download className="h-4 w-4" />
                    <span className="text-sm font-medium">Descarga</span>
                  </div>
                  <p className="text-lg font-bold">{networkStatus.downloadSpeed} Mbps</p>
                </div>

                <div className="p-3 border rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Upload className="h-4 w-4" />
                    <span className="text-sm font-medium">Subida</span>
                  </div>
                  <p className="text-lg font-bold">{networkStatus.uploadSpeed} Mbps</p>
                </div>
              </div>

              <Button
                onClick={handleTestConnection}
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Probando...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Probar Conexión
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Configuración de Sincronización */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configuración de Sincronización
            </CardTitle>
            <CardDescription>
              Gestiona cómo se sincronizan tus datos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Sincronización Automática</p>
                  <p className="text-sm text-muted-foreground">
                    Sincroniza datos automáticamente
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
                    Sincronizar solo con conexión WiFi
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

        {/* Optimización de Red */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Optimización de Red
            </CardTitle>
            <CardDescription>
              Mejora el rendimiento de tu conexión
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Button
                variant="outline"
                onClick={() => toast('Optimización de DNS próximamente')}
                className="w-full justify-start"
              >
                <Globe className="h-4 w-4 mr-2" />
                Optimizar DNS
              </Button>
              
              <Button
                variant="outline"
                onClick={() => toast('Limpieza de caché próximamente')}
                className="w-full justify-start"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Limpiar Caché de Red
              </Button>
              
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
                <Shield className="h-4 w-4 mr-2" />
                Configurar VPN
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Solución de Problemas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Solución de Problemas
            </CardTitle>
            <CardDescription>
              Herramientas para diagnosticar problemas de red
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Button
                variant="outline"
                onClick={() => toast('Diagnóstico de red próximamente')}
                className="w-full justify-start"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Diagnóstico de Red
              </Button>
              
              <Button
                variant="outline"
                onClick={() => toast('Reinicio de red próximamente')}
                className="w-full justify-start"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reiniciar Configuración de Red
              </Button>
              
              <Button
                variant="outline"
                onClick={() => toast('Información de red próximamente')}
                className="w-full justify-start"
              >
                <Globe className="h-4 w-4 mr-2" />
                Información Detallada de Red
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Información Adicional */}
      <Card className="mt-6">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Globe className="h-5 w-5 text-aqua-600 mt-0.5" />
            <div>
              <h4 className="font-medium mb-1">Consejos para una Mejor Conexión</h4>
              <p className="text-sm text-muted-foreground">
                • Mantén tu dispositivo actualizado<br />
                • Usa conexiones WiFi estables cuando sea posible<br />
                • Cierra aplicaciones que no uses para liberar ancho de banda<br />
                • Considera usar una conexión más rápida para mejor rendimiento
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 