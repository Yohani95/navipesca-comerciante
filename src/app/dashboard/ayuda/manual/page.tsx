'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  BookOpen,
  ArrowLeft,
  User,
  Ship,
  Scale,
  Settings,
  Smartphone,
  Wifi,
  WifiOff,
  CheckCircle,
  AlertCircle,
  Clock,
  Download,
  FileText,
  Video,
  MessageCircle,
  Phone,
  Mail
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ManualPage() {
  const router = useRouter()

  const sections = [
    {
      id: 'getting-started',
      title: 'Primeros Pasos',
      icon: User,
      content: [
        {
          title: 'Registro y Acceso',
          steps: [
            'Ingresa a la aplicación con tu email y contraseña',
            'Si es tu primera vez, completa tu perfil de usuario',
            'Configura los datos de tu empresa en la sección de perfil',
            'Verifica que tu rol esté correctamente asignado (Comprador o Pesador)'
          ]
        },
        {
          title: 'Configuración Inicial',
          steps: [
            'Ve a Configuración y personaliza el tema (claro/oscuro)',
            'Configura las notificaciones según tus preferencias',
            'Revisa la configuración de sincronización de datos',
            'Asegúrate de tener una conexión estable a internet'
          ]
        }
      ]
    },
    {
      id: 'dashboard-comprador',
      title: 'Dashboard del Comprador',
      icon: Ship,
      content: [
        {
          title: 'Vista General',
          steps: [
            'El dashboard muestra métricas clave: kilos del día/mes, embarcaciones activas',
            'Revisa el estado de sincronización en tiempo real',
            'Monitorea la actividad reciente de pesajes',
            'Verifica el período de prueba y días restantes'
          ]
        },
        {
          title: 'Acciones Principales',
          steps: [
            'Nuevo Pesaje: Registra el peso de una embarcación',
            'Gestionar Embarcaciones: Administra tu flota de barcos',
            'Reportes: Genera informes y estadísticas',
            'Configuración: Ajusta parámetros del sistema'
          ]
        }
      ]
    },
    {
      id: 'dashboard-pesador',
      title: 'Dashboard del Pesador',
      icon: Scale,
      content: [
        {
          title: 'Operación Diaria',
          steps: [
            'Verifica tu estado de conexión (Online/Offline)',
            'Revisa los pesajes pendientes de sincronización',
            'Monitorea los kilos registrados hoy',
            'Usa el botón de sincronización manual si es necesario'
          ]
        },
        {
          title: 'Registro de Pesajes',
          steps: [
            'Haz clic en "Nuevo Pesaje" para registrar un peso',
            'Selecciona la embarcación y número de bins',
            'Ingresa el peso bruto del pesaje',
            'El sistema calculará automáticamente el peso neto',
            'Confirma y guarda el registro'
          ]
        }
      ]
    },
    {
      id: 'offline-mode',
      title: 'Modo Offline',
      icon: WifiOff,
      content: [
        {
          title: 'Funcionamiento Offline',
          steps: [
            'La aplicación funciona sin conexión a internet',
            'Los datos se guardan localmente en tu dispositivo',
            'Los registros se marcan como "pendientes"',
            'La sincronización ocurre automáticamente al recuperar conexión'
          ]
        },
        {
          title: 'Sincronización',
          steps: [
            'Verifica tu conexión en el header de la aplicación',
            'Usa el botón "Sincronizar" para forzar la sincronización',
            'Revisa el estado de cada pesaje (pendiente/sincronizado/error)',
            'Los datos se envían al servidor cuando hay conexión'
          ]
        }
      ]
    },
    {
      id: 'troubleshooting',
      title: 'Solución de Problemas',
      icon: AlertCircle,
      content: [
        {
          title: 'Problemas Comunes',
          steps: [
            'Error de conexión: Verifica tu internet y reintenta',
            'Datos no sincronizados: Usa sincronización manual',
            'Error en pesaje: Verifica los datos ingresados',
            'App lenta: Cierra y vuelve a abrir la aplicación'
          ]
        },
        {
          title: 'Contacto de Soporte',
          steps: [
            'WhatsApp: +56 9 6520 8072',
            'Email: soporte@navipesca.cl',
            'Horario: Lunes a Viernes 8:00-18:00',
            'Emergencias: Disponible 24/7'
          ]
        }
      ]
    }
  ]

  const quickLinks = [
    {
      title: 'Configuración',
      description: 'Ajustes del sistema',
      icon: Settings,
      href: '/dashboard/configuracion'
    },
    {
      title: 'Mi Perfil',
      description: 'Editar información personal',
      icon: User,
      href: '/dashboard/perfil'
    },
    {
      title: 'Ayuda y Soporte',
      description: 'Contacto directo',
      icon: MessageCircle,
      href: '/dashboard/ayuda'
    }
  ]

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-aqua-600" />
            Manual de Usuario
          </h1>
          <p className="text-muted-foreground mt-1">
            Guía completa para usar NaviPesca Comerciante
          </p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Acceso Rápido</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickLinks.map((link, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <Link href={link.href}>
                  <div className="flex items-center gap-3">
                    <link.icon className="h-6 w-6 text-aqua-600" />
                    <div>
                      <h3 className="font-medium">{link.title}</h3>
                      <p className="text-sm text-muted-foreground">{link.description}</p>
                    </div>
                  </div>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Manual Sections */}
      <div className="space-y-8">
        {sections.map((section, sectionIndex) => (
          <Card key={section.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <section.icon className="h-6 w-6 text-aqua-600" />
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {section.content.map((content, contentIndex) => (
                  <div key={contentIndex} className="border-l-4 border-aqua-200 pl-4">
                    <h3 className="font-semibold text-lg mb-3">{content.title}</h3>
                    <ol className="space-y-2">
                      {content.steps.map((step, stepIndex) => (
                        <li key={stepIndex} className="flex items-start gap-2">
                          <span className="flex-shrink-0 w-6 h-6 bg-aqua-100 text-aqua-600 rounded-full flex items-center justify-center text-sm font-medium">
                            {stepIndex + 1}
                          </span>
                          <span className="text-muted-foreground">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Contact Section */}
      <div className="mt-8">
        <Card className="bg-aqua-50 dark:bg-card border-aqua-200 dark:border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-aqua-800 dark:text-foreground">
              <MessageCircle className="h-6 w-6 text-aqua-600 dark:text-aqua-400" />
              ¿Necesitas Ayuda?
            </CardTitle>
            <CardDescription className="text-aqua-700 dark:text-muted-foreground">
              Nuestro equipo de soporte está disponible para ayudarte
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-aqua-600 dark:bg-aqua-600 text-white border border-aqua-500 dark:border-aqua-500">
                <MessageCircle className="h-5 w-5 text-white" />
                <div>
                  <p className="font-medium text-white">WhatsApp</p>
                  <p className="text-sm text-aqua-100">+56 9 6520 8072</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-aqua-600 dark:bg-aqua-600 text-white border border-aqua-500 dark:border-aqua-500">
                <Phone className="h-5 w-5 text-white" />
                <div>
                  <p className="font-medium text-white">Teléfono</p>
                  <p className="text-sm text-aqua-100">+56 9 6520 8072</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-aqua-600 dark:bg-aqua-600 text-white border border-aqua-500 dark:border-aqua-500">
                <Mail className="h-5 w-5 text-white" />
                <div>
                  <p className="font-medium text-white">Email</p>
                  <p className="text-sm text-aqua-100">soporte@navipesca.cl</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 