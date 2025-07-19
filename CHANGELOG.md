# Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

## [0.2.0] - 2024-12-19

### 🚀 Nuevas Funcionalidades
- **Navegación optimizada**: Layout compartido del dashboard sin recargas de header
- **Título clickeable**: Navegación rápida al dashboard principal desde el header
- **Página 404 mejorada**: Diseño NaviPesca con navegación inteligente
- **Actualización de perfil funcional**: Integración completa con Supabase Auth y RLS
- **Corrección de redirección**: Botón "Ayuda y Soporte" ahora funciona correctamente

### 🔧 Mejoras Técnicas
- **Layout compartido**: `src/app/dashboard/layout.tsx` con header persistente
- **Navegación inteligente**: Título principal detecta rol y navega al dashboard correcto
- **Políticas RLS**: Configuración de permisos para actualización de perfiles
- **Limpieza de código**: Eliminación de logs y componentes de diagnóstico
- **Gitignore mejorado**: Exclusiones completas para Next.js y archivos temporales

### 🐛 Correcciones
- **Headers duplicados**: Eliminados de páginas individuales del dashboard
- **Sintaxis JSX**: Corregidos errores de estructura en páginas
- **Redirección ayuda**: Corregida ruta de `/dashboard/configuracion/ayuda` a `/dashboard/ayuda`
- **Estructura de archivos**: Optimizada para evitar recargas innecesarias

### 📱 Experiencia de Usuario
- **Navegación fluida**: Sin recargas al cambiar entre páginas del dashboard
- **Feedback visual**: Icono de casa en hover del título principal
- **Página 404 elegante**: Diseño consistente con tema NaviPesca
- **Tooltips informativos**: Indicaciones claras de funcionalidad

### 🔒 Seguridad
- **Políticas RLS**: Configuradas para `clientes` y `usuarios`
- **Validación mejorada**: Zod schemas para formularios de perfil
- **Manejo de errores**: Mejor feedback en actualizaciones de perfil

### 📦 Dependencias
- **Versión actualizada**: De 0.1.0 a 0.2.0
- **Documentación actualizada**: IMPLEMENTATION_SUMMARY.md y ARCHITECTURE.md
- **Gitignore completo**: Exclusiones estándar para proyectos Next.js

---

## [0.1.0] - 2024-12-18

### 🎉 Lanzamiento Inicial
- **Fundación del proyecto**: Estructura Next.js 14 con TypeScript
- **Sistema de autenticación**: Supabase Auth con Google OAuth
- **Dashboards diferenciados**: Comprador y Pesador con métricas mock
- **Tema NaviPesca**: Colores personalizados y modo oscuro
- **Configuración móvil**: Capacitor para apps nativas
- **PWA ready**: Manifest y Service Worker configurados 