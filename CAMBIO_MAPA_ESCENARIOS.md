# 🗺️ Cambio Automático de Ubicación del Mapa según Escenario

## 🎯 Funcionalidad Implementada

El mapa ahora **cambia automáticamente** a la ubicación geográfica correspondiente cuando seleccionas un escenario diferente.

## ✨ Características

### 1. **Animación Suave de Transición**
- Cuando cambias de escenario (Valparaíso → Santiago, etc.)
- El mapa se mueve suavemente a la nueva ubicación
- Duración de animación: 1.5 segundos
- Zoom ajustado automáticamente según el escenario

### 2. **Ubicaciones Configuradas por Escenario**

| Escenario | Ciudad | Coordenadas | Zoom |
|-----------|--------|-------------|------|
| 🔥 Incendio Valparaíso | Valparaíso, Región de Valparaíso | -33.0472, -71.6127 | 13 |
| 🏢 Terremoto Santiago | Santiago, Región Metropolitana | -33.4489, -70.6693 | 12 |
| 🌊 Inundación Maule | Talca, Región del Maule | -35.4264, -71.6554 | 12 |
| 🌋 Erupción Araucanía | Temuco, Región de la Araucanía | -38.7359, -72.6002 | 11 |

### 3. **Indicadores Visuales en el Mapa**

#### A. Panel de Zona de Operación (Superior Izquierdo)
- Muestra el nombre de la ciudad y región actual
- Indicador animado con el color del escenario
- Fondo oscuro con blur para mejor legibilidad

#### B. Contador de Drones (Superior Derecho)
- Muestra el número de drones activos en el escenario
- Se actualiza automáticamente al cambiar de escenario
- Icono visual para identificación rápida

### 4. **Drones Específicos por Ubicación**

Ahora cada escenario tiene su propia flota de drones desplegados en la ubicación correcta:

#### Valparaíso (Incendio)
- `drone-search-1` - Malla-Alpha-1
- `drone-thermal-1` - Malla-Bravo-1
- `drone-vocal-1` - Malla-Charlie-1
- `drone-relay-1` - Malla-Delta-1

#### Santiago (Terremoto)
- `drone-search-2` - Malla-Alpha-2
- `drone-thermal-2` - Malla-Bravo-2
- `drone-vocal-2` - Malla-Charlie-2
- `drone-relay-2` - Malla-Delta-2

#### Maule (Inundación)
- `drone-search-3` - Malla-Alpha-3
- `drone-thermal-3` - Malla-Bravo-3
- `drone-vocal-3` - Malla-Charlie-3
- `drone-relay-3` - Malla-Delta-3

#### Araucanía (Erupción)
- `drone-search-4` - Malla-Alpha-4
- `drone-thermal-4` - Malla-Bravo-4
- `drone-vocal-4` - Malla-Charlie-4
- `drone-relay-4` - Malla-Delta-4

## 🔧 Implementación Técnica

### Componente MapViewController
```tsx
function MapViewController({ center, zoom }: { center: LatLngExpression; zoom: number }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom, {
      animate: true,
      duration: 1.5,
    });
  }, [center, zoom, map]);
  
  return null;
}
```

Este componente:
- Se ejecuta dentro de MapContainer
- Escucha cambios en center y zoom
- Anima la transición del mapa
- Usa el hook useMap() de React Leaflet

### Integración en MapView
```tsx
<MapContainer ...>
  <MapViewController 
    center={[config.center.lat, config.center.lng]} 
    zoom={config.zoom} 
  />
  {/* resto del contenido */}
</MapContainer>
```

## 📊 Beneficios para el Usuario

### Contexto Geográfico Inmediato
✅ Ves instantáneamente dónde está ocurriendo la emergencia  
✅ Entiendes la escala del despliegue de drones  
✅ Identificas rápidamente las ubicaciones de víctimas  

### Navegación Intuitiva
✅ No necesitas buscar manualmente la ubicación  
✅ El zoom se ajusta automáticamente  
✅ Animación suave previene desorientación  

### Mejor Comprensión del Operativo
✅ Ves los drones específicos de cada zona  
✅ Entiendes la cobertura de la red mesh  
✅ Contextualizas las operaciones de rescate  

## 🎮 Cómo Usar

1. **Selecciona un escenario** desde el header superior:
   - Click en cualquier botón de escenario
   
2. **El mapa se mueve automáticamente** a:
   - La ubicación geográfica del escenario
   - Con el nivel de zoom apropiado
   - Mostrando los drones de esa zona

3. **Observa los indicadores**:
   - Panel superior izquierdo: Ciudad y región
   - Panel superior derecho: Cantidad de drones
   - Marcadores en el mapa: Drones y víctimas

## 🚀 Próximas Mejoras Posibles

### 1. Transiciones Más Avanzadas
- Efecto de "vuelo" con arco
- Zoom out → Pan → Zoom in
- Rotación del mapa según dirección

### 2. Información Geográfica Adicional
- Límites de regiones/comunas
- Puntos de interés (hospitales, bases de operación)
- Rutas de evacuación
- Zonas de riesgo

### 3. Capas de Mapa Alternativas
- Mapa satelital
- Mapa de terreno
- Vista híbrida
- Mapa nocturno

### 4. Historial de Ubicaciones
- Breadcrumb trail de escenarios visitados
- Botón "Volver a ubicación anterior"
- Bookmarks de ubicaciones favoritas

### 5. Modo Comparación
- Split screen con dos escenarios
- Vista lado a lado
- Comparación de métricas

## 💡 Tips para Usuarios

### Para Entrenamiento
- Cambia entre escenarios para familiarizarte con cada ubicación
- Observa cómo cambian las flotas de drones
- Identifica patrones de despliegue por tipo de emergencia

### Para Presentaciones
- Usa las transiciones suaves para demos en vivo
- Los indicadores visuales son ideales para explicar operaciones
- El contador de drones muestra capacidad de respuesta

### Para Análisis
- Compara despliegues entre diferentes regiones
- Evalúa cobertura geográfica de la red mesh
- Identifica necesidades de recursos por zona

## 📝 Archivos Modificados

### `components/dashboard/MapView.tsx`
- ✅ Agregado componente MapViewController
- ✅ Agregado panel de zona de operación
- ✅ Agregado contador de drones activos
- ✅ Mejorada inclusión de drones thermal

### `data/seed-data.ts`
- ✅ Ampliada flota de drones (4 de cada tipo)
- ✅ Drones posicionados en cada ubicación
- ✅ Configuraciones de coordenadas validadas

## 🎯 Resultado

Ahora tienes un **sistema de visualización geográfica inteligente** que:
- Se adapta automáticamente al contexto
- Proporciona información visual clara
- Mejora la comprensión operacional
- Facilita la navegación entre escenarios

---

*Esta funcionalidad transforma el mapa de estático a dinámico e inteligente, mejorando significativamente la experiencia del usuario.*
