# 📊 Reporte de Puntos Canjeados - ACAUCAB

Este reporte genera un análisis completo de los puntos de fidelidad canjeados por clientes afiliados en la tienda online de ACAUCAB.

## 🚀 Características

- **Resumen general** con estadísticas totales
- **Desglose por tipo de cliente** (natural/jurídico)
- **Detalle individual** de cada cliente
- **Información temporal** del período analizado
- **Diseño profesional** y responsive
- **Exportación en HTML y PDF**

## 📁 Estructura de Archivos

```
reportes/
├── data/Reportes/
│   ├── puntos_canjeados_report.js      # Script de datos (consulta SQL)
│   └── puntos_canjeados_template.html  # Plantilla HTML del reporte
├── generar_reporte_puntos.js           # Script principal para generar reportes
├── jsreport.config.json               # Configuración de jsreport
└── README_REPORTE_PUNTOS.md           # Este archivo
```

## 🛠️ Instalación y Configuración

### 1. Instalar dependencias
```bash
cd reportes
npm install
```

### 2. Verificar conexión a base de datos
Asegúrate de que la base de datos PostgreSQL esté corriendo y que las credenciales en `jsreport.config.json` sean correctas:

```json
{
  "extensions": {
    "data": {
      "extensions": {
        "postgres": {
          "connectionString": "postgres://grupo7:123456@localhost:5432/grupo7",
          "ssl": false
        }
      }
    }
  }
}
```

## 📋 Uso del Reporte

### Generar reporte con fechas por defecto (2024)
```bash
node generar_reporte_puntos.js
```

### Generar reporte con fechas personalizadas
```bash
node generar_reporte_puntos.js --fechas 2024-01-01 2024-12-31
```

### Generar reporte en PDF
```bash
node generar_reporte_puntos.js --pdf
```

### Ejemplos de uso
```bash
# Reporte del año 2023
node generar_reporte_puntos.js --fechas 2023-01-01 2023-12-31

# Reporte de noviembre 2024
node generar_reporte_puntos.js --fechas 2024-11-01 2024-11-30

# Reporte del último mes en PDF
node generar_reporte_puntos.js --fechas 2024-11-01 2024-11-30 --pdf
```

## 📊 Información del Reporte

### Resumen General
- **Clientes Afiliados**: Total de clientes que han canjeado puntos
- **Pagos con Puntos**: Número total de transacciones con puntos
- **Puntos Canjeados**: Cantidad total de puntos utilizados
- **Valor Total**: Valor monetario en bolívares de los puntos canjeados

### Resumen por Tipo de Cliente
- **Cliente Natural**: Personas físicas
- **Cliente Jurídico**: Empresas y organizaciones

### Detalle por Cliente
- **RIF**: Identificación fiscal del cliente
- **Cliente**: Nombre o razón social
- **Tipo**: Natural o Jurídico
- **Pagos**: Cantidad de transacciones realizadas
- **Puntos Canjeados**: Total de puntos utilizados por el cliente
- **Valor en Bolívares**: Valor monetario de los puntos canjeados
- **Primera Fecha**: Fecha del primer canje
- **Última Fecha**: Fecha del último canje

## 🔧 Personalización

### Modificar fechas por defecto
Edita el archivo `data/Reportes/puntos_canjeados_report.js`:

```javascript
// Cambia estas líneas
const fechaInicio = '2024-01-01';
const fechaFin = '2024-12-31';
```

### Modificar la consulta SQL
El archivo `data/Reportes/puntos_canjeados_report.js` contiene las consultas SQL. Puedes modificarlas según tus necesidades.

### Personalizar el diseño
Edita el archivo `data/Reportes/puntos_canjeados_template.html` para cambiar:
- Colores y estilos
- Layout y estructura
- Información mostrada
- Formato de fechas y números

## 📈 Consultas SQL Utilizadas

### 1. Detalle por Cliente
```sql
SELECT
  c.rif,
  COALESCE(c.razon_social, c.primer_nombre || ' ' || c.primer_apellido) AS cliente,
  c.tipo AS tipo_cliente,
  COUNT(p.clave) AS cantidad_pagos_puntos,
  SUM(CASE WHEN md.tipo = 'Puntos' THEN p.monto_total ELSE 0 END) AS total_puntos_canjeados,
  SUM(CASE WHEN md.tipo = 'Puntos' THEN p.monto_total * tc.monto_equivalencia ELSE 0 END) AS total_bolivares,
  MIN(p.fecha_pago) AS primera_fecha_pago,
  MAX(p.fecha_pago) AS ultima_fecha_pago
FROM pago p
JOIN metodo_de_pago md ON md.clave = p.fk_metodo_de_pago
JOIN tasa_cambio tc ON tc.clave = p.fk_tasa_cambio
JOIN venta_online v ON v.clave = p.fk_venta_online
JOIN usuario u ON u.clave = v.fk_usuario
JOIN cliente c ON c.clave = u.fk_cliente
WHERE md.tipo = 'Puntos'
  AND tc.moneda = 'PUNTOS'
  AND p.fecha_pago BETWEEN $1 AND $2
  AND tc.fecha_inicio <= p.fecha_pago 
  AND (tc.fecha_fin IS NULL OR tc.fecha_fin >= p.fecha_pago)
  AND c.tipo IN ('natural', 'juridico')
GROUP BY c.rif, c.razon_social, c.primer_nombre, c.primer_apellido, c.tipo
HAVING SUM(CASE WHEN md.tipo = 'Puntos' THEN p.monto_total ELSE 0 END) > 0
ORDER BY total_bolivares DESC
```

## 🚨 Solución de Problemas

### Error de conexión a base de datos
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solución**: Verifica que PostgreSQL esté corriendo y las credenciales sean correctas.

### Error de módulo no encontrado
```
Error: Cannot find module 'pg'
```
**Solución**: Ejecuta `npm install` en la carpeta `reportes`.

### Error de jsreport
```
Error: jsreport is not defined
```
**Solución**: Verifica que jsreport esté instalado correctamente con `npm install jsreport`.

### No se muestran datos
Si el reporte se genera pero no muestra datos:
1. Verifica que existan pagos con método de pago tipo 'Puntos'
2. Verifica que las fechas del reporte coincidan con datos existentes
3. Verifica que las tasas de cambio estén configuradas correctamente

## 📞 Soporte

Para problemas técnicos o mejoras del reporte, contacta al equipo de desarrollo de ACAUCAB.

---

**© 2024 ACAUCAB - Sistema de Gestión de Puntos de Fidelidad** 