# 🏗️ Arquitectura del Proyecto

## 📁 Estructura de Carpetas

```
src/
├── app/                    # Next.js App Router
│   ├── dashboard/         # Páginas del dashboard
│   │   ├── layout.tsx    # Layout compartido con header persistente
│   │   ├── perfil/       # Gestión de perfil
│   │   ├── configuracion/ # Configuración del sistema
│   │   ├── ayuda/        # Ayuda y soporte
│   │   ├── comprador/    # Dashboard del comprador
│   │   └── pesador/      # Dashboard del pesador
│   ├── globals.css       # Estilos globales
│   ├── layout.tsx        # Layout principal
│   ├── page.tsx          # Página de inicio
│   └── not-found.tsx     # Página 404 mejorada
├── components/            # Componentes reutilizables
│   ├── ui/              # Componentes de UI base
│   ├── auth/            # Componentes de autenticación
│   └── providers/       # Providers de contexto
├── hooks/               # Hooks personalizados
├── lib/                 # Utilidades y configuraciones
│   ├── actions/         # Server Actions
│   ├── supabase/        # Configuración de Supabase
│   └── utils.ts         # Utilidades generales
└── types/               # Definiciones de tipos TypeScript
```

## 🔧 Tecnologías y Patrones

### **Server Actions (Recomendado)**
- ✅ **Mejor rendimiento** que API routes
- ✅ **Type safety** nativo
- ✅ **Validación** del lado del servidor
- ✅ **Menos código** y más simple
- ✅ **Integración directa** con Supabase

### **Estructura de Server Actions**
```typescript
// src/lib/actions/user-actions.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// 1. Schema de validación
const updateProfileSchema = z.object({
  nombre: z.string().min(2).max(50),
  // ...
})

// 2. Función de actualización
export async function updateUserProfile(data: UpdateProfileInput) {
  // Validación
  // Lógica de negocio
  // Actualización en BD
  // Revalidación de cache
}
```

### **Hooks Personalizados**
```typescript
// src/hooks/use-profile-form.ts
export function useProfileForm() {
  // Estado del formulario
  // Validación
  // Manejo de errores
  // Integración con Server Actions
}
```

## 🗄️ Base de Datos

### **Supabase Schema**
```sql
-- Tabla de clientes
CREATE TABLE clientes (
  id SERIAL PRIMARY KEY,
  id_usuario UUID REFERENCES auth.users(id),
  nombre VARCHAR(50) NOT NULL,
  apellido VARCHAR(50) NOT NULL,
  telefono VARCHAR(20),
  nombre_empresa VARCHAR(100) NOT NULL,
  direccion TEXT,
  tarifa_por_kilo DECIMAL(10,2) DEFAULT 1.00,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Trigger para sincronizar con auth.users
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO clientes (id_usuario, nombre, apellido, nombre_empresa)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'nombre', 
          NEW.raw_user_meta_data->>'apellido', 
          NEW.raw_user_meta_data->>'nombreEmpresa');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

## 🔐 Autenticación

### **Flujo de Autenticación**
1. **Registro**: Usuario se registra en Supabase Auth
2. **Trigger**: Se ejecuta automáticamente `handle_new_user()`
3. **Sincronización**: Se crea registro en tabla `clientes`
4. **Metadata**: Datos adicionales se guardan en `user_metadata`
5. **Actualización**: Perfil funcional con políticas RLS configuradas

### **Gestión de Sesión**
```typescript
// src/hooks/use-auth.ts
export function useAuth() {
  // Estado de autenticación
  // Funciones de login/logout
  // Datos del usuario
}
```

## 🎨 UI/UX

### **Sistema de Diseño**
- **Tailwind CSS**: Estilos utilitarios
- **Radix UI**: Componentes accesibles
- **Lucide React**: Iconografía
- **next-themes**: Gestión de temas

### **Componentes Base**
```typescript
// src/components/ui/
├── button.tsx      # Botones con variantes
├── card.tsx        # Tarjetas de contenido
├── input.tsx       # Campos de entrada
├── form-input.tsx  # Input con validación
├── loading-spinner.tsx # Indicadores de carga
├── dashboard-header.tsx # Header persistente con navegación
└── connection-diagnostic.tsx # Diagnóstico de conectividad
```

## 📱 PWA y Capacitor

### **Configuración PWA**
- **Manifest**: `/public/manifest.json`
- **Service Worker**: `/public/sw.js`
- **Iconos**: Múltiples tamaños para diferentes dispositivos

### **Configuración Capacitor**
```typescript
// capacitor.config.ts
const config: CapacitorConfig = {
  appId: 'com.navipesca.comerciante',
  webDir: 'out',
  plugins: {
    SplashScreen: { /* ... */ },
    StatusBar: { /* ... */ }
  }
}
```

## 🚀 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Servidor de desarrollo
npm run build            # Construcción para producción

# Base de datos
npm run db:generate      # Generar cliente Prisma
npm run db:push          # Sincronizar esquema
npm run db:migrate       # Ejecutar migraciones

# PWA
npm run pwa:build        # Construir PWA
npm run pwa:serve        # Servir PWA localmente

# Capacitor
npm run mobile:build     # Construir para móvil
npm run mobile:ios       # Ejecutar en iOS
npm run mobile:android   # Ejecutar en Android
```

## 🔄 Flujo de Datos

### **Actualización de Perfil**
1. **Usuario** edita formulario
2. **Hook** valida datos localmente
3. **Supabase Client** actualiza auth.users y clientes
4. **Políticas RLS** validan permisos
5. **Cache** se revalida automáticamente
6. **UI** se actualiza con nuevos datos
7. **Navegación** fluida sin recargas de header

### **Manejo de Errores**
- **Validación cliente**: Errores inmediatos
- **Validación servidor**: Errores de seguridad
- **Errores de red**: Toast notifications
- **Errores de BD**: Logs y fallbacks

## 📊 Escalabilidad

### **Patrones Recomendados**
- ✅ **Supabase Client** para operaciones CRUD directas
- ✅ **Hooks personalizados** para lógica reutilizable
- ✅ **Validación Zod** para type safety
- ✅ **Componentes composables** para UI
- ✅ **Layout compartido** para navegación optimizada
- ✅ **Políticas RLS** para seguridad de datos

### **Próximos Pasos**
1. **Implementar** sistema de pesajes con Supabase
2. **Crear** componentes de formulario avanzados
3. **Agregar** tests unitarios
4. **Optimizar** performance con React.memo
5. **Implementar** lazy loading de componentes
6. **Mejorar** políticas RLS para todas las tablas 