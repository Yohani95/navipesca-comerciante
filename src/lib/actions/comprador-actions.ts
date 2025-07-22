import { createServerSupabaseClient } from '@/lib/supabase-actions'

// Obtener estadísticas del dashboard del comprador
export async function obtenerEstadisticasComprador() {
  const supabase = createServerSupabaseClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (!user || userError) {
    return { data: null, error: 'No autenticado' }
  }

  // Obtener clienteId del usuario
  const { data: usuarioData, error: usuarioError } = await supabase
    .from('usuarios')
    .select('clienteId')
    .eq('id', user.id)
    .single()

  if (usuarioError || !usuarioData) {
    return { data: null, error: 'Usuario no encontrado' }
  }

  try {
    // Obtener fecha actual
    const hoy = new Date()
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1)
    const finMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0)

    // 1. Total kilos hoy
    const { data: kilosHoy, error: kilosHoyError } = await supabase
      .from('pesajes')
      .select('pesoNeto')
      .eq('clienteId', usuarioData.clienteId)
      .gte('fecha', hoy.toISOString().split('T')[0])
      .lt('fecha', new Date(hoy.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0])

    // 2. Total kilos del mes
    const { data: kilosMes, error: kilosMesError } = await supabase
      .from('pesajes')
      .select('pesoNeto')
      .eq('clienteId', usuarioData.clienteId)
      .gte('fecha', inicioMes.toISOString().split('T')[0])
      .lte('fecha', finMes.toISOString().split('T')[0])

    // 3. Embarcaciones activas
    const { data: embarcaciones, error: embarcacionesError } = await supabase
      .from('embarcaciones')
      .select('id')
      .eq('clienteId', usuarioData.clienteId)
      .eq('activo', true)

    // 4. Pesajes hoy
    const { data: pesajesHoyData, error: pesajesHoyError } = await supabase
      .from('pesajes')
      .select('id')
      .eq('clienteId', usuarioData.clienteId)
      .gte('fecha', hoy.toISOString().split('T')[0])
      .lt('fecha', new Date(hoy.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0])

    // 5. Pesajes en proceso (pendientes de sincronizar)
    const { data: pesajesEnProceso, error: pesajesEnProcesoError } = await supabase
      .from('pesajes_en_proceso')
      .select('id')
      .eq('clienteId', usuarioData.clienteId)
      .neq('estado', 'completado')

    // Calcular totales
    const totalKilosHoy = kilosHoy?.reduce((sum, pesaje) => sum + (pesaje.pesoNeto || 0), 0) || 0
    const totalKilosMes = kilosMes?.reduce((sum, pesaje) => sum + (pesaje.pesoNeto || 0), 0) || 0
    const embarcacionesActivas = embarcaciones?.length || 0
    const pesajesHoy = pesajesHoyData?.length || 0
    const pendientesSincronizar = pesajesEnProceso?.length || 0

    // Calcular monto facturado (simulado - en producción se calcularía con precios reales)
    const montoFacturadoMes = totalKilosMes * 2.5 // Precio simulado por kg

    return {
      data: {
        totalKilosHoy,
        totalKilosMes,
        embarcacionesActivas,
        pesajesHoy,
        montoFacturadoMes,
        pendientesSincronizar
      }
    }
  } catch (error) {
    console.error('Error obteniendo estadísticas del comprador:', error)
    return { data: null, error: 'Error obteniendo estadísticas' }
  }
}

// Obtener pesajes recientes del comprador
export async function obtenerPesajesRecientesComprador(limit = 5) {
  const supabase = createServerSupabaseClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (!user || userError) {
    return { data: [], error: 'No autenticado' }
  }

  // Obtener clienteId del usuario
  const { data: usuarioData, error: usuarioError } = await supabase
    .from('usuarios')
    .select('clienteId')
    .eq('id', user.id)
    .single()

  if (usuarioError || !usuarioData) {
    return { data: [], error: 'Usuario no encontrado' }
  }

  try {
    const { data: pesajes, error } = await supabase
      .from('pesajes')
      .select(`
        *,
        embarcaciones (
          nombre,
          matricula
        ),
        bins (
          codigo
        )
      `)
      .eq('clienteId', usuarioData.clienteId)
      .order('fecha', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error obteniendo pesajes recientes:', error)
      return { data: [], error: 'Error obteniendo pesajes recientes' }
    }

    return { data: pesajes || [] }
  } catch (error) {
    console.error('Error obteniendo pesajes recientes:', error)
    return { data: [], error: 'Error obteniendo pesajes recientes' }
  }
}

// Obtener embarcaciones activas del comprador
export async function obtenerEmbarcacionesActivasComprador() {
  const supabase = createServerSupabaseClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (!user || userError) {
    return { data: [], error: 'No autenticado' }
  }

  // Obtener clienteId del usuario
  const { data: usuarioData, error: usuarioError } = await supabase
    .from('usuarios')
    .select('clienteId')
    .eq('id', user.id)
    .single()

  if (usuarioError || !usuarioData) {
    return { data: [], error: 'Usuario no encontrado' }
  }

  try {
    const { data: embarcaciones, error } = await supabase
      .from('embarcaciones')
      .select('*')
      .eq('clienteId', usuarioData.clienteId)
      .eq('activo', true)
      .order('nombre', { ascending: true })

    if (error) {
      console.error('Error obteniendo embarcaciones activas:', error)
      return { data: [], error: 'Error obteniendo embarcaciones' }
    }

    return { data: embarcaciones || [] }
  } catch (error) {
    console.error('Error obteniendo embarcaciones activas:', error)
    return { data: [], error: 'Error obteniendo embarcaciones' }
  }
} 