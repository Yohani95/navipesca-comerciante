'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { supabase } from '@/lib/supabase'
import { 
  Wifi, 
  WifiOff, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw,
  Database,
  User,
  Settings
} from 'lucide-react'

interface DiagnosticResult {
  name: string
  status: 'success' | 'error' | 'loading' | 'unknown'
  message: string
  details?: any
}

export function ConnectionDiagnostic() {
  const [results, setResults] = useState<DiagnosticResult[]>([])
  const [running, setRunning] = useState(false)

  const runDiagnostics = async () => {
    setRunning(true)
    setResults([])

    const diagnostics: DiagnosticResult[] = []

    // 1. Verificar variables de entorno
    const envCheck: DiagnosticResult = {
      name: 'Variables de Entorno',
      status: 'unknown',
      message: 'Verificando configuración...'
    }
    diagnostics.push(envCheck)
    setResults([...diagnostics])

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      envCheck.status = 'error'
      envCheck.message = 'Variables de entorno faltantes'
      envCheck.details = {
        url: supabaseUrl ? '✅ Configurada' : '❌ No configurada',
        key: supabaseAnonKey ? '✅ Configurada' : '❌ No configurada'
      }
    } else {
      envCheck.status = 'success'
      envCheck.message = 'Variables de entorno configuradas correctamente'
    }

    // 2. Verificar conectividad básica
    const connectivityCheck: DiagnosticResult = {
      name: 'Conectividad Básica',
      status: 'loading',
      message: 'Probando conexión...'
    }
    diagnostics.push(connectivityCheck)
    setResults([...diagnostics])

    try {
      const { data, error } = await supabase.from('clientes').select('count').limit(1)
      
      if (error) {
        connectivityCheck.status = 'error'
        connectivityCheck.message = `Error de conexión: ${error.message}`
        connectivityCheck.details = error
      } else {
        connectivityCheck.status = 'success'
        connectivityCheck.message = 'Conexión exitosa con Supabase'
      }
    } catch (error) {
      connectivityCheck.status = 'error'
      connectivityCheck.message = `Error de red: ${error instanceof Error ? error.message : 'Error desconocido'}`
      connectivityCheck.details = error
    }

    // 3. Verificar autenticación
    const authCheck: DiagnosticResult = {
      name: 'Estado de Autenticación',
      status: 'loading',
      message: 'Verificando sesión...'
    }
    diagnostics.push(authCheck)
    setResults([...diagnostics])

    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        authCheck.status = 'error'
        authCheck.message = `Error de autenticación: ${error.message}`
        authCheck.details = error
      } else if (!session) {
        authCheck.status = 'error'
        authCheck.message = 'No hay sesión activa'
      } else {
        authCheck.status = 'success'
        authCheck.message = 'Sesión activa'
        authCheck.details = {
          user: session.user.email,
          expires: session.expires_at
        }
      }
    } catch (error) {
      authCheck.status = 'error'
      authCheck.message = `Error al verificar autenticación: ${error instanceof Error ? error.message : 'Error desconocido'}`
      authCheck.details = error
    }

    // 4. Verificar permisos de tablas
    const permissionsCheck: DiagnosticResult = {
      name: 'Permisos de Tablas',
      status: 'loading',
      message: 'Verificando permisos...'
    }
    diagnostics.push(permissionsCheck)
    setResults([...diagnostics])

    try {
      // Obtener sesión actual
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        permissionsCheck.status = 'error'
        permissionsCheck.message = 'No hay sesión activa para verificar permisos'
        return
      }

      // Verificar lectura de clientes
      const { data: clientesTest, error: clientesTestError } = await supabase
        .from('clientes')
        .select('*')
        .eq('email', session.user.email)
        .limit(1)

      // Verificar lectura de usuarios
      const { data: usuariosTest, error: usuariosTestError } = await supabase
        .from('usuarios')
        .select('*')
        .eq('email', session.user.email)
        .limit(1)

      const errors = []
      if (clientesTestError) errors.push(`clientes: ${clientesTestError.message}`)
      if (usuariosTestError) errors.push(`usuarios: ${usuariosTestError.message}`)

      if (errors.length > 0) {
        permissionsCheck.status = 'error'
        permissionsCheck.message = `Errores de permisos: ${errors.join(', ')}`
        permissionsCheck.details = { 
          clientes: { data: clientesTest, error: clientesTestError },
          usuarios: { data: usuariosTest, error: usuariosTestError },
          userEmail: session.user.email
        }
      } else {
        permissionsCheck.status = 'success'
        permissionsCheck.message = 'Permisos de lectura correctos'
        permissionsCheck.details = {
          clientesEncontrados: clientesTest?.length || 0,
          usuariosEncontrados: usuariosTest?.length || 0,
          userEmail: session.user.email
        }
      }
    } catch (error) {
      permissionsCheck.status = 'error'
      permissionsCheck.message = `Error al verificar permisos: ${error instanceof Error ? error.message : 'Error desconocido'}`
      permissionsCheck.details = error
    }

    setResults([...diagnostics])
    setRunning(false)
  }

  useEffect(() => {
    runDiagnostics()
  }, [])

  const getStatusIcon = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-600" />
      case 'loading':
        return <LoadingSpinner size="sm" />
      default:
        return <Settings className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusColor = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'success':
        return 'border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800'
      case 'error':
        return 'border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800'
      case 'loading':
        return 'border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800'
      default:
        return 'border-gray-200 bg-gray-50 dark:bg-gray-900/20 dark:border-gray-800'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wifi className="h-5 w-5" />
          Diagnóstico de Conectividad
        </CardTitle>
        <CardDescription>
          Verificación de la configuración y conectividad con Supabase
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {results.map((result, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${getStatusColor(result.status)}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(result.status)}
                  <div>
                    <p className="font-medium">{result.name}</p>
                    <p className="text-sm text-muted-foreground">{result.message}</p>
                  </div>
                </div>
              </div>
              
              {result.details && (
                <div className="mt-3 p-3 bg-white dark:bg-gray-800 rounded border text-xs">
                  <pre className="whitespace-pre-wrap overflow-x-auto">
                    {JSON.stringify(result.details, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ))}

          <div className="flex justify-center pt-4">
            <Button 
              onClick={runDiagnostics} 
              disabled={running}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${running ? 'animate-spin' : ''}`} />
              {running ? 'Ejecutando...' : 'Ejecutar Diagnóstico'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 