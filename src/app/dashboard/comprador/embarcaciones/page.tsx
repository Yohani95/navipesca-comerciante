'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { useAuth } from '@/hooks/use-auth'
import { 
  Ship,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Filter,
  MoreHorizontal,
  Calendar,
  MapPin,
  Phone,
  Mail,
  User
} from 'lucide-react'
import Link from 'next/link'
import { formatDate, formatWeight } from '@/lib/utils'
import { getEmbarcaciones, deleteEmbarcacion } from '@/lib/actions/embarcaciones-actions'

interface EmbarcacionWithStats {
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
  totalPesajes: number
  totalKilos: number
  ultimoPesaje?: string
}

export default function EmbarcacionesPage() {
  const { user } = useAuth()
  const [embarcaciones, setEmbarcaciones] = useState<EmbarcacionWithStats[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterEstado, setFilterEstado] = useState<'todos' | 'activa' | 'inactiva'>('todos')

  useEffect(() => {
    const loadEmbarcaciones = async () => {
      try {
        setLoading(true)
        
        const { data, error } = await getEmbarcaciones()
        if (error) {
          console.error('Error loading embarcaciones:', error)
          // Aquí podrías mostrar un toast de error
          return
        }
        
        setEmbarcaciones(data || [])
      } catch (error) {
        console.error('Error loading embarcaciones:', error)
        // Aquí podrías mostrar un toast de error
      } finally {
        setLoading(false)
      }
    }

    loadEmbarcaciones()
  }, [])

  const filteredEmbarcaciones = embarcaciones.filter(embarcacion => {
    const matchesSearch = embarcacion.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         embarcacion.matricula.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         embarcacion.propietario.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterEstado === 'todos' || 
                         (filterEstado === 'activa' && embarcacion.activa) ||
                         (filterEstado === 'inactiva' && !embarcacion.activa)
    
    return matchesSearch && matchesFilter
  })

  const getEstadoColor = (activa: boolean) => {
    return activa 
      ? 'bg-aqua-100 text-aqua-700 dark:bg-aqua-900/20 dark:text-aqua-300'
      : 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300'
  }

  const getEstadoText = (activa: boolean) => {
    return activa ? 'Activa' : 'Inactiva'
  }

  const handleDeleteEmbarcacion = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta embarcación?')) {
      return
    }

    try {
      const result = await deleteEmbarcacion(id)
      if (result.error) {
        console.error('Error deleting embarcacion:', result.error)
        // Aquí podrías mostrar un toast de error
        return
      }

      // Recargar la lista
      const { data, error } = await getEmbarcaciones()
      if (!error && data) {
        setEmbarcaciones(data)
      }
    } catch (error) {
      console.error('Error deleting embarcacion:', error)
      // Aquí podrías mostrar un toast de error
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Embarcaciones</h1>
          <p className="text-muted-foreground">
            Administra las embarcaciones registradas en el sistema
          </p>
        </div>
        <Button variant="aqua" size="lg" asChild>
          <Link href="/dashboard/comprador/embarcaciones/nueva">
            <Plus className="h-5 w-5 mr-2" />
            Nueva Embarcación
          </Link>
        </Button>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre, matrícula o propietario..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterEstado === 'todos' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterEstado('todos')}
              >
                Todas
              </Button>
              <Button
                variant={filterEstado === 'activa' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterEstado('activa')}
              >
                Activas
              </Button>
              <Button
                variant={filterEstado === 'inactiva' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterEstado('inactiva')}
              >
                Inactivas
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Embarcaciones Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmbarcaciones.map((embarcacion) => (
          <Card key={embarcacion.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{embarcacion.nombre}</CardTitle>
                  <CardDescription className="text-sm">
                    {embarcacion.matricula}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(embarcacion.activa)}`}>
                    {getEstadoText(embarcacion.activa)}
                  </span>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Propietario Info */}
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium text-sm">{embarcacion.propietario}</p>
                  {embarcacion.telefono && (
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {embarcacion.telefono}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Observaciones */}
              {embarcacion.observaciones && (
                <div>
                  <p className="text-sm text-muted-foreground">{embarcacion.observaciones}</p>
                </div>
              )}

              {/* Estadísticas */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                <div>
                  <p className="text-xs text-muted-foreground">Total Pesajes</p>
                  <p className="font-semibold">{embarcacion.totalPesajes}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Kilos</p>
                  <p className="font-semibold">{formatWeight(embarcacion.totalKilos)}</p>
                </div>
              </div>

              {/* Último Pesaje */}
              {embarcacion.ultimoPesaje && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>Último pesaje: {formatDate(embarcacion.ultimoPesaje)}</span>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <Link href={`/dashboard/comprador/embarcaciones/${embarcacion.id}`}>
                    <Eye className="h-4 w-4 mr-1" />
                    Ver
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <Link href={`/dashboard/comprador/embarcaciones/${embarcacion.id}/editar`}>
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-destructive hover:text-destructive"
                  onClick={() => handleDeleteEmbarcacion(embarcacion.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredEmbarcaciones.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Ship className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No se encontraron embarcaciones</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || filterEstado !== 'todos' 
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'Comienza agregando tu primera embarcación'
              }
            </p>
            {!searchTerm && filterEstado === 'todos' && (
              <Button variant="aqua" asChild>
                <Link href="/dashboard/comprador/embarcaciones/nueva">
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Primera Embarcación
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
} 