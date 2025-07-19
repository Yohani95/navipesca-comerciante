import { supabase } from './supabase'
import type { Database } from './supabase'

type Embarcacion = Database['public']['Tables']['embarcaciones']['Row']
type EmbarcacionInsert = Database['public']['Tables']['embarcaciones']['Insert']
type EmbarcacionUpdate = Database['public']['Tables']['embarcaciones']['Update']

export interface EmbarcacionWithStats extends Embarcacion {
  totalPesajes: number
  totalKilos: number
  ultimoPesaje?: string
}

export class EmbarcacionesService {
  static async getEmbarcaciones(clienteId: string): Promise<EmbarcacionWithStats[]> {
    try {
      // Obtener embarcaciones con estadísticas
      const { data: embarcaciones, error } = await supabase
        .from('embarcaciones')
        .select('*')
        .eq('clienteId', clienteId)
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

      return embarcacionesConStats
    } catch (error) {
      console.error('Error fetching embarcaciones:', error)
      throw error
    }
  }

  static async getEmbarcacion(id: string): Promise<EmbarcacionWithStats | null> {
    try {
      const { data: embarcacion, error } = await supabase
        .from('embarcaciones')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error

      if (!embarcacion) return null

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
        ...embarcacion,
        totalPesajes,
        totalKilos,
        ultimoPesaje
      }
    } catch (error) {
      console.error('Error fetching embarcacion:', error)
      throw error
    }
  }

  static async createEmbarcacion(embarcacionData: Omit<EmbarcacionInsert, 'id' | 'createdAt' | 'updatedAt'>): Promise<Embarcacion> {
    try {
      const { data, error } = await supabase
        .from('embarcaciones')
        .insert({
          ...embarcacionData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating embarcacion:', error)
      throw error
    }
  }

  static async updateEmbarcacion(id: string, embarcacionData: Partial<EmbarcacionUpdate>): Promise<Embarcacion> {
    try {
      const { data, error } = await supabase
        .from('embarcaciones')
        .update({
          ...embarcacionData,
          updatedAt: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating embarcacion:', error)
      throw error
    }
  }

  static async deleteEmbarcacion(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('embarcaciones')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Error deleting embarcacion:', error)
      throw error
    }
  }

  static async getPesajesEmbarcacion(embarcacionId: string): Promise<any[]> {
    try {
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
      return data || []
    } catch (error) {
      console.error('Error fetching pesajes:', error)
      throw error
    }
  }
} 