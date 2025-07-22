import { obtenerPesajeEnProceso } from '@/lib/actions/pesajes-actions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { 
  Ship, 
  Scale, 
  Package, 
  Clock, 
  CheckCircle, 
  ArrowLeft,
  Edit,
  Trash2,
  Download,
  Share
} from 'lucide-react'
import Link from 'next/link'
import { formatWeight, formatDateTime } from '@/lib/utils'
import { notFound } from 'next/navigation'

interface PageProps {
  params: {
    id: string
  }
}

export default async function PesajeDetallePage({ params }: PageProps) {
  const { id } = params
  
  // Obtener detalles del pesaje
  const pesajeResult = await obtenerPesajeEnProceso(id)
  
  if (!pesajeResult.data) {
    notFound()
  }

  const pesaje = pesajeResult.data

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

  const getBinEstadoColor = (estado: string) => {
    switch (estado) {
      case 'tara_completada':
        return 'text-warning-600'
      case 'pesaje_completado':
        return 'text-aqua-600'
      case 'pendiente':
        return 'text-muted-foreground'
      default:
        return 'text-muted-foreground'
    }
  }

  const getBinEstadoText = (estado: string) => {
    switch (estado) {
      case 'tara_completada':
        return 'Tara Completada'
      case 'pesaje_completado':
        return 'Pesaje Completado'
      case 'pendiente':
        return 'Pendiente'
      default:
        return estado
    }
  }

  // Calcular totales
  const totalBins = pesaje.bins_pesaje?.length || 0
  const binsCompletados = pesaje.bins_pesaje?.filter((bin: any) => bin.estado === 'pesaje_completado').length || 0
  const binsPendientes = totalBins - binsCompletados
  const totalKilos = pesaje.bins_pesaje?.reduce((total: number, bin: any) => total + (bin.pesoNeto || 0), 0) || 0

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/pesador">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Link>
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">Detalles del Pesaje</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Información completa del pesaje</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="text-xs sm:text-sm">
            <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Editar</span>
          </Button>
          <Button variant="outline" size="sm" className="text-xs sm:text-sm">
            <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Exportar</span>
          </Button>
          <Button variant="outline" size="sm" className="text-xs sm:text-sm">
            <Share className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Compartir</span>
          </Button>
        </div>
      </div>

      {/* Información Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Detalles del Pesaje */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ship className="h-5 w-5" />
              {pesaje.embarcacionNombre}
            </CardTitle>
            <CardDescription>
              Pesaje iniciado el {formatDateTime(pesaje.fechaInicio)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Estado</p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-1 ${getEstadoColor(pesaje.estado)}`}>
                  {getEstadoText(pesaje.estado)}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Kilos</p>
                <p className="text-lg font-semibold">{formatWeight(totalKilos)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Bins Completados</p>
                <p className="text-lg font-semibold">{binsCompletados} de {totalBins}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Bins Pendientes</p>
                <p className="text-lg font-semibold text-warning-600">{binsPendientes}</p>
              </div>
            </div>
            
            {pesaje.observaciones && (
              <div className="mt-4">
                <p className="text-sm font-medium text-muted-foreground">Observaciones</p>
                <p className="text-sm mt-1">{pesaje.observaciones}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Estadísticas Rápidas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5" />
              Estadísticas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Total Bins</span>
                </div>
                <span className="font-semibold">{totalBins}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-aqua-600" />
                  <span className="text-sm">Completados</span>
                </div>
                <span className="font-semibold text-aqua-600">{binsCompletados}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-warning-600" />
                  <span className="text-sm">Pendientes</span>
                </div>
                <span className="font-semibold text-warning-600">{binsPendientes}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Scale className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Total Kilos</span>
                </div>
                <span className="font-semibold">{formatWeight(totalKilos)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Bins */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Bins del Pesaje
          </CardTitle>
          <CardDescription>
            {totalBins} bins registrados • {binsCompletados} completados • {binsPendientes} pendientes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pesaje.bins_pesaje?.map((bin: any) => (
              <div key={bin.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">Bin {bin.codigo}</h3>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${getBinEstadoColor(bin.estado)}`}>
                      {getBinEstadoText(bin.estado)}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline">
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Tara:</span>
                    <span className="text-sm font-medium">{formatWeight(bin.tara)}</span>
                  </div>
                  
                  {bin.pesoBruto && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Peso Bruto:</span>
                      <span className="text-sm font-medium">{formatWeight(bin.pesoBruto)}</span>
                    </div>
                  )}
                  
                  {bin.pesoNeto && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Peso Neto:</span>
                      <span className="text-sm font-medium text-aqua-600">{formatWeight(bin.pesoNeto)}</span>
                    </div>
                  )}
                  
                  {bin.observaciones && (
                    <div className="pt-2 border-t">
                      <p className="text-xs text-muted-foreground">{bin.observaciones}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {(!pesaje.bins_pesaje || pesaje.bins_pesaje.length === 0) && (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay bins registrados en este pesaje</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 