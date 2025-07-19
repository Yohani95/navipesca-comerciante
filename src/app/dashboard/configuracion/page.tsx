'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { useAuth } from '@/hooks/use-auth'
import { useThemeToggle } from '@/hooks/use-theme'
import { 
  Settings,
  Moon,
  Sun,
  Bell,
  Shield,
  Database,
  Smartphone,
  Globe,
  ArrowLeft,
  Download,
  Upload,
  Trash2,
  AlertTriangle,
  MessageCircle,
  Phone,
  Mail,
  User
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

export default function ConfiguracionPage() {
  const { user, signOut } = useAuth()
  const { theme, toggleTheme, mounted } = useThemeToggle()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  const [notificationLoading, setNotificationLoading] = useState(false)

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
      toast.error('Error al cerrar sesión')
    }
  }

  const handleExportData = async () => {
    setLoading(true)
    try {
      // Simular exportación de datos
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success('Datos exportados correctamente')
    } catch (error) {
      toast.error('Error al exportar datos')
    } finally {
      setLoading(false)
    }
  }

  const handleClearCache = async () => {
    setLoading(true)
    try {
      // Simular limpieza de caché
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Caché limpiado correctamente')
    } catch (error) {
      toast.error('Error al limpiar caché')
    } finally {
      setLoading(false)
    }
  }

  const handleNotificationToggle = async () => {
    setNotificationLoading(true)
    try {
      if (!notificationsEnabled) {
        // Solicitar permisos de notificación
        const permission = await Notification.requestPermission()
        if (permission === 'granted') {
          setNotificationsEnabled(true)
          toast.success('Notificaciones activadas')
        } else {
          toast.error('Permisos de notificación denegados')
        }
      } else {
        setNotificationsEnabled(false)
        toast.success('Notificaciones desactivadas')
      }
    } catch (error) {
      toast.error('Error al configurar notificaciones')
    } finally {
      setNotificationLoading(false)
    }
  }

  const handleFeatureNotImplemented = (featureName: string) => {
    toast.error(`${featureName} estará disponible próximamente`)
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
        {/* Breadcrumb */}
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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Configuración de Apariencia */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Apariencia
              </CardTitle>
              <CardDescription>
                Personaliza la apariencia de la aplicación
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Tema</p>
                  <p className="text-sm text-muted-foreground">
                    Cambia entre tema claro y oscuro
                  </p>
                </div>
                {mounted && (
                  <Button
                    variant="outline"
                    onClick={toggleTheme}
                    className="flex items-center gap-2"
                  >
                    {theme === 'dark' ? (
                      <>
                        <Moon className="h-4 w-4" />
                        Oscuro
                      </>
                    ) : (
                      <>
                        <Sun className="h-4 w-4" />
                        Claro
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Configuración de Notificaciones */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notificaciones
              </CardTitle>
              <CardDescription>
                Gestiona las notificaciones de la aplicación
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Notificaciones Push</p>
                  <p className="text-sm text-muted-foreground">
                    Recibe notificaciones en tiempo real
                  </p>
                </div>
                <Button 
                  variant={notificationsEnabled ? "default" : "outline"} 
                  size="sm"
                  onClick={handleNotificationToggle}
                  disabled={notificationLoading}
                >
                  {notificationLoading ? (
                    <LoadingSpinner size="sm" />
                  ) : notificationsEnabled ? (
                    'Activadas'
                  ) : (
                    'Activar'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Configuración de Datos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Datos y Sincronización
              </CardTitle>
              <CardDescription>
                Gestiona tus datos y sincronización
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Button
                  variant="outline"
                  onClick={handleExportData}
                  disabled={loading}
                  className="w-full justify-start"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exportar Datos
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleClearCache}
                  disabled={loading}
                  className="w-full justify-start"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Limpiar Caché
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Configuración de Dispositivos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Dispositivos
              </CardTitle>
              <CardDescription>
                Gestiona tus dispositivos conectados
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Button
                  variant="outline"
                  onClick={() => router.push('/dashboard/configuracion/dispositivos')}
                  className="w-full justify-start"
                >
                  <Smartphone className="h-4 w-4 mr-2" />
                  Dispositivos Conectados
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => router.push('/dashboard/configuracion/sincronizacion')}
                  className="w-full justify-start"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Configurar Sincronización
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Configuración de Privacidad */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacidad y Seguridad
              </CardTitle>
              <CardDescription>
                Configura la privacidad de tu cuenta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Button
                  variant="outline"
                  onClick={() => router.push('/dashboard/configuracion/privacidad')}
                  className="w-full justify-start"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Configuración de Privacidad
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => router.push('/dashboard/configuracion/seguridad')}
                  className="w-full justify-start"
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Configuración de Seguridad
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => router.push('/dashboard/configuracion/sesiones')}
                  className="w-full justify-start"
                >
                  <User className="h-4 w-4 mr-2" />
                  Sesiones Activas
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Configuración de Red */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Red y Conectividad
              </CardTitle>
              <CardDescription>
                Configura la conectividad de la aplicación
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Button
                  variant="outline"
                  onClick={() => router.push('/dashboard/configuracion/red')}
                  className="w-full justify-start"
                >
                  <Globe className="h-4 w-4 mr-2" />
                  Configuración de Red
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => router.push('/dashboard/configuracion/offline')}
                  className="w-full justify-start"
                >
                  <Smartphone className="h-4 w-4 mr-2" />
                  Modo Offline
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Información de Contacto */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Información de Contacto
              </CardTitle>
              <CardDescription>
                Datos de contacto para soporte técnico
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <MessageCircle className="h-5 w-5 text-aqua-600" />
                    <div>
                      <p className="font-medium">WhatsApp</p>
                      <p className="text-sm text-muted-foreground">+56 9 6520 8072</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open('https://wa.me/56965208072', '_blank')}
                  >
                    Contactar
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-aqua-600" />
                    <div>
                      <p className="font-medium">Teléfono</p>
                      <p className="text-sm text-muted-foreground">+56 9 6520 8072</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open('tel:+56965208072', '_blank')}
                  >
                    Llamar
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-aqua-600" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">soporte@navipesca.cl</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open('mailto:soporte@navipesca.cl', '_blank')}
                  >
                    Enviar
                  </Button>
                </div>

                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <p className="text-sm font-medium mb-1">Horarios de Atención</p>
                  <p className="text-xs text-muted-foreground">
                    Lunes a Viernes: 8:00 - 18:00<br />
                    Sábados: 9:00 - 14:00<br />
                    Emergencias: Disponible 24/7
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Acciones de Cuenta */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Cuenta</CardTitle>
              <CardDescription>
                Acciones relacionadas con tu cuenta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  onClick={() => router.push('/dashboard/perfil')}
                  className="flex-1"
                >
                  Editar Perfil
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => router.push('/dashboard/ayuda')}
                  className="flex-1"
                >
                  Ayuda y Soporte
                </Button>
                
                <Button
                  variant="destructive"
                  onClick={handleSignOut}
                  className="flex-1"
                >
                  Cerrar Sesión
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
  )
} 