import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'

interface OfflineAction {
  id: string
  type: 'iniciar_pesaje' | 'agregar_bin' | 'registrar_peso' | 'cambiar_estado' | 'cerrar_pesaje'
  data: any
  timestamp: number
  retries: number
}

interface OfflineData {
  pesajesEnProceso: any[]
  embarcaciones: any[]
  pendingActions: OfflineAction[]
}

export function useOfflineStorage() {
  const [isOnline, setIsOnline] = useState(true)
  const [pendingActions, setPendingActions] = useState<OfflineAction[]>([])
  const [offlineData, setOfflineData] = useState<OfflineData>({
    pesajesEnProceso: [],
    embarcaciones: [],
    pendingActions: []
  })

  // Detectar estado de conexión
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      toast.success('Conexión restaurada')
      syncPendingActions()
    }
    
    const handleOffline = () => {
      setIsOnline(false)
      toast.error('Sin conexión - Modo offline activado')
    }
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    // Cargar datos offline al inicio
    loadOfflineData()
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Cargar datos desde localStorage
  const loadOfflineData = () => {
    try {
      const stored = localStorage.getItem('navipesca-offline-data')
      if (stored) {
        const data = JSON.parse(stored)
        setOfflineData(data)
        setPendingActions(data.pendingActions || [])
      }
    } catch (error) {
      console.error('Error cargando datos offline:', error)
    }
  }

  // Guardar datos en localStorage
  const saveOfflineData = (data: Partial<OfflineData>) => {
    try {
      const currentData = { ...offlineData, ...data }
      localStorage.setItem('navipesca-offline-data', JSON.stringify(currentData))
      setOfflineData(currentData)
    } catch (error) {
      console.error('Error guardando datos offline:', error)
    }
  }

  // Agregar acción pendiente
  const addPendingAction = (action: Omit<OfflineAction, 'id' | 'timestamp' | 'retries'>) => {
    const newAction: OfflineAction = {
      ...action,
      id: `offline-${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
      retries: 0
    }
    
    const updatedActions = [...pendingActions, newAction]
    setPendingActions(updatedActions)
    saveOfflineData({ pendingActions: updatedActions })
    
    if (isOnline) {
      syncPendingActions()
    }
  }

  // Sincronizar acciones pendientes
  const syncPendingActions = async () => {
    if (!isOnline || pendingActions.length === 0) return
    
    const actionsToSync = [...pendingActions]
    setPendingActions([])
    
    for (const action of actionsToSync) {
      try {
        // Aquí se ejecutarían las Server Actions correspondientes
        console.log('Sincronizando acción:', action)
        
        // Simular sincronización exitosa
        await new Promise(resolve => setTimeout(resolve, 500))
        
        toast.success(`Acción sincronizada: ${action.type}`)
      } catch (error) {
        console.error('Error sincronizando acción:', action, error)
        
        // Reintentar más tarde
        const retryAction = { ...action, retries: action.retries + 1 }
        if (retryAction.retries < 3) {
          setPendingActions(prev => [...prev, retryAction])
        } else {
          toast.error(`Error sincronizando: ${action.type}`)
        }
      }
    }
    
    saveOfflineData({ pendingActions: [] })
  }

  // Actualizar datos offline
  const updateOfflineData = (key: keyof OfflineData, data: any) => {
    saveOfflineData({ [key]: data })
  }

  // Ejecutar acción con manejo offline
  const executeWithOfflineSupport = async (
    action: () => Promise<any>,
    offlineAction: Omit<OfflineAction, 'id' | 'timestamp' | 'retries'>
  ) => {
    if (isOnline) {
      try {
        const result = await action()
        return result
      } catch (error) {
        console.error('Error ejecutando acción online:', error)
        addPendingAction(offlineAction)
        return { error: 'Error de conexión - Acción guardada para sincronización' }
      }
    } else {
      addPendingAction(offlineAction)
      return { success: true, offline: true }
    }
  }

  return {
    isOnline,
    pendingActions,
    offlineData,
    addPendingAction,
    syncPendingActions,
    updateOfflineData,
    executeWithOfflineSupport,
    loadOfflineData
  }
} 