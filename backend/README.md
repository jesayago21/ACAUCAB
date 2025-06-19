# ACAUCAB Backend API

Sistema de gestión de cervecería ACAUCAB - Backend con documentación Swagger.

## 🚀 Características

- **API RESTful** para gestión de productos de cervecería
- **Documentación Swagger** interactiva
- **Consulta de presentaciones** de cerveza con ofertas
- **Filtrado por tienda física**
- **Conexión a PostgreSQL**

## 📋 Prerequisitos

- Node.js (v14 o superior)
- PostgreSQL (v12 o superior)
- npm o yarn

## 🛠️ Instalación

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Crea un archivo `.env` en la raíz del directorio backend con:

```env
# Configuración del servidor
PORT=5000
NODE_ENV=development

# Configuración de la base de datos PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=acaucab_db
DB_USER=postgres
DB_PASSWORD=tu_password_aqui
```

### 3. Configurar la base de datos

Ejecuta el script SQL `CREATE version 2.sql` en tu base de datos PostgreSQL para crear las tablas necesarias.

## 🏃‍♂️ Ejecutar el servidor

### Modo desarrollo

```bash
npm run dev
```

### Modo producción

```bash
npm start
```

El servidor estará disponible en: `http://localhost:5000`

## 📚 Documentación API

### Swagger UI

Una vez que el servidor esté corriendo, visita:
**http://localhost:5000/api-docs**

### Endpoints principales

#### 1. **GET /api/shop/products**

Obtener todas las presentaciones de cerveza disponibles en inventario

**Parámetros opcionales:**

- `tienda_id` (query): Filtrar por ID de tienda física

**Ejemplo de respuesta:**

```json
[
  {
    "clave": 1,
    "ean_13": "1234567890123",
    "nombre_presentacion": "Pilsen 355ml",
    "cantidad_unidades": 1,
    "nombre_cerveza": "Pilsen Premium",
    "grado_alcohol": 5,
    "tipo_cerveza": "Lager",
    "miembro": "Cervecería Los Andes C.A.",
    "cantidad_disponible": 150,
    "lugar_tienda": "Pasillo A - Anaquel 1",
    "tienda_fisica": "ACAUCAB Centro",
    "tiene_oferta": true,
    "porcentaje_descuento": 15,
    "fecha_inicio_oferta": "2024-01-01",
    "fecha_fin_oferta": "2024-01-10"
  }
]
```

#### 2. **GET /api/shop/offers**

Obtener solo productos con ofertas activas

**Parámetros opcionales:**

- `tienda_id` (query): Filtrar por ID de tienda física

#### 3. **GET /api/shop/tiendas**

Obtener lista de tiendas físicas disponibles

#### 4. **GET /api/shop/payment-methods/:userId**

Obtener métodos de pago de un usuario

#### 5. **POST /api/shop/order**

Crear una nueva venta online

**Cuerpo de la petición:**

```json
{
  "usuarioId": 1,
  "direccionEnvio": "Av. Principal #123",
  "lugarId": 1,
  "metodoPagoId": 1,
  "tasaCambioId": 1,
  "items": [
    {
      "producto_id": 1,
      "cantidad": 2,
      "precio": 10.5
    }
  ]
}
```

## 🧪 Cómo probar los endpoints

### 1. Usando Swagger UI (Recomendado)

- Ve a `http://localhost:5000/api-docs`
- Explora y prueba cada endpoint directamente desde la interfaz

### 2. Usando cURL

**Obtener productos:**

```bash
curl -X GET "http://localhost:5000/api/shop/products"
```

**Obtener productos de una tienda específica:**

```bash
curl -X GET "http://localhost:5000/api/shop/products?tienda_id=1"
```

**Obtener solo ofertas:**

```bash
curl -X GET "http://localhost:5000/api/shop/offers"
```

**Obtener tiendas:**

```bash
curl -X GET "http://localhost:5000/api/shop/tiendas"
```

### 3. Usando Postman

Importa la URL de Swagger: `http://localhost:5000/api-docs` para generar automáticamente la colección.

## 🗄️ Estructura de la base de datos

El sistema utiliza las siguientes tablas principales:

- **presentacion**: Presentaciones de cerveza
- **cerveza**: Información de cervezas
- **tipo_cerveza**: Tipos de cerveza
- **miembro**: Miembros productores
- **inventario_tienda**: Stock por tienda
- **tienda_fisica**: Tiendas físicas
- **lugar_tienda**: Ubicaciones dentro de tiendas
- **oferta**: Ofertas activas

## ⚠️ Reglas de negocio implementadas

- Las **ofertas** se muestran solo si están dentro del rango de fechas válido
- Solo se muestran productos con **stock disponible** (cantidad > 0)
- Los productos se **ordenan** por tienda, ubicación y nombre
- Las ofertas se **ordenan** por porcentaje de descuento (mayor primero)

## 🔧 Troubleshooting

### Error de conexión a base de datos

- Verifica que PostgreSQL esté corriendo
- Confirma las credenciales en el archivo `.env`
- Asegúrate de que la base de datos existe

### Error "Cannot find module swagger-jsdoc"

```bash
npm install
```

### Error de puerto en uso

Cambia el puerto en el archivo `.env`:

```env
PORT=3000
```

## 📝 Scripts disponibles

- `npm start`: Ejecutar en modo producción
- `npm run dev`: Ejecutar en modo desarrollo con nodemon

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-feature`)
3. Commit tus cambios (`git commit -m 'Agregar nueva feature'`)
4. Push a la rama (`git push origin feature/nueva-feature`)
5. Abre un Pull Request
