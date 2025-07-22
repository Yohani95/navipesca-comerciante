import { getEmbarcaciones } from '@/lib/actions/embarcaciones-actions'
import { obtenerPesajesEnProceso } from '@/lib/actions/pesajes-actions'
import PesajeNuevoForm from '@/app/dashboard/pesador/pesaje-nuevo/pesaje-nuevo-form'

export default async function PesajeNuevoCompradorPage() {
  // Obtener embarcaciones activas reales desde Supabase
  const { data: embarcaciones, error } = await getEmbarcaciones()
  // Obtener pesajes en proceso
  const pesajesResult = await obtenerPesajesEnProceso()
  const pesajesEnProceso = pesajesResult?.data || []

  if (error || !embarcaciones) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <p className="text-destructive font-semibold">No se pudieron cargar las embarcaciones. Intenta nuevamente.</p>
      </div>
    )
  }

  return <PesajeNuevoForm embarcaciones={embarcaciones} pesajesEnProceso={pesajesEnProceso} />
} 