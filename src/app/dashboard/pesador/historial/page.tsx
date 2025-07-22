import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { 
  Ship, 
  Scale, 
  Package, 
  Calendar,
  Search,
  Filter,
  Download,
  ArrowLeft,
  Eye,
  FileText,
  TrendingUp,
  Clock
} from 'lucide-react'
import Link from 'next/link'
import { formatWeight, formatDateTime } from '@/lib/utils'
import { obtenerHistorialPesajes } from '@/lib/actions/pesajes-actions'

export default async function HistorialPesadorPage() {
  // Obtener historial de pesajes
  const historialResult = await obtenerHistorialPesajes()
  const historial = historialResult?.data || []

  // Calcular estadísticas
  const totalPesajes = historial.length
  const totalKilos = historial.reduce((total: number, pesaje: any) => total + (pesaje.totalKilos || 0), 0)
  const pesajesEsteMes = historial.filter((pesaje: any) => {
    const fecha = new Date(pesaje.fechaCierre || pesaje.fechaInicio)
    const ahora = new Date()
    return fecha.getMonth() === ahora.getMonth() && fecha.getFullYear() === ahora.getFullYear()
  }).length

  return (
    <div className="max-w-7xl mx-auto p-6">
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
            <h1 className="text-xl sm:text-2xl font-bold">Historial de Pesajes</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Todos los pesajes completados</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="text-xs sm:text-sm">
            <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Exportar</span>
          </Button>
          <Button variant="outline" size="sm" className="text-xs sm:text-sm">
            <FileText className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Reporte</span>
          </Button>
        </div>
      </div>

      {/* Estadísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Pesajes</p>
                <p className="text-2xl font-bold">{totalPesajes}</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Kilos</p>
                <p className="text-2xl font-bold">{formatWeight(totalKilos)}</p>
              </div>
              <Scale className="h-8 w-8 text-aqua-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Este Mes</p>
                <p className="text-2xl font-bold">{pesajesEsteMes}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros y Búsqueda */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por embarcación..."
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Fecha
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Pesajes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Pesajes Completados
          </CardTitle>
          <CardDescription>
            {totalPesajes} pesajes encontrados • Total: {formatWeight(totalKilos)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {historial.length > 0 ? (
              historial.map((pesaje: any) => (
                <div key={pesaje.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <Ship className="h-8 w-8 text-blue-600" />
                      <div>
                        <h3 className="font-semibold text-lg">{pesaje.embarcacionNombre}</h3>
                        <p className="text-sm text-muted-foreground">
                          Completado: {formatDateTime(pesaje.fechaCierre || pesaje.fechaInicio)}
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-sm text-muted-foreground">
                            {pesaje.totalBins || 0} bins
                          </span>
                          <span className="text-sm font-medium text-aqua-600">
                            {formatWeight(pesaje.totalKilos || 0)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/dashboard/pesador/pesaje/${pesaje.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Detalles
                        </Link>
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        PDF
                      </Button>
                    </div>
                  </div>

                  {/* Bins del pesaje (vista resumida) */}
                  {pesaje.bins && pesaje.bins.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {pesaje.bins.slice(0, 3).map((bin: any) => (
                          <div key={bin.id} className="bg-muted/50 rounded p-2 text-xs">
                            <div className="flex justify-between">
                              <span className="font-medium">Bin {bin.codigo}</span>
                              <span className="text-aqua-600">{formatWeight(bin.pesoNeto || 0)}</span>
                            </div>
                          </div>
                        ))}
                        {pesaje.bins.length > 3 && (
                          <div className="bg-muted/50 rounded p-2 text-xs flex items-center justify-center">
                            <span className="text-muted-foreground">
                              +{pesaje.bins.length - 3} más
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No hay pesajes completados</p>
                <p className="text-sm">Los pesajes aparecerán aquí una vez completados</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 