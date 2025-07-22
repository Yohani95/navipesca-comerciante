"use client"

import { useState, useTransition, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, ArrowLeft, Save, X, Scale, Ship, Play, Square, Zap, CheckCircle, Clock, Edit, RefreshCw } from "lucide-react"
import Link from "next/link"
import { iniciarPesaje, agregarBinAlPesaje, registrarPesoBruto, cerrarPesaje, cambiarEstadoAPesaje, obtenerPesajesEnProceso } from '@/lib/actions/pesajes-actions'
import toast from 'react-hot-toast'
import { formatWeight, formatDateTime } from '@/lib/utils'

interface Embarcacion {
  id: string
  nombre: string
  matricula: string
  propietario: string
}

interface PesajeEnProceso {
  id: string
  embarcacionId: string
  embarcacionNombre: string
  estado: 'tara' | 'pesaje' | 'completado'
  bins_pesaje: BinPesaje[]
  fechaInicio: string
  fechaCierre?: string
  observaciones?: string
}

interface BinPesaje {
  id: string
  codigo: string
  tara: number
  pesoBruto?: number
  pesoNeto?: number
  estado: 'pendiente' | 'tara_completada' | 'pesaje_completado'
  observaciones?: string
}

export default function PesajeNuevoForm({ 
  embarcaciones, 
  pesajesEnProceso,
  pesajeIdPreseleccionado
}: { 
  embarcaciones: Embarcacion[]
  pesajesEnProceso: PesajeEnProceso[]
  pesajeIdPreseleccionado?: string | null
}) {
  const [selectedEmbarcacion, setSelectedEmbarcacion] = useState<string>("")
  const [codigoBin, setCodigoBin] = useState("")
  const [tara, setTara] = useState("")
  const [pesoBruto, setPesoBruto] = useState("")
  const [observacionesBin, setObservacionesBin] = useState("")
  const [observacionesPeso, setObservacionesPeso] = useState("")
  const [selectedBin, setSelectedBin] = useState<string>("")
  const [selectedPesaje, setSelectedPesaje] = useState<string>("")
  const [isSubmitting, startTransition] = useTransition()
  const [localPesajes, setLocalPesajes] = useState(pesajesEnProceso || [])
  const router = useRouter()

  // Sincronizar datos locales con props
  useEffect(() => {
    setLocalPesajes(pesajesEnProceso || [])
  }, [pesajesEnProceso])

  // Preseleccionar pesaje si se pasa un ID
  useEffect(() => {
    if (pesajeIdPreseleccionado && pesajesEnProceso.length > 0) {
      const pesajeEncontrado = pesajesEnProceso.find(p => p.id === pesajeIdPreseleccionado)
      if (pesajeEncontrado) {
        setSelectedPesaje(pesajeIdPreseleccionado)
        console.log('Pesaje preseleccionado:', pesajeEncontrado.embarcacionNombre)
      }
    }
  }, [pesajeIdPreseleccionado, pesajesEnProceso])

  // Función para recargar datos desde el servidor
  const recargarDatos = async () => {
    try {
      // Pequeño delay para asegurar que los cambios se hayan propagado
      await new Promise(resolve => setTimeout(resolve, 200))
      
      const pesajesResult = await obtenerPesajesEnProceso()
      if (pesajesResult?.data) {
        setLocalPesajes(pesajesResult.data)
      }
    } catch (error) {
      console.error('Error recargando datos:', error)
    }
  }

  // Validar que embarcaciones sea un array
  const embarcacionesArray = embarcaciones || []
  const localPesajesArray = localPesajes || []

  // Filtrar embarcaciones que no tienen pesaje en proceso
  const embarcacionesDisponibles = embarcacionesArray.filter(emb => 
    !localPesajesArray.some(pesaje => 
      pesaje.embarcacionId === emb.id && pesaje.estado !== 'completado'
    )
  )

  // Obtener pesaje seleccionado
  const pesajeActual = localPesajesArray.find(p => p.id === selectedPesaje)
  
  // Debug: mostrar datos
  console.log('Pesajes en proceso:', localPesajes)
  console.log('Pesaje seleccionado:', selectedPesaje)
  console.log('Pesaje actual:', pesajeActual)
  if (pesajeActual) {
    console.log('Bins del pesaje actual:', pesajeActual.bins_pesaje)
  }

  const handleIniciarPesaje = async () => {
    if (!selectedEmbarcacion) {
      toast.error('Selecciona una embarcación')
      return
    }

    startTransition(async () => {
      const result = await iniciarPesaje(selectedEmbarcacion)
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success('Pesaje iniciado correctamente')
        setSelectedEmbarcacion("")
        
        // Recargar datos desde el servidor
        await recargarDatos()
      }
    })
  }

  const handleAgregarBin = async (pesajeId: string) => {
    if (!codigoBin || !tara) {
      toast.error('Completa el código del bin y la tara')
      return
    }

    console.log('Intentando agregar bin:', { pesajeId, codigoBin, tara })

    startTransition(async () => {
      try {
        const result = await agregarBinAlPesaje(pesajeId, codigoBin, parseFloat(tara), observacionesBin)
        console.log('Resultado:', result)
        
        if (result?.error) {
          toast.error(result.error)
        } else {
          toast.success('Bin agregado correctamente')
          setCodigoBin("")
          setTara("")
          setObservacionesBin("")
          
          // Limpiar formulario
          setCodigoBin("")
          setTara("")
          setObservacionesBin("")
          
          // Recargar datos desde el servidor
          await recargarDatos()
        }
      } catch (error) {
        console.error('Error al agregar bin:', error)
        toast.error('Error inesperado al agregar bin')
      }
    })
  }

  const handleRegistrarPeso = async (pesajeId: string, binId: string) => {
    if (!pesoBruto) {
      toast.error('Ingresa el peso bruto')
      return
    }

    startTransition(async () => {
      const result = await registrarPesoBruto(pesajeId, binId, parseFloat(pesoBruto), observacionesPeso)
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success('Peso registrado correctamente')
        setPesoBruto("")
        setObservacionesPeso("")
        
        // Limpiar formulario
        setPesoBruto("")
        setObservacionesPeso("")
        
        // Recargar datos desde el servidor
        await recargarDatos()
      }
    })
  }

  const handleCerrarPesaje = async (pesajeId: string) => {
    startTransition(async () => {
      const result = await cerrarPesaje(pesajeId)
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success('Pesaje cerrado correctamente')
        
        // Limpiar selección si el pesaje cerrado era el seleccionado
        if (selectedPesaje === pesajeId) {
          setSelectedPesaje("")
        }
        
        // Recargar datos desde el servidor
        await recargarDatos()
      }
    })
  }

  const handleCambiarAPesaje = async (pesajeId: string) => {
    startTransition(async () => {
      const result = await cambiarEstadoAPesaje(pesajeId)
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success('Pesaje listo para pesar')
        
        // Recargar datos desde el servidor
        await recargarDatos()
      }
    })
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'tara':
        return 'text-warning-600 bg-warning-50 dark:bg-warning-900/20'
      case 'pesaje':
        return 'text-aqua-600 bg-aqua-50 dark:bg-aqua-900/20'
      case 'completado':
        return 'text-success-600 bg-success-50 dark:bg-success-900/20'
      default:
        return 'text-muted-foreground bg-muted'
    }
  }

  const getEstadoText = (estado: string) => {
    switch (estado) {
      case 'tara':
        return 'En Tara'
      case 'pesaje':
        return 'En Pesaje'
      case 'completado':
        return 'Completado'
      default:
        return estado
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/pesador">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Gestión de Pesajes</h1>
            <p className="text-muted-foreground">
              Maneja múltiples embarcaciones en paralelo
            </p>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={recargarDatos}
          disabled={isSubmitting}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Recargar
        </Button>
      </div>

      {/* Iniciar Nuevo Pesaje */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Iniciar Nuevo Pesaje
          </CardTitle>
          <CardDescription>
            Selecciona una embarcación para comenzar un nuevo pesaje
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Embarcación</label>
              <Select value={selectedEmbarcacion} onValueChange={setSelectedEmbarcacion}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una embarcación" />
                </SelectTrigger>
                <SelectContent>
                  {embarcacionesDisponibles.map(emb => (
                    <SelectItem key={emb.id} value={emb.id}>
                      {emb.nombre} - {emb.matricula}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={handleIniciarPesaje}
              disabled={!selectedEmbarcacion || isSubmitting}
              loading={isSubmitting}
            >
              <Play className="h-4 w-4 mr-2" />
              Iniciar Pesaje
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Seleccionar Pesaje en Proceso */}
      {(localPesajes || []).length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Seleccionar Pesaje en Proceso
            </CardTitle>
            <CardDescription>
              Selecciona un pesaje para agregar bins o registrar pesos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {localPesajes.map((pesaje) => (
                <div 
                  key={pesaje.id} 
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedPesaje === pesaje.id 
                      ? 'border-aqua-500 bg-aqua-50 dark:bg-aqua-900/20' 
                      : 'hover:border-muted-foreground'
                  }`}
                  onClick={() => setSelectedPesaje(pesaje.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Ship className="h-6 w-6 text-blue-600" />
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(pesaje.estado)}`}>
                      {getEstadoText(pesaje.estado)}
                    </span>
                  </div>
                  <h3 className="font-semibold">{pesaje.embarcacionNombre}</h3>
                  <p className="text-sm text-muted-foreground">
                    {pesaje.bins_pesaje?.length || 0} bins • {formatDateTime(pesaje.fechaInicio)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Gestión del Pesaje Seleccionado */}
      {pesajeActual && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ship className="h-5 w-5" />
              {pesajeActual.embarcacionNombre}
            </CardTitle>
            <CardDescription>
                                Estado: {getEstadoText(pesajeActual.estado)} • {pesajeActual.bins_pesaje?.length || 0} bins registrados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Agregar Bin */}
              {(pesajeActual.estado === 'tara' || pesajeActual.estado === 'pesaje') && (
                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-medium mb-3">Agregar Bin</h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Código Bin</label>
                        <Input
                        placeholder="Ej: BIN001"
                        value={codigoBin}
                        onChange={(e) => setCodigoBin(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Tara (kg)</label>
                        <Input
                          type="number"
                          placeholder="Ej: 12.5"
                        value={tara}
                        onChange={(e) => setTara(e.target.value)}
                          min={0}
                          step={0.01}
                        />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Observaciones</label>
                      <Input
                        placeholder="Opcional"
                        value={observacionesBin}
                        onChange={(e) => setObservacionesBin(e.target.value)}
                      />
                    </div>
                    <div className="flex items-end">
                      <Button
                        onClick={() => handleAgregarBin(pesajeActual.id)}
                        disabled={!codigoBin || !tara || isSubmitting}
                        loading={isSubmitting}
                        className="w-full"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar Bin
                      </Button>
                    </div>
                  </div>
                  
                  {/* Botón para cambiar a estado pesaje */}
                  {pesajeActual.bins_pesaje && pesajeActual.bins_pesaje.length > 0 && pesajeActual.estado === 'tara' && (
                    <div className="mt-4">
                      <Button
                        onClick={() => handleCambiarAPesaje(pesajeActual.id)}
                        disabled={isSubmitting}
                        loading={isSubmitting}
                        variant="aqua"
                        className="w-full"
                      >
                        <Scale className="h-4 w-4 mr-2" />
                        Comenzar Pesaje
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Registrar Peso */}
              {pesajeActual.estado === 'pesaje' && (
                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-medium mb-3">Registrar Peso</h4>
                  
                  {/* Seleccionar Bin */}
                  <div className="mb-4">
                    <label className="text-sm font-medium mb-2 block">Seleccionar Bin</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {pesajeActual.bins_pesaje?.filter(bin => bin.estado === 'tara_completada').map((bin) => (
                        <Button
                          key={bin.id}
                          variant="outline"
                          onClick={() => {
                            setPesoBruto("")
                            setObservacionesPeso("")
                            setSelectedBin(bin.id)
                          }}
                          className={`justify-start ${selectedBin === bin.id ? 'border-aqua-500 bg-aqua-50' : ''}`}
                        >
                          <div className="text-left">
                            <div className="font-medium">Bin {bin.codigo}</div>
                            <div className="text-sm text-muted-foreground">Tara: {formatWeight(bin.tara)}</div>
                          </div>
                        </Button>
                      ))}
                    </div>
                    {pesajeActual.bins_pesaje?.filter(bin => bin.estado === 'tara_completada').length === 0 && (
                      <p className="text-sm text-muted-foreground">No hay bins pendientes de pesaje</p>
                    )}
                  </div>

                  {/* Formulario de Peso */}
                  {selectedBin && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">Peso Bruto (kg)</label>
                        <Input
                          type="number"
                          placeholder="Ej: 320.5"
                          value={pesoBruto}
                          onChange={(e) => setPesoBruto(e.target.value)}
                          min={0}
                          step={0.01}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Observaciones</label>
                        <Input
                          placeholder="Opcional"
                          value={observacionesPeso}
                          onChange={(e) => setObservacionesPeso(e.target.value)}
                        />
                      </div>
                      <div className="flex items-end">
                        <Button
                          onClick={() => handleRegistrarPeso(pesajeActual.id, selectedBin)}
                          disabled={!pesoBruto || isSubmitting}
                          loading={isSubmitting}
                          className="w-full"
                        >
                          <Scale className="h-4 w-4 mr-2" />
                          Registrar Peso
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Bins del pesaje */}
              <div>
                <h4 className="font-medium mb-3">Bins Registrados</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {pesajeActual.bins_pesaje?.map((bin) => (
                    <div key={bin.id} className="bg-muted/50 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Bin {bin.codigo}</p>
                          <p className="text-sm text-muted-foreground">
                            Tara: {formatWeight(bin.tara)}
                          </p>
                          {bin.pesoBruto && (
                            <p className="text-sm text-muted-foreground">
                              Bruto: {formatWeight(bin.pesoBruto)}
                            </p>
                          )}
                          {bin.pesoNeto && (
                            <p className="text-sm font-medium text-aqua-600">
                              Neto: {formatWeight(bin.pesoNeto)}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          {bin.estado === 'tara_completada' && (
                            <CheckCircle className="h-4 w-4 text-warning-600" />
                          )}
                          {bin.estado === 'pesaje_completado' && (
                            <CheckCircle className="h-4 w-4 text-aqua-600" />
                          )}
                          {bin.estado === 'pendiente' && (
                            <Clock className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
            </div>

              {/* Cerrar Pesaje */}
              {pesajeActual.estado === 'pesaje' && (
                <div className="flex justify-end">
                  <Button
                    onClick={() => handleCerrarPesaje(pesajeActual.id)}
                    disabled={isSubmitting}
                    loading={isSubmitting}
                    variant="aqua"
                  >
                    <Square className="h-4 w-4 mr-2" />
                    Cerrar Pesaje
              </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mensaje cuando no hay pesajes */}
      {(localPesajes || []).length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Ship className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">No hay pesajes en proceso</p>
            <p className="text-sm text-muted-foreground">Inicia un nuevo pesaje para comenzar</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 