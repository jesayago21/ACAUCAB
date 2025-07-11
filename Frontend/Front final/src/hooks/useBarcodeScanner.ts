/** Hook personalizado para manejar la lectura de códigos de barras con scanner USB */
import { useState, useEffect, useCallback, useRef } from 'react';
import { ecommerceService } from '../services/api';
import type { Producto } from '../types/api';

interface UseBarcodeScannerReturn {
  isScanning: boolean;
  lastScannedCode: string | null;
  scannedProduct: Producto | null;
  startScanning: () => void;
  stopScanning: () => void;
  onProductFound: React.MutableRefObject<((producto: Producto) => void) | null>;
  onProductNotFound: React.MutableRefObject<((code: string) => void) | null>;
}

export function useBarcodeScanner(): UseBarcodeScannerReturn {
  const [isScanning, setIsScanning] = useState(false);
  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null);
  const [scannedProduct, setScannedProduct] = useState<Producto | null>(null);
  const [buffer, setBuffer] = useState('');
  const [lastKeyTime, setLastKeyTime] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const autoProcessTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const onProductFoundRef = useRef<((producto: Producto) => void) | null>(null);
  const onProductNotFoundRef = useRef<((code: string) => void) | null>(null);

  /** Función para procesar el código escaneado */
  const processScannedCode = useCallback(async (code: string) => {
    console.log('🔍 Procesando código escaneado:', code);
    
    // Validar que el código tenga un formato válido (al menos 8 dígitos)
    if (!code || code.length < 8) {
      console.log('❌ Código inválido:', code);
      setScannedProduct(null);
      setLastScannedCode(code);
      return null;
    }
    
    try {
      // Buscar el producto por EAN usando el servicio de ecommerce
      console.log('🔍 Buscando producto con EAN:', code);
      const productos = await ecommerceService.obtenerProductos({ 
        busqueda: code, 
        limite: 10 
      });
      
      console.log('📦 Productos encontrados:', productos.length);
      
      // Buscar el producto que coincida exactamente con el EAN
      const producto = productos.find(p => p.ean_13?.toString() === code);
      
      if (producto) {
        console.log('✅ Producto encontrado:', producto.nombre_cerveza, 'EAN:', producto.ean_13);
        setScannedProduct(producto);
        setLastScannedCode(code);
        return producto;
      } else {
        console.log('❌ Producto no encontrado para código:', code);
        console.log('📋 Productos disponibles:', productos.map(p => ({ nombre: p.nombre_cerveza, ean: p.ean_13 })));
        setScannedProduct(null);
        setLastScannedCode(code);
        return null;
      }
    } catch (error) {
      console.error('❌ Error procesando código escaneado:', error);
      setScannedProduct(null);
      setLastScannedCode(code);
      return null;
    }
  }, []);

  /** Función para manejar la entrada de teclado del scanner */
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (!isScanning) return;

    const currentTime = Date.now();
    
    // Log de todas las teclas para debug
    console.log('🎹 Tecla presionada:', event.key, 'KeyCode:', event.keyCode, 'Code:', event.code);
    
    // Si han pasado más de 50ms desde la última tecla, reiniciar el buffer
    // Los scanners suelen ser muy rápidos, así que usamos un tiempo más corto
    if (currentTime - lastKeyTime > 50) {
      setBuffer('');
      console.log('🔄 Buffer reiniciado por timeout');
    }
    
    setLastKeyTime(currentTime);
    
    // Agregar la tecla al buffer (solo números y algunos caracteres especiales)
    if (event.key.length === 1 && /[0-9A-Za-z]/.test(event.key)) {
      setBuffer(prev => {
        const newBuffer = prev + event.key;
        console.log('🔢 Tecla agregada al buffer:', event.key, 'Buffer actual:', newBuffer);
        
        // Configurar timeout para procesar automáticamente después de 200ms de inactividad
        if (autoProcessTimeoutRef.current) {
          clearTimeout(autoProcessTimeoutRef.current);
        }
        
        autoProcessTimeoutRef.current = setTimeout(() => {
          if (newBuffer.length >= 8) { // Solo procesar si tiene al menos 8 caracteres
            console.log('⏰ Timeout automático - procesando código:', newBuffer);
            processScannedCode(newBuffer);
            setBuffer('');
          }
        }, 200);
        
        return newBuffer;
      });
    }
    
    // Detectar Enter de múltiples formas
    if (event.key === 'Enter' || event.keyCode === 13 || event.code === 'Enter') {
      const code = buffer.trim();
      console.log('⏎ Enter detectado! Buffer actual:', code);
      if (code.length > 0) {
        // Limpiar timeout automático
        if (autoProcessTimeoutRef.current) {
          clearTimeout(autoProcessTimeoutRef.current);
        }
        console.log('📦 Código completo escaneado:', code);
        processScannedCode(code);
        setBuffer('');
      }
    }
    
    // Detectar otros posibles finalizadores de scanner
    if (event.key === 'Tab' || event.keyCode === 9) {
      const code = buffer.trim();
      console.log('↹ Tab detectado! Buffer actual:', code);
      if (code.length > 0) {
        // Limpiar timeout automático
        if (autoProcessTimeoutRef.current) {
          clearTimeout(autoProcessTimeoutRef.current);
        }
        console.log('📦 Código completo escaneado (Tab):', code);
        processScannedCode(code);
        setBuffer('');
      }
    }
  }, [isScanning, buffer, lastKeyTime, processScannedCode]);

  /** Función para manejar cuando se encuentra un producto */
  const handleProductFound = useCallback((producto: Producto) => {
    console.log('✅ Producto encontrado por scanner:', producto.nombre_cerveza);
    if (onProductFoundRef.current) {
      onProductFoundRef.current(producto);
    }
  }, []);

  /** Función para manejar cuando no se encuentra un producto */
  const handleProductNotFound = useCallback((code: string) => {
    console.log('❌ Producto no encontrado para código:', code);
    if (onProductNotFoundRef.current) {
      onProductNotFoundRef.current(code);
    }
  }, []);

  /** Iniciar el escaneo */
  const startScanning = useCallback(() => {
    console.log('🚀 Iniciando escaneo de códigos de barras');
    setIsScanning(true);
    setBuffer('');
    setLastScannedCode(null);
    setScannedProduct(null);
  }, []);

  /** Detener el escaneo */
  const stopScanning = useCallback(() => {
    console.log('⏹️ Deteniendo escaneo de códigos de barras');
    setIsScanning(false);
    setBuffer('');
    setLastScannedCode(null);
    setScannedProduct(null);
    
    // Limpiar timeouts
    if (autoProcessTimeoutRef.current) {
      clearTimeout(autoProcessTimeoutRef.current);
    }
  }, []);

  /** Efecto para agregar/remover el event listener */
  useEffect(() => {
    if (isScanning) {
      document.addEventListener('keydown', handleKeyPress);
      console.log('🎯 Event listener agregado para scanner');
      console.log('🔍 Scanner activo - Esperando códigos de barras...');
    } else {
      document.removeEventListener('keydown', handleKeyPress);
      console.log('🎯 Event listener removido para scanner');
    }

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [isScanning, handleKeyPress]);

  /** Efecto para procesar automáticamente el producto escaneado */
  useEffect(() => {
    if (scannedProduct) {
      handleProductFound(scannedProduct);
      // Limpiar después de procesar
      setTimeout(() => {
        setScannedProduct(null);
      }, 1000);
    } else if (lastScannedCode && !scannedProduct) {
      handleProductNotFound(lastScannedCode);
      // Limpiar después de procesar
      setTimeout(() => {
        setLastScannedCode(null);
      }, 1000);
    }
  }, [scannedProduct, lastScannedCode, handleProductFound, handleProductNotFound]);

  /** Limpiar timeout al desmontar */
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (autoProcessTimeoutRef.current) {
        clearTimeout(autoProcessTimeoutRef.current);
      }
    };
  }, []);

  return {
    isScanning,
    lastScannedCode,
    scannedProduct,
    startScanning,
    stopScanning,
    onProductFound: onProductFoundRef,
    onProductNotFound: onProductNotFoundRef
  };
} 