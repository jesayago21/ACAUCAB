# 🍺 ACAUCAB - Sistema de Autopago

Prototipo funcional de una interfaz de autopago para tienda física de distribuidora de cervezas artesanales, desarrollado con **Astro**, **React**, **TypeScript** y **Tailwind CSS**.

## 📋 Descripción del Proyecto

Este sistema permite a los clientes realizar compras de manera autónoma en un kiosco de autopago, siguiendo un flujo completo que incluye identificación, selección de productos, gestión del carrito y múltiples métodos de pago.

## 🎯 Características Principales

### ✨ Funcionalidades Core

- **Identificación de Clientes**: Verificación en tiempo real por CI/RIF con debouncing
- **Registro Dinámico**: Formularios adaptados para personas naturales y jurídicas
- **Catálogo de Productos**: Grid responsivo con búsqueda y filtros
- **Carrito Inteligente**: Gestión en tiempo real con control de stock
- **Métodos de Pago Múltiples**: Efectivo, tarjetas, cheques y puntos de fidelidad
- **Sistema de Puntos**: Acumulación y canje de puntos por compras

### 🎨 Experiencia de Usuario

- **Diseño Cohesivo**: Paleta de colores verde botella acorde a la marca
- **Interfaz Táctil**: Optimizada para pantallas touch de kiosco
- **Responsive Design**: Adaptable a diferentes tamaños de pantalla
- **Transiciones Suaves**: Animaciones CSS para mejor UX
- **Feedback Visual**: Estados de carga, éxito y error claramente indicados

### 🔧 Características Técnicas

- **TypeScript**: Tipado fuerte para mayor robustez
- **Componentes Modulares**: Arquitectura escalable y mantenible
- **API Integration**: Conexión con backend Express.js
- **Error Handling**: Manejo robusto de errores y estados de carga
- **Custom Hooks**: Lógica reutilizable (useCarrito)

## 🗂️ Estructura del Proyecto

```
src/
├── components/           # Componentes React
│   ├── AutopagoApp.tsx   # Componente principal
│   ├── IdentificacionCliente.tsx
│   ├── RegistroCliente.tsx
│   ├── VistaPrincipalCompra.tsx
│   ├── ProductCard.tsx
│   ├── Carrito.tsx
│   ├── MetodosPago.tsx
│   └── PantallaExito.tsx
├── hooks/               # Hooks personalizados
│   └── useCarrito.ts    # Gestión del carrito
├── services/            # Servicios de API
│   └── api.ts          # Comunicación con backend
├── types/              # Definiciones TypeScript
│   └── api.ts          # Tipos de la API
└── pages/              # Páginas Astro
    └── index.astro     # Página principal
```

## 🚀 Flujo de Usuario (End-to-End)

### 1. 🏁 Pantalla de Bienvenida

- Presentación del sistema ACAUCAB
- Botón "Iniciar Compra" para comenzar el proceso

### 2. 🔍 Identificación del Cliente

- **Campo de entrada único** para CI/RIF con formato automático
- **Verificación en tiempo real** con debounce (800ms)
- **Feedback visual** del estado de verificación
- Estados posibles:
  - ✅ Cliente encontrado → Continuar a compra
  - ❌ Cliente no registrado → Ir a registro

### 3. 📝 Registro de Cliente (si es necesario)

#### Paso 1: Selección de Tipo

- **Persona Natural** vs **Persona Jurídica**

#### Paso 2: Formulario Dinámico

**Campos Comunes:**

- RIF (validado y formateado)
- Email (validación de formato)
- Teléfonos múltiples (códigos venezolanos)
- Ubicación jerárquica (Estado → Municipio → Parroquia)

**Persona Natural (adicional):**

- Cédula, nombres, apellidos
- Dirección de habitación

**Persona Jurídica (adicional):**

- Razón social, denominación comercial
- URL página web, capital disponible
- Direcciones fiscal y física
- Personas de contacto

### 4. 🛒 Vista Principal de Compra

#### Layout Responsivo

- **Área de productos (75%)**: Grid con búsqueda y filtros
- **Carrito lateral (25%)**: Fijo y siempre visible

#### Funcionalidades de Productos

- **Búsqueda en tiempo real** con debouncing
- **Filtros por tipo** de cerveza
- **Manejo de ofertas** con badges de descuento
- **Control de stock** con advertencias
- **Imágenes con fallback** automático

#### Gestión del Carrito

- **Agregar/remover productos** con validación de stock
- **Actualización de cantidades** en tiempo real
- **Cálculo automático** de subtotales y puntos
- **Indicador visual** de productos en carrito

### 5. 💳 Métodos de Pago

#### Múltiples Opciones de Pago

- **Efectivo**: Monto parcial o total
- **Tarjeta**: Débito o crédito con validación de datos
- **Cheque**: Número y banco emisor
- **Puntos**: Conversión automática con tasa de cambio

#### Gestión de Pagos Múltiples

- **Aplicación secuencial** de diferentes métodos
- **Tracking del monto pendiente** en tiempo real
- **Resumen visual** de pagos aplicados
- **Validación** antes de finalizar

### 6. ✅ Confirmación de Éxito

- **Comprobante detallado** con número de referencia
- **Resumen de la transacción** completa
- **Puntos ganados** en la compra
- **Opciones**: Nueva compra o finalizar sesión

## 🎨 Diseño y Paleta de Colores

### Colores Principales

- **Verde Oscuro (Principal)**: `#3D4A3A` - Botones principales, headers
- **Verde Claro (Acentos)**: `#A1B5A0` - Fondos de sección, hover states
- **Fondo Crema**: `#F4EFE6` - Fondo general de la aplicación
- **Texto Principal**: `#2C2C2C` - Texto principal
- **Rojo Oferta**: `#D9534F` - Precios en oferta y descuentos

### Principios de Diseño

- **Consistencia visual** en todos los componentes
- **Espaciado generoso** para facilitar la interacción táctil
- **Jerarquía clara** de información
- **Feedback inmediato** en todas las acciones

## 🔧 Configuración y Desarrollo

### Prerrequisitos

- Node.js 18+
- npm o yarn
- Backend ACAUCAB ejecutándose en puerto 5000

### Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build
```

### Dependencias Principales

- **Astro**: Framework web moderno
- **React 18**: Biblioteca de UI
- **TypeScript**: Tipado estático
- **Tailwind CSS**: Framework de estilos
- **@astrojs/react**: Integración React para Astro
- **@astrojs/tailwind**: Integración Tailwind para Astro

## 🌐 Integración con Backend

### Endpoints Utilizados

- `GET /api/clientes/verificar/{documento}` - Verificación de cliente
- `POST /api/clientes/crear` - Registro de cliente
- `GET /api/shop/products` - Lista de productos
- `GET /api/lugares/estados` - Estados de Venezuela
- `GET /api/lugares/municipios/{id}` - Municipios por estado
- `GET /api/lugares/parroquias/{id}` - Parroquias por municipio
- `GET /api/tasas/cambio` - Tasas de cambio para puntos

### Tipos de Datos

Todos los tipos están definidos en `src/types/api.ts` basados en el esquema de base de datos PostgreSQL del proyecto.

## 📱 Características para Kiosco

### Optimizaciones Táctiles

- **Botones grandes**: Mínimo 44px de área táctil
- **Prevención de zoom**: Configurado para dispositivos móviles
- **Sin selección de texto**: Evita selecciones accidentales
- **Scrollbars personalizados**: Mejores para pantallas touch

### Modo Kiosco

- **Pantalla completa**: Soporte para modo kiosco
- **Cursor oculto**: En modo pantalla completa
- **Error boundaries**: Recuperación automática de errores
- **Service Worker**: Para funcionalidad offline básica

## 🧪 Características del Prototipo

### Datos Simulados

Para efectos de demostración, algunos datos están simulados:

- **Puntos del cliente**: 150 puntos disponibles
- **Tasa de cambio**: Configurada desde el backend
- **Imágenes de productos**: Fallbacks automáticos

### Validaciones Implementadas

- **Formato RIF/CI**: Regex para documentos venezolanos
- **Email**: Validación de formato estándar
- **Teléfonos**: Códigos de área venezolanos válidos
- **Stock**: Control de disponibilidad de productos

## 🎯 Casos de Uso Cubiertos

### Cliente Existente

1. Ingresa documento → Sistema lo encuentra
2. Navega productos → Agrega al carrito
3. Procede al pago → Selecciona método(s)
4. Finaliza compra → Recibe confirmación

### Cliente Nuevo - Persona Natural

1. Ingresa documento → Sistema no lo encuentra
2. Se registra como persona natural
3. Completa formulario básico
4. Continúa con proceso de compra

### Cliente Nuevo - Persona Jurídica

1. Ingresa RIF → Sistema no lo encuentra
2. Se registra como persona jurídica
3. Completa formulario empresarial
4. Añade personas de contacto
5. Continúa con proceso de compra

### Pago Múltiple

1. Cliente con carrito de Bs. 1,000
2. Paga Bs. 300 con puntos
3. Paga Bs. 200 en efectivo
4. Completa Bs. 500 con tarjeta
5. Sistema valida total y procesa

## 🚀 Próximos Pasos

### Mejoras Sugeridas

- **PWA**: Convertir en Progressive Web App
- **Offline Support**: Sincronización cuando regrese la conexión
- **Accesibilidad**: Mejoras para usuarios con discapacidades
- **Analytics**: Tracking de uso y conversión
- **Impresión**: Integración con impresoras de tickets

### Características Adicionales

- **Códigos QR**: Para productos y pagos móviles
- **Reconocimiento facial**: Para identificación rápida
- **Voice Commands**: Para accesibilidad
- **Multi-idioma**: Soporte para otros idiomas

## 📄 Licencia

Este proyecto es un prototipo desarrollado para ACAUCAB - Distribuidora de Cervezas Artesanales.

---

**Desarrollado con ❤️ para la experiencia de autopago del futuro**

```sh
npm create astro@latest -- --template minimal
```

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/withastro/astro/tree/latest/examples/minimal)
[![Open with CodeSandbox](https://assets.codesandbox.io/github/button-edit-lime.svg)](https://codesandbox.io/p/sandbox/github/withastro/astro/tree/latest/examples/minimal)
[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/withastro/astro?devcontainer_path=.devcontainer/minimal/devcontainer.json)

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
├── src/
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

# Sistema de Autopago ACAUCAB - Versión Final

## 🚀 Nuevas Funcionalidades Implementadas

### ✅ Conexión al Backend Real

- **Endpoint de Ventas**: `/api/shop/venta-fisica` para procesar ventas de tienda física
- **Manejo de Transacciones**: Sistema completo con rollback en caso de errores
- **Actualización de Inventario**: Reduce automáticamente el stock disponible
- **Registro de Pagos**: Soporta múltiples métodos de pago simultáneos

### ✅ Sistema de Puntos Mejorado

- **Tasa de Cambio Real**: Obtiene la tasa de puntos desde `/api/shop/tasa-cambio-puntos`
- **Cálculo de Bs Canjeables**: Muestra el valor exacto en bolívares de los puntos disponibles
- **Validación de Límites**: Impide usar más puntos de los disponibles o del monto pendiente
- **Actualización Automática**: Los puntos se actualizan en tiempo real durante el proceso

### ✅ Precisión Decimal en Precios

- **Dos Decimales**: Todos los precios se muestran con exactamente 2 decimales
- **Cálculos Precisos**: Usa `parseFloat().toFixed(2)` en lugar de `Math.round()`
- **Ofertas Visibles**: Los descuentos de 10% ahora se aprecian claramente (ej: Bs. 27.00 → Bs. 24.30)
- **Formateo Consistente**: Aplicado en ProductCard, Carrito, MetodosPago y useCarrito

### ✅ Funcionalidades del Backend

#### Controlador de Ventas (`createVentaFisica`)

```javascript
// Proceso completo de venta:
1. Validación de datos de entrada
2. Inicio de transacción de BD
3. Creación de venta en venta_tienda_fisica
4. Inserción de detalles por cada producto
5. Verificación y actualización de inventario
6. Registro de métodos de pago
7. Actualización de puntos del cliente
8. Commit de transacción o rollback en errores
```

#### Endpoints de Tasas de Cambio

- `GET /api/shop/tasa-cambio-puntos`: Tasa de conversión puntos → Bs
- `GET /api/shop/tasa-cambio-actual`: Tasa de cambio USD actual

## 📋 Preparación de la Base de Datos

### 1. Ejecutar Migración de Puntos

```sql
-- Ejecutar en la base de datos:
\i migration_add_puntos_moneda.sql
```

### 2. Verificar Datos de Prueba

```sql
-- Verificar que existe la tasa de puntos
SELECT * FROM tasa_cambio WHERE moneda = 'PUNTOS';

-- Si no existe, insertarla manualmente:
INSERT INTO tasa_cambio (moneda, monto_equivalencia, fecha_inicio)
VALUES ('PUNTOS', 1.50, CURRENT_DATE);
```

## 🎯 Flujo de Pago Completo

### 1. Identificación del Cliente

- Verificación de CI/RIF en tiempo real
- Registro automático si no existe
- Carga de puntos acumulados del cliente

### 2. Selección de Productos

- Catálogo con precios precisos (2 decimales)
- Ofertas claramente visibles
- Control de stock en tiempo real

### 3. Métodos de Pago Múltiples

- **Efectivo**: Monto específico
- **Tarjetas**: Crédito/débito con validación
- **Cheques**: Con número y banco
- **Puntos**: Conversión automática usando tasa real del backend

### 4. Procesamiento de Venta

- Envío de datos al backend `/api/shop/venta-fisica`
- Validación de stock
- Actualización de inventario
- Registro de pagos
- Actualización de puntos del cliente

## 🔧 Configuración del Frontend

### Variables de Entorno

```env
PUBLIC_API_BASE_URL=http://localhost:5000
PUBLIC_API_TIMEOUT=10000
PUBLIC_NODE_ENV=development
```

### Dependencias Principales

- **Astro**: Framework principal
- **React**: Componentes interactivos
- **TypeScript**: Tipado fuerte
- **Tailwind CSS**: Estilos responsive

## 📱 Características de UX/UI

### Optimización para Kioscos

- Botones táctiles mínimo 44px
- Prevención de zoom y selección de texto
- Transiciones suaves
- Feedback visual inmediato

### Manejo de Errores

- Validación en tiempo real
- Mensajes de error claros
- Fallbacks para conexión perdida
- Transacciones seguras con rollback

## 🎨 Paleta de Colores

- **Principal**: #3D4A3A (Verde botella)
- **Acentos**: #A1B5A0 (Verde claro)
- **Fondo**: #F4EFE6 (Beige suave)
- **Texto**: #2C2C2C (Gris oscuro)
- **Ofertas**: #D9534F (Rojo llamativo)

## 🚀 Cómo Ejecutar

### Backend

```bash
cd backend
npm install
npm start
# Servidor en http://localhost:5000
```

### Frontend

```bash
cd "Frontend/Front final"
npm install
npm run dev
# Aplicación en http://localhost:4321
```

### Documentación API

- Swagger disponible en: `http://localhost:5000/api-docs`
- Incluye todos los endpoints del sistema de autopago

## 📊 Estructura de Datos

### Venta Física

```json
{
  "cliente_id": 1,
  "tienda_id": 1,
  "items": [
    {
      "producto_id": 5,
      "cantidad": 2,
      "precio_unitario": 24.3
    }
  ],
  "metodos_pago": [
    {
      "tipo": "Efectivo",
      "monto": 40.0
    },
    {
      "tipo": "Puntos",
      "monto": 8.6,
      "detalles": { "puntos_usados": 6 }
    }
  ],
  "total_venta": 48.6
}
```

### Respuesta del Backend

```json
{
  "success": true,
  "venta_id": 123,
  "message": "Venta creada exitosamente. Puntos ganados: 2"
}
```

## 🔐 Seguridad y Validaciones

- Validación de stock antes de procesar venta
- Transacciones atomicas con rollback automático
- Verificación de límites de puntos
- Sanitización de datos de entrada
- Manejo seguro de métodos de pago

## 📈 Beneficios Implementados

1. **Precisión**: Precios con 2 decimales evitan errores de redondeo
2. **Eficiencia**: Conexión real al backend para datos actualizados
3. **Usabilidad**: Sistema de puntos intuitivo con conversión automática
4. **Confiabilidad**: Transacciones seguras con validación completa
5. **Escalabilidad**: Estructura preparada para múltiples tiendas y productos

---

## 🐛 Solución de Problemas

### Error: "invalid input value for enum tipo_moneda: PUNTOS"

**Solución**: Ejecutar la migración:

```sql
\i migration_add_puntos_moneda.sql
```

### Error de conexión al backend

**Verificar**:

- Backend corriendo en puerto 5000
- Variables de entorno configuradas
- Base de datos PostgreSQL activa

### Precios no se muestran con decimales

**Verificado**: Ya corregido en todos los componentes con `toLocaleString` y `toFixed(2)`

---

**Sistema desarrollado para ACAUCAB - Distribuidora de Cervezas Artesanales**

✅ **Status**: Funcional con backend conectado y precisión decimal implementada
