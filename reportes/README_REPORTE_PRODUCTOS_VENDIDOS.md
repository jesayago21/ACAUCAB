# 📊 Reporte de Productos Vendidos

Este reporte te permite analizar cuántos productos se han vendido en un período específico, con la flexibilidad de variar los parámetros de fecha según tus necesidades.

## 🎯 ¿Qué información incluye?

El reporte proporciona un análisis completo de las ventas de productos, incluyendo:

- **Resumen general** de ventas por período
- **Top 5 productos** más vendidos
- **Detalle completo** de todos los productos vendidos
- **Distribución por canal** de venta (Tienda Física, Online, Eventos)
- **Métricas financieras** (total ventas, precio promedio)
- **Información del producto** (productor, tipo de cerveza, grado de alcohol)

## 📅 Cómo variar los parámetros de fecha

### Opción 1: Fechas por defecto
```bash
# Generar reporte HTML con fechas por defecto (2025-06-01 a 2025-07-01)
node generar_reporte_ventas_productos.js

# Generar reporte PDF con fechas por defecto
node generar_reporte_ventas_productos.js --pdf
```

### Opción 2: Fechas personalizadas desde línea de comandos
```bash
# Reporte HTML para un período específico
node generar_reporte_ventas_productos.js --fechas 2024-11-01 2024-11-30

# Reporte PDF para un período específico
node generar_reporte_ventas_productos.js --fechas 2024-11-01 2024-11-30 --pdf

# Reporte para un mes específico
node generar_reporte_ventas_productos.js --fechas 2024-12-01 2024-12-31 --pdf

# Reporte para una semana específica
node generar_reporte_ventas_productos.js --fechas 2024-12-16 2024-12-22 --pdf
```

### Opción 3: Modificar fechas en el código
Puedes editar directamente el archivo `data/Reportes/ventas_productos_report.js`:

```javascript
// Líneas 8-9 del archivo
const fechaInicio = '2024-11-01';  // Cambia esta fecha
const fechaFin = '2024-11-30';     // Cambia esta fecha
```

## 📋 Ejemplos de uso

### Ejemplo 1: Análisis mensual
```bash
# Generar reporte del mes de noviembre 2024
node generar_reporte_ventas_productos.js --fechas 2024-11-01 2024-11-30 --pdf
```

### Ejemplo 2: Análisis trimestral
```bash
# Generar reporte del primer trimestre 2024
node generar_reporte_ventas_productos.js --fechas 2024-01-01 2024-03-31 --pdf
```

### Ejemplo 3: Análisis semanal
```bash
# Generar reporte de la semana del 16 al 22 de diciembre
node generar_reporte_ventas_productos.js --fechas 2024-12-16 2024-12-22 --pdf
```

### Ejemplo 4: Análisis de fin de año
```bash
# Generar reporte de diciembre 2024
node generar_reporte_ventas_productos.js --fechas 2024-12-01 2024-12-31 --pdf
```

## 📊 Información que obtendrás

### Resumen General
- Total de productos vendidos
- Total de ventas en bolívares
- Distribución por canal de venta:
  - Tienda Física
  - Tienda Online
  - Eventos

### Top 5 Productos
- Los productos más vendidos del período
- Cantidad vendida por producto
- Total de ventas por producto
- Precio promedio
- Distribución por canal de venta

### Tabla Detallada
- Lista completa de todos los productos vendidos
- Información detallada de cada producto
- Métricas de venta por canal

## 🔍 Consultas SQL utilizadas

El reporte combina datos de tres fuentes principales:

1. **Ventas de Tienda Física**: `detalle_venta_fisica` + `venta_tienda_fisica`
2. **Ventas Online**: `detalle_venta_online` + `venta_online`
3. **Ventas de Eventos**: `detalle_venta_evento` + `venta_evento`

### Estructura de las consultas
```sql
-- Ejemplo para ventas físicas
SELECT 
  c.nombre AS nombre_cerveza,
  p.nombre AS presentacion,
  SUM(dvf.cantidad) AS cantidad_vendida,
  SUM(dvf.cantidad * dvf.precio_unitario) AS total_ventas
FROM detalle_venta_fisica dvf
JOIN venta_tienda_fisica vtf ON dvf.fk_venta_tienda_fisica = vtf.clave
-- ... más JOINs para obtener información completa
WHERE vtf.fecha BETWEEN $1 AND $2
GROUP BY c.nombre, p.nombre
ORDER BY cantidad_vendida DESC;
```

## 📁 Archivos generados

Los reportes se guardan en:
- **HTML**: `ReportesPdf/ventas_productos/reporte_ventas_productos_YYYY-MM-DD.html`
- **PDF**: `ReportesPdf/ventas_productos/reporte_ventas_productos_YYYY-MM-DD.pdf`

### Nomenclatura de archivos
- **Fechas por defecto**: `reporte_ventas_productos_2025-06-22.html`
- **Fechas personalizadas**: `reporte_ventas_productos_2024-11-01_a_2024-11-30.html`

## ⚙️ Configuración avanzada

### Modificar el período por defecto
Edita las líneas 8-9 en `data/Reportes/ventas_productos_report.js`:

```javascript
const fechaInicio = '2024-01-01';  // Fecha de inicio por defecto
const fechaFin = '2024-12-31';     // Fecha de fin por defecto
```

### Personalizar el reporte
Puedes modificar:
- **Plantilla HTML**: `data/Reportes/ventas_productos_template.html`
- **Lógica de datos**: `data/Reportes/ventas_productos_report.js`
- **Configuración**: `generar_reporte_ventas_productos.js`

## 🚀 Comandos rápidos

```bash
# Ayuda del script
node generar_reporte_ventas_productos.js

# Reporte del mes actual (ejemplo)
node generar_reporte_ventas_productos.js --fechas 2024-12-01 2024-12-31 --pdf

# Reporte de la semana pasada
node generar_reporte_ventas_productos.js --fechas 2024-12-09 2024-12-15 --pdf

# Reporte del año completo
node generar_reporte_ventas_productos.js --fechas 2024-01-01 2024-12-31 --pdf
```

## 📈 Interpretación de resultados

### Métricas clave a observar:
1. **Productos más vendidos**: Identifica los productos estrella
2. **Distribución por canal**: Entiende dónde se vende más
3. **Tendencias temporales**: Compara períodos diferentes
4. **Rendimiento financiero**: Analiza totales y promedios

### Preguntas que puedes responder:
- ¿Qué productos se venden más en cada canal?
- ¿Cuál es el canal de venta más efectivo?
- ¿Qué productos tienen mejor rendimiento financiero?
- ¿Cómo varían las ventas por período?

---

**Nota**: Asegúrate de que la base de datos tenga datos de ventas en el período que quieres analizar. Si no hay datos, el reporte mostrará 0 en todas las métricas. 