'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { supabase } from '@/lib/supabase'
import { CheckCircle, XCircle, Database, Shield, Users, Ship, Package, Scale, CreditCard, Calendar } from 'lucide-react'

interface ConnectionTest {
  name: string
  status: 'pending' | 'success' | 'error'
  message: string
  icon: any
}

export default function TestConnectionPage() {
  const [tests, setTests] = useState<ConnectionTest[]>([
    { name: 'Conexión Básica', status: 'pending', message: 'Probando...', icon: Database },
    { name: 'Autenticación', status: 'pending', message: 'Probando...', icon: Shield },
    { name: 'Tabla Clientes', status: 'pending', message: 'Probando...', icon: Users },
    { name: 'Tabla Embarcaciones', status: 'pending', message: 'Probando...', icon: Ship },
    { name: 'Tabla Bins', status: 'pending', message: 'Probando...', icon: Package },
    { name: 'Tabla Pesajes', status: 'pending', message: 'Probando...', icon: Scale },
    { name: 'Tabla Pagos', status: 'pending', message: 'Probando...', icon: CreditCard },
    { name: 'Tabla Cobros Mensuales', status: 'pending', message: 'Probando...', icon: Calendar },
  ])
  const [running, setRunning] = useState(false)
  const [overallStatus, setOverallStatus] = useState<'pending' | 'success' | 'error'>('pending')

  const runTests = async () => {
    setRunning(true)
    setOverallStatus('pending')
    
    const newTests = [...tests]
    
    try {
      // Test 1: Conexión básica
      newTests[0].status = 'pending'
      setTests([...newTests])
      
      const { error: basicError } = await supabase.from('clientes').select('count').limit(1)
      newTests[0].status = basicError ? 'error' : 'success'
      newTests[0].message = basicError ? basicError.message : 'Conexión exitosa'
      setTests([...newTests])

      // Test 2: Autenticación
      newTests[1].status = 'pending'
      setTests([...newTests])
      
      const { error: authError } = await supabase.auth.getSession()
      newTests[1].status = authError ? 'error' : 'success'
      newTests[1].message = authError ? authError.message : 'Autenticación funcionando'
      setTests([...newTests])

      // Test 3-8: Tablas
      const tables = ['clientes', 'embarcaciones', 'bins', 'pesajes', 'pagos', 'cobros_mensuales']
      
      for (let i = 0; i < tables.length; i++) {
        const tableIndex = i + 2
        newTests[tableIndex].status = 'pending'
        setTests([...newTests])
        
        try {
          const { error } = await supabase.from(tables[i]).select('*').limit(1)
          newTests[tableIndex].status = error ? 'error' : 'success'
          newTests[tableIndex].message = error ? error.message : 'Tabla accesible'
          setTests([...newTests])
        } catch (err: any) {
          newTests[tableIndex].status = 'error'
          newTests[tableIndex].message = err.message
          setTests([...newTests])
        }
      }

      // Determinar estado general
      const allSuccess = newTests.every(test => test.status === 'success')
      setOverallStatus(allSuccess ? 'success' : 'error')
      
    } catch (error: any) {
      console.error('Error en pruebas:', error)
      setOverallStatus('error')
    } finally {
      setRunning(false)
    }
  }

  useEffect(() => {
    runTests()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <LoadingSpinner size="sm" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800'
      case 'error':
        return 'border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800'
      default:
        return 'border-gray-200 bg-gray-50 dark:bg-gray-900/20 dark:border-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            🔍 Prueba de Conexión - NaviPesca
          </h1>
          <p className="text-muted-foreground">
            Verificando la conexión con Supabase y las tablas de la base de datos
          </p>
        </div>

        {/* Status Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {overallStatus === 'success' && <CheckCircle className="h-6 w-6 text-green-500" />}
              {overallStatus === 'error' && <XCircle className="h-6 w-6 text-red-500" />}
              {overallStatus === 'pending' && <LoadingSpinner size="lg" />}
              Estado General de la Conexión
            </CardTitle>
            <CardDescription>
              {overallStatus === 'success' && '✅ Todas las pruebas pasaron exitosamente'}
              {overallStatus === 'error' && '❌ Algunas pruebas fallaron'}
              {overallStatus === 'pending' && '⏳ Ejecutando pruebas...'}
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Tests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tests.map((test, index) => (
            <Card key={index} className={getStatusColor(test.status)}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <test.icon className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{test.name}</p>
                      <p className="text-sm text-muted-foreground">{test.message}</p>
                    </div>
                  </div>
                  {getStatusIcon(test.status)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4">
          <Button 
            onClick={runTests} 
            disabled={running}
            variant="aqua"
          >
            {running ? 'Ejecutando...' : 'Ejecutar Pruebas'}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => window.location.href = '/dashboard/comprador'}
          >
            Ir al Dashboard
          </Button>
        </div>

        {/* Connection Info */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Información de Conexión</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p><strong>URL:</strong> https://olmjboktmrjlfrvqlkcs.supabase.co</p>
              <p><strong>Proyecto:</strong> navipesca-comerciante</p>
              <p><strong>Estado:</strong> {overallStatus === 'success' ? 'Conectado' : overallStatus === 'error' ? 'Error' : 'Verificando'}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 