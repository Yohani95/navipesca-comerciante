'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { 
  Shield,
  Eye,
  EyeOff,
  Lock,
  User,
  Mail,
  Phone,
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  Download,
  Trash2,
  Settings,
  Key
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

export default function PrivacidadPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    dataSharing: false,
    analytics: true,
    marketing: false,
    locationSharing: false
  })

  const handlePrivacySettingChange = async (setting: string, value: any) => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      setPrivacySettings(prev => ({ ...prev, [setting]: value }))
      toast.success('Configuración actualizada')
    } catch (error) {
      toast.error('Error al actualizar configuración')
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadData = async () => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success('Datos descargados correctamente')
    } catch (error) {
      toast.error('Error al descargar datos')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.')) {
      setLoading(true)
      try {
        await new Promise(resolve => setTimeout(resolve, 3000))
        toast.success('Cuenta eliminada correctamente')
        router.push('/')
      } catch (error) {
        toast.error('Error al eliminar cuenta')
      } finally {
        setLoading(false)
      }
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
        <h1 className="text-2xl font-bold">Privacidad y Seguridad</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuración de Privacidad */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Configuración de Privacidad
            </CardTitle>
            <CardDescription>
              Controla qué información es visible para otros usuarios
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Visibilidad del Perfil</p>
                  <p className="text-sm text-muted-foreground">
                    Quién puede ver tu información
                  </p>
                </div>
                <select
                  value={privacySettings.profileVisibility}
                  onChange={(e) => handlePrivacySettingChange('profileVisibility', e.target.value)}
                  className="px-3 py-1 border rounded-md text-sm"
                  disabled={loading}
                >
                  <option value="public">Público</option>
                  <option value="contacts">Solo Contactos</option>
                  <option value="private">Privado</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Compartir Datos</p>
                  <p className="text-sm text-muted-foreground">
                    Permitir uso de datos para mejoras
                  </p>
                </div>
                <Button
                  variant={privacySettings.dataSharing ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePrivacySettingChange('dataSharing', !privacySettings.dataSharing)}
                  disabled={loading}
                >
                  {privacySettings.dataSharing ? 'Activado' : 'Desactivado'}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Analytics</p>
                  <p className="text-sm text-muted-foreground">
                    Recopilar datos de uso anónimos
                  </p>
                </div>
                <Button
                  variant={privacySettings.analytics ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePrivacySettingChange('analytics', !privacySettings.analytics)}
                  disabled={loading}
                >
                  {privacySettings.analytics ? 'Activado' : 'Desactivado'}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Marketing</p>
                  <p className="text-sm text-muted-foreground">
                    Recibir comunicaciones promocionales
                  </p>
                </div>
                <Button
                  variant={privacySettings.marketing ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePrivacySettingChange('marketing', !privacySettings.marketing)}
                  disabled={loading}
                >
                  {privacySettings.marketing ? 'Activado' : 'Desactivado'}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Ubicación</p>
                  <p className="text-sm text-muted-foreground">
                    Compartir ubicación con la app
                  </p>
                </div>
                <Button
                  variant={privacySettings.locationSharing ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePrivacySettingChange('locationSharing', !privacySettings.locationSharing)}
                  disabled={loading}
                >
                  {privacySettings.locationSharing ? 'Activado' : 'Desactivado'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configuración de Seguridad */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Configuración de Seguridad
            </CardTitle>
            <CardDescription>
              Protege tu cuenta con configuraciones de seguridad
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Button
                variant="outline"
                onClick={() => router.push('/dashboard/configuracion/seguridad')}
                className="w-full justify-start"
              >
                <Key className="h-4 w-4 mr-2" />
                Cambiar Contraseña
              </Button>
              
              <Button
                variant="outline"
                onClick={() => toast('Autenticación de dos factores próximamente')}
                className="w-full justify-start"
              >
                <Shield className="h-4 w-4 mr-2" />
                Autenticación de Dos Factores
              </Button>
              
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
                onClick={() => toast('Sesiones activas próximamente')}
                className="w-full justify-start"
              >
                <User className="h-4 w-4 mr-2" />
                Sesiones Activas
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Datos Personales */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Datos Personales
            </CardTitle>
            <CardDescription>
              Gestiona la información de tu cuenta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Button
                variant="outline"
                onClick={() => router.push('/dashboard/perfil')}
                className="w-full justify-start"
              >
                <User className="h-4 w-4 mr-2" />
                Editar Perfil
              </Button>
              
              <Button
                variant="outline"
                onClick={() => toast('Información de contacto próximamente')}
                className="w-full justify-start"
              >
                <Mail className="h-4 w-4 mr-2" />
                Información de Contacto
              </Button>
              
              <Button
                variant="outline"
                onClick={handleDownloadData}
                disabled={loading}
                className="w-full justify-start"
              >
                <Download className="h-4 w-4 mr-2" />
                Descargar Mis Datos
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Eliminar Cuenta */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" />
              Eliminar Cuenta
            </CardTitle>
            <CardDescription>
              Elimina permanentemente tu cuenta y todos tus datos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                <div>
                  <h4 className="font-medium text-destructive mb-1">Acción Irreversible</h4>
                  <p className="text-sm text-muted-foreground">
                    Al eliminar tu cuenta, perderás acceso a todos tus datos y no podrás recuperarlos.
                  </p>
                </div>
              </div>
            </div>
            
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Eliminando...
                </>
              ) : (
                'Eliminar Cuenta'
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Información Legal */}
      <Card className="mt-6">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-aqua-600 mt-0.5" />
            <div>
              <h4 className="font-medium mb-1">Tu Privacidad es Importante</h4>
              <p className="text-sm text-muted-foreground">
                Cumplimos con las regulaciones de protección de datos. Puedes revisar nuestra 
                <a href="#" className="text-aqua-600 hover:underline ml-1">Política de Privacidad</a> 
                y <a href="#" className="text-aqua-600 hover:underline">Términos de Servicio</a> 
                para más información.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 