'use client'

// Wrapper functions to call Server Actions from client components
import { obtenerEstadisticasPesador, obtenerPesajesEnProceso, iniciarPesaje, cerrarPesaje, cambiarEstadoAPesaje } from '@/lib/actions/pesajes-actions'

// Wrapper for pesador dashboard
export const getPesadorStats = async () => {
  return await obtenerEstadisticasPesador()
}

export const getPesajesEnProceso = async () => {
  return await obtenerPesajesEnProceso()
}

export const startPesaje = async (embarcacionId: string) => {
  return await iniciarPesaje(embarcacionId)
}

export const closePesaje = async (pesajeId: string) => {
  return await cerrarPesaje(pesajeId)
}

export const changePesajeState = async (pesajeId: string) => {
  return await cambiarEstadoAPesaje(pesajeId)
} 