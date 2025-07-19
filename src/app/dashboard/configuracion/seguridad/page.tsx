'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { 
  Lock,
  Key,
  Shield,
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle,
  ArrowLeft,
  Smartphone,
  Mail,
  Clock,
  AlertCircle
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

export default function SeguridadPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [twoFactorLoading, setTwoFactorLoading] = useState(false)

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordForm(prev => ({ ...prev, [field]: value }))
  }

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Las contraseñas no coinciden')
      return
    }

    if (passwordForm.newPassword.length < 8) {
      toast.error('La contraseña debe tener al menos 8 caracteres')
      return
    }

    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success('Contraseña cambiada correctamente')
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } catch (error) {
      toast.error('Error al cambiar contraseña')
    } finally {
      setLoading(false)
    }
  }

  const handleTwoFactorToggle = async () => {
    setTwoFactorLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      setTwoFactorEnabled(!twoFactorEnabled)
      toast.success(twoFactorEnabled ? 'Autenticación de dos factores desactivada' : 'Autenticación de dos factores activada')
    } catch (error) {
      toast.error('Error al configurar autenticación de dos factores')
    } finally {
      setTwoFactorLoading(false)
    }
  }

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, text: '', color: '' }
    
    let score = 0
    if (password.length >= 8) score++
    if (/[a-z]/.test(password)) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++

    switch (score) {
      case 0:
      case 1:
        return { strength: score, text: 'Muy débil', color: 'text-red-600' }
      case 2:
        return { strength: score, text: 'Débil', color: 'text-orange-600' }
      case 3:
        return { strength: score, text: 'Media', color: 'text-yellow-600' }
      case 4:
        return { strength: score, text: 'Fuerte', color: 'text-green-600' }
      case 5:
        return { strength: score, text: 'Muy fuerte', color: 'text-green-700' }
      default:
        return { strength: score, text: '', color: '' }
    }
  }

  const passwordStrength = getPasswordStrength(passwordForm.newPassword)

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
        <h1 className="text-2xl font-bold">Seguridad</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cambiar Contraseña */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Cambiar Contraseña
            </CardTitle>
            <CardDescription>
              Actualiza tu contraseña para mantener tu cuenta segura
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-2 block">Contraseña Actual</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Ingresa tu contraseña actual"
                    value={passwordForm.currentPassword}
                    onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                    disabled={loading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Nueva Contraseña</label>
                <div className="relative">
                  <Input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Ingresa tu nueva contraseña"
                    value={passwordForm.newPassword}
                    onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                    disabled={loading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {passwordForm.newPassword && (
                  <div className="mt-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs">Fortaleza:</span>
                      <span className={`text-xs font-medium ${passwordStrength.color}`}>
                        {passwordStrength.text}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div 
                        className={`h-1 rounded-full transition-all ${
                          passwordStrength.strength <= 1 ? 'bg-red-500' :
                          passwordStrength.strength === 2 ? 'bg-orange-500' :
                          passwordStrength.strength === 3 ? 'bg-yellow-500' :
                          passwordStrength.strength >= 4 ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                        style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Confirmar Nueva Contraseña</label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirma tu nueva contraseña"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                    disabled={loading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword && (
                  <p className="text-xs text-red-600 mt-1">Las contraseñas no coinciden</p>
                )}
              </div>

              <Button
                onClick={handleChangePassword}
                disabled={loading || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
                className="w-full"
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Cambiando...
                  </>
                ) : (
                  'Cambiar Contraseña'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Autenticación de Dos Factores */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Autenticación de Dos Factores
            </CardTitle>
            <CardDescription>
              Añade una capa extra de seguridad a tu cuenta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Autenticación de Dos Factores</p>
                  <p className="text-sm text-muted-foreground">
                    Requiere un código adicional para acceder
                  </p>
                </div>
                <Button
                  variant={twoFactorEnabled ? "default" : "outline"}
                  size="sm"
                  onClick={handleTwoFactorToggle}
                  disabled={twoFactorLoading}
                >
                  {twoFactorLoading ? (
                    <LoadingSpinner size="sm" />
                  ) : twoFactorEnabled ? (
                    'Activada'
                  ) : (
                    'Activar'
                  )}
                </Button>
              </div>

              {twoFactorEnabled && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-green-800 dark:text-green-200 mb-1">
                        Autenticación de Dos Factores Activada
                      </h4>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        Tu cuenta está protegida con autenticación de dos factores.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Button
                  variant="outline"
                  onClick={() => toast('Configuración de SMS próximamente')}
                  className="w-full justify-start"
                >
                  <Smartphone className="h-4 w-4 mr-2" />
                  Configurar SMS
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => toast('Configuración de Email próximamente')}
                  className="w-full justify-start"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Configurar Email
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => toast('Aplicación autenticadora próximamente')}
                  className="w-full justify-start"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Aplicación Autenticadora
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actividad Reciente */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Actividad Reciente
            </CardTitle>
            <CardDescription>
              Últimos accesos a tu cuenta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-aqua-100 dark:bg-aqua-900/20 flex items-center justify-center">
                    <Smartphone className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">iPhone 14 Pro</p>
                    <p className="text-xs text-muted-foreground">Valparaíso, Chile</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Hace 5 min</p>
                  <CheckCircle className="h-4 w-4 text-green-600 ml-auto mt-1" />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-aqua-100 dark:bg-aqua-900/20 flex items-center justify-center">
                    <Smartphone className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">MacBook Pro</p>
                    <p className="text-xs text-muted-foreground">Santiago, Chile</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Hace 2 horas</p>
                  <CheckCircle className="h-4 w-4 text-green-600 ml-auto mt-1" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Consejos de Seguridad */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Consejos de Seguridad
            </CardTitle>
            <CardDescription>
              Recomendaciones para mantener tu cuenta segura
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Usa contraseñas únicas</p>
                  <p className="text-xs text-muted-foreground">
                    No reutilices contraseñas en diferentes servicios
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Activa la autenticación de dos factores</p>
                  <p className="text-xs text-muted-foreground">
                    Añade una capa extra de seguridad
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Revisa tu actividad regularmente</p>
                  <p className="text-xs text-muted-foreground">
                    Verifica que solo tú accedas a tu cuenta
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Mantén tu información actualizada</p>
                  <p className="text-xs text-muted-foreground">
                    Actualiza tu email y teléfono de recuperación
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 