'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { validateEmail } from '@/lib/utils'
import toast from 'react-hot-toast'

interface FormData {
  email: string
  password: string
  confirmPassword: string
  nombre: string
  apellido: string
  nombreEmpresa: string
  telefono: string
}

export function AuthForm() {
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    nombre: '',
    apellido: '',
    nombreEmpresa: '',
    telefono: '',
  })

  const { signIn, signUp } = useAuth()
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!validateEmail(formData.email)) {
        toast.error('Por favor ingresa un email válido')
        return
      }

      if (formData.password.length < 6) {
        toast.error('La contraseña debe tener al menos 6 caracteres')
        return
      }

      if (isLogin) {
        const { data, error } = await signIn(formData.email, formData.password)
        
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast.error('Credenciales inválidas')
          } else {
            toast.error('Error al iniciar sesión')
          }
          return
        }

        // Check user role and redirect accordingly
        // This will be handled by the useEffect in the main page
        toast.success('Sesión iniciada correctamente')
        
      } else {
        // Registration validation
        if (formData.password !== formData.confirmPassword) {
          toast.error('Las contraseñas no coinciden')
          return
        }

        if (!formData.nombre || !formData.apellido || !formData.nombreEmpresa) {
          toast.error('Por favor completa todos los campos requeridos')
          return
        }

        const { data, error } = await signUp(formData.email, formData.password, {
          nombre: formData.nombre,
          apellido: formData.apellido,
          nombreEmpresa: formData.nombreEmpresa,
          telefono: formData.telefono,
          rol: 'comprador' // Default role for new registrations
        })

        if (error) {
          if (error.message.includes('already registered')) {
            toast.error('Este email ya está registrado')
          } else {
            toast.error('Error al crear la cuenta')
          }
          return
        }

        toast.success('Cuenta creada correctamente. Por favor verifica tu email.')
      }
    } catch (error) {
      console.error('Auth error:', error)
      toast.error('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center">
          {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
        </CardTitle>
        <CardDescription className="text-center">
          {isLogin 
            ? 'Ingresa tus credenciales para acceder'
            : 'Completa los datos para crear tu cuenta'
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="tu@empresa.com"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Contraseña
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="••••••••"
              required
            />
          </div>

          {!isLogin && (
            <>
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirmar Contraseña
                </label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="nombre" className="text-sm font-medium">
                    Nombre
                  </label>
                  <Input
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    placeholder="Juan"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="apellido" className="text-sm font-medium">
                    Apellido
                  </label>
                  <Input
                    id="apellido"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleInputChange}
                    placeholder="Pérez"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="nombreEmpresa" className="text-sm font-medium">
                  Nombre de la Empresa
                </label>
                <Input
                  id="nombreEmpresa"
                  name="nombreEmpresa"
                  value={formData.nombreEmpresa}
                  onChange={handleInputChange}
                  placeholder="Pescados del Sur Ltda."
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="telefono" className="text-sm font-medium">
                  Teléfono (opcional)
                </label>
                <Input
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  placeholder="+56 9 1234 5678"
                />
              </div>
            </>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            variant="navy"
            loading={loading}
            disabled={loading}
          >
            <span>{isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}</span>
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {isLogin 
              ? '¿No tienes cuenta? Regístrate aquí'
              : '¿Ya tienes cuenta? Inicia sesión'
            }
          </button>
        </div>

        {!isLogin && (
          <div className="mt-4 p-4 bg-aqua-50 dark:bg-aqua-900/20 rounded-lg border border-aqua-200 dark:border-aqua-700">
            <p className="text-sm text-aqua-700 dark:text-aqua-300">
              <strong>🎯 Período de prueba:</strong> Tu cuenta incluye 1 mes de uso gratuito.
              Después podrás suscribirte por $1 CLP por kilo registrado mensualmente.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}