/** Hook personalizado para gestión del carrito de compras */
import { useState, useMemo, useCallback, useEffect } from 'react';
import type { ItemCarrito, Producto } from '../types/api';

export interface UseCarritoReturn {
  items: ItemCarrito[];
  totalItems: number;
  totalPrecio: number;
  puntosGanados: number;
  agregarItem: (producto: Producto, cantidad?: number) => void;
  removerItem: (productoId: number) => void;
  actualizarCantidad: (productoId: number, cantidad: number) => void;
  limpiarCarrito: () => void;
  obtenerItem: (productoId: number) => ItemCarrito | undefined;
}

export function useCarrito(): UseCarritoReturn {
  const [items, setItems] = useState<ItemCarrito[]>([]);

  /** Calcular totales usando useMemo para optimización */
  const { totalItems, totalPrecio, puntosGanados } = useMemo(() => {
    const totalItems = items.reduce((sum, item) => sum + item.cantidad, 0);
    const totalPrecio = parseFloat(items.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2));
    
    // Calcular puntos ganados: 1 punto por cada unidad de producto
    const puntosGanados = items.reduce((sum, item) => sum + item.cantidad, 0);

    return {
      totalItems,
      totalPrecio,
      puntosGanados
    };
  }, [items]);

  /** Obtener ID único del producto */
  const obtenerIdProducto = (producto: Producto): number => {
    return producto.clave || producto.id || 0;
  };

  /** Obtener stock disponible del producto */
  const obtenerStockDisponible = (producto: Producto): number => {
    return producto.stock_disponible || producto.cantidad_disponible || 0;
  };

  /** Agregar item al carrito */
  const agregarItem = useCallback((producto: Producto, cantidad: number = 1) => {
    const productoId = obtenerIdProducto(producto);
    const stockDisponible = obtenerStockDisponible(producto);
    
    console.log('🔍 AGREGAR ITEM - Inicio:', {
      nombreProducto: producto.nombre_cerveza,
      productoId: productoId,
      cantidad: cantidad,
      stockDisponible: stockDisponible,
      productoClave: producto.clave,
    });
    
    if (productoId === 0) {
      console.error('❌ AGREGAR ITEM - Producto sin ID válido:', producto);
      return;
    }

    if (stockDisponible === 0) {
      console.warn('⚠️ AGREGAR ITEM - Producto sin stock disponible:', producto.nombre_cerveza);
      return;
    }

    setItems(prevItems => {
      console.log('📦 AGREGAR ITEM - Items previos:', prevItems.length);
      
      const itemExistente = prevItems.find(item => obtenerIdProducto(item.producto) === productoId);
      
      if (itemExistente) {
        console.log('🔄 AGREGAR ITEM - Item existente encontrado, actualizando cantidad');
        const nuevaCantidad = itemExistente.cantidad + cantidad;
        
        if (nuevaCantidad > stockDisponible) {
          console.warn(`⚠️ AGREGAR ITEM - No se puede agregar más cantidad. Stock disponible: ${stockDisponible}`);
          return prevItems;
        }
        
        const nuevosItems = prevItems.map(item =>
          obtenerIdProducto(item.producto) === productoId
            ? {
                ...item,
                cantidad: nuevaCantidad,
                subtotal: parseFloat((nuevaCantidad * item.precio_unitario).toFixed(2))
              }
            : item
        );
        
        console.log('✅ AGREGAR ITEM - Item actualizado exitosamente');
        return nuevosItems;
      } else {
        console.log('➕ AGREGAR ITEM - Creando nuevo item');
        
        if (cantidad > stockDisponible) {
          console.warn(`⚠️ AGREGAR ITEM - Cantidad solicitada (${cantidad}) excede stock disponible (${stockDisponible})`);
          return prevItems;
        }
        
        const precioUnitario = producto.tiene_oferta && producto.porcentaje_descuento 
          ? parseFloat((producto.precio * (1 - producto.porcentaje_descuento / 100)).toFixed(2))
          : parseFloat(producto.precio.toFixed(2));
          
        const nuevoItem: ItemCarrito = {
          producto,
          cantidad,
          precio_unitario: precioUnitario,
          subtotal: parseFloat((cantidad * precioUnitario).toFixed(2))
        };
        
        const nuevosItems = [...prevItems, nuevoItem];
        
        console.log('✅ AGREGAR ITEM - Nuevo item creado exitosamente:', {
          nombre: nuevoItem.producto.nombre_cerveza,
          clave: nuevoItem.producto.clave,
          cantidad: nuevoItem.cantidad,
          totalItems: nuevosItems.length
        });
        
        return nuevosItems;
      }
    });
  }, []);

  /** Remover item del carrito */
  const removerItem = useCallback((productoId: number) => {
    setItems(prevItems => prevItems.filter(item => obtenerIdProducto(item.producto) !== productoId));
  }, []);

  /** Actualizar cantidad de un item */
  const actualizarCantidad = useCallback((productoId: number, cantidad: number) => {
    if (cantidad <= 0) {
      removerItem(productoId);
      return;
    }

    setItems(prevItems =>
      prevItems.map(item => {
        if (obtenerIdProducto(item.producto) === productoId) {
          const stockDisponible = obtenerStockDisponible(item.producto);
          
          // Verificar que no se exceda el stock
          if (cantidad > stockDisponible) {
            console.warn(`Cantidad solicitada (${cantidad}) excede stock disponible (${stockDisponible})`);
            return item; // No actualizar si excede el stock
          }
          
          return {
            ...item,
            cantidad,
            subtotal: parseFloat((cantidad * item.precio_unitario).toFixed(2))
          };
        }
        return item;
      })
    );
  }, [removerItem]);

  /** Limpiar carrito */
  const limpiarCarrito = useCallback(() => {
    setItems([]);
  }, []);

  /** Obtener item específico del carrito */
  const obtenerItem = useCallback((productoId: number): ItemCarrito | undefined => {
    return items.find(item => obtenerIdProducto(item.producto) === productoId);
  }, [items]);

  // Debug del estado del carrito
  useEffect(() => {
    console.log('🛒 Estado del carrito actualizado:', {
      itemsLength: items.length,
      items: items.map(item => ({
        nombre: item.producto.nombre_cerveza,
        clave: item.producto.clave,
        cantidad: item.cantidad
      }))
    });
  }, [items]);

  return {
    items,
    totalItems,
    totalPrecio,
    puntosGanados,
    agregarItem,
    removerItem,
    actualizarCantidad,
    limpiarCarrito,
    obtenerItem
  };
} 