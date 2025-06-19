const express = require('express');
const cors = require('cors');
const shopRoutes = require('./routes/shopRoutes');
const { specs, swaggerUi } = require('./config/swagger');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

/** Middleware básico */
app.use(cors()); // Permite peticiones de otros orígenes (tu frontend)
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
      createOrder: '/api/shop/order'
    }
  });
});

/** Rutas de la API */
app.use('/api/shop', shopRoutes);

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