/** Script de prueba para los endpoints de ACAUCAB API */
const BASE_URL = 'http://localhost:5000';

/** Función auxiliar para realizar peticiones HTTP */
async function makeRequest(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    const data = await response.json();
    
    console.log(`\n🔗 ${options.method || 'GET'} ${url}`);
    console.log(`📊 Status: ${response.status}`);
    console.log('📝 Response:', JSON.stringify(data, null, 2));
    
    return data;
  } catch (error) {
    console.error(`❌ Error en ${url}:`, error.message);
  }
}

/** Función principal para probar todos los endpoints */
async function testEndpoints() {
  console.log('🧪 PROBANDO ENDPOINTS DE ACAUCAB API');
  console.log('=' .repeat(50));
  
  // 1. Probar endpoint de bienvenida
  await makeRequest(`${BASE_URL}/`);
  
  // 2. Obtener todas las tiendas físicas
  await makeRequest(`${BASE_URL}/api/shop/tiendas`);
  
  // 3. Obtener todos los productos disponibles
  await makeRequest(`${BASE_URL}/api/shop/products`);
  
  // 4. Obtener productos de una tienda específica (ID 1)
  await makeRequest(`${BASE_URL}/api/shop/products?tienda_id=1`);
  
  // 5. Obtener solo productos con ofertas
  await makeRequest(`${BASE_URL}/api/shop/offers`);
  
  // 6. Obtener ofertas de una tienda específica
  await makeRequest(`${BASE_URL}/api/shop/offers?tienda_id=1`);
  
  // 7. Obtener métodos de pago de un usuario (ID 1)
  await makeRequest(`${BASE_URL}/api/shop/payment-methods/1`);
  
  // 8. Crear una venta online (ejemplo)
  const ventaData = {
    usuarioId: 1,
    direccionEnvio: "Av. Principal #123, Caracas",
    lugarId: 1,
    metodoPagoId: 1,
    tasaCambioId: 1,
    items: [
      {
        producto_id: 1,
        cantidad: 2,
        precio: 15.50
      },
      {
        producto_id: 2,
        cantidad: 1,
        precio: 8.75
      }
    ]
  };
  
  await makeRequest(`${BASE_URL}/api/shop/order`, {
    method: 'POST',
    body: JSON.stringify(ventaData)
  });
  
  // 9. Probar endpoint inexistente (debe devolver 404)
  await makeRequest(`${BASE_URL}/api/shop/endpoint-inexistente`);
  
  console.log('\n✅ Prueba de endpoints completada');
  console.log(`📖 Documentación disponible en: ${BASE_URL}/api-docs`);
}

/** Función para probar solo los productos (más específica) */
async function testProductsEndpoint() {
  console.log('🍺 PROBANDO ENDPOINTS DE PRODUCTOS');
  console.log('=' .repeat(40));
  
  // Obtener todos los productos
  const allProducts = await makeRequest(`${BASE_URL}/api/shop/products`);
  
  if (allProducts && allProducts.length > 0) {
    console.log(`\n📊 Total de productos encontrados: ${allProducts.length}`);
    
    // Mostrar primer producto como ejemplo
    console.log('\n🏷️ Ejemplo de producto:');
    console.log('- Nombre:', allProducts[0].nombre_presentacion);
    console.log('- Cerveza:', allProducts[0].nombre_cerveza);
    console.log('- Tipo:', allProducts[0].tipo_cerveza);
    console.log('- Stock:', allProducts[0].cantidad_disponible);
    console.log('- Tiene oferta:', allProducts[0].tiene_oferta ? 'Sí' : 'No');
    
    if (allProducts[0].tiene_oferta) {
      console.log('- Descuento:', `${allProducts[0].porcentaje_descuento}%`);
    }
  }
  
  // Probar filtro por tienda
  console.log('\n🏪 Probando filtro por tienda...');
  await makeRequest(`${BASE_URL}/api/shop/products?tienda_id=1`);
  
  // Obtener solo ofertas
  console.log('\n🎯 Probando endpoint de ofertas...');
  const offers = await makeRequest(`${BASE_URL}/api/shop/offers`);
  
  if (offers && offers.length > 0) {
    console.log(`\n🎉 Total de productos en oferta: ${offers.length}`);
  } else {
    console.log('\n😔 No hay productos en oferta actualmente');
  }
}

/** Ejecutar las pruebas según el argumento pasado */
if (require.main === module) {
  const testType = process.argv[2];
  
  if (testType === 'products') {
    testProductsEndpoint();
  } else {
    testEndpoints();
  }
}

module.exports = {
  makeRequest,
  testEndpoints,
  testProductsEndpoint
}; 