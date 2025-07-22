'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { getEmbarcaciones } from '@/lib/actions/embarcaciones-actions'
import { obtenerPesajesEnProceso } from '@/lib/actions/pesajes-actions'
import PesajeNuevoForm from './pesaje-nuevo-form'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export default function PesajeNuevoPage() {
  const [embarcaciones, setEmbarcaciones] = useState<any[]>([])
  const [pesajesEnProceso, setPesajesEnProceso] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const pesajeIdFromUrl = searchParams.get('pesajeId')

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        
        // Obtener embarcaciones activas reales desde Supabase
        const { data: embarcacionesData, error: embarcacionesError } = await getEmbarcaciones()

        // Obtener pesajes en proceso
        const pesajesResult = await obtenerPesajesEnProceso()
        const pesajesEnProcesoData = pesajesResult?.data || []

        if (embarcacionesError || !embarcacionesData) {
          setError('No se pudieron cargar las embarcaciones. Intenta nuevamente.')
          return
        }

        setEmbarcaciones(embarcacionesData || [])
        setPesajesEnProceso(pesajesEnProcesoData || [])
      } catch (error: any) {
        console.error('Error en PesajeNuevoPage:', error)
        setError('Error al cargar la página. Intenta nuevamente.')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <p className="text-destructive font-semibold">{error}</p>
      </div>
    )
  }

  return (
    <PesajeNuevoForm 
      embarcaciones={embarcaciones} 
      pesajesEnProceso={pesajesEnProceso} 
      pesajeIdPreseleccionado={pesajeIdFromUrl}
    />
  )
} 