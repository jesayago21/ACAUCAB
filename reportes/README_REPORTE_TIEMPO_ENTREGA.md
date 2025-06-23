# Reporte de Tiempo de Entrega de Pedidos Online - ACAUCAB

## 📊 Descripción

Este reporte analiza la duración promedio de preparación y despacho de pedidos online por día de la semana. Calcula el tiempo promedio que transcurre desde que un pedido cambia su estatus a "listo para entrega" hasta que es "entregado" al cliente, agrupado por cada día de la semana y por período de tiempo.

## 🎯 Objetivos del Reporte

- **Análisis de Eficiencia**: Medir la eficiencia del proceso de entrega de pedidos online
- **Identificación de Patrones**: Detectar patrones de tiempo por día de la semana
- **Optimización de Procesos**: Identificar oportunidades de mejora en los tiempos de entrega
- **Seguimiento de KPIs**: Monitorear métricas clave de rendimiento del servicio

## 📈 Métricas Analizadas

### 1. Tiempo de Preparación
- **Definición**: Tiempo desde "procesando" hasta "listo para entrega"
- **Objetivo**: < 2 horas (según reglas de negocio)
- **Códigos de Color**:
  - 🟢 Verde: < 1 hora (Excelente)
  - 🟡 Amarillo: 1-2 horas (Aceptable)
  - 🔴 Rojo: > 2 horas (Necesita mejora)

### 2. Tiempo de Entrega
- **Definición**: Tiempo desde "listo para entrega" hasta "entregado"
- **Objetivo**: < 4 horas
- **Códigos de Color**:
  - 🟢 Verde: < 2 horas (Excelente)
  - 🟡 Amarillo: 2-4 horas (Aceptable)
  - 🔴 Rojo: > 4 horas (Necesita mejora)

### 3. Tiempo Total
- **Definición**: Tiempo total desde "procesando" hasta "entregado"
- **Objetivo**: < 6 horas
- **Códigos de Color**:
  - 🟢 Verde: < 3 horas (Excelente)
  - 🟡 Amarillo: 3-6 horas (Aceptable)
  - 🔴 Rojo: > 6 horas (Necesita mejora)

## 🗂️ Estructura del Reporte

### Resumen General
- Total de pedidos en el período
- Pedidos entregados vs pendientes
- Tasa de entrega (%)
- Total de ventas (Bs.)

### Estadísticas de Tiempo
- Tiempo promedio de entrega
- Tiempo promedio de preparación
- Tiempo total promedio

### Análisis por Día de la Semana
- Desglose detallado por cada día
- Métricas de tiempo (promedio, mínimo, máximo)
- Volumen de pedidos y ventas por día

### Detalle de Pedidos Recientes
- Lista de los últimos 50 pedidos
- Información individual de cada pedido
- Estado actual de entrega

## 🚀 Uso del Reporte

### Generación Básica
```bash
# Generar reporte HTML con fechas por defecto
node generar_reporte_tiempo_entrega.js

# Generar reporte PDF con fechas por defecto
node generar_reporte_tiempo_entrega.js --pdf
```

### Generación con Fechas Personalizadas
```bash
# Reporte HTML para período específico
node generar_reporte_tiempo_entrega.js --fechas 2024-11-01 2024-11-30

# Reporte PDF para período específico
node generar_reporte_tiempo_entrega.js --fechas 2024-11-01 2024-11-30 --pdf
```

## 📁 Archivos del Reporte

### Scripts Principales
- `generar_reporte_tiempo_entrega.js` - Script generador principal
- `data/Reportes/tiempo_entrega_report.js` - Lógica de consultas y procesamiento de datos
- `data/Reportes/tiempo_entrega_template.html` - Plantilla HTML del reporte

### Directorio de Salida
- `ReportesPdf/tiempo_entrega/` - Archivos generados

## 🔍 Consultas SQL Utilizadas

### Consulta Principal de Tiempo de Entrega
```sql
WITH tiempos_entrega AS (
  SELECT 
    vo.clave AS id_venta,
    vo.fecha AS fecha_venta,
    EXTRACT(DOW FROM vo.fecha) AS dia_semana,
    TO_CHAR(vo.fecha, 'Day') AS nombre_dia,
    -- Tiempo desde "listo para entrega" hasta "entregado"
    CASE 
      WHEN h_listo.fecha IS NOT NULL AND h_entregado.fecha IS NOT NULL 
      THEN EXTRACT(EPOCH FROM (h_entregado.fecha - h_listo.fecha)) / 3600
      ELSE NULL
    END AS tiempo_entrega_horas,
    -- Tiempo desde "procesando" hasta "listo para entrega"
    CASE 
      WHEN h_procesando.fecha IS NOT NULL AND h_listo.fecha IS NOT NULL 
      THEN EXTRACT(EPOCH FROM (h_listo.fecha - h_procesando.fecha)) / 3600
      ELSE NULL
    END AS tiempo_preparacion_horas,
    -- Tiempo total desde "procesando" hasta "entregado"
    CASE 
      WHEN h_procesando.fecha IS NOT NULL AND h_entregado.fecha IS NOT NULL 
      THEN EXTRACT(EPOCH FROM (h_entregado.fecha - h_procesando.fecha)) / 3600
      ELSE NULL
    END AS tiempo_total_horas,
    vo.monto_total,
    u.username AS cliente
  FROM venta_online vo
  LEFT JOIN usuario u ON u.clave = vo.fk_usuario
  -- Estado "listo para entrega" (estatus 8)
  LEFT JOIN historico h_listo ON h_listo.fk_venta_online = vo.clave 
    AND h_listo.fk_estatus = 8
  -- Estado "entregado" (estatus 9)
  LEFT JOIN historico h_entregado ON h_entregado.fk_venta_online = vo.clave 
    AND h_entregado.fk_estatus = 9
  -- Estado "procesando" (estatus 7)
  LEFT JOIN historico h_procesando ON h_procesando.fk_venta_online = vo.clave 
    AND h_procesando.fk_estatus = 7
  WHERE vo.fecha BETWEEN $1 AND $2
    AND h_listo.fecha IS NOT NULL
)
SELECT 
  dia_semana,
  nombre_dia,
  COUNT(*) AS total_pedidos,
  COUNT(CASE WHEN tiempo_entrega_horas IS NOT NULL THEN 1 END) AS pedidos_entregados,
  ROUND(AVG(tiempo_entrega_horas), 2) AS tiempo_entrega_promedio_horas,
  ROUND(AVG(tiempo_preparacion_horas), 2) AS tiempo_preparacion_promedio_horas,
  ROUND(AVG(tiempo_total_horas), 2) AS tiempo_total_promedio_horas,
  ROUND(MIN(tiempo_entrega_horas), 2) AS tiempo_entrega_minimo_horas,
  ROUND(MAX(tiempo_entrega_horas), 2) AS tiempo_entrega_maximo_horas,
  ROUND(SUM(monto_total), 2) AS total_ventas_dia
FROM tiempos_entrega
GROUP BY dia_semana, nombre_dia
ORDER BY dia_semana;
```

## 📊 Interpretación de Resultados

### Indicadores de Rendimiento

#### Excelente Rendimiento
- Tiempo de preparación: < 1 hora
- Tiempo de entrega: < 2 horas
- Tiempo total: < 3 horas
- Tasa de entrega: > 95%

#### Rendimiento Aceptable
- Tiempo de preparación: 1-2 horas
- Tiempo de entrega: 2-4 horas
- Tiempo total: 3-6 horas
- Tasa de entrega: 80-95%

#### Necesita Mejora
- Tiempo de preparación: > 2 horas
- Tiempo de entrega: > 4 horas
- Tiempo total: > 6 horas
- Tasa de entrega: < 80%

## 🔧 Configuración

### Dependencias
- jsreport: ^4.9.0
- @jsreport/jsreport-chrome-pdf: ^4.2.0
- handlebars: ^4.7.8
- pg: ^8.16.2

### Configuración de Base de Datos
- Host: localhost
- Puerto: 5432
- Base de datos: grupo7
- Usuario: grupo7
- Contraseña: 123456

## 📝 Notas Importantes

1. **Estados Requeridos**: El reporte solo analiza pedidos que han llegado al estado "listo para entrega"
2. **Filtro de Fechas**: Se pueden especificar fechas personalizadas para análisis específicos
3. **Límite de Detalle**: El detalle muestra solo los últimos 50 pedidos para evitar reportes muy extensos
4. **Códigos de Color**: Los tiempos se muestran con colores según su eficiencia para facilitar la interpretación

## 🎯 Casos de Uso

### Análisis Semanal
- Generar reporte cada lunes para analizar la semana anterior
- Identificar días con mejor/peor rendimiento
- Planificar recursos según patrones identificados

### Análisis Mensual
- Comparar rendimiento entre semanas
- Identificar tendencias de mejora o deterioro
- Establecer objetivos de mejora

### Análisis de Incidentes
- Investigar días con tiempos anormalmente altos
- Identificar causas de retrasos
- Implementar medidas correctivas

## 📞 Soporte

Para consultas o problemas con este reporte, contactar al equipo de desarrollo de ACAUCAB.

---

**© 2024 ACAUCAB - Todos los derechos reservados** 