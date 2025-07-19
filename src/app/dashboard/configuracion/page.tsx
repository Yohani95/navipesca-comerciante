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
  AlertTriangle
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

export default function ConfiguracionPage() {
  const { user, signOut } = useAuth()
  const { theme, toggleTheme, mounted } = useThemeToggle()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

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
                <Button variant="outline" size="sm">
                  Configurar
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