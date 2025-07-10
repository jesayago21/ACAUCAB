const express = require('express');
const cors = require('cors');
const shopRoutes = require('./routes/shopRoutes');
const clientRoutes = require('./routes/clientRoutes');
const roleRoutes = require('./routes/roleRoutes'); 
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const privilegeRoutes = require('./routes/privilegeRoutes');
const reposicionRoutes = require('./routes/reposicionRoutes');
const eventRoutes = require('./routes/eventRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const offerRoutes = require('./routes/offerRoutes');
const comprasRoutes = require('./routes/comprasRoutes');
const ecommerceRoutes = require('./routes/ecommerceRoutes');
const { specs, swaggerUi } = require('./config/swagger');
const db = require('./config/db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.set('db', db);

/** Middleware básico */
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:4321', 'http://127.0.0.1:4321'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With', 
    'x-user-id', 
    'X-User-Id', 
    'X-User-ID',
    'x-user-ID'
  ],
  credentials: true
})); // Permite peticiones de otros orígenes (tu frontend)

// Middleware para normalizar headers de usuario
app.use((req, res, next) => {
  // Normalizar el header de usuario a lowercase para consistencia
  const userIdHeader = req.headers['x-user-id'] || req.headers['X-User-ID'] || req.headers['X-User-Id'];
  if (userIdHeader) {
    req.headers['x-user-id'] = userIdHeader;
  }
  next();
});

app.use(express.json()); // Para parsear el body de las peticiones como JSON

/** Configuración de Swagger UI */
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "ACAUCAB API Documentation"
}));

/** Ruta de bienvenida */
app.get('/', (req, res) => {
  res.json({
    message: 'Bienvenido a la API de ACAUCAB',
    documentation: `http://localhost:${PORT}/api-docs`,
    endpoints: {
      products: '/api/shop/products',
      offers: '/api/shop/offers',
      tiendas: '/api/shop/tiendas',
      paymentMethods: '/api/shop/payment-methods/:userId',
      createOrder: '/api/shop/order',
      clientIdentify: '/api/clientes/identificar',
      clientCreate: '/api/clientes/crear',
      clientPlaces: '/api/clientes/lugares',
      login: '/api/auth/login',
      verifyPermission: '/api/auth/verificar-permiso'
    }
  });
});

/** Rutas de la API */
app.use('/api/shop', shopRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/privileges', privilegeRoutes);
app.use('/api/clientes', clientRoutes);
app.use('/api/reposicion', reposicionRoutes);
app.use('/api/eventos', eventRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/ofertas', offerRoutes);
app.use('/api/compras', comprasRoutes);
app.use('/api/ecommerce', ecommerceRoutes);

/** rutas para los reportes */
const reportRoutes = require('./routes/reportesRouter');
app.use('/api/reportes', reportRoutes);

/** Manejo de rutas no encontradas */
app.use('*', (req, res) => {
  res.status(404).json({
    message: 'Endpoint no encontrado',
    documentation: `http://localhost:${PORT}/api-docs`
  });
});

/** Manejo global de errores */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
  console.log(`Documentación disponible en: http://localhost:${PORT}/api-docs`);
  
});

