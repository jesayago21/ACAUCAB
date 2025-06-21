# Sistema de Dashboard Administrativo - ACAUCAB

## Descripción General

El sistema de dashboard administrativo de ACAUCAB proporciona una interfaz completa de gestión con un sistema de permisos atómicos por tabla. Está inspirado en el diseño de WordPress admin, con un menú lateral colapsible y módulos organizados por funcionalidad.

## Características Principales

### 🔐 Sistema de Permisos Atómicos

- **4 operaciones básicas por tabla**: crear, consultar, modificar, eliminar
- **Permisos especiales** para cambios de estado en compras, reposiciones y ventas online
- **Control granular** de acceso a cada funcionalidad del sistema
- **Gestión visual** de permisos agrupados por módulo/tabla

### 🎛️ Dashboard Administrativo

- **Menú lateral colapsible** tipo WordPress
- **Navegación contextual** que muestra solo los módulos permitidos
- **Dashboard principal** con estadísticas y resumen
- **Gestión completa** de usuarios, roles y privilegios

### 📊 Módulos Implementados

#### Gestión de Usuarios y Permisos

- **Usuarios**: Crear, listar, modificar usuarios del sistema
- **Roles**: Gestión de roles con asignación de privilegios
- **Privilegios**: Visualización y gestión de permisos por módulo

#### Gestión de Productos

- **Cervezas**: CRUD completo de productos cerveceros
- **Recetas**: Gestión de recetas de fabricación
- **Presentaciones**: Manejo de diferentes formatos de venta

#### Gestión de Inventario

- **Almacén**: Control de stock central
- **Reposiciones**: Gestión de reposiciones con cambios de estado

#### Gestión de Ventas

- **Ventas Físicas**: Ventas en tienda física
- **Ventas Online**: Ventas por internet con gestión de estados
- **Ventas Eventos**: Ventas en eventos especiales

#### Gestión de Compras

- **Órdenes de Compra**: Con gestión completa de estados

#### Reportes

- **Reportes de Ventas**: Análisis de ventas por período
- **Reportes de Inventario**: Estado del inventario
- **Reportes Financieros**: Análisis financiero

## Arquitectura del Sistema

### Backend

```
backend/
├── controllers/
│   ├── authController.js      # Autenticación y autorización
│   ├── userController.js      # Gestión de usuarios
│   ├── roleController.js      # Gestión de roles
│   └── privilegeController.js # Gestión de privilegios
├── routes/
│   ├── authRoutes.js          # Rutas de autenticación
│   ├── userRoutes.js          # Rutas de usuarios
│   ├── roleRoutes.js          # Rutas de roles
│   └── privilegeRoutes.js     # Rutas de privilegios
```

### Frontend

```
Frontend/Front final/src/components/admin/
├── AdminDashboard.tsx         # Dashboard principal
├── AdminDashboardMain.tsx     # Componente principal con layout
├── AdminSidebar.tsx           # Menú lateral con permisos
├── RoleManagement.tsx         # Gestión de roles
├── UserManagement.tsx         # Gestión de usuarios
├── PrivilegeManagement.tsx    # Gestión de privilegios
└── StatusManagement.tsx       # Gestión de estados
```

### Base de Datos

```sql
-- Tabla de privilegios con permisos atómicos
privilegio (clave, nombre, descripcion)

-- Relación muchos a muchos roles-privilegios
rol_pri (clave, fk_rol, fk_privilegio, fecha)

-- Usuarios con rol único
usuario (clave, username, contrasena, fk_rol, ...)
```

## Instalación y Configuración

### 1. Ejecutar Scripts de Base de Datos

```sql
-- 1. Crear estructura básica
\i CREATE version 2.sql

-- 2. Insertar datos básicos
\i Inserts/1insert lugar.sql
\i Inserts/2INSERT cer_rec.sql
\i Inserts/3inserts miem_cer.sql
\i Inserts/4Inserts_empleado-rolesymas.sql
\i Inserts/5Insert usuario-pago y ultimos.sql
\i Inserts/6Insert_usuarios_prueba.sql

-- 3. Insertar privilegios atómicos
\i Inserts/7Insert_privilegios_atomicos.sql

-- 4. Asignar privilegios a roles
\i Inserts/8Insert_roles_privilegios_nuevos.sql
```

### 2. Configurar Backend

```bash
cd backend
npm install
npm start
```

### 3. Configurar Frontend

```bash
cd "Frontend/Front final"
npm install
npm run dev
```

## Sistema de Privilegios

### Privilegios por Tabla

Cada tabla del sistema tiene 4 privilegios básicos:

| Operación | Formato             | Ejemplo             |
| --------- | ------------------- | ------------------- |
| Crear     | `crear_{tabla}`     | `crear_cerveza`     |
| Consultar | `consultar_{tabla}` | `consultar_cerveza` |
| Modificar | `modificar_{tabla}` | `modificar_cerveza` |
| Eliminar  | `eliminar_{tabla}`  | `eliminar_cerveza`  |

### Privilegios Especiales

- `cambiar_estado_compra` - Cambiar estados de órdenes de compra
- `cambiar_estado_reposicion` - Cambiar estados de reposiciones
- `cambiar_estado_venta_online` - Cambiar estados de ventas online
- `ver_dashboard_admin` - Acceder al dashboard administrativo
- `gestionar_roles_privilegios` - Gestionar roles y privilegios

### Roles Predefinidos

#### Administrador

- **Permisos**: Todos los privilegios del sistema
- **Acceso**: Dashboard completo, gestión de usuarios, roles y privilegios

#### Supervisor

- **Permisos**: Ventas + inventario + reposiciones + reportes
- **Acceso**: Gestión operativa completa

#### Vendedor

- **Permisos**: Ventas básicas + consultas de productos y clientes
- **Acceso**: Operaciones de venta únicamente

#### Cliente Admin

- **Permisos**: Consultas básicas + reportes de ventas
- **Acceso**: Solo visualización y reportes

## Uso del Sistema

### Acceso al Dashboard

1. **Desde Autopago**: Botón discreto en esquina superior derecha
2. **URL Directa**: `/login` para acceso directo
3. **Credenciales de Prueba**:
   - admin/admin123 (Administrador)
   - supervisor/super123 (Supervisor)
   - vendedor/vend123 (Vendedor)
   - cliente/cliente123 (Cliente Admin)

### Navegación

- **Menú Lateral**: Muestra solo módulos con permisos
- **Módulos Expandibles**: Con submódulos organizados
- **Indicador Visual**: Módulo activo resaltado
- **Responsive**: Menú colapsible en dispositivos pequeños

### Gestión de Roles y Privilegios

1. Acceder a "Gestión de Usuarios" → "Gestión de Roles"
2. Seleccionar rol existente o crear nuevo
3. Asignar privilegios por módulo con checkboxes
4. Guardar cambios para aplicar permisos

## API Endpoints

### Autenticación

- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/verificar-permiso` - Verificar permisos específicos
- `GET /api/auth/perfil/:usuario_id` - Obtener perfil de usuario

### Gestión de Roles

- `GET /api/roles` - Listar todos los roles
- `POST /api/roles` - Crear nuevo rol
- `PUT /api/roles/:id` - Actualizar rol
- `DELETE /api/roles/:id` - Eliminar rol
- `PUT /api/roles/:id/privileges` - Asignar privilegios a rol
- `GET /api/roles/:id/privileges` - Obtener privilegios de rol

### Gestión de Privilegios

- `GET /api/privileges` - Listar todos los privilegios
- `GET /api/privileges/modules` - Privilegios agrupados por módulo
- `POST /api/privileges` - Crear nuevo privilegio
- `PUT /api/privileges/:id` - Actualizar privilegio
- `DELETE /api/privileges/:id` - Eliminar privilegio

### Gestión de Usuarios

- `GET /api/users` - Listar usuarios
- `POST /api/users` - Crear usuario
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario
- `PUT /api/users/:id/rol` - Asignar rol a usuario

## Personalización

### Agregar Nuevo Módulo

1. **Backend**: Crear controlador y rutas
2. **Privilegios**: Agregar privilegios en `7Insert_privilegios_atomicos.sql`
3. **Frontend**: Agregar entrada en `menuItems` de `AdminSidebar.tsx`
4. **Componente**: Crear componente del módulo
5. **Routing**: Agregar caso en `renderModuleContent()` de `AdminDashboardMain.tsx`

### Personalizar Permisos

1. Modificar `7Insert_privilegios_atomicos.sql` para nuevos privilegios
2. Actualizar `8Insert_roles_privilegios_nuevos.sql` para asignaciones
3. Ejecutar scripts en base de datos
4. Actualizar `menuItems` en frontend si es necesario

## Consideraciones Técnicas

### Seguridad

- Validación de permisos en backend y frontend
- Tokens de sesión con timeout configurable
- Filtrado de menús según permisos de usuario
- Validación de entrada en todas las operaciones

### Performance

- Carga lazy de módulos no utilizados
- Cache de permisos en sesión de usuario
- Consultas optimizadas con JOINs eficientes
- Paginación en listados grandes

### Escalabilidad

- Arquitectura modular para fácil extensión
- Sistema de privilegios flexible
- Componentes reutilizables
- API RESTful estándar

## Próximos Desarrollos

1. **Módulos Completos**: Implementar CRUD completo para todas las tablas
2. **Reportes Avanzados**: Gráficos y exportación de datos
3. **Notificaciones**: Sistema de alertas y notificaciones
4. **Auditoría**: Log de acciones de usuarios
5. **API Avanzada**: Filtros, búsqueda y ordenamiento
6. **Móvil**: Versión responsive mejorada

## Soporte

Para soporte técnico o consultas sobre el sistema:

- Revisar logs en consola del navegador
- Verificar configuración de base de datos
- Consultar documentación de API en `/api-docs` (Swagger)
- Validar permisos de usuario en base de datos
