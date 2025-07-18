# 🐟 NaviPesca Comerciante

Sistema de gestión comercial para compradores de pesca con soporte offline y multiplataforma.

## 🎯 Características Principales

- **Dashboard por roles**: Comprador, Pesador y Admin
- **Gestión de pesajes**: Registro múltiple de embarcaciones con bins
- **Modo offline**: Funciona sin conexión y sincroniza automáticamente
- **Facturación automática**: $1 CLP por kilo registrado mensualmente
- **Reportes y estadísticas**: PDF/CSV con filtros avanzados
- **Multiplataforma**: Web, móvil (iOS/Android) y tablets
- **Modo oscuro**: UI optimizada para trabajo nocturno

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Backend**: Supabase + Prisma ORM
- **Auth**: Supabase Auth (Google + email)
- **UI**: Radix UI + shadcn/ui components
- **Mobile**: Capacitor
- **Estado**: Zustand + React Query
- **Base de datos**: PostgreSQL con RLS

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/navipesca-comerciante.git
cd navipesca-comerciante
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
```bash
cp .env.example .env.local
```

Edita `.env.local` con tus credenciales de Supabase:
```env
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 4. Configurar base de datos
```bash
# Generar cliente de Prisma
npm run db:generate

# Aplicar migraciones
npm run db:push
```

### 5. Ejecutar en desarrollo
```bash
npm run dev
```

## 📱 Compilación para móviles

### Android
```bash
# Compilar para producción
npm run capacitor:build

# Agregar plataforma Android
npx cap add android

# Abrir en Android Studio
npx cap open android
```

### iOS
```bash
# Compilar para producción
npm run capacitor:build

# Agregar plataforma iOS
npx cap add ios

# Abrir en Xcode
npx cap open ios
```

## 🗃️ Estructura de la Base de Datos

### Tablas principales:
- **clientes**: Información de compradores
- **usuarios**: Roles y permisos (comprador/pesador/admin)
- **embarcaciones**: Registro de embarcaciones
- **bins**: Contenedores para pesaje
- **pesajes**: Registros de peso con estado de sincronización
- **pagos**: Historial de pagos manuales
- **cobros_mensuales**: Facturación automática mensual

### Seguridad RLS (Row Level Security)
Todas las tablas implementan políticas de seguridad que filtran por `clienteId`:

```sql
CREATE POLICY "cliente accede solo a sus datos"
ON tabla_name
FOR ALL USING (cliente_id = auth.uid());
```

## 🔄 Flujo de Trabajo

### Registro de Cliente
1. Usuario se registra → Se crea entrada en `clientes`
2. Período de prueba: 1 mes gratuito
3. Después: $1 CLP por kilo registrado mensualmente

### Proceso de Pesaje
1. Pesador registra múltiples embarcaciones
2. Asocia bins → tara → peso bruto
3. Sistema calcula peso neto automáticamente
4. Funciona offline, sincroniza cuando hay conexión

### Estados de Sincronización
- `pendiente`: No sincronizado
- `sincronizado`: Subido al servidor
- `error`: Falló la sincronización

## 🎨 Tema Visual

### Colores NaviPesca:
- **Azul marino** (`#0f172a`): Navegación principal
- **Verde agua** (`#14b8a6`): Datos sincronizados, éxito
- **Amarillo** (`#f59e0b`): Pendientes, advertencias
- **Rojo** (`#ef4444`): Errores, duplicados

### Componentes Personalizados:
- Gradientes: `.gradient-navy`, `.gradient-aqua`
- Sombras: `.shadow-navy`, `.shadow-aqua`
- Animaciones: `.fade-in`, `.slide-up`

## 📊 Dashboards

### Comprador
- Métricas de kilos diarios/mensuales
- Estado de embarcaciones activas
- Resumen de facturación
- Acciones rápidas: nuevo pesaje, reportes

### Pesador
- Pesajes del día
- Estado de sincronización
- Registro offline
- Vista móvil optimizada

### Admin Global
- Métricas de todos los clientes
- Gestión de tarifas
- Estados de suscripción
- Análisis del sistema

## 🔒 Seguridad

- **Autenticación**: Supabase Auth con Google OAuth
- **Autorización**: RLS en PostgreSQL
- **Filtrado automático**: Middleware de Prisma por `clienteId`
- **Validación**: Esquemas de datos con TypeScript

## 📈 Modo de Prueba vs Suscripción

### Prueba (1 mes):
- Acceso completo a funcionalidades
- Sin límites de pesajes
- Todos los reportes disponibles

### Suscripción:
- $1 CLP por kilo registrado/mes
- Facturación automática
- Bloqueo de pesajes si no se paga
- Historial en modo lectura

## 🧪 Testing y Desarrollo

```bash
# Ejecutar tests
npm test

# Linter
npm run lint

# Prisma Studio (visualizar datos)
npm run db:studio

# Build de producción
npm run build
```

## 📱 Características Móviles

- **PWA**: Instalable como app nativa
- **Offline-first**: Almacenamiento local con IndexedDB
- **Sincronización**: Automática al recuperar conexión
- **Optimización táctil**: Botones grandes, navegación simple
- **Orientación**: Funciona en portrait y landscape

## 🚀 Deployment

### Vercel (Recomendado para web)
```bash
# Conectar repositorio en Vercel
# Configurar variables de entorno
# Deploy automático con Git
```

### Distribución móvil
- **Android**: Google Play Store
- **iOS**: Apple App Store
- **Web**: PWA instalable

## 📞 Soporte

Para soporte técnico o reportar bugs:
- Crear issue en GitHub
- Email: soporte@navipesca.com
- Documentación: [docs.navipesca.com](https://docs.navipesca.com)

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver `LICENSE` para más detalles.

---

**Desarrollado con ❤️ para la industria pesquera chilena**