# Reporte de Comparativa de Ingresos por Tipo de Cerveza

## Descripción

Este reporte proporciona un análisis detallado de los ingresos generados por cervezas tipo **Ale** y **Lager**, diferenciando las ventas realizadas a través de la tienda física y la tienda online por período de tiempo.

## Características del Reporte

### 📊 Análisis Incluido

1. **Resumen General de Ingresos**
   - Total de ingresos generados
   - Participación porcentual de Ale vs Lager
   - Total de unidades vendidas

2. **Comparativa Detallada por Categoría**
   - Ingresos totales por tipo de cerveza
   - Unidades vendidas por categoría
   - Desglose por canal de venta (Física vs Online)

3. **Análisis por Período Mensual**
   - Evolución temporal de ventas
   - Comparativa mes a mes
   - Tendencias de crecimiento

4. **Rankings y Estadísticas**
   - Top 5 cervezas por ingresos
   - Top 5 productores por ingresos totales
   - Distribución por canal de venta

5. **Análisis de Tendencias**
   - Categoría dominante en el mercado
   - Canal preferido por tipo de cerveza
   - Diferencia porcentual entre categorías

### 🍺 Clasificación de Cervezas

**Cervezas Ale:**
- American Pale Ale (APA)
- Indian Pale Ale (IPA)
- Stout
- Porter
- Wheat/Weizen
- Belgian (Dubbel, Tripel, Golden Strong)
- Saison
- Amber Ale
- Red Ale
- Blonde Ale

**Cervezas Lager:**
- Lager tradicional
- Pilsner
- Bock
- Oktoberfest/Märzen
- Munich Helles
- Vienna
- Schwarzbier

## Archivos del Reporte

### 📁 Estructura de Archivos

```
reportes/
├── data/Reportes/
│   ├── comparativa_ingresos_cerveza_report.js      # Lógica de consulta y procesamiento
│   └── comparativa_ingresos_cerveza_template.html  # Template HTML del reporte
├── generar_reporte_comparativa_cerveza.js          # Script de generación
├── ReportesPdf/comparativa_ingresos/               # Directorio de salida
│   ├── reporte_comparativa_ingresos_cerveza_YYYY-MM-DD.pdf
│   └── reporte_comparativa_ingresos_cerveza_YYYY-MM-DD.html
└── README_REPORTE_COMPARATIVA_CERVEZA.md           # Esta documentación
```

## 🚀 Cómo Generar el Reporte

### Opción 1: Ejecutar directamente
```bash
cd reportes
node generar_reporte_comparativa_cerveza.js
```

### Opción 2: Desde el servidor principal
```bash
cd reportes
node server.js
# Luego acceder a la ruta correspondiente en el servidor
```

## 📋 Requisitos

- Node.js instalado
- Dependencias de jsreport instaladas
- Conexión a la base de datos PostgreSQL
- Datos de ventas en las tablas correspondientes

## 🔍 Consultas SQL Utilizadas

El reporte utiliza una consulta compleja que:

1. **Consolida ventas físicas y online** usando UNION ALL
2. **Clasifica automáticamente** las cervezas en Ale o Lager basándose en el tipo
3. **Calcula ingresos totales** por cantidad × precio unitario
4. **Agrupa por período mensual** para análisis temporal
5. **Filtra solo Ale y Lager** excluyendo otros tipos

### Estructura de la Consulta Principal

```sql
WITH ventas_consolidadas AS (
    -- Ventas físicas
    SELECT ... FROM venta_tienda_fisica
    UNION ALL
    -- Ventas online  
    SELECT ... FROM venta_online
)
SELECT ... FROM ventas_consolidadas
WHERE categoria_cerveza IN ('Ale', 'Lager')
```

## 📈 Métricas Calculadas

### Resumen General
- **Total de ventas**: Número total de transacciones analizadas
- **Ingresos totales**: Suma de todos los ingresos generados
- **Participación Ale/Lager**: Porcentaje de cada categoría sobre el total

### Por Categoría
- **Ingresos por tipo**: Monto total generado por Ale y Lager
- **Unidades vendidas**: Cantidad de productos vendidos
- **Ventas por canal**: Desglose entre tienda física y online

### Rankings
- **Top cervezas**: Las 5 cervezas con mayores ingresos
- **Top productores**: Los 5 productores con mayores ventas totales
- **Distribución por canal**: Porcentaje de ventas físicas vs online

## 🎯 Casos de Uso

### Para la Dirección
- **Análisis de rentabilidad** por tipo de cerveza
- **Estrategias de distribución** basadas en preferencias de canal
- **Planificación de inventario** según tendencias

### Para Marketing
- **Campañas dirigidas** por tipo de cerveza
- **Análisis de preferencias** del consumidor
- **Optimización de canales** de venta

### Para Operaciones
- **Gestión de stock** por categoría
- **Análisis de rendimiento** por canal
- **Planificación logística** optimizada

## 🔧 Personalización

### Modificar Clasificación de Cervezas
Para agregar o modificar la clasificación de cervezas, editar el archivo `comparativa_ingresos_cerveza_report.js` en la sección CASE:

```javascript
CASE 
    WHEN tc.nombre LIKE '%Lager%' OR tc.nombre LIKE '%Pilsner%' THEN 'Lager'
    WHEN tc.nombre LIKE '%Ale%' OR tc.nombre LIKE '%IPA%' THEN 'Ale'
    ELSE 'Otros'
END AS categoria_cerveza
```

### Agregar Nuevas Métricas
Para incluir nuevas métricas, modificar la función `run()` en el archivo del reporte y actualizar el template HTML correspondiente.

## 📊 Interpretación de Resultados

### Indicadores Clave
- **Categoría dominante**: Indica qué tipo de cerveza genera más ingresos
- **Canal preferido**: Muestra si los clientes prefieren comprar Ale o Lager online o en tienda física
- **Diferencia porcentual**: Magnitud de la diferencia entre Ale y Lager

### Tendencias a Observar
- **Crecimiento por período**: Evolución temporal de las ventas
- **Cambios en preferencias**: Variaciones en la demanda por tipo
- **Efectividad de canales**: Rendimiento comparativo de ventas físicas vs online

## 🐛 Solución de Problemas

### Error de Conexión a BD
- Verificar configuración en `backend/config/db.js`
- Comprobar que PostgreSQL esté ejecutándose
- Validar credenciales de acceso

### Error de Generación PDF
- Verificar instalación de jsreport-chrome-pdf
- Comprobar que Chrome/Chromium esté disponible
- Revisar permisos de escritura en directorio de salida

### Datos Vacíos
- Verificar que existan ventas en el período analizado
- Comprobar que las cervezas estén correctamente clasificadas
- Validar integridad de datos en las tablas de ventas

## 📞 Soporte

Para reportar problemas o solicitar mejoras:
1. Revisar los logs en `reportes/logs/`
2. Verificar la documentación de jsreport
3. Consultar con el equipo de desarrollo

---

**Versión**: 1.0  
**Última actualización**: Diciembre 2024  
**Autor**: Sistema de Reportes ACAUCAB 