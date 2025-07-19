'use server'

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function getEmbarcaciones() {
  const supabase = createServerComponentClient({ cookies })
  
  try {
    // Verificar autenticación
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      throw new Error('No autenticado')
    }

    // Obtener clienteId del usuario
    const { data: usuario, error: userError } = await supabase
      .from('usuarios')
      .select('clienteId')
      .eq('id', user.id)
      .single()

    if (userError || !usuario) {
      throw new Error('Usuario no encontrado')
    }

    // Obtener embarcaciones con estadísticas
    const { data: embarcaciones, error } = await supabase
      .from('embarcaciones')
      .select('*')
      .eq('clienteId', usuario.clienteId)
      .order('createdAt', { ascending: false })

    if (error) throw error

    // Obtener estadísticas de pesajes para cada embarcación
    const embarcacionesConStats = await Promise.all(
      embarcaciones.map(async (embarcacion) => {
        const { data: pesajes, error: pesajesError } = await supabase
          .from('pesajes')
          .select('pesoNeto, fecha')
          .eq('embarcacionId', embarcacion.id)
          .order('fecha', { ascending: false })

        if (pesajesError) throw pesajesError

        const totalPesajes = pesajes.length
        const totalKilos = pesajes.reduce((sum, pesaje) => sum + pesaje.pesoNeto, 0)
        const ultimoPesaje = pesajes.length > 0 ? pesajes[0].fecha : undefined

        return {
          ...embarcacion,
          totalPesajes,
          totalKilos,
          ultimoPesaje
        }
      })
    )

    return { data: embarcacionesConStats, error: null }
  } catch (error) {
    console.error('Error fetching embarcaciones:', error)
    return { data: null, error: error instanceof Error ? error.message : 'Error desconocido' }
  }
}

export async function getEmbarcacion(id: string) {
  const supabase = createServerComponentClient({ cookies })
  
  try {
    // Verificar autenticación
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      throw new Error('No autenticado')
    }

    const { data: embarcacion, error } = await supabase
      .from('embarcaciones')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error

    if (!embarcacion) return { data: null, error: null }

    // Obtener estadísticas de pesajes
    const { data: pesajes, error: pesajesError } = await supabase
      .from('pesajes')
      .select('pesoNeto, fecha')
      .eq('embarcacionId', embarcacion.id)
      .order('fecha', { ascending: false })

    if (pesajesError) throw pesajesError

    const totalPesajes = pesajes.length
    const totalKilos = pesajes.reduce((sum, pesaje) => sum + pesaje.pesoNeto, 0)
    const ultimoPesaje = pesajes.length > 0 ? pesajes[0].fecha : undefined

    return {
      data: {
        ...embarcacion,
        totalPesajes,
        totalKilos,
        ultimoPesaje
      },
      error: null
    }
  } catch (error) {
    console.error('Error fetching embarcacion:', error)
    return { data: null, error: error instanceof Error ? error.message : 'Error desconocido' }
  }
}

export async function createEmbarcacion(formData: FormData) {
  const supabase = createServerComponentClient({ cookies })
  
  try {
    // Verificar autenticación
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      throw new Error('No autenticado')
    }

    // Obtener clienteId del usuario
    const { data: usuario, error: userError } = await supabase
      .from('usuarios')
      .select('clienteId')
      .eq('id', user.id)
      .single()

    if (userError || !usuario) {
      throw new Error('Usuario no encontrado')
    }

    // Extraer datos del formulario
    const nombre = formData.get('nombre') as string
    const matricula = formData.get('matricula') as string
    const propietario = formData.get('propietario') as string
    const telefono = formData.get('telefono') as string
    const observaciones = formData.get('observaciones') as string

    // Validar campos requeridos
    if (!nombre || !matricula || !propietario) {
      throw new Error('Los campos nombre, matrícula y propietario son requeridos')
    }

    // Crear embarcación
    const { data, error } = await supabase
      .from('embarcaciones')
      .insert({
        nombre,
        matricula,
        propietario,
        telefono: telefono || null,
        observaciones: observaciones || null,
        clienteId: usuario.clienteId,
        activa: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      throw new Error(`Error al crear embarcación: ${error.message}`)
    }

    revalidatePath('/dashboard/comprador/embarcaciones')
    redirect('/dashboard/comprador/embarcaciones')
  } catch (error) {
    console.error('Error creating embarcacion:', error)
    // Lanzar el error para que se maneje en el cliente
    throw error
  }
}

export async function updateEmbarcacion(id: string, formData: FormData) {
  const supabase = createServerComponentClient({ cookies })
  
  try {
    // Verificar autenticación
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      throw new Error('No autenticado')
    }

    // Extraer datos del formulario
    const nombre = formData.get('nombre') as string
    const matricula = formData.get('matricula') as string
    const propietario = formData.get('propietario') as string
    const telefono = formData.get('telefono') as string
    const observaciones = formData.get('observaciones') as string
    const activa = formData.get('activa') === 'true'

    // Validar campos requeridos
    if (!nombre || !matricula || !propietario) {
      throw new Error('Los campos nombre, matrícula y propietario son requeridos')
    }

    // Actualizar embarcación
    const { data, error } = await supabase
      .from('embarcaciones')
      .update({
        nombre,
        matricula,
        propietario,
        telefono: telefono || null,
        observaciones: observaciones || null,
        activa,
        updatedAt: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      throw new Error(`Error al actualizar embarcación: ${error.message}`)
    }

    revalidatePath('/dashboard/comprador/embarcaciones')
    redirect('/dashboard/comprador/embarcaciones')
  } catch (error) {
    console.error('Error updating embarcacion:', error)
    // Lanzar el error para que se maneje en el cliente
    throw error
  }
}

export async function deleteEmbarcacion(id: string) {
  const supabase = createServerComponentClient({ cookies })
  
  try {
    // Verificar autenticación
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      throw new Error('No autenticado')
    }

    // Eliminar embarcación
    const { error } = await supabase
      .from('embarcaciones')
      .delete()
      .eq('id', id)

    if (error) throw error

    revalidatePath('/dashboard/comprador/embarcaciones')
    return { success: true }
  } catch (error) {
    console.error('Error deleting embarcacion:', error)
    return { error: error instanceof Error ? error.message : 'Error desconocido' }
  }
}

export async function getPesajesEmbarcacion(embarcacionId: string) {
  const supabase = createServerComponentClient({ cookies })
  
  try {
    // Verificar autenticación
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      throw new Error('No autenticado')
    }

    const { data, error } = await supabase
      .from('pesajes')
      .select(`
        id,
        pesoBruto,
        pesoNeto,
        fecha,
        observaciones,
        estado,
        sincronizado,
        bins (
          codigo
        )
      `)
      .eq('embarcacionId', embarcacionId)
      .order('fecha', { ascending: false })
      .limit(10)

    if (error) throw error

    return { data: data || [], error: null }
  } catch (error) {
    console.error('Error fetching pesajes:', error)
    return { data: null, error: error instanceof Error ? error.message : 'Error desconocido' }
  }
} 