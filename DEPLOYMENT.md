# 🚀 Guía de Deployment - NaviPesca Comerciante

## 📋 Prerrequisitos

- Cuenta en [Vercel](https://vercel.com)
- Cuenta en [Supabase](https://supabase.com)
- Repositorio en GitHub conectado a Vercel

## 🔧 Configuración de Variables de Entorno

### 1. Variables Requeridas

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Database URL (for Prisma)
DATABASE_URL=your_database_url

# Next.js Configuration
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your_nextauth_secret
```

### 2. Configuración en Vercel

1. Ve a tu proyecto en Vercel Dashboard
2. Navega a **Settings** → **Environment Variables**
3. Agrega cada variable de entorno:

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL de tu proyecto Supabase | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave anónima de Supabase | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave de servicio de Supabase | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `DATABASE_URL` | URL de la base de datos PostgreSQL | `postgresql://user:pass@host:port/db` |
| `NEXTAUTH_URL` | URL de tu aplicación en producción | `https://navipesca.vercel.app` |
| `NEXTAUTH_SECRET` | Secreto para NextAuth | `tu-secreto-seguro-aqui` |

## 🚀 Pasos para Deploy

### 1. Conectar Repositorio

1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Haz clic en **"New Project"**
3. Importa tu repositorio de GitHub
4. Selecciona el repositorio `navipesca-comerciante`

### 2. Configurar Build Settings

Vercel detectará automáticamente que es un proyecto Next.js, pero puedes verificar:

- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### 3. Configurar Variables de Entorno

1. En la configuración del proyecto, ve a **Environment Variables**
2. Agrega todas las variables listadas arriba
3. Asegúrate de que estén configuradas para **Production**, **Preview** y **Development**

### 4. Configurar Dominio Personalizado (Opcional)

1. Ve a **Settings** → **Domains**
2. Agrega tu dominio personalizado
3. Configura los registros DNS según las instrucciones de Vercel

## 🔧 Configuración de Supabase

### 1. Configurar RLS (Row Level Security)

Asegúrate de que las políticas RLS estén configuradas correctamente:

```sql
-- Ejemplo de política para embarcaciones
CREATE POLICY "Users can view their own embarcaciones" ON embarcaciones
FOR ALL USING (auth.uid() = cliente_id);
```

### 2. Configurar Webhooks (Opcional)

Si necesitas webhooks para sincronización:

1. Ve a tu proyecto Supabase
2. Navega a **Database** → **Webhooks**
3. Configura webhooks para eventos de base de datos

## 📱 Configuración para Dispositivos Móviles

### 1. Configurar Capacitor

```bash
# Instalar dependencias de Capacitor
npm install @capacitor/core @capacitor/cli

# Inicializar Capacitor
npx cap init

# Agregar plataformas
npx cap add android
npx cap add ios
```

### 2. Configurar Build para Móvil

```bash
# Build para producción
npm run build

# Sincronizar con Capacitor
npx cap sync

# Abrir en Android Studio
npx cap open android

# Abrir en Xcode (solo macOS)
npx cap open ios
```

## 🔍 Verificación del Deploy

### 1. Verificar Funcionalidades

Después del deploy, verifica:

- ✅ **Autenticación**: Login/logout funciona
- ✅ **Dashboard**: Se carga correctamente
- ✅ **Embarcaciones**: CRUD funciona
- ✅ **Configuración**: Navegación funciona
- ✅ **Responsive**: Se ve bien en móvil

### 2. Verificar Variables de Entorno

```bash
# En Vercel Dashboard, verifica que todas las variables estén configuradas
# Especialmente las variables de Supabase
```

### 3. Verificar Logs

1. Ve a **Functions** en Vercel Dashboard
2. Revisa los logs por errores
3. Verifica que las Server Actions funcionen

## 🚨 Troubleshooting

### Error: "Environment variable not found"

1. Verifica que todas las variables estén configuradas en Vercel
2. Asegúrate de que los nombres coincidan exactamente
3. Reinicia el deploy después de agregar variables

### Error: "Database connection failed"

1. Verifica que `DATABASE_URL` esté correcta
2. Asegúrate de que la base de datos esté accesible desde Vercel
3. Verifica las políticas de firewall de Supabase

### Error: "Authentication failed"

1. Verifica que las claves de Supabase sean correctas
2. Asegúrate de que `NEXTAUTH_URL` apunte a tu dominio de producción
3. Verifica que `NEXTAUTH_SECRET` esté configurado

## 📊 Monitoreo

### 1. Analytics

Configura Google Analytics:

```bash
# Agregar variable de entorno
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### 2. Error Tracking

Configura Sentry para monitoreo de errores:

```bash
# Agregar variable de entorno
NEXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx
```

## 🔄 Actualizaciones

### 1. Deploy Automático

- Cada push a `main` activará un deploy automático
- Los deploys de preview se crean para pull requests

### 2. Rollback

Si necesitas hacer rollback:

1. Ve a **Deployments** en Vercel Dashboard
2. Encuentra el deploy anterior estable
3. Haz clic en **"Redeploy"**

## 📞 Soporte

Si tienes problemas con el deploy:

1. Revisa los logs en Vercel Dashboard
2. Verifica las variables de entorno
3. Consulta la documentación de [Vercel](https://vercel.com/docs)
4. Revisa la documentación de [Supabase](https://supabase.com/docs)

---

**Nota**: Esta guía asume que ya tienes configurado Supabase y tu base de datos. Si necesitas ayuda con la configuración inicial de Supabase, consulta la documentación oficial. 