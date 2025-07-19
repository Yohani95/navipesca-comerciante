'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// Schema de validación para actualización de perfil
const updateProfileSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(50),
  apellido: z.string().min(2, 'El apellido debe tener al menos 2 caracteres').max(50),
  telefono: z.string().optional(),
  nombreEmpresa: z.string().min(2, 'El nombre de empresa debe tener al menos 2 caracteres').max(100),
  direccion: z.string().optional(),
})

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>

// Actualizar perfil del usuario
export async function updateUserProfile(data: UpdateProfileInput) {
  try {
    // Validar datos de entrada
    const validatedData = updateProfileSchema.parse(data)
    
    // Obtener cliente de Supabase para operaciones
    const supabase = createClient()

    // Actualizar metadata del usuario en Supabase Auth
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

    // Actualizar tabla de clientes si existe
    const { error: clienteError } = await supabase
      .from('clientes')
      .update({
        nombre: validatedData.nombre,
        apellido: validatedData.apellido,
        telefono: validatedData.telefono,
        nombre_empresa: validatedData.nombreEmpresa,
        direccion: validatedData.direccion,
        updated_at: new Date().toISOString()
      })
      .eq('id_usuario', user.id)

    if (clienteError) {
      console.warn('Error al actualizar tabla clientes:', clienteError)
      // No lanzamos error aquí porque la actualización en auth fue exitosa
    }

    // Revalidar páginas relacionadas
    revalidatePath('/dashboard/perfil')
    revalidatePath('/dashboard')

    return {
      success: true,
      message: 'Perfil actualizado correctamente'
    }

  } catch (error: unknown) {
    console.error('Error en updateUserProfile:', error)
    
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: 'Datos inválidos',
        errors: error.issues
      }
    }

    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error desconocido'
    }
  }
}

 