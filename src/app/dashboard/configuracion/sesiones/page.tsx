'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { 
  User,
  Smartphone,
  Monitor,
  Tablet,
  Laptop,
  Globe,
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowLeft,
  Settings,
  LogOut,
  Shield,
  MapPin,
  AlertCircle
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

interface Session {
  id: string
  deviceName: string
  deviceType: 'mobile' | 'desktop' | 'tablet' | 'laptop'
  browser: string
  os: string
  location: string
  ipAddress: string
  lastActivity: string
  isCurrent: boolean
  isTrusted: boolean
  userAgent: string
}

export default function SesionesPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [sessions, setSessions] = useState<Session[]>([])
  const [terminatingSession, setTerminatingSession] = useState<string | null>(null)
  const [terminatingAll, setTerminatingAll] = useState(false)

  useEffect(() => {
    loadSessions()
  }, [])

  const loadSessions = async () => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSessions([
        {
          id: '1',
          deviceName: 'iPhone 14 Pro',
          deviceType: 'mobile',
          browser: 'Safari',
          os: 'iOS 17.2',
          location: 'Valparaíso, Chile',
          ipAddress: '192.168.1.100',
          lastActivity: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          isCurrent: true,
          isTrusted: true,
          userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X)'
        },
        {
          id: '2',
          deviceName: 'MacBook Pro',
          deviceType: 'laptop',
          browser: 'Chrome',
          os: 'macOS 14.1',
          location: 'Santiago, Chile',
          ipAddress: '192.168.1.101',
          lastActivity: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          isCurrent: false,
          isTrusted: true,
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
        },
        {
          id: '3',
          deviceName: 'iPad Air',
          deviceType: 'tablet',
          browser: 'Safari',
          os: 'iPadOS 17.2',
          location: 'Viña del Mar, Chile',
          ipAddress: '192.168.1.102',
          lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          isCurrent: false,
          isTrusted: false,
          userAgent: 'Mozilla/5.0 (iPad; CPU OS 17_2 like Mac OS X)'
        },
        {
          id: '4',
          deviceName: 'PC Windows',
          deviceType: 'desktop',
          browser: 'Firefox',
          os: 'Windows 11',
          location: 'Concepción, Chile',
          ipAddress: '192.168.1.103',
          lastActivity: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          isCurrent: false,
          isTrusted: false,
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
        }
      ])
    } catch (error) {
      toast.error('Error al cargar sesiones')
    } finally {
      setLoading(false)
    }
  }

  const handleTerminateSession = async (sessionId: string) => {
    setTerminatingSession(sessionId)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSessions(prev => prev.filter(s => s.id !== sessionId))
      toast.success('Sesión terminada correctamente')
    } catch (error) {
      toast.error('Error al terminar sesión')
    } finally {
      setTerminatingSession(null)
    }
  }

  const handleTerminateAllOtherSessions = async () => {
    if (!confirm('¿Estás seguro de que quieres terminar todas las demás sesiones?')) {
      return
    }
    
    setTerminatingAll(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      setSessions(prev => prev.filter(s => s.isCurrent))
      toast.success('Todas las demás sesiones han sido terminadas')
    } catch (error) {
      toast.error('Error al terminar sesiones')
    } finally {
      setTerminatingAll(false)
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

  const formatLastActivity = (dateString: string) => {
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

  const currentSession = sessions.find(s => s.isCurrent)
  const otherSessions = sessions.filter(s => !s.isCurrent)
  const trustedSessions = sessions.filter(s => s.isTrusted).length
  const untrustedSessions = sessions.filter(s => !s.isTrusted).length

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
          <h1 className="text-2xl font-bold">Sesiones Activas</h1>
        </div>
        
        {otherSessions.length > 0 && (
          <Button
            variant="outline"
            onClick={handleTerminateAllOtherSessions}
            disabled={terminatingAll}
          >
            {terminatingAll ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Terminando...
              </>
            ) : (
              <>
                <LogOut className="h-4 w-4 mr-2" />
                Terminar Otras Sesiones
              </>
            )}
          </Button>
        )}
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{sessions.length}</p>
              </div>
              <User className="h-8 w-8 text-aqua-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Confiables</p>
                <p className="text-2xl font-bold">{trustedSessions}</p>
              </div>
              <Shield className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">No Confiables</p>
                <p className="text-2xl font-bold">{untrustedSessions}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sesión Actual */}
        {currentSession && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Sesión Actual
              </CardTitle>
              <CardDescription>
                Esta es tu sesión actual
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/20">
                    {getDeviceIcon(currentSession.deviceType)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{currentSession.deviceName}</h3>
                      <span className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200">
                        Actual
                      </span>
                      {currentSession.isTrusted && (
                        <Shield className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                    
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>{currentSession.browser} • {currentSession.os}</p>
                      <p>{currentSession.location}</p>
                      <p>IP: {currentSession.ipAddress}</p>
                      <p>Última actividad: {formatLastActivity(currentSession.lastActivity)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Configuración de Seguridad */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Configuración de Seguridad
            </CardTitle>
            <CardDescription>
              Gestiona la seguridad de tus sesiones
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Button
                variant="outline"
                onClick={() => router.push('/dashboard/configuracion/dispositivos')}
                className="w-full justify-start"
              >
                <Settings className="h-4 w-4 mr-2" />
                Dispositivos Conectados
              </Button>
              
              <Button
                variant="outline"
                onClick={() => router.push('/dashboard/configuracion/seguridad')}
                className="w-full justify-start"
              >
                <Shield className="h-4 w-4 mr-2" />
                Configuración de Seguridad
              </Button>
              
              <Button
                variant="outline"
                onClick={() => toast('Notificaciones de sesión próximamente')}
                className="w-full justify-start"
              >
                <AlertCircle className="h-4 w-4 mr-2" />
                Notificaciones de Sesión
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Otras Sesiones */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Otras Sesiones
            </CardTitle>
            <CardDescription>
              Sesiones activas en otros dispositivos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {otherSessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-aqua-100 dark:bg-aqua-900/20">
                      {getDeviceIcon(session.deviceType)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{session.deviceName}</h3>
                        <span className="text-xs px-2 py-1 rounded-full bg-muted">
                          {getDeviceTypeName(session.deviceType)}
                        </span>
                        {session.isTrusted ? (
                          <Shield className="h-4 w-4 text-green-600" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>{session.browser} • {session.os}</p>
                        <p>{session.location}</p>
                        <p>IP: {session.ipAddress}</p>
                        <p>Última actividad: {formatLastActivity(session.lastActivity)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toast('Ver detalles próximamente')}
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTerminateSession(session.id)}
                      disabled={terminatingSession === session.id}
                    >
                      {terminatingSession === session.id ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        <LogOut className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}

              {otherSessions.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No hay otras sesiones activas</p>
                  <p className="text-sm">Solo tienes una sesión activa en este dispositivo</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Información de Seguridad */}
      <Card className="mt-6">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-warning-600 mt-0.5" />
            <div>
              <h4 className="font-medium mb-1">Seguridad de Sesiones</h4>
              <p className="text-sm text-muted-foreground">
                Revisa regularmente tus sesiones activas. Si notas actividad sospechosa, 
                termina inmediatamente las sesiones no autorizadas y cambia tu contraseña. 
                Las sesiones confiables son dispositivos que has usado anteriormente.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 