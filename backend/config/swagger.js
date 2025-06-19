/** Configuración de Swagger para documentar la API */
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

/** Opciones de configuración para swagger-jsdoc */
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ACAUCAB API',
      version: '1.0.0',
      description: 'API para el sistema de gestión de cervecería ACAUCAB',
      contact: {
        name: 'Equipo de desarrollo ACAUCAB',
        email: 'dev@acaucab.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Servidor de desarrollo'
      }
    ],
    components: {
      schemas: {
        /** Esquema para presentación de cerveza */
        PresentacionCerveza: {
          type: 'object',
          properties: {
            clave: {
              type: 'integer',
              description: 'ID único de la presentación'
            },
            ean_13: {
              type: 'string',
              description: 'Código de barras EAN-13'
            },
            nombre_presentacion: {
              type: 'string',
              description: 'Nombre de la presentación'
            },
            cantidad_unidades: {
              type: 'integer',
              description: 'Cantidad de unidades en la presentación'
            },
            nombre_cerveza: {
              type: 'string',
              description: 'Nombre de la cerveza'
            },
            grado_alcohol: {
              type: 'integer',
              description: 'Grado de alcohol de la cerveza'
            },
            tipo_cerveza: {
              type: 'string',
              description: 'Tipo de cerveza'
            },
            miembro: {
              type: 'string',
              description: 'Razón social del miembro productor'
            },
            cantidad_disponible: {
              type: 'integer',
              description: 'Cantidad disponible en inventario'
            },
            lugar_tienda: {
              type: 'string',
              description: 'Ubicación en la tienda'
            },
            tienda_fisica: {
              type: 'string',
              description: 'Nombre de la tienda física'
            },
            tiene_oferta: {
              type: 'boolean',
              description: 'Indica si el producto tiene oferta activa'
            },
            porcentaje_descuento: {
              type: 'integer',
              description: 'Porcentaje de descuento si hay oferta',
              nullable: true
            },
            fecha_inicio_oferta: {
              type: 'string',
              format: 'date',
              description: 'Fecha de inicio de la oferta',
              nullable: true
            },
            fecha_fin_oferta: {
              type: 'string',
              format: 'date',
              description: 'Fecha de fin de la oferta',
              nullable: true
            }
          }
        },
        /** Esquema para método de pago */
        MetodoPago: {
          type: 'object',
          properties: {
            clave: {
              type: 'integer',
              description: 'ID único del método de pago'
            },
            banco: {
              type: 'string',
              description: 'Nombre del banco'
            },
            numero_tarjeta: {
              type: 'string',
              description: 'Número de tarjeta enmascarado'
            },
            fecha_vencimiento: {
              type: 'string',
              format: 'date',
              description: 'Fecha de vencimiento de la tarjeta'
            }
          }
        },
        /** Esquema para crear orden online */
        CrearOrden: {
          type: 'object',
          required: ['usuarioId', 'items', 'metodoPagoId'],
          properties: {
            usuarioId: {
              type: 'integer',
              description: 'ID del usuario que realiza la compra'
            },
            direccionEnvio: {
              type: 'string',
              description: 'Dirección de envío'
            },
            lugarId: {
              type: 'integer',
              description: 'ID del lugar de envío'
            },
            metodoPagoId: {
              type: 'integer',
              description: 'ID del método de pago'
            },
            tasaCambioId: {
              type: 'integer',
              description: 'ID de la tasa de cambio'
            },
            items: {
              type: 'array',
              description: 'Lista de productos en la orden',
              items: {
                type: 'object',
                properties: {
                  producto_id: {
                    type: 'integer',
                    description: 'ID del producto'
                  },
                  cantidad: {
                    type: 'integer',
                    description: 'Cantidad del producto'
                  },
                  precio: {
                    type: 'number',
                    format: 'float',
                    description: 'Precio unitario del producto'
                  }
                }
              }
            }
          }
        },
        /** Esquema para respuesta de error */
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Mensaje de error'
            },
            error: {
              type: 'string',
              description: 'Detalles del error',
              nullable: true
            }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js'],
   // rutas a los archivos que contienen las definiciones OpenAPI
};

/** Especificación de OpenAPI */
const specs = swaggerJsdoc(options);

module.exports = {
  specs,
  swaggerUi
}; 