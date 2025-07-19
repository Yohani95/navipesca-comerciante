import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Ship,
  ArrowLeft,
  Edit,
  Trash2,
  Calendar,
  Scale,
  TrendingUp,
  Activity,
  AlertTriangle
} from 'lucide-react'
import Link from 'next/link'
import { formatDate, formatWeight } from '@/lib/utils'
import { getEmbarcacion, getPesajesEmbarcacion } from '@/lib/actions/embarcaciones-actions'

interface PageProps {
  params: {
    id: string
  }
}

export default async function EmbarcacionDetallePage({ params }: PageProps) {
  const embarcacionId = params.id

  // Cargar datos en el servidor
  const { data: embarcacion, error: embarcacionError } = await getEmbarcacion(embarcacionId)
  const { data: pesajes, error: pesajesError } = await getPesajesEmbarcacion(embarcacionId)

  if (embarcacionError || !embarcacion) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-warning-600" />
          <h3 className="text-lg font-semibold mb-2">Embarcación no encontrada</h3>
          <p className="text-muted-foreground mb-4">
            La embarcación que buscas no existe o ha sido eliminada.
          </p>
          <Button asChild>
            <Link href="/dashboard/comprador/embarcaciones">
              Volver a la lista
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  // Transformar pesajes si existen
  const pesajesTransformados = (pesajes || []).map((pesaje: any) => ({
    id: pesaje.id,
    pesoBruto: pesaje.pesoBruto,
    pesoNeto: pesaje.pesoNeto,
    fecha: pesaje.fecha,
    observaciones: pesaje.observaciones,
    estado: pesaje.estado,
    sincronizado: pesaje.sincronizado,
    bins: {
      codigo: pesaje.bins?.codigo || 'N/A'
    }
  }))

  const getEstadoColor = (activa: boolean) => {
    return activa 
      ? 'bg-aqua-100 text-aqua-700 dark:bg-aqua-900/20 dark:text-aqua-300'
      : 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300'
  }

  const getEstadoText = (activa: boolean) => {
    return activa ? 'Activa' : 'Inactiva'
  }

  const getPesajeStatusIcon = (sincronizado: boolean) => {
    return sincronizado 
      ? <Scale className="h-4 w-4 text-aqua-600" />
      : <Calendar className="h-4 w-4 text-warning-600" />
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/comprador/embarcaciones">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{embarcacion.nombre}</h1>
            <p className="text-muted-foreground">
              {embarcacion.matricula}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/comprador/embarcaciones/${embarcacion.id}/editar`}>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Link>
          </Button>
          <Button variant="outline" className="text-destructive hover:text-destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            Eliminar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información Principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Scale className="h-5 w-5 text-aqua-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Pesajes</p>
                    <p className="text-2xl font-bold">{embarcacion.totalPesajes}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-navy-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Kilos</p>
                    <p className="text-2xl font-bold">{formatWeight(embarcacion.totalKilos)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Fecha Registro</p>
                    <p className="text-2xl font-bold">{new Date(embarcacion.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Último Pesaje</p>
                    <p className="text-2xl font-bold">
                      {embarcacion.ultimoPesaje 
                        ? new Date(embarcacion.ultimoPesaje).toLocaleDateString()
                        : 'N/A'
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Información Detallada */}
          <Card>
            <CardHeader>
              <CardTitle>Información de la Embarcación</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Nombre</p>
                  <p className="font-semibold">{embarcacion.nombre}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Matrícula</p>
                  <p className="font-semibold">{embarcacion.matricula}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Propietario</p>
                  <p className="font-semibold">{embarcacion.propietario}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Estado</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(embarcacion.activa)}`}>
                    {getEstadoText(embarcacion.activa)}
                  </span>
                </div>
              </div>
              
              {embarcacion.observaciones && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Observaciones</p>
                  <p className="text-sm">{embarcacion.observaciones}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pesajes Recientes */}
          <Card>
            <CardHeader>
              <CardTitle>Pesajes Recientes</CardTitle>
              <CardDescription>
                Últimos registros de pesaje de esta embarcación
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pesajesTransformados.map((pesaje) => (
                  <div key={pesaje.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getPesajeStatusIcon(pesaje.sincronizado)}
                      <div>
                        <p className="font-medium">{formatDate(pesaje.fecha)}</p>
                        <p className="text-sm text-muted-foreground">
                          Bin: {pesaje.bins?.codigo || 'N/A'}
                          {pesaje.observaciones && ` • ${pesaje.observaciones}`}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatWeight(pesaje.pesoNeto)}</p>
                      <p className="text-xs text-muted-foreground">
                        {pesaje.sincronizado ? 'Sincronizado' : 'Pendiente'}
                      </p>
                    </div>
                  </div>
                ))}

                {pesajesTransformados.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Scale className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No hay pesajes registrados para esta embarcación</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Información del Propietario */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Propietario
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Nombre</p>
                <p className="font-semibold">{embarcacion.propietario}</p>
              </div>
              
              {embarcacion.telefono && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Teléfono</p>
                  <p className="font-semibold">{embarcacion.telefono}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Acciones Rápidas */}
          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="aqua" className="w-full" asChild>
                <Link href="/dashboard/comprador/pesajes/nuevo">
                  <Scale className="h-4 w-4 mr-2" />
                  Nuevo Pesaje
                </Link>
              </Button>
              
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/dashboard/comprador/embarcaciones/${embarcacion.id}/editar`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar Embarcación
                </Link>
              </Button>
              
              <Button variant="outline" className="w-full text-destructive hover:text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar Embarcación
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 