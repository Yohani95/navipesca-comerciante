'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { useThemeToggle } from '@/hooks/use-theme'
import { Button } from '@/components/ui/button'
import { 
  User,
  Settings,
  LogOut,
  ChevronDown,
  Wifi,
  WifiOff,
  Bell,
  HelpCircle,
  Sun,
  Moon,
  Home
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useRouter } from 'next/navigation'

interface DashboardHeaderProps {
  title: string
  subtitle: string
  isOnline?: boolean
  userRole?: string
}

export function DashboardHeader({ 
  title, 
  subtitle, 
  isOnline = true, 
  userRole = 'usuario' 
}: DashboardHeaderProps) {
  const { user, signOut } = useAuth()
  const { theme, toggleTheme, mounted } = useThemeToggle()
  const router = useRouter()
  const [showConnectionStatus, setShowConnectionStatus] = useState(true)

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  const getUserDisplayName = () => {
    if (user?.user_metadata?.nombre && user?.user_metadata?.apellido) {
      return `${user.user_metadata.nombre} ${user.user_metadata.apellido}`
    }
    return user?.email || 'Usuario'
  }

  const getUserRoleDisplay = () => {
    switch (userRole) {
      case 'comprador':
        return 'Comprador'
      case 'pesador':
        return 'Pesador'
      case 'admin':
        return 'Administrador'
      default:
        return 'Usuario'
    }
  }

  const getCompanyName = () => {
    return user?.user_metadata?.nombreEmpresa || 'Mi Empresa'
  }

  const getDashboardPath = () => {
    switch (userRole) {
      case 'comprador':
        return '/dashboard/comprador'
      case 'pesador':
        return '/dashboard/pesador'
      default:
        return '/dashboard/comprador' // Default fallback
    }
  }

  return (
    <div className={`${theme === 'dark' ? 'gradient-navy' : 'gradient-navy-light'} text-white p-6 header-responsive`}>
      <div className="max-w-7xl mx-auto">
        {/* Header Principal */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div>
              <button
                onClick={() => router.push(getDashboardPath())}
                className="text-left hover:opacity-80 transition-opacity cursor-pointer group"
                title="Ir al Dashboard Principal"
              >
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold header-title">🐟 NaviPesca Comerciante</h1>
                  <Home className="h-4 w-4 opacity-60 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className={`${theme === 'dark' ? 'text-navy-200' : 'text-gray-300'} header-subtitle`}>{subtitle}</p>
                <p className={`text-sm ${theme === 'dark' ? 'text-navy-300' : 'text-gray-400'} mt-1 header-company`}>
                  {getCompanyName()}
                </p>
              </button>
            </div>
          </div>

          {/* Menú de Usuario */}
          <div className="flex items-center gap-4 header-actions">
            {/* Estado de Conexión */}
            <div className="flex items-center gap-2 text-sm">
              {isOnline ? (
                <Wifi className="h-4 w-4 text-aqua-300" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-300" />
              )}
              <span className={`${theme === 'dark' ? 'text-navy-200' : 'text-gray-300'}`}>
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>

            {/* Cambio de Tema */}
            {mounted && (
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="text-white hover:bg-white/10"
                title={theme === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
              >
                {theme === 'dark' ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
            )}

            {/* Notificaciones */}
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10"
            >
              <Bell className="h-4 w-4" />
            </Button>

            {/* Menú de Usuario */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-white hover:bg-white/10 flex items-center gap-2"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-aqua-500 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <div className="text-left hidden sm:block header-user-info">
                      <p className="text-sm font-medium">{getUserDisplayName()}</p>
                      <p className={`text-xs ${theme === 'dark' ? 'text-navy-200' : 'text-gray-300'}`}>{getUserRoleDisplay()}</p>
                    </div>
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{getUserDisplayName()}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                    <p className="text-xs text-muted-foreground">{getCompanyName()}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <DropdownMenuItem onClick={() => router.push('/dashboard/perfil')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Mi Perfil</span>
                </DropdownMenuItem>
                
                <DropdownMenuItem onClick={() => router.push('/dashboard/configuracion')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configuración</span>
                </DropdownMenuItem>
                
                <DropdownMenuItem onClick={() => router.push('/dashboard/ayuda')}>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  <span>Ayuda</span>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem 
                  onClick={handleSignOut}
                  className="text-red-600 focus:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar Sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Estado de Conexión Expandido */}
        {showConnectionStatus && (
          <div className={`rounded-lg p-4 mb-4 ${
            isOnline 
              ? 'bg-aqua-500/20 border border-aqua-500/30' 
              : 'bg-destructive/20 border border-destructive/30'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isOnline ? (
                  <Wifi className="h-5 w-5 text-aqua-300" />
                ) : (
                  <WifiOff className="h-5 w-5 text-red-300" />
                )}
                <div>
                  <p className="font-medium text-white">
                    {isOnline ? 'Conectado a Internet' : 'Modo Offline'}
                  </p>
                  <p className="text-sm text-gray-200">
                    {isOnline 
                      ? 'Los datos se sincronizan automáticamente'
                      : 'Los datos se guardarán localmente hasta recuperar conexión'
                    }
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowConnectionStatus(false)}
                className="text-white hover:bg-white/10"
              >
                ×
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 