import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase'
import { toast } from 'react-hot-toast'
import { z } from 'zod'

// Schema de validación para actualización de perfil
const updateProfileSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(50),
  apellido: z.string().min(2, 'El apellido debe tener al menos 2 caracteres').max(50),
  telefono: z.string().optional(),
  nombreEmpresa: z.string().min(2, 'El nombre de empresa debe tener al menos 2 caracteres').max(100),
  direccion: z.string().optional(),
})

interface ProfileFormData {
  nombre: string
  apellido: string
  email: string
  telefono: string
  nombreEmpresa: string
  direccion: string
  rol: string
}

interface UseProfileFormReturn {
  profile: ProfileFormData
  loading: boolean
  saving: boolean
  errors: Record<string, string>
  handleInputChange: (field: keyof ProfileFormData, value: string) => void
  handleSave: () => Promise<void>
  resetForm: () => void
  hasChanges: boolean
}

export function useProfileForm(): UseProfileFormReturn {
  const { user } = useAuth()
  const [profile, setProfile] = useState<ProfileFormData>({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    nombreEmpresa: '',
    direccion: '',
    rol: ''
  })

  const [originalProfile, setOriginalProfile] = useState<ProfileFormData>({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    nombreEmpresa: '',
    direccion: '',
    rol: ''
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Cargar datos del perfil desde el contexto de autenticación
  useEffect(() => {
    if (user) {
      const profileData = {
        nombre: user.user_metadata?.nombre || '',
        apellido: user.user_metadata?.apellido || '',
        email: user.email || '',
        telefono: user.user_metadata?.telefono || '',
        nombreEmpresa: user.user_metadata?.nombreEmpresa || '',
        direccion: user.user_metadata?.direccion || '',
        rol: user.user_metadata?.rol || 'comprador'
      }
      setProfile(profileData)
      setOriginalProfile(profileData)
      setLoading(false)
    }
  }, [user])

  const handleInputChange = (field: keyof ProfileFormData, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }))

    // Limpiar error del campo si existe
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!profile.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido'
    } else if (profile.nombre.length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres'
    }

    if (!profile.apellido.trim()) {
      newErrors.apellido = 'El apellido es requerido'
    } else if (profile.apellido.length < 2) {
      newErrors.apellido = 'El apellido debe tener al menos 2 caracteres'
    }

    if (!profile.nombreEmpresa.trim()) {
      newErrors.nombreEmpresa = 'El nombre de la empresa es requerido'
    } else if (profile.nombreEmpresa.length < 2) {
      newErrors.nombreEmpresa = 'El nombre de la empresa debe tener al menos 2 caracteres'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error('Por favor corrige los errores en el formulario')
      return
    }

    setSaving(true)
    try {
      // Validar datos con Zod
      const validatedData = updateProfileSchema.parse({
        nombre: profile.nombre,
        apellido: profile.apellido,
        telefono: profile.telefono,
        nombreEmpresa: profile.nombreEmpresa,
        direccion: profile.direccion,
      })

      // Actualizar metadata del usuario en Supabase Auth (solo datos personales)
      const { data: { user }, error: updateError } = await supabase.auth.updateUser({
        data: {
          nombre: validatedData.nombre,
          apellido: validatedData.apellido,
          telefono: validatedData.telefono,
          nombreEmpresa: validatedData.nombreEmpresa,
          direccion: validatedData.direccion,
        }
      })

      if (updateError) {
        throw new Error(`Error al actualizar perfil: ${updateError.message}`)
      }

      if (!user) {
        throw new Error('Usuario no autenticado')
      }

      // Obtener el cliente asociado al usuario
      const { data: clientesTest, error: clientesTestError } = await supabase
        .from('clientes')
        .select('*')
        .eq('email', user.email)
        .limit(1)
      
      if (clientesTestError) {
        throw new Error(`Error al leer datos del cliente: ${clientesTestError.message}`)
      }
      
      if (!clientesTest || clientesTest.length === 0) {
        throw new Error('No se encontró la información del cliente')
      }
      
      const cliente = clientesTest[0]
      
      // Obtener el usuario usando el clienteId
      const { data: usuariosTest, error: usuariosTestError } = await supabase
        .from('usuarios')
        .select('*')
        .eq('clienteId', cliente.id)
        .eq('email', user.email)
        .limit(1)
      
      if (usuariosTestError) {
        throw new Error(`Error al leer datos del usuario: ${usuariosTestError.message}`)
      }
      
      if (!usuariosTest || usuariosTest.length === 0) {
        throw new Error('No se encontró la información del usuario')
      }
      
      const usuario = usuariosTest[0]

      // Actualizar tabla de usuarios con datos personales
      const { error: usuarioError } = await supabase
        .from('usuarios')
        .update({
          nombre: validatedData.nombre,
          apellido: validatedData.apellido,
        })
        .eq('id', usuario.id)

      if (usuarioError) {
        throw new Error(`Error al actualizar usuario: ${usuarioError.message}`)
      }

      // Actualizar tabla de clientes con datos de empresa
      const { error: clienteError } = await supabase
        .from('clientes')
        .update({
          nombre: validatedData.nombreEmpresa, // Nombre de la empresa
          telefono: validatedData.telefono,
          direccion: validatedData.direccion,
        })
        .eq('id', cliente.id)

      if (clienteError) {
        throw new Error(`Error al actualizar cliente: ${clienteError.message}`)
      }

      toast.success('Perfil actualizado correctamente')
      // Actualizar perfil original para resetear hasChanges
      setOriginalProfile(profile)
      setErrors({})
      
      // El AuthProvider se actualizará automáticamente con los nuevos datos
      // Agregar un pequeño delay para asegurar que la actualización se procese
      setTimeout(() => {
        // Forzar una actualización del contexto
        supabase.auth.getSession()
      }, 100)
      
    } catch (error) {
      console.error('❌ Error al actualizar perfil:', error)
      
      // Manejar errores de conectividad específicamente
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch') || error.message.includes('ERR_NAME_NOT_RESOLVED')) {
          toast.error('Error de conectividad. Verifica tu conexión a internet y la configuración de Supabase.')
        } else if (error.message.includes('Auth session missing')) {
          toast.error('Sesión de autenticación perdida. Por favor, inicia sesión nuevamente.')
        } else {
          toast.error(error.message)
        }
      } else {
        toast.error('Error inesperado al actualizar el perfil')
      }
      
      if (error instanceof z.ZodError) {
        // Mapear errores de validación
        const validationErrors: Record<string, string> = {}
        error.issues.forEach((issue) => {
          if (issue.path && issue.path[0]) {
            validationErrors[issue.path[0] as string] = issue.message
          }
        })
        setErrors(validationErrors)
      }
    } finally {
      setSaving(false)
    }
  }

  const resetForm = () => {
    setProfile(originalProfile)
    setErrors({})
  }

  const hasChanges = JSON.stringify(profile) !== JSON.stringify(originalProfile)

  return {
    profile,
    loading,
    saving,
    errors,
    handleInputChange,
    handleSave,
    resetForm,
    hasChanges
  }
} 