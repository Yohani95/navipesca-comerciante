'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DashboardHeader } from '@/components/ui/dashboard-header'
import { 
  AlertTriangle,
  Home,
  ArrowLeft,
  Search,
  Ship,
  Fish
} from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader
        title="🐟 NaviPesca Comerciante"
        subtitle="Página no encontrada"
        isOnline={true}
        userRole="usuario"
      />

      <div className="max-w-4xl mx-auto p-6">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          {/* Icono de Error */}
          <div className="mb-8">
            <div className="relative">
              <Fish className="h-24 w-24 text-muted-foreground/50" />
              <AlertTriangle className="h-12 w-12 text-warning-600 absolute -top-2 -right-2" />
            </div>
          </div>

          {/* Mensaje Principal */}
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-destructive">
                404 - Página no encontrada
              </CardTitle>
              <CardDescription className="text-lg">
                Lo sentimos, la página que buscas no existe o ha sido movida.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground">
                <p>Posibles causas:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>La URL puede estar mal escrita</li>
                  <li>La página puede haber sido eliminada</li>
                  <li>El enlace puede estar desactualizado</li>
                </ul>
              </div>

              {/* Botones de Acción */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  onClick={() => router.push('/dashboard')}
                  className="flex-1"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Ir al Dashboard
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => router.back()}
                  className="flex-1"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver Atrás
                </Button>
              </div>

              {/* Búsqueda */}
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-2">
                  ¿Buscas algo específico?
                </p>
                <Button
                  variant="ghost"
                  onClick={() => router.push('/dashboard/ayuda')}
                  className="w-full"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Ir a Ayuda y Soporte
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Información Adicional */}
          <div className="mt-8 text-sm text-muted-foreground">
            <p>
              Si crees que esto es un error, contacta con soporte técnico.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 