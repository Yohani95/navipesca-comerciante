# Flujo Real de Pesaje - NaviPesca Comerciante

## 🚢 Descripción del Flujo Real

El sistema ahora maneja el flujo real de trabajo del pesador, permitiendo **múltiples embarcaciones en paralelo** según las necesidades prácticas de las zonas de descarga de pesca.

## 📋 Flujo de Trabajo Implementado

### 1. **Espera de Llegada**
- El pesador se mantiene atento a la llegada de embarcaciones
- Las embarcaciones pueden arribar en distintos momentos
- No siempre de forma ordenada

### 2. **Inicio de Pesaje**
- Al llegar una embarcación, el pesador inicia el proceso
- Se asocia la embarcación a un grupo de bins
- El sistema crea un registro de "pesaje en proceso"

### 3. **Tara de Bins**
- Antes de cargar pescado, los bins deben ser registrados con su peso vacío
- Se hace manualmente por el pesador, uno por uno
- Cada bin se registra con su código y tara

### 4. **Carga y Pesaje Bruto**
- A medida que se llena cada bin con pescado, se registra su peso bruto
- El sistema calcula automáticamente el peso neto:
  ```
  Peso neto = peso bruto - tara
  ```

### 5. **Cierre del Pesaje**
- Una vez que todos los bins de esa embarcación han sido pesados
- El pesador puede cerrar el pesaje
- Esto indica que el proceso está completo para esa embarcación

## 🔄 Múltiples Embarcaciones en Paralelo

### Características Implementadas:

✅ **Varios procesos de pesaje abiertos simultáneamente**
- Cada embarcación tiene su propio pesaje independiente
- Estados separados: 'tara', 'pesaje', 'completado'

✅ **Cambio entre embarcaciones**
- El pesador puede cambiar de una embarcación a otra en cualquier momento
- Interfaz clara que muestra todos los pesajes activos

✅ **Bins separados por embarcación**
- Cada embarcación mantiene sus propios bins
- No hay interferencia entre embarcaciones

✅ **Flujo ágil y realista**
- Adaptado a situaciones comunes en zonas de descarga
- Manejo de llegadas no ordenadas

## 🗄️ Estructura de Base de Datos

### Nuevas Tablas:

#### `pesajes_en_proceso`
```sql
- id: Identificador único
- embarcacionId: Referencia a la embarcación
- embarcacionNombre: Nombre de la embarcación
- estado: 'tara' | 'pesaje' | 'completado'
- fechaInicio: Cuándo se inició el pesaje
- fechaCierre: Cuándo se completó (opcional)
- usuarioId: Quién registró el pesaje
- clienteId: Cliente asociado
- observaciones: Notas adicionales
```

#### `bins_pesaje`
```sql
- id: Identificador único
- pesajeId: Referencia al pesaje en proceso
- binId: Referencia al bin
- codigo: Código del bin
- tara: Peso del contenedor vacío
- pesoBruto: Peso total (bin + producto)
- pesoNeto: Peso del producto (calculado automáticamente)
- estado: 'pendiente' | 'tara_completada' | 'pesaje_completado'
- observaciones: Notas adicionales
```

## 🎯 Funcionalidades del Dashboard

### Estadísticas en Tiempo Real:
- **Embarcaciones Activas**: Cuántas tienen pesajes en proceso
- **Bins Pendientes**: Cuántos bins están por procesar
- **Kilos Hoy**: Total registrado en el día
- **Estado de Conexión**: Online/Offline

### Gestión de Pesajes:
- **Iniciar Pesaje**: Seleccionar embarcación y comenzar
- **Agregar Bins**: Registrar tara de contenedores
- **Registrar Peso**: Ingresar peso bruto (neto se calcula automáticamente)
- **Cerrar Pesaje**: Finalizar cuando todos los bins están completos

### Interfaz Responsiva:
- **Web**: Pantalla completa con todas las opciones
- **Android/iOS**: Optimizada para pantallas táctiles
- **Offline**: Funciona sin conexión, sincroniza después

## 🔧 Acciones del Servidor Implementadas

### `iniciarPesaje(embarcacionId)`
- Crea un nuevo pesaje en proceso
- Verifica que no haya otro pesaje activo para la misma embarcación
- Estado inicial: 'tara'

### `agregarBinAlPesaje(pesajeId, codigoBin, tara)`
- Agrega un bin al pesaje en proceso
- Crea o actualiza el bin en la base de datos
- Estado del bin: 'tara_completada'

### `registrarPesoBruto(pesajeId, binId, pesoBruto)`
- Registra el peso bruto de un bin
- Calcula automáticamente el peso neto
- Estado del bin: 'pesaje_completado'

### `cerrarPesaje(pesajeId)`
- Verifica que todos los bins tengan peso registrado
- Crea registros finales en la tabla `pesajes`
- Marca el pesaje como 'completado'

### `obtenerPesajesEnProceso()`
- Obtiene todos los pesajes activos del cliente
- Incluye información de bins asociados

### `obtenerEstadisticasPesador()`
- Calcula estadísticas en tiempo real
- Embarcaciones activas, bins pendientes, kilos del día

## 📱 Experiencia de Usuario

### Flujo Típico:
1. **Pesador llega al punto de descarga**
2. **Ve embarcaciones disponibles** en el dashboard
3. **Inicia pesaje** para la primera embarcación que llega
4. **Registra tara** de todos los bins de esa embarcación
5. **Mientras tanto, llegan más embarcaciones**
6. **Inicia pesajes paralelos** para las nuevas embarcaciones
7. **Alterna entre embarcaciones** según la disponibilidad
8. **Registra pesos brutos** a medida que se llenan los bins
9. **Cierra pesajes** cuando están completos
10. **Continúa con las siguientes embarcaciones**

### Ventajas del Sistema:
- ✅ **Flexibilidad**: Maneja llegadas no ordenadas
- ✅ **Eficiencia**: Múltiples embarcaciones simultáneas
- ✅ **Precisión**: Cálculo automático de pesos netos
- ✅ **Trazabilidad**: Registro completo de todo el proceso
- ✅ **Offline**: Funciona sin conexión
- ✅ **Responsive**: Adaptado a todos los dispositivos

## 🚀 Próximos Pasos

### Funcionalidades Adicionales:
- [ ] **Notificaciones push** cuando llegan embarcaciones
- [ ] **Códigos QR** para identificación rápida de bins
- [ ] **Integración con balanzas** electrónicas
- [ ] **Reportes automáticos** por embarcación
- [ ] **Sincronización en tiempo real** entre dispositivos

### Mejoras de UX:
- [ ] **Modo oscuro** optimizado para trabajo nocturno
- [ ] **Vibración** para confirmaciones táctiles
- [ ] **Comandos de voz** para manos libres
- [ ] **Modo offline avanzado** con sincronización inteligente

---

**Versión**: 1.0.0  
**Fecha**: 19 de Diciembre, 2024  
**Estado**: ✅ Implementado y funcional 