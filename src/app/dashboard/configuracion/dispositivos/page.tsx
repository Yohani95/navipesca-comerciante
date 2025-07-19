'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { 
  Smartphone,
  Monitor,
  Tablet,
  Laptop,
  Wifi,
  WifiOff,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowLeft,
  Plus,
  Settings
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

interface Device {
  id: string
  name: string
  type: 'mobile' | 'desktop' | 'tablet' | 'laptop'
  lastActive: string
  isOnline: boolean
  location: string
  browser: string
  os: string
}

export default function DispositivosPage() {
  const router = useRouter()
  const [devices, setDevices] = useState<Device[]>([])
  const [loading, setLoading] = useState(true)
  const [removingDevice, setRemovingDevice] = useState<string | null>(null)

  useEffect(() => {
    loadDevices()
  }, [])

  const loadDevices = async () => {
    setLoading(true)
    try {
      // Simular carga de dispositivos
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setDevices([
        {
          id: '1',
          name: 'iPhone 14 Pro',
          type: 'mobile',
          lastActive: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          isOnline: true,
          location: 'Valparaíso, Chile',
          browser: 'Safari',
          os: 'iOS 17.2'
        },
        {
          id: '2',
          name: 'MacBook Pro',
          type: 'laptop',
          lastActive: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          isOnline: false,
          location: 'Santiago, Chile',
          browser: 'Chrome',
          os: 'macOS 14.1'
        },
        {
          id: '3',
          name: 'iPad Air',
          type: 'tablet',
          lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          isOnline: true,
          location: 'Viña del Mar, Chile',
          browser: 'Safari',
          os: 'iPadOS 17.2'
        }
      ])
    } catch (error) {
      toast.error('Error al cargar dispositivos')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveDevice = async (deviceId: string) => {
    setRemovingDevice(deviceId)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setDevices(prev => prev.filter(d => d.id !== deviceId))
      toast.success('Dispositivo removido correctamente')
    } catch (error) {
      toast.error('Error al remover dispositivo')
    } finally {
      setRemovingDevice(null)
    }
  }

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'mobile':
        return <Smartphone className="h-5 w-5" />
      case 'desktop':
        return <Monitor className="h-5 w-5" />
      case 'tablet':
        return <Tablet className="h-5 w-5" />
      case 'laptop':
        return <Laptop className="h-5 w-5" />
      default:
        return <Smartphone className="h-5 w-5" />
    }
  }

  const getDeviceTypeName = (type: string) => {
    switch (type) {
      case 'mobile':
        return 'Móvil'
      case 'desktop':
        return 'Escritorio'
      case 'tablet':
        return 'Tablet'
      case 'laptop':
        return 'Laptop'
      default:
        return 'Dispositivo'
    }
  }

  const formatLastActive = (dateString: string) => {
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <h1 className="text-2xl font-bold">Dispositivos Conectados</h1>
        </div>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Agregar Dispositivo
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{devices.length}</p>
              </div>
              <Smartphone className="h-8 w-8 text-aqua-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Online</p>
                <p className="text-2xl font-bold">{devices.filter(d => d.isOnline).length}</p>
              </div>
              <Wifi className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Offline</p>
                <p className="text-2xl font-bold">{devices.filter(d => !d.isOnline).length}</p>
              </div>
              <WifiOff className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Devices List */}
      <div className="space-y-4">
        {devices.map((device) => (
          <Card key={device.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-aqua-100 dark:bg-aqua-900/20">
                    {getDeviceIcon(device.type)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{device.name}</h3>
                      <span className="text-xs px-2 py-1 rounded-full bg-muted">
                        {getDeviceTypeName(device.type)}
                      </span>
                      {device.isOnline ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <Clock className="h-4 w-4 text-gray-500" />
                      )}
                    </div>
                    
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>{device.browser} • {device.os}</p>
                      <p>{device.location}</p>
                      <p>Última actividad: {formatLastActive(device.lastActive)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toast('Configuración de dispositivo próximamente')}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveDevice(device.id)}
                    disabled={removingDevice === device.id}
                  >
                    {removingDevice === device.id ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {devices.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Smartphone className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No hay dispositivos conectados</h3>
              <p className="text-muted-foreground mb-4">
                Los dispositivos que uses para acceder a tu cuenta aparecerán aquí
              </p>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Agregar Dispositivo
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Security Notice */}
      <Card className="mt-6">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-warning-600 mt-0.5" />
            <div>
              <h4 className="font-medium mb-1">Seguridad de Dispositivos</h4>
              <p className="text-sm text-muted-foreground">
                Solo puedes acceder desde dispositivos autorizados. Si notas actividad sospechosa, 
                contacta inmediatamente al soporte técnico.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 