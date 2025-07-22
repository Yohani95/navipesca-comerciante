export interface Cliente {
  id: string
  nombre: string
  email: string
  telefono?: string
  direccion?: string
  fechaRegistro: string
  fechaVencimiento: string
  estadoSuscripcion: 'prueba' | 'activo' | 'suspendido' | 'cancelado'
  tarifaPorKilo: number
  activo: boolean
  createdAt: string
  updatedAt: string
}

export interface Usuario {
  id: string
  email: string
  nombre: string
  apellido: string
  rol: 'comprador' | 'pesador' | 'admin'
  clienteId: string
  activo: boolean
  createdAt: string
  updatedAt: string
  lastLogin?: string
}

export interface Embarcacion {
  id: string
  nombre: string
  matricula: string
  propietario: string
  telefono?: string
  observaciones?: string
  clienteId: string
  activa: boolean
  createdAt: string
  updatedAt: string
}

export interface Bin {
  id: string
  codigo: string
  tara: number
  capacidad?: number
  clienteId: string
  activo: boolean
  createdAt: string
  updatedAt: string
}

export interface Pesaje {
  id: string
  embarcacionId: string
  binId: string
  usuarioId: string
  clienteId: string
  pesoBruto: number
  pesoNeto: number
  fecha: string
  observaciones?: string
  estado: 'pendiente' | 'sincronizado' | 'error'
  sincronizado: boolean
  fechaSinc?: string
  createdAt: string
  updatedAt: string
  
  // Relations
  embarcacion?: Embarcacion
  bin?: Bin
  usuario?: Usuario
}

export interface Pago {
  id: string
  clienteId: string
  monto: number
  fecha: string
  concepto: string
  metodoPago?: 'efectivo' | 'transferencia' | 'cheque'
  referencia?: string
  observaciones?: string
  createdAt: string
  updatedAt: string
}

export interface CobroMensual {
  id: string
  clienteId: string
  año: number
  mes: number
  totalKilos: number
  precioPorKilo: number
  montoTotal: number
  estado: 'pendiente' | 'pagado' | 'vencido'
  fechaGenerado: string
  fechaVencimiento: string
  fechaPago?: string
  observaciones?: string
  createdAt: string
  updatedAt: string
}

// Form types
export interface PesajeForm {
  embarcacionId: string
  bins: {
    binId: string
    pesoBruto: number
  }[]
  observaciones?: string
}

export interface EmbarcacionForm {
  nombre: string
  matricula: string
  propietario: string
  telefono?: string
  observaciones?: string
}

export interface BinForm {
  codigo: string
  tara: number
  capacidad?: number
}

export interface PagoForm {
  monto: number
  fecha: string
  concepto: string
  metodoPago?: string
  referencia?: string
  observaciones?: string
}

// API Response types
export interface ApiResponse<T> {
  data?: T
  error?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Dashboard stats
export interface DashboardStats {
  totalKilosHoy: number
  totalKilosMes: number
  embarcacionesActivas: number
  pesajesHoy: number
  montoFacturadoMes: number
  pendientesSincronizar: number
}

export interface PesadorStats {
  pesajesHoy: number
  kilosHoy: number
  pendientesSinc: number
  erroresSinc: number
  ultimoPesaje?: string
}

export interface AdminStats {
  totalClientes: number
  clientesActivos: number
  ingresosMes: number
  kilosTotalesMes: number
  clientesVencidos: number
}

// Sync types
export interface SyncStatus {
  isOnline: boolean
  lastSync?: string
  pendingRecords: number
  errorRecords: number
}

export interface OfflineRecord {
  id: string
  type: 'pesaje' | 'embarcacion' | 'bin' | 'pago'
  data: any
  timestamp: string
  retries: number
}

// Filter types
export interface PesajeFilters {
  embarcacionId?: string
  estado?: string
  fechaInicio?: string
  fechaFin?: string
  usuarioId?: string
}

export interface ReportFilters {
  fechaInicio: string
  fechaFin: string
  embarcacionId?: string
  incluirPagos?: boolean
  formato: 'pdf' | 'csv'
}

// Tipos para el flujo real de pesaje
export interface PesajeEnProceso {
  id: string
  embarcacionId: string
  embarcacionNombre: string
  estado: 'tara' | 'pesaje' | 'completado'
  bins: BinPesaje[]
  fechaInicio: string
  fechaCierre?: string
  observaciones?: string
}

export interface BinPesaje {
  id: string
  codigo: string
  tara: number
  pesoBruto?: number
  pesoNeto?: number
  estado: 'pendiente' | 'tara_completada' | 'pesaje_completado'
  observaciones?: string
}

export interface EmbarcacionPesaje {
  id: string
  nombre: string
  matricula: string
  propietario: string
  pesajeEnProceso?: PesajeEnProceso
}

export interface PesajeStats {
  embarcacionesActivas: number
  binsPendientes: number
  kilosHoy: number
  ultimoPesaje: string | null
}