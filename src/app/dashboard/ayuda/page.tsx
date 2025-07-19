'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { 
  HelpCircle,
  MessageCircle,
  Mail,
  Phone,
  FileText,
  Video,
  ArrowLeft,
  ExternalLink,
  BookOpen,
  Users
} from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function AyudaPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('faq')

  const faqs = [
    {
      question: "¿Cómo registro un nuevo pesaje?",
      answer: "Ve al dashboard y haz clic en 'Nuevo Pesaje'. Completa los datos de la embarcación, bins y peso. El sistema calculará automáticamente el peso neto."
    },
    {
      question: "¿Qué pasa si no tengo conexión a internet?",
      answer: "La aplicación funciona en modo offline. Los datos se guardan localmente y se sincronizan automáticamente cuando recuperes la conexión."
    },
    {
      question: "¿Cómo cambio mi información de perfil?",
      answer: "Ve a 'Mi Perfil' en el menú de usuario. Allí podrás editar tu información personal y de empresa."
    },
    {
      question: "¿Cuánto cuesta el servicio?",
      answer: "El primer mes es gratuito. Después se cobra $1 CLP por kilo registrado mensualmente."
    },
    {
      question: "¿Puedo usar la app en múltiples dispositivos?",
      answer: "Sí, puedes usar la aplicación en varios dispositivos. Los datos se sincronizan automáticamente entre todos ellos."
    }
  ]

  const contactMethods = [
    {
      icon: Mail,
      title: "Email de Soporte",
      description: "soporte@navipesca.cl",
      action: "Enviar Email",
      href: "mailto:soporte@navipesca.cl"
    },
    {
      icon: Phone,
      title: "Teléfono",
      description: "+56 9 6520 8072",
      action: "Llamar",
      href: "tel:+56965208072"
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      description: "Soporte en tiempo real",
      action: "Abrir WhatsApp",
      href: "https://wa.me/56965208072"
    }
  ]

  const resources = [
    {
      icon: FileText,
      title: "Manual de Usuario",
      description: "Guía completa de todas las funciones",
      href: "/dashboard/ayuda/manual"
    },
    {
      icon: Video,
      title: "Tutoriales en Video",
      description: "Videos explicativos paso a paso",
      href: "https://youtube.com/navipesca"
    },
    {
      icon: BookOpen,
      title: "Base de Conocimientos",
      description: "Artículos y soluciones comunes",
      href: "https://ayuda.navipesca.cl"
    }
  ]

  return (
    <div className="max-w-4xl mx-auto p-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6">
          <Button
            variant={activeTab === 'faq' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('faq')}
            size="sm"
          >
            Preguntas Frecuentes
          </Button>
          <Button
            variant={activeTab === 'contact' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('contact')}
            size="sm"
          >
            Contacto
          </Button>
          <Button
            variant={activeTab === 'resources' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('resources')}
            size="sm"
          >
            Recursos
          </Button>
        </div>

        {/* FAQ Tab */}
        {activeTab === 'faq' && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  Preguntas Frecuentes
                </CardTitle>
                <CardDescription>
                  Encuentra respuestas a las preguntas más comunes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div key={index} className="border-b border-border pb-4 last:border-b-0">
                      <h3 className="font-medium mb-2">{faq.question}</h3>
                      <p className="text-sm text-muted-foreground">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Contact Tab */}
        {activeTab === 'contact' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Contacto Directo
                </CardTitle>
                <CardDescription>
                  Nuestro equipo de soporte está disponible para ayudarte
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {contactMethods.map((method, index) => (
                    <Card key={index} className="text-center">
                      <CardContent className="pt-6">
                        <method.icon className="h-8 w-8 mx-auto mb-3 text-aqua-600" />
                        <h3 className="font-medium mb-1">{method.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{method.description}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(method.href, '_blank')}
                          className="w-full"
                        >
                          {method.action}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Horarios de Atención
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium mb-2">Soporte Técnico</h3>
                    <p className="text-sm text-muted-foreground">
                      Lunes a Viernes: 8:00 - 18:00<br />
                      Sábados: 9:00 - 14:00
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Emergencias</h3>
                    <p className="text-sm text-muted-foreground">
                      Disponible 24/7 para problemas críticos
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Resources Tab */}
        {activeTab === 'resources' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Recursos de Ayuda
                </CardTitle>
                <CardDescription>
                  Documentación y recursos para aprender más sobre la aplicación
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {resources.map((resource, index) => (
                    <Card key={index} className="text-center">
                      <CardContent className="pt-6">
                        <resource.icon className="h-8 w-8 mx-auto mb-3 text-aqua-600" />
                        <h3 className="font-medium mb-1">{resource.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{resource.description}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(resource.href)}
                          className="w-full"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Acceder
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  onClick={() => router.push('/dashboard/configuracion')}
                  className="flex-1"
                >
                  Configuración
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => router.push('/dashboard/perfil')}
                  className="flex-1"
                >
                  Mi Perfil
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => window.open('mailto:soporte@navipesca.cl', '_blank')}
                  className="flex-1"
                >
                  Reportar Problema
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
  )
} 