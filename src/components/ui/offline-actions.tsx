import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Clock, WifiOff, RefreshCw, CheckCircle } from 'lucide-react'

interface OfflineAction {
  id: string
  type: string
  data: any
  timestamp: number
  retries: number
}

interface OfflineActionsProps {
  actions: OfflineAction[]
  onSync: () => void
  syncing: boolean
}

export function OfflineActions({ actions, onSync, syncing }: OfflineActionsProps) {
  if (actions.length === 0) {
    return (
      <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center gap-2 text-green-800">
          <CheckCircle className="h-5 w-5" />
          <span className="text-sm font-medium">Todo sincronizado</span>
        </div>
      </div>
    )
  }

  const getActionText = (type: string) => {
    switch (type) {
      case 'iniciar_pesaje':
        return 'Iniciar Pesaje'
      case 'agregar_bin':
        return 'Agregar Bin'
      case 'registrar_peso':
        return 'Registrar Peso'
      case 'cambiar_estado':
        return 'Cambiar Estado'
      case 'cerrar_pesaje':
        return 'Cerrar Pesaje'
      default:
        return type
    }
  }

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString()
  }

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-800">
          <WifiOff className="h-5 w-5" />
          Acciones Pendientes ({actions.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {actions.map((action) => (
            <div key={action.id} className="flex items-center justify-between p-2 bg-white rounded border">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-600" />
                <div>
                  <p className="font-medium">{getActionText(action.type)}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatTime(action.timestamp)}
                  </p>
                </div>
              </div>
              {action.retries > 0 && (
                <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                  Reintento {action.retries}/3
                </span>
              )}
            </div>
          ))}
          
          <Button 
            onClick={onSync} 
            disabled={syncing}
            className="w-full mt-4"
            variant="outline"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Sincronizando...' : 'Sincronizar Todo'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 