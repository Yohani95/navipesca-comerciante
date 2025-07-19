'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { useAuth } from '@/hooks/use-auth'
import { useProfileForm } from '@/hooks/use-profile-form'
import { 
  User,
  Mail,
  Phone,
  Building,
  MapPin,
  Save,
  ArrowLeft,
  RotateCcw
} from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function PerfilPage() {
  const { user } = useAuth()
  const router = useRouter()
  const {
    profile,
    loading,
    saving,
    errors,
    handleInputChange,
    handleSave,
    resetForm,
    hasChanges
  } = useProfileForm()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información Personal */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Información Personal
              </CardTitle>
              <CardDescription>
                Actualiza tu información personal y de contacto
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Nombre</label>
                  <Input
                    value={profile.nombre}
                    onChange={(e) => handleInputChange('nombre', e.target.value)}
                    placeholder="Tu nombre"
                    className={`mt-1 ${errors.nombre ? 'border-red-500' : ''}`}
                  />
                  {errors.nombre && (
                    <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium">Apellido</label>
                  <Input
                    value={profile.apellido}
                    onChange={(e) => handleInputChange('apellido', e.target.value)}
                    placeholder="Tu apellido"
                    className={`mt-1 ${errors.apellido ? 'border-red-500' : ''}`}
                  />
                  {errors.apellido && (
                    <p className="text-red-500 text-xs mt-1">{errors.apellido}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Email</label>
                <Input
                  value={profile.email}
                  disabled
                  className="mt-1 bg-muted"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  El email no se puede modificar por seguridad
                </p>
              </div>

              <div>
                <label className="text-sm font-medium">Teléfono</label>
                <Input
                  value={profile.telefono}
                  onChange={(e) => handleInputChange('telefono', e.target.value)}
                  placeholder="+56 9 1234 5678"
                  className={`mt-1 ${errors.telefono ? 'border-red-500' : ''}`}
                />
                {errors.telefono && (
                  <p className="text-red-500 text-xs mt-1">{errors.telefono}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Información de la Empresa */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Información de la Empresa
              </CardTitle>
              <CardDescription>
                Datos de tu empresa o negocio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Nombre de la Empresa</label>
                <Input
                  value={profile.nombreEmpresa}
                  onChange={(e) => handleInputChange('nombreEmpresa', e.target.value)}
                  placeholder="Nombre de tu empresa"
                  className={`mt-1 ${errors.nombreEmpresa ? 'border-red-500' : ''}`}
                />
                {errors.nombreEmpresa && (
                  <p className="text-red-500 text-xs mt-1">{errors.nombreEmpresa}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium">Dirección</label>
                <Input
                  value={profile.direccion}
                  onChange={(e) => handleInputChange('direccion', e.target.value)}
                  placeholder="Dirección de tu empresa"
                  className={`mt-1 ${errors.direccion ? 'border-red-500' : ''}`}
                />
                {errors.direccion && (
                  <p className="text-red-500 text-xs mt-1">{errors.direccion}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium">Rol</label>
                <Input
                  value={profile.rol === 'comprador' ? 'Comprador' : 'Pesador'}
                  disabled
                  className="mt-1 bg-muted"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  El rol se asigna automáticamente según tu tipo de cuenta
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Panel Lateral */}
        <div className="space-y-6">
          {/* Resumen */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Resumen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Usuario:</span>
                <span className="font-medium">{profile.nombre} {profile.apellido}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Email:</span>
                <span className="font-medium">{profile.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Empresa:</span>
                <span className="font-medium">{profile.nombreEmpresa}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Teléfono:</span>
                <span className="font-medium">{profile.telefono || 'No especificado'}</span>
              </div>
            </CardContent>
          </Card>

          {/* Acciones */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Acciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={handleSave}
                disabled={saving || !hasChanges}
                loading={saving}
                className="w-full"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
              
              {hasChanges && (
                <Button 
                  variant="outline"
                  onClick={resetForm}
                  disabled={saving}
                  className="w-full"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Restaurar Cambios
                </Button>
              )}
              
              <Button 
                variant="outline"
                onClick={() => router.push('/dashboard/configuracion')}
                className="w-full"
              >
                Configuración Avanzada
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 