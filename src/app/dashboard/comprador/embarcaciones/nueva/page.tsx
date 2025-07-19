'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/hooks/use-auth'
import { 
  Ship,
  ArrowLeft,
  Save,
  X
} from 'lucide-react'
import Link from 'next/link'
import { createEmbarcacion } from '@/lib/actions/embarcaciones-actions'

export default function NuevaEmbarcacionPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (formData: FormData) => {
    setLoading(true)
    setError(null)

    try {
      await createEmbarcacion(formData)
      // Si llega aquí, la acción redirigió exitosamente
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error inesperado al crear la embarcación'
      setError(errorMessage)
      console.error('Error creating embarcacion:', error)
    } finally {
      setLoading(false)
    }
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
          <h1 className="text-3xl font-bold">Nueva Embarcación</h1>
          <p className="text-muted-foreground">
            Registra una nueva embarcación en el sistema
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <Card className="mb-6 border-destructive">
          <CardContent className="p-4">
            <p className="text-destructive text-sm">{error}</p>
          </CardContent>
        </Card>
      )}

      <form action={handleSubmit}>
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
                  placeholder="Ej: Esperanza III"
                  required
                />
              </div>

              <div>
                <Label htmlFor="matricula">Matrícula *</Label>
                <Input
                  id="matricula"
                  name="matricula"
                  placeholder="Ej: ES-2024-001"
                  required
                />
              </div>

              <div>
                <Label htmlFor="propietario">Nombre del Propietario *</Label>
                <Input
                  id="propietario"
                  name="propietario"
                  placeholder="Ej: Juan Pérez"
                  required
                />
              </div>

              <div>
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  id="telefono"
                  name="telefono"
                  placeholder="Ej: +56 9 1234 5678"
                />
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
            disabled={loading}
            loading={loading}
          >
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Guardando...' : 'Guardar Embarcación'}
          </Button>
        </div>
      </form>
    </div>
  )
} 