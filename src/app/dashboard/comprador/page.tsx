import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Scale,
  Ship,
  Users,
  DollarSign,
  Calendar,
  TrendingUp,
  AlertTriangle,
  Plus,
  FileText,
  Settings
} from 'lucide-react'
import Link from 'next/link'
import { formatCurrency, formatWeight, formatDate, getDaysUntilExpiration } from '@/lib/utils'
import { obtenerEstadisticasComprador, obtenerPesajesRecientesComprador, obtenerEmbarcacionesActivasComprador } from '@/lib/actions/comprador-actions'

interface DashboardStats {
  totalKilosHoy: number
  totalKilosMes: number
  embarcacionesActivas: number
  pesajesHoy: number
  montoFacturadoMes: number
  pendientesSincronizar: number
}

export default async function CompradorDashboard() {
  // Cargar datos del servidor
  const statsResult = await obtenerEstadisticasComprador()
  const pesajesResult = await obtenerPesajesRecientesComprador(5)
  const embarcacionesResult = await obtenerEmbarcacionesActivasComprador()

  const stats = statsResult.data
  const pesajesRecientes = pesajesResult.data || []
  const embarcacionesActivas = embarcacionesResult.data || []

  // Mock trial info (en producción vendría de la base de datos)
  const trialInfo = {
    isExpired: false,
    daysLeft: 25,
    subscription: 'prueba'
  }

  const statCards = [
    {
      title: "Kilos Hoy",
      value: stats ? formatWeight(stats.totalKilosHoy) : "0 kg",
      description: "Registrados hoy",
      icon: Scale,
      color: "text-aqua-600"
    },
    {
      title: "Kilos del Mes",
      value: stats ? formatWeight(stats.totalKilosMes) : "0 kg",
      description: `Facturado: ${stats ? formatCurrency(stats.montoFacturadoMes) : '$0'}`,
      icon: TrendingUp,
      color: "text-navy-600"
    },
    {
      title: "Embarcaciones",
      value: stats?.embarcacionesActivas || 0,
      description: "Activas",
      icon: Ship,
      color: "text-blue-600"
    },
    {
      title: "Pesajes Hoy",
      value: stats?.pesajesHoy || 0,
      description: `${stats?.pendientesSincronizar || 0} pendientes`,
      icon: Calendar,
      color: "text-purple-600"
    }
  ]

  const quickActions = [
    {
      title: "Nuevo Pesaje",
      description: "Registrar peso de embarcación",
      icon: Plus,
      href: "/dashboard/comprador/pesajes/nuevo",
      variant: "aqua" as const
    },
    {
      title: "Gestionar Embarcaciones",
      description: "Ver y administrar embarcaciones",
      icon: Ship,
      href: "/dashboard/comprador/embarcaciones",
      variant: "navy" as const
    },
    {
      title: "Reportes",
      description: "Generar informes y estadísticas",
      icon: FileText,
      href: "/dashboard/comprador/reportes",
      variant: "outline" as const
    },
    {
      title: "Configuración",
      description: "Ajustes de cuenta y sistema",
      icon: Settings,
      href: "/dashboard/configuracion",
      variant: "outline" as const
    }
  ]

  return (
    <>
      {/* Trial Warning */}
      {trialInfo.subscription === 'prueba' && (
        <div className="max-w-7xl mx-auto px-6 pt-6">
          <div className="bg-warning-500/20 dark:bg-warning-500/20 border border-warning-500/30 dark:border-warning-500/30 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning-600 dark:text-warning-300" />
              <div>
                <p className="font-medium text-warning-800 dark:text-warning-100">
                  Período de Prueba - {trialInfo.daysLeft} días restantes
                </p>
                <p className="text-sm text-warning-700 dark:text-warning-200">
                  Tu suscripción vence el {formatDate(new Date(Date.now() + trialInfo.daysLeft * 24 * 60 * 60 * 1000))}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <Card key={index} className="fade-in">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">
                      {stat.description}
                    </p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <Link href={action.href}>
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div className={`p-3 rounded-full ${
                        action.variant === 'aqua' ? 'bg-aqua-100 text-aqua-600' :
                        action.variant === 'navy' ? 'bg-navy-100 text-navy-600' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        <action.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{action.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Actividad Reciente</CardTitle>
              <CardDescription>Últimos pesajes registrados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pesajesRecientes.length > 0 ? (
                  pesajesRecientes.slice(0, 3).map((pesaje: any) => (
                    <div key={pesaje.id} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div>
                        <p className="font-medium">{pesaje.embarcaciones?.nombre || 'Embarcación N/A'}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(pesaje.fecha)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatWeight(pesaje.pesoNeto || 0)}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          pesaje.estado === 'completado' 
                            ? 'bg-aqua-100 text-aqua-700' 
                            : 'bg-warning-100 text-warning-700'
                        }`}>
                          {pesaje.estado === 'completado' ? 'Completado' : 'Pendiente'}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    <p>No hay pesajes recientes</p>
                  </div>
                )}
              </div>
              <Button variant="outline" className="w-full mt-4" asChild>
                <Link href="/dashboard/comprador/pesajes">
                  <span>Ver todos los pesajes</span>
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Estado del Sistema</CardTitle>
              <CardDescription>Información de sincronización</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Conexión</span>
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-aqua-500 rounded-full"></div>
                    Online
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Datos pendientes</span>
                  <span className="text-warning-600 font-medium">
                    {stats?.pendientesSincronizar || 0} registros
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Última sincronización</span>
                  <span className="text-sm text-muted-foreground">
                    Hace 5 minutos
                  </span>
                </div>
              </div>
              <Button variant="aqua" className="w-full mt-4">
                Sincronizar ahora
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}