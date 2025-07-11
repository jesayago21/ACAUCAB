/** Componente de prueba para el scanner de códigos de barras */
import React, { useState } from 'react';
import { useBarcodeScanner } from '../hooks/useBarcodeScanner';
import { ecommerceService } from '../services/api';
import type { Producto } from '../types/api';

export default function ScannerTest() {
  const [productosEscaneados, setProductosEscaneados] = useState<Producto[]>([]);
  const [codigosNoEncontrados, setCodigosNoEncontrados] = useState<string[]>([]);
  
  const {
    isScanning,
    lastScannedCode,
    scannedProduct,
    startScanning,
    stopScanning,
    onProductFound,
    onProductNotFound
  } = useBarcodeScanner();

  // Configurar callbacks
  React.useEffect(() => {
    const handleProductFound = (producto: Producto) => {
      console.log('✅ Producto encontrado en prueba:', producto.nombre_cerveza);
      setProductosEscaneados(prev => [...prev, producto]);
      
      // Mostrar notificación de éxito
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce';
      notification.innerHTML = `
        <div class="flex items-center space-x-2">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
          </svg>
          <span>✅ ${producto.nombre_cerveza} encontrado!</span>
        </div>
      `;
      document.body.appendChild(notification);
      
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 3000);
    };

    const handleProductNotFound = (code: string) => {
      console.log('❌ Producto no encontrado en prueba:', code);
      setCodigosNoEncontrados(prev => [...prev, code]);
      
      // Mostrar notificación de error
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-pulse';
      notification.innerHTML = `
        <div class="flex items-center space-x-2">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
          </svg>
          <span>❌ Producto con código ${code} no encontrado</span>
        </div>
      `;
      document.body.appendChild(notification);
      
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 3000);
    };

    onProductFound.current = handleProductFound;
    onProductNotFound.current = handleProductNotFound;
  }, [onProductFound, onProductNotFound]);

  const limpiarHistorial = () => {
    setProductosEscaneados([]);
    setCodigosNoEncontrados([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Prueba del Scanner de Códigos de Barras
          </h1>

          {/* Controles del scanner */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Estado del Scanner</h2>
              <button
                onClick={isScanning ? stopScanning : startScanning}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                  isScanning 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 7v2h1v8H3v2h2V7H3zm16 0v12h2v-2h-1V9h1V7h-2zm-6-4H8v2h5V3zm5 0v2h3v2h2V3h-5zM6 3H3v2h2v2h2V3H6zm0 16v2h3v2h2v-2H6v-2z"/>
                </svg>
                <span>{isScanning ? 'Detener Scanner' : 'Activar Scanner'}</span>
              </button>
            </div>

            {/* Campo de prueba manual */}
            <div className="mb-4 p-3 bg-white rounded border">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Prueba Manual (sin scanner)</h3>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Ingrese un código EAN para probar..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const code = e.currentTarget.value.trim();
                      if (code) {
                        console.log('🧪 Prueba manual con código:', code);
                        // Simular el procesamiento del código
                        const handleManualTest = async () => {
                          try {
                            const productos = await ecommerceService.obtenerProductos({ 
                              busqueda: code, 
                              limite: 10 
                            });
                            const producto = productos.find(p => p.ean_13?.toString() === code);
                            
                            if (producto) {
                              setProductosEscaneados(prev => [...prev, producto]);
                              console.log('✅ Producto encontrado manualmente:', producto.nombre_cerveza);
                            } else {
                              setCodigosNoEncontrados(prev => [...prev, code]);
                              console.log('❌ Producto no encontrado manualmente:', code);
                            }
                          } catch (error) {
                            console.error('Error en prueba manual:', error);
                            setCodigosNoEncontrados(prev => [...prev, code]);
                          }
                        };
                        handleManualTest();
                        e.currentTarget.value = '';
                      }
                    }
                  }}
                />
                <button
                  onClick={() => {
                    const input = document.querySelector('input[placeholder*="código EAN"]') as HTMLInputElement;
                    if (input && input.value.trim()) {
                      const code = input.value.trim();
                      console.log('🧪 Prueba manual con código:', code);
                      // Simular Enter key
                      const event = new KeyboardEvent('keypress', { key: 'Enter' });
                      input.dispatchEvent(event);
                    }
                  }}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  Probar
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="p-3 bg-white rounded border">
                <span className="font-medium">Estado:</span>
                <span className={`ml-2 ${isScanning ? 'text-green-600' : 'text-red-600'}`}>
                  {isScanning ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              <div className="p-3 bg-white rounded border">
                <span className="font-medium">Último código:</span>
                <span className="ml-2 text-gray-600">
                  {lastScannedCode || 'Ninguno'}
                </span>
              </div>
              <div className="p-3 bg-white rounded border">
                <span className="font-medium">Producto escaneado:</span>
                <span className="ml-2 text-gray-600">
                  {scannedProduct ? scannedProduct.nombre_cerveza : 'Ninguno'}
                </span>
              </div>
            </div>

            {isScanning && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                  </svg>
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Scanner activo</p>
                    <p>Use su scanner USB para escanear códigos de barras. Los resultados aparecerán abajo.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Historial de escaneos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Productos encontrados */}
            <div className="bg-white border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Productos Encontrados ({productosEscaneados.length})
                </h3>
                <button
                  onClick={limpiarHistorial}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded hover:bg-gray-50"
                >
                  Limpiar
                </button>
              </div>
              
              {productosEscaneados.length === 0 ? (
                <p className="text-gray-500 text-sm">No se han escaneado productos aún</p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {productosEscaneados.map((producto, index) => (
                    <div key={index} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-green-800">{producto.nombre_cerveza}</p>
                          <p className="text-sm text-green-600">EAN: {producto.ean_13}</p>
                        </div>
                        <span className="text-xs text-green-600">
                          {new Date().toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Códigos no encontrados */}
            <div className="bg-white border rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Códigos No Encontrados ({codigosNoEncontrados.length})
              </h3>
              
              {codigosNoEncontrados.length === 0 ? (
                <p className="text-gray-500 text-sm">No hay códigos no encontrados</p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {codigosNoEncontrados.map((codigo, index) => (
                    <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-red-800">Código: {codigo}</p>
                          <p className="text-sm text-red-600">Producto no encontrado</p>
                        </div>
                        <span className="text-xs text-red-600">
                          {new Date().toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Instrucciones */}
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">Instrucciones de Prueba</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Conecte su scanner USB al computador</li>
              <li>• Haga clic en "Activar Scanner"</li>
              <li>• Escanee códigos de barras de productos</li>
              <li>• Los productos encontrados aparecerán en la lista verde</li>
              <li>• Los códigos no encontrados aparecerán en la lista roja</li>
              <li>• Use "Limpiar" para borrar el historial</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 