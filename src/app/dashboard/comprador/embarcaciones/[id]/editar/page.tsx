import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { 
  Ship,
  ArrowLeft,
  Save,
  X,
  AlertTriangle
} from 'lucide-react'
import Link from 'next/link'
import { getEmbarcacion } from '@/lib/actions/embarcaciones-actions'
import { updateEmbarcacion } from '@/lib/actions/embarcaciones-actions'

interface PageProps {
  params: {
    id: string
  }
}

export default async function EditarEmbarcacionPage({ params }: PageProps) {
  const embarcacionId = params.id

  // Cargar datos de la embarcación en el servidor
  const { data: embarcacion, error } = await getEmbarcacion(embarcacionId)

  if (error || !embarcacion) {
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

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/comprador/embarcaciones">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Editar Embarcación</h1>
          <p className="text-muted-foreground">
            Modifica la información de {embarcacion.nombre}
          </p>
        </div>
      </div>

      {/* Stats Card */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total Pesajes</p>
              <p className="text-2xl font-bold">{embarcacion.totalPesajes}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total Kilos</p>
              <p className="text-2xl font-bold">{embarcacion.totalKilos.toLocaleString()} kg</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Fecha Registro</p>
              <p className="text-2xl font-bold">{new Date(embarcacion.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="text-center">
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

      <form action={updateEmbarcacion.bind(null, embarcacionId)}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Información Principal */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ship className="h-5 w-5" />
                Información Principal
              </CardTitle>
              <CardDescription>
                Datos básicos de la embarcación
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="nombre">Nombre de la Embarcación *</Label>
                <Input
                  id="nombre"
                  name="nombre"
                  defaultValue={embarcacion.nombre}
                  placeholder="Ej: Esperanza III"
                  required
                />
              </div>

              <div>
                <Label htmlFor="matricula">Matrícula *</Label>
                <Input
                  id="matricula"
                  name="matricula"
                  defaultValue={embarcacion.matricula}
                  placeholder="Ej: ES-2024-001"
                  required
                />
              </div>

              <div>
                <Label htmlFor="propietario">Nombre del Propietario *</Label>
                <Input
                  id="propietario"
                  name="propietario"
                  defaultValue={embarcacion.propietario}
                  placeholder="Ej: Juan Pérez"
                  required
                />
              </div>

              <div>
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  id="telefono"
                  name="telefono"
                  defaultValue={embarcacion.telefono || ''}
                  placeholder="Ej: +56 9 1234 5678"
                />
              </div>

              <div>
                <Label htmlFor="activa">Estado</Label>
                <Select name="activa" defaultValue={embarcacion.activa ? 'true' : 'false'}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Activa</SelectItem>
                    <SelectItem value="false">Inactiva</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Observaciones */}
          <Card>
            <CardHeader>
              <CardTitle>Observaciones</CardTitle>
              <CardDescription>
                Información adicional sobre la embarcación
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                name="observaciones"
                defaultValue={embarcacion.observaciones || ''}
                placeholder="Agrega cualquier observación relevante..."
                rows={8}
              />
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 mt-6">
          <Button variant="outline" type="button" asChild>
            <Link href="/dashboard/comprador/embarcaciones">
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Link>
          </Button>
          <Button 
            type="submit" 
            variant="aqua"
          >
            <Save className="h-4 w-4 mr-2" />
            Guardar Cambios
          </Button>
        </div>
      </form>
    </div>
  )
} 