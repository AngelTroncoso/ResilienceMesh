# Mejoras en la Visualización del Mapa de Drones

## 🎯 Objetivo
Mejorar la visualización de los drones en el mapa para mostrar su actividad en tiempo real durante las operaciones de emergencia.

## ✨ Mejoras Implementadas

### 1. **Marcadores Dinámicos de Drones**
- Los drones ahora se muestran con su posición en tiempo real desde la telemetría
- Cada drone tiene un icono personalizado según su rol y estado
- Iconos con colores específicos:
  - 🔵 Azul: Drones de búsqueda (search)
  - 🔴 Rojo: Drones térmicos (thermal)
  - 🟢 Verde: Drones vocales (vocal)
  - 🟣 Morado: Drones relay (relay)
  - 🟡 Ámbar: Drones de entrega (delivery)

### 2. **Indicadores de Estado Visual**
Los drones muestran diferentes estados:
- **Activo**: Color brillante con animación de pulso si tiene tarea asignada
- **Inactivo (idle)**: Color gris
- **Batería baja**: Color amarillo con indicador
- **Batería crítica**: Color rojo
- **Regresando a base**: Color cyan
- **Fuera de línea**: Color gris oscuro

### 3. **Indicadores de Batería**
- Punto amarillo en la esquina superior derecha cuando la batería está por debajo del 30%
- Visible desde el mapa sin necesidad de hacer clic

### 4. **Animaciones en Tiempo Real**
- **Pulso**: Los drones con tareas asignadas tienen una animación de pulso para indicar actividad
- **Ping**: Las víctimas tienen una animación de ping para llamar la atención

### 5. **Popups Informativos Mejorados**
Al hacer clic en un drone, se muestra:
- ID del drone
- Estado actual (con indicador visual)
- Nivel de batería (con color según nivel)
- Altitud en metros
- Velocidad en m/s
- Señal de mesh network
- **Tarea activa** (si está asignado):
  - Rol en la tarea
  - Descripción de la tarea
  - Prioridad
  - Procedimiento detallado
- Estado de "Regresando a base" si aplica

### 6. **Marcadores de Víctimas Mejorados**
- Icono de emergencia (🆘)
- Animación de ping para destacar
- Popup con información detallada:
  - Descripción
  - Severidad (con color)
  - Estado actual
  - Lesiones (si aplica)

### 7. **Actualización en Tiempo Real**
- Los marcadores se actualizan automáticamente con la telemetría
- Las posiciones de los drones se mueven según la simulación
- Los estados y tareas se reflejan instantáneamente

## 🎨 Estilos Personalizados

Se agregó un archivo CSS (`MapView.css`) con:
- Animaciones personalizadas (pulse, ping, bounce)
- Estilos mejorados para popups
- Indicadores visuales de tarea

## 🔧 Componentes Modificados

### `MapView.tsx`
- Agregada función `createDroneIcon()` para iconos personalizados
- Nuevo componente `DroneLiveMarker` para renderizar drones con telemetría
- Integración completa con el contexto de simulación
- Marcadores de víctimas con iconos y animaciones personalizados

### `MapView.css` (nuevo)
- Estilos y animaciones personalizadas para el mapa

## 📊 Información Mostrada

### Para cada Drone:
1. **Visual**: Color según rol, pulso si está activo, indicador de batería
2. **Telemetría**: Batería, altitud, velocidad, señal mesh
3. **Tarea**: Rol, descripción, prioridad, procedimiento
4. **Estado**: Active, idle, low-battery, critical-battery, returning, offline

### Para cada Víctima:
1. **Visual**: Icono 🆘 con animación ping
2. **Información**: Descripción, severidad, estado, lesiones

## 🚀 Cómo Funciona

1. El componente `MapView` consume el contexto de simulación
2. Obtiene la telemetría de todos los drones activos en el escenario
3. Para cada drone, crea un `DroneLiveMarker` que:
   - Lee la telemetría en tiempo real
   - Verifica si tiene una tarea asignada
   - Genera un icono personalizado según estado
   - Muestra toda la información relevante en el popup
4. Se actualiza automáticamente cuando cambia el estado de la simulación

## 💡 Beneficios

- ✅ Visualización clara de qué drones están trabajando
- ✅ Identificación rápida de problemas (batería baja, drones offline)
- ✅ Seguimiento de tareas asignadas sin salir del mapa
- ✅ Mejor comprensión del estado general de la operación
- ✅ Animaciones que llaman la atención sobre elementos importantes

## 🔄 Próximas Mejoras Posibles

1. Líneas de trayectoria que muestren el camino recorrido
2. Áreas de cobertura por tipo de sensor
3. Líneas de conexión entre drones relay para visualizar la red mesh
4. Historial de posiciones con trail effect
5. Clustering de drones cuando hay muchos en una zona
6. Filtros para mostrar/ocultar tipos específicos de drones
