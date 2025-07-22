"use server"

import { createServerSupabaseClient } from '@/lib/supabase-actions'
import { revalidatePath } from 'next/cache'
import { PesajeEnProceso, BinPesaje } from '@/types'

interface PesajeInput {
  embarcacionId: string
  bin: string
  tara?: string
  pesoBruto?: string
  observaciones?: string
}

// Iniciar pesaje para una embarcación
export async function iniciarPesaje(embarcacionId: string) {
  console.log('Iniciando pesaje para embarcación:', embarcacionId)
  
  const supabase = createServerSupabaseClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (!user || userError) {
    console.error('Error de autenticación:', userError)
    return { error: 'No autenticado' }
  }

  // Obtener clienteId del usuario
  const { data: usuarioData, error: usuarioError } = await supabase
    .from('usuarios')
    .select('clienteId')
    .eq('id', user.id)
    .single()
  if (usuarioError || !usuarioData) {
    return { error: 'No se pudo obtener el cliente del usuario' }
  }

  // Verificar que no haya un pesaje en proceso para esta embarcación
  const { data: pesajeExistente } = await supabase
    .from('pesajes_en_proceso')
    .select('id')
    .eq('embarcacionId', embarcacionId)
    .eq('estado', 'tara')
    .single()

  if (pesajeExistente) {
    return { error: 'Ya existe un pesaje en proceso para esta embarcación' }
  }

  // Obtener información de la embarcación
  const { data: embarcacion, error: embarcacionError } = await supabase
    .from('embarcaciones')
    .select('nombre')
    .eq('id', embarcacionId)
    .single()

  if (embarcacionError || !embarcacion) {
    return { error: 'Embarcación no encontrada' }
  }

  // Crear pesaje en proceso
  const { data: pesajeEnProceso, error: pesajeError } = await supabase
    .from('pesajes_en_proceso')
    .insert({
      embarcacionId,
      embarcacionNombre: embarcacion.nombre,
      estado: 'tara',
      fechaInicio: new Date().toISOString(),
      usuarioId: user.id,
      clienteId: usuarioData.clienteId
    })
    .select('*')
    .single()

  if (pesajeError) {
    return { error: 'No se pudo iniciar el pesaje: ' + pesajeError.message }
  }

  revalidatePath('/dashboard/pesador')
  revalidatePath('/dashboard/pesador/pesaje-nuevo')
  return { success: true, pesajeEnProceso }
}

// Agregar bin al pesaje en proceso
export async function agregarBinAlPesaje(pesajeId: string, codigoBin: string, tara: number, observaciones?: string) {
  console.log('Agregando bin:', { pesajeId, codigoBin, tara })
  
  const supabase = createServerSupabaseClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (!user || userError) {
    console.error('Error de autenticación:', userError)
    return { error: 'No autenticado' }
  }

  // Verificar que el pesaje existe y está en estado tara
  const { data: pesaje, error: pesajeError } = await supabase
    .from('pesajes_en_proceso')
    .select('*')
    .eq('id', pesajeId)
    .single()

  if (pesajeError || !pesaje) {
    return { error: 'Pesaje no encontrado' }
  }

  if (pesaje.estado !== 'tara' && pesaje.estado !== 'pesaje') {
    return { error: 'El pesaje no está en estado de tara o pesaje' }
  }

  // Buscar bin existente primero
  const { data: binExistente, error: binSearchError } = await supabase
    .from('bins')
    .select('*')
    .eq('codigo', codigoBin)
    .eq('clienteId', pesaje.clienteId)
    .maybeSingle()

  let binId: string

  if (binExistente) {
    // Bin existe, actualizar tara si es diferente
    if (binExistente.tara !== tara) {
      const { error: updateError } = await supabase
        .from('bins')
        .update({ tara })
        .eq('id', binExistente.id)
      
      if (updateError) {
        return { error: 'No se pudo actualizar la tara del bin: ' + updateError.message }
      }
    }
    binId = binExistente.id
  } else {
    // Crear nuevo bin
    const { data: nuevoBin, error: binCreateError } = await supabase
      .from('bins')
      .insert({
        codigo: codigoBin,
        tara,
        clienteId: pesaje.clienteId,
        activo: true
      })
      .select('*')
      .single()

    if (binCreateError) {
      return { error: 'No se pudo crear el bin: ' + binCreateError.message }
    }
    binId = nuevoBin.id
  }

  // Verificar si el bin ya está en este pesaje
  const { data: binEnPesaje, error: binPesajeSearchError } = await supabase
    .from('bins_pesaje')
    .select('id')
    .eq('pesajeId', pesajeId)
    .eq('binId', binId)
    .maybeSingle()

  if (binEnPesaje) {
    return { error: 'Este bin ya está registrado en este pesaje' }
  }

  // Agregar bin al pesaje
  const { data: binPesaje, error: binPesajeError } = await supabase
    .from('bins_pesaje')
    .insert({
      pesajeId,
      binId: binId,
      codigo: codigoBin,
      tara,
      estado: 'tara_completada',
      observaciones: observaciones || null
    })
    .select('*')
    .single()

  if (binPesajeError) {
    return { error: 'No se pudo agregar el bin al pesaje: ' + binPesajeError.message }
  }

  // NO cambiar estado automáticamente - el usuario debe decidir cuándo comenzar el pesaje

  revalidatePath('/dashboard/pesador')
  revalidatePath('/dashboard/pesador/pesaje-nuevo')
  return { success: true, binPesaje }
}

// Cambiar estado del pesaje a 'pesaje'
export async function cambiarEstadoAPesaje(pesajeId: string) {
  const supabase = createServerSupabaseClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (!user || userError) {
    return { error: 'No autenticado' }
  }

  // Verificar que el pesaje existe y está en estado tara
  const { data: pesaje, error: pesajeError } = await supabase
    .from('pesajes_en_proceso')
    .select('*')
    .eq('id', pesajeId)
    .single()

  if (pesajeError || !pesaje) {
    return { error: 'Pesaje no encontrado' }
  }

  if (pesaje.estado !== 'tara') {
    return { error: 'El pesaje no está en estado de tara' }
  }

  // Verificar que hay al menos un bin
  const { data: bins, error: binsError } = await supabase
    .from('bins_pesaje')
    .select('id')
    .eq('pesajeId', pesajeId)

  if (binsError) {
    return { error: 'Error verificando bins: ' + binsError.message }
  }

  if (!bins || bins.length === 0) {
    return { error: 'Debe agregar al menos un bin antes de comenzar el pesaje' }
  }

  // Cambiar estado a 'pesaje'
  const { error: updateError } = await supabase
    .from('pesajes_en_proceso')
    .update({ estado: 'pesaje' })
    .eq('id', pesajeId)

  if (updateError) {
    return { error: 'No se pudo cambiar el estado: ' + updateError.message }
  }

  revalidatePath('/dashboard/pesador')
  revalidatePath('/dashboard/pesador/pesaje-nuevo')
  return { success: true }
}

// Registrar peso bruto de un bin
export async function registrarPesoBruto(pesajeId: string, binId: string, pesoBruto: number, observaciones?: string) {
  const supabase = createServerSupabaseClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (!user || userError) {
    return { error: 'No autenticado' }
  }

  // Obtener información del bin
  const { data: binPesaje, error: binPesajeError } = await supabase
    .from('bins_pesaje')
    .select('*, bins(*)')
    .eq('id', binId)
    .eq('pesajeId', pesajeId)
    .single()

  if (binPesajeError || !binPesaje) {
    return { error: 'Bin no encontrado en el pesaje' }
  }

  const pesoNeto = Math.max(0, pesoBruto - binPesaje.tara)

  // Actualizar peso bruto y neto
  const { error: updateError } = await supabase
    .from('bins_pesaje')
    .update({
      pesoBruto,
      pesoNeto,
      estado: 'pesaje_completado',
      observaciones: observaciones || null
    })
    .eq('id', binId)

  if (updateError) {
    return { error: 'No se pudo registrar el peso: ' + updateError.message }
  }

  revalidatePath('/dashboard/pesador')
  revalidatePath('/dashboard/pesador/pesaje-nuevo')
  return { success: true, pesoNeto }
}

// Cerrar pesaje de una embarcación
export async function cerrarPesaje(pesajeId: string) {
  const supabase = createServerSupabaseClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (!user || userError) {
    return { error: 'No autenticado' }
  }

  // Obtener pesaje y bins
  const { data: pesaje, error: pesajeError } = await supabase
    .from('pesajes_en_proceso')
    .select('*, bins_pesaje(*)')
    .eq('id', pesajeId)
    .single()

  if (pesajeError || !pesaje) {
    return { error: 'Pesaje no encontrado' }
  }

  // Verificar que todos los bins tengan peso registrado
  const binsSinPeso = pesaje.bins_pesaje?.filter((bin: any) => bin.estado !== 'pesaje_completado')
  if (binsSinPeso && binsSinPeso.length > 0) {
    return { error: 'Hay bins sin peso registrado' }
  }

  // Crear registros de pesaje finales
  const registrosPesaje = pesaje.bins_pesaje?.map((bin: any) => ({
    embarcacionId: pesaje.embarcacionId,
    binId: bin.binId,
    usuarioId: user.id,
    clienteId: pesaje.clienteId,
    pesoBruto: bin.pesoBruto,
    pesoNeto: bin.pesoNeto,
    fecha: new Date().toISOString(),
    observaciones: bin.observaciones,
    estado: 'pendiente',
    sincronizado: false
  })) || []

  const { error: insertError } = await supabase
    .from('pesajes')
    .insert(registrosPesaje)

  if (insertError) {
    return { error: 'No se pudo crear los registros de pesaje: ' + insertError.message }
  }

  // Marcar pesaje como completado
  const { error: updateError } = await supabase
    .from('pesajes_en_proceso')
    .update({
      estado: 'completado',
      fechaCierre: new Date().toISOString()
    })
    .eq('id', pesajeId)

  if (updateError) {
    return { error: 'No se pudo cerrar el pesaje: ' + updateError.message }
  }

  revalidatePath('/dashboard/pesador')
  revalidatePath('/dashboard/pesador/pesaje-nuevo')
  return { success: true }
}

// Obtener pesajes en proceso
export async function obtenerPesajesEnProceso() {
  const supabase = createServerSupabaseClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (!user || userError) {
    return { data: [] }
  }

  // Obtener clienteId del usuario
  const { data: usuarioData, error: usuarioError } = await supabase
    .from('usuarios')
    .select('clienteId')
    .eq('id', user.id)
    .single()
  if (usuarioError || !usuarioData) {
    return { data: [] }
  }

  // Primero obtener los pesajes
  const { data: pesajes, error } = await supabase
    .from('pesajes_en_proceso')
    .select('*')
    .eq('clienteId', usuarioData.clienteId)
    .neq('estado', 'completado')
    .order('fechaInicio', { ascending: false })

  if (error) {
    console.error('Error obteniendo pesajes en proceso:', error)
    return { data: [] }
  }

  // Debug: Verificar todos los bins disponibles
  const { data: todosLosBins, error: todosBinsError } = await supabase
    .from('bins_pesaje')
    .select('*')
  
  console.log('Todos los bins en la BD:', todosLosBins)
  console.log('Error obteniendo todos los bins:', todosBinsError)

  // Luego obtener los bins para cada pesaje
  console.log('Pesajes encontrados:', pesajes)
  
  const pesajesConBins = await Promise.all(
    (pesajes || []).map(async (pesaje) => {
      console.log(`Buscando bins para pesaje: ${pesaje.id}`)
      
      const { data: bins, error: binsError } = await supabase
        .from('bins_pesaje')
        .select('*')
        .eq('pesajeId', pesaje.id)

      console.log(`Bins encontrados para pesaje ${pesaje.id}:`, bins)
      console.log(`Error bins para pesaje ${pesaje.id}:`, binsError)

      if (binsError) {
        console.error('Error obteniendo bins para pesaje:', pesaje.id, binsError)
        return { ...pesaje, bins_pesaje: [] }
      }

      const pesajeConBins = { ...pesaje, bins_pesaje: bins || [] }
      console.log(`Pesaje con bins ${pesaje.id}:`, pesajeConBins)
      return pesajeConBins
    })
  )

  if (error) {
    console.error('Error obteniendo pesajes en proceso:', error)
    return { data: [] }
  }

  console.log('Pesajes obtenidos:', pesajesConBins)
  return { data: pesajesConBins || [] }
}

// Obtener un pesaje específico en proceso
export async function obtenerPesajeEnProceso(pesajeId: string) {
  const supabase = createServerSupabaseClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (!user || userError) {
    return { data: null }
  }

  // Obtener clienteId del usuario
  const { data: usuarioData, error: usuarioError } = await supabase
    .from('usuarios')
    .select('clienteId')
    .eq('id', user.id)
    .single()
  if (usuarioError || !usuarioData) {
    return { data: null }
  }

  // Obtener el pesaje específico
  const { data: pesaje, error } = await supabase
    .from('pesajes_en_proceso')
    .select('*')
    .eq('id', pesajeId)
    .eq('clienteId', usuarioData.clienteId)
    .single()

  if (error || !pesaje) {
    return { data: null }
  }

  // Obtener los bins del pesaje
  const { data: bins, error: binsError } = await supabase
    .from('bins_pesaje')
    .select('*')
    .eq('pesajeId', pesajeId)

  if (binsError) {
    console.error('Error obteniendo bins del pesaje:', binsError)
    return { data: { ...pesaje, bins_pesaje: [] } }
  }

  return { data: { ...pesaje, bins_pesaje: bins || [] } }
}

// Obtener historial de pesajes completados
export async function obtenerHistorialPesajes() {
  const supabase = createServerSupabaseClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (!user || userError) {
    return { data: [] }
  }

  // Obtener clienteId del usuario
  const { data: usuarioData, error: usuarioError } = await supabase
    .from('usuarios')
    .select('clienteId')
    .eq('id', user.id)
    .single()
  if (usuarioError || !usuarioData) {
    return { data: [] }
  }

  // Obtener pesajes completados
  const { data: pesajesCompletados, error } = await supabase
    .from('pesajes_en_proceso')
    .select('*')
    .eq('clienteId', usuarioData.clienteId)
    .eq('estado', 'completado')
    .order('fechaCierre', { ascending: false })

  if (error) {
    console.error('Error obteniendo historial:', error)
    return { data: [] }
  }

  // Obtener bins para cada pesaje completado
  const historialConBins = await Promise.all(
    (pesajesCompletados || []).map(async (pesaje) => {
      const { data: bins, error: binsError } = await supabase
        .from('bins_pesaje')
        .select('*')
        .eq('pesajeId', pesaje.id)

      if (binsError) {
        console.error('Error obteniendo bins para pesaje:', pesaje.id, binsError)
        return { ...pesaje, bins: [], totalBins: 0, totalKilos: 0 }
      }

      const totalKilos = bins?.reduce((total, bin) => total + (bin.pesoNeto || 0), 0) || 0

      return { 
        ...pesaje, 
        bins: bins || [], 
        totalBins: bins?.length || 0,
        totalKilos
      }
    })
  )

  return { data: historialConBins || [] }
}

// Obtener estadísticas del pesador
export async function obtenerEstadisticasPesador() {
  const supabase = createServerSupabaseClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (!user || userError) {
    return { 
      data: {
        embarcacionesActivas: 0,
        binsPendientes: 0,
        kilosHoy: 0,
        ultimoPesaje: null
      }
    }
  }

  // Obtener clienteId del usuario
  const { data: usuarioData, error: usuarioError } = await supabase
    .from('usuarios')
    .select('clienteId')
    .eq('id', user.id)
    .single()
  if (usuarioError || !usuarioData) {
    return { 
      data: {
        embarcacionesActivas: 0,
        binsPendientes: 0,
        kilosHoy: 0,
        ultimoPesaje: null
      }
    }
  }

  const hoy = new Date()
  const inicioDia = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()).toISOString()

  // Pesajes de hoy
  const { data: pesajesHoy, error: pesajesError } = await supabase
    .from('pesajes')
    .select('pesoNeto')
    .eq('clienteId', usuarioData.clienteId)
    .gte('fecha', inicioDia)

  // Embarcaciones activas (con pesajes en proceso)
  const { data: embarcacionesActivas, error: embarcacionesError } = await supabase
    .from('pesajes_en_proceso')
    .select('embarcacionId')
    .eq('clienteId', usuarioData.clienteId)
    .neq('estado', 'completado')

  // Bins pendientes - contar bins que no están completados (no tienen peso bruto)
  const { data: binsPendientes, error: binsError } = await supabase
    .from('bins_pesaje')
    .select('id')
    .neq('estado', 'pesaje_completado')

  const kilosHoy = pesajesHoy?.reduce((total, pesaje) => total + (pesaje.pesoNeto || 0), 0) || 0
  const embarcacionesActivasCount = embarcacionesActivas?.length || 0
  const binsPendientesCount = binsPendientes?.length || 0

  return {
    data: {
      embarcacionesActivas: embarcacionesActivasCount,
      binsPendientes: binsPendientesCount,
      kilosHoy,
      ultimoPesaje: pesajesHoy && pesajesHoy.length > 0 ? new Date().toISOString() : null
    }
  }
}

export async function registrarPesajes(pesajes: PesajeInput[]) {
  const supabase = createServerSupabaseClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (!user || userError) {
    return { error: 'No autenticado' }
  }

  // Obtener clienteId del usuario
  const { data: usuarioData, error: usuarioError } = await supabase
    .from('usuarios')
    .select('clienteId')
    .eq('id', user.id)
    .single()
  if (usuarioError || !usuarioData) {
    return { error: 'No se pudo obtener el cliente del usuario' }
  }
  const clienteId = usuarioData.clienteId

  const registrosPesaje = []

  for (const pesaje of pesajes) {
    if (!pesaje.embarcacionId || !pesaje.bin) {
      return { error: 'Embarcación y bin son obligatorios' }
    }

    // Buscar bin por código y clienteId
    let binId: string | null = null
    const { data: binData, error: binError } = await supabase
      .from('bins')
      .select('id')
      .eq('codigo', pesaje.bin)
      .eq('clienteId', clienteId)
      .single()

    if (binData && binData.id) {
      binId = binData.id
    } else {
      // Crear bin si no existe
      const { data: newBin, error: newBinError } = await supabase
        .from('bins')
        .insert({
          codigo: pesaje.bin,
          tara: pesaje.tara ? parseFloat(pesaje.tara) : 0,
          clienteId: clienteId,
          activo: true
        })
        .select('id')
        .single()
      if (newBinError || !newBin) {
        return { error: 'No se pudo crear el bin: ' + (newBinError?.message || '') }
      }
      binId = newBin.id
    }

    registrosPesaje.push({
      embarcacionId: pesaje.embarcacionId,
      binId,
      usuarioId: user.id,
      clienteId,
      pesoBruto: pesaje.pesoBruto ? parseFloat(pesaje.pesoBruto) : 0,
      pesoNeto: pesaje.pesoBruto && pesaje.tara ? Math.max(0, parseFloat(pesaje.pesoBruto) - parseFloat(pesaje.tara)) : 0,
      fecha: new Date().toISOString(),
      observaciones: pesaje.observaciones || null,
      estado: pesaje.pesoBruto ? 'sincronizado' : 'pendiente',
      sincronizado: !!pesaje.pesoBruto,
    })
  }

  const { error: pesajeError } = await supabase.from('pesajes').insert(registrosPesaje)
  if (pesajeError) {
    return { error: pesajeError.message }
  }

  revalidatePath('/dashboard/pesador')
  revalidatePath('/dashboard/comprador')
  return { success: true }
} 