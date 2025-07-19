import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { createClient } from '@supabase/supabase-js'

// Supabase configuration - verificar que las variables estén definidas
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Verificar que las variables de entorno estén configuradas
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.')
}

// Client-side Supabase instance con configuración mejorada
export const supabase = createClientComponentClient({
  supabaseUrl,
  supabaseKey: supabaseAnonKey
})

// Service role client for admin operations
export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Database types
export type Database = {
  public: {
    Tables: {
      clientes: {
        Row: {
          id: string
          nombre: string
          email: string
          telefono: string | null
          direccion: string | null
          fechaRegistro: string
          fechaVencimiento: string
          estadoSuscripcion: string
          tarifaPorKilo: number
          activo: boolean
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id?: string
          nombre: string
          email: string
          telefono?: string | null
          direccion?: string | null
          fechaRegistro?: string
          fechaVencimiento: string
          estadoSuscripcion?: string
          tarifaPorKilo?: number
          activo?: boolean
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: string
          nombre?: string
          email?: string
          telefono?: string | null
          direccion?: string | null
          fechaRegistro?: string
          fechaVencimiento?: string
          estadoSuscripcion?: string
          tarifaPorKilo?: number
          activo?: boolean
          createdAt?: string
          updatedAt?: string
        }
      }
      usuarios: {
        Row: {
          id: string
          email: string
          nombre: string
          apellido: string
          rol: string
          clienteId: string
          activo: boolean
          createdAt: string
          updatedAt: string
          lastLogin: string | null
        }
        Insert: {
          id?: string
          email: string
          nombre: string
          apellido: string
          rol: string
          clienteId: string
          activo?: boolean
          createdAt?: string
          updatedAt?: string
          lastLogin?: string | null
        }
        Update: {
          id?: string
          email?: string
          nombre?: string
          apellido?: string
          rol?: string
          clienteId?: string
          activo?: boolean
          createdAt?: string
          updatedAt?: string
          lastLogin?: string | null
        }
      }
      embarcaciones: {
        Row: {
          id: string
          nombre: string
          matricula: string
          propietario: string
          telefono: string | null
          observaciones: string | null
          clienteId: string
          activa: boolean
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id?: string
          nombre: string
          matricula: string
          propietario: string
          telefono?: string | null
          observaciones?: string | null
          clienteId: string
          activa?: boolean
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: string
          nombre?: string
          matricula?: string
          propietario?: string
          telefono?: string | null
          observaciones?: string | null
          clienteId?: string
          activa?: boolean
          createdAt?: string
          updatedAt?: string
        }
      }
      bins: {
        Row: {
          id: string
          codigo: string
          tara: number
          capacidad: number | null
          clienteId: string
          activo: boolean
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id?: string
          codigo: string
          tara: number
          capacidad?: number | null
          clienteId: string
          activo?: boolean
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: string
          codigo?: string
          tara?: number
          capacidad?: number | null
          clienteId?: string
          activo?: boolean
          createdAt?: string
          updatedAt?: string
        }
      }
      pesajes: {
        Row: {
          id: string
          embarcacionId: string
          binId: string
          usuarioId: string
          clienteId: string
          pesoBruto: number
          pesoNeto: number
          fecha: string
          observaciones: string | null
          estado: string
          sincronizado: boolean
          fechaSinc: string | null
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id?: string
          embarcacionId: string
          binId: string
          usuarioId: string
          clienteId: string
          pesoBruto: number
          pesoNeto: number
          fecha?: string
          observaciones?: string | null
          estado?: string
          sincronizado?: boolean
          fechaSinc?: string | null
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: string
          embarcacionId?: string
          binId?: string
          usuarioId?: string
          clienteId?: string
          pesoBruto?: number
          pesoNeto?: number
          fecha?: string
          observaciones?: string | null
          estado?: string
          sincronizado?: boolean
          fechaSinc?: string | null
          createdAt?: string
          updatedAt?: string
        }
      }
      pagos: {
        Row: {
          id: string
          clienteId: string
          monto: number
          fecha: string
          concepto: string
          metodoPago: string | null
          referencia: string | null
          observaciones: string | null
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id?: string
          clienteId: string
          monto: number
          fecha?: string
          concepto: string
          metodoPago?: string | null
          referencia?: string | null
          observaciones?: string | null
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: string
          clienteId?: string
          monto?: number
          fecha?: string
          concepto?: string
          metodoPago?: string | null
          referencia?: string | null
          observaciones?: string | null
          createdAt?: string
          updatedAt?: string
        }
      }
      cobros_mensuales: {
        Row: {
          id: string
          clienteId: string
          año: number
          mes: number
          totalKilos: number
          precioPorKilo: number
          montoTotal: number
          estado: string
          fechaGenerado: string
          fechaVencimiento: string
          fechaPago: string | null
          observaciones: string | null
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id?: string
          clienteId: string
          año: number
          mes: number
          totalKilos?: number
          precioPorKilo: number
          montoTotal: number
          estado?: string
          fechaGenerado?: string
          fechaVencimiento: string
          fechaPago?: string | null
          observaciones?: string | null
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: string
          clienteId?: string
          año?: number
          mes?: number
          totalKilos?: number
          precioPorKilo?: number
          montoTotal?: number
          estado?: string
          fechaGenerado?: string
          fechaVencimiento?: string
          fechaPago?: string | null
          observaciones?: string | null
          createdAt?: string
          updatedAt?: string
        }
      }
    }
  }
}