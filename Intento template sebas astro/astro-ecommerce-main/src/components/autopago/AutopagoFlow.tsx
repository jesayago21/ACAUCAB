import React, { useState, useEffect } from 'react';
import type { DatosPago } from '../../types/autopago';
import type { Cliente, ClienteNatural, ClienteJuridico } from '../../types/client';
import { obtenerProductosDisponibles, type ProductoAdaptado } from '../../services/productService';
import PantallaInicio from './PantallaInicio';
import IdentificacionCliente from './IdentificacionCliente';
import SeleccionTipoCliente from './SeleccionTipoCliente';
import RegistroCliente from './RegistroCliente';
import MetodosPago from './MetodosPago';
import BeerProduct from '../products/BeerProduct';
import BeerCart from '../cart/BeerCart';
import { useStore } from '@nanostores/react';
import { cartStore } from '../../store/cartStore';
import type { Beer } from '../../types/beer';

export type EstadoAutopago = 'inicio' | 'identificacion' | 'seleccion-tipo' | 'registro' | 'compra' | 'carrito' | 'pago' | 'confirmacion';

/** Componente principal que maneja el flujo completo del autopago */
const AutopagoFlow: React.FC = () => {
  const [estadoActual, setEstadoActual] = useState<EstadoAutopago>('inicio');
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [cedulaParaRegistro, setCedulaParaRegistro] = useState<string>('');
  const [mensaje, setMensaje] = useState<string>('');
  const [tipoMensaje, setTipoMensaje] = useState<'success' | 'error' | 'info'>('info');
  const [datosPagoFinal, setDatosPagoFinal] = useState<DatosPago | null>(null);
  const [productos, setProductos] = useState<ProductoAdaptado[]>([]);
  const [cargandoProductos, setCargandoProductos] = useState(false);
  const [filtros, setFiltros] = useState({
    busqueda: '',
    soloOfertas: false
  });

  /** Helper para obtener el nombre del cliente según su tipo */
  const obtenerNombreCliente = (cliente: Cliente): string => {
    if (cliente.tipo === 'natural') {
      const clienteNatural = cliente as ClienteNatural;
      return `${clienteNatural.nombre || clienteNatural.primer_nombre} ${clienteNatural.apellido || clienteNatural.primer_apellido}`;
    } else {
      const clienteJuridico = cliente as ClienteJuridico;
      return clienteJuridico.denominacion_comercial || clienteJuridico.razon_social;
    }
  };

  /** Helper para obtener el documento del cliente */
  const obtenerDocumentoCliente = (cliente: Cliente): string => {
    return cliente.documento?.toString() || cliente.rif.toString();
  };

  // Estado del carrito
  const cartState = useStore(cartStore) as { items: any[]; total: number };

  /** Cargar productos del backend */
  useEffect(() => {
    const cargarProductos = async () => {
      setCargandoProductos(true);
      try {
        const productosObtenidos = await obtenerProductosDisponibles();
        setProductos(productosObtenidos);
      } catch (error) {
        console.error('Error al cargar productos:', error);
        setMensaje('Error al cargar productos. Usando datos por defecto.');
        setTipoMensaje('error');
        // Fallback a productos por defecto si falla la conexión
        setProductos([]);
      } finally {
        setCargandoProductos(false);
      }
    };

    if (estadoActual === 'compra') {
      cargarProductos();
    }
  }, [estadoActual]);

  /** Datos simulados de productos disponibles */
  const productosSimulados: Beer[] = [
    {
      id: "cerveza-1",
      thumb_src: "/images/products/beer-1.jpg",
      thumb_alt: "Cerveza Rubia",
      title: "Cerveza Rubia Premium",
      description: "Cerveza rubia tradicional con un sabor suave y refrescante. Perfecta para cualquier ocasión.",
      price: 5.99,
      stock: 50
    },
    {
      id: "cerveza-2", 
      thumb_src: "/images/products/beer-2.jpg",
      thumb_alt: "Cerveza Negra",
      title: "Cerveza Negra Artesanal",
      description: "Cerveza negra con notas de café y chocolate. Ideal para los amantes de sabores intensos.",
      price: 6.99,
      stock: 30
    },
    {
      id: "cerveza-3",
      thumb_src: "/images/products/beer-3.jpg", 
      thumb_alt: "Cerveza Roja",
      title: "Cerveza Roja Especial",
      description: "Cerveza roja con un equilibrio perfecto entre malta y lúpulo. Sabor único y distintivo.",
      price: 7.99,
      stock: 25
    },
    {
      id: "snack-1",
      thumb_src: "/images/products/snack-1.jpg",
      thumb_alt: "Papas Fritas",
      title: "Papas Fritas Artesanales",
      description: "Crujientes papas fritas cortadas a mano con sal marina.",
      price: 2.50,
      stock: 100
    },
    {
      id: "refresco-1",
      thumb_src: "/images/products/soda-1.jpg",
      thumb_alt: "Refresco de Cola",
      title: "Cola Premium 500ml",
      description: "Refrescante bebida de cola con el sabor clásico que conoces.",
      price: 1.75,
      stock: 80
    }
  ];

  /** Manejo de cambio de estado */
  const cambiarEstado = (nuevoEstado: EstadoAutopago) => {
    setEstadoActual(nuevoEstado);
    setMensaje('');
  };

  /** Manejo de identificación exitosa del cliente */
  const handleClienteIdentificado = (clienteData: Cliente) => {
    setCliente(clienteData);
    setMensaje(`¡Bienvenido ${obtenerNombreCliente(clienteData)}!`);
    setTipoMensaje('success');
    cambiarEstado('compra');
  };

  /** Manejo de cliente no encontrado - ir a selección de tipo */
  const handleClienteNoEncontrado = (cedula: string) => {
    setCedulaParaRegistro(cedula);
    setMensaje('Cliente no encontrado. Seleccione el tipo de cliente para registrarse.');
    setTipoMensaje('info');
    cambiarEstado('seleccion-tipo');
  };

  /** Manejo de cliente registrado exitosamente */
  const handleClienteRegistrado = (nuevoCliente: Cliente) => {
    setCliente(nuevoCliente);
    setMensaje(`¡Bienvenido ${obtenerNombreCliente(nuevoCliente)}! Su registro fue exitoso.`);
    setTipoMensaje('success');
    cambiarEstado('compra');
  };

  /** Manejo de pago completado */
  const handlePagoCompletado = (datos: DatosPago) => {
    setDatosPagoFinal(datos);
    setMensaje('¡Pago procesado exitosamente!');
    setTipoMensaje('success');
    cambiarEstado('confirmacion');
  };

  /** Manejo de errores */
  const handleError = (error: string) => {
    setMensaje(error);
    setTipoMensaje('error');
  };

  /** Manejo de selección de tipo de cliente */
  const handleTipoClienteSeleccionado = (tipo: 'natural' | 'juridico') => {
    // Aquí podrías guardar el tipo si es necesario
    cambiarEstado('registro');
  };

  /** Renderizar mensaje de estado */
  const renderMensaje = () => {
    if (!mensaje) return null;

    const estilos = {
      success: 'bg-green-100 border-green-400 text-green-700',
      error: 'bg-red-100 border-red-400 text-red-700',
      info: 'bg-blue-100 border-blue-400 text-blue-700'
    };

    const iconos = {
      success: 'fa-check-circle',
      error: 'fa-exclamation-triangle', 
      info: 'fa-info-circle'
    };

    return (
      <div className="fixed top-4 right-4 z-50 max-w-md">
        <div className={`${estilos[tipoMensaje]} border rounded-lg p-4 shadow-lg`}>
          <div className="flex items-center">
            <i className={`fas ${iconos[tipoMensaje]} mr-3`}></i>
            <span>{mensaje}</span>
            <button 
              onClick={() => setMensaje('')}
              className="ml-auto text-lg hover:opacity-70"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
      </div>
    );
  };

  /** Renderizar barra de progreso */
  const renderProgreso = () => {
    const estados = ['inicio', 'identificacion', 'seleccion-tipo', 'registro', 'compra', 'carrito', 'pago', 'confirmacion'];
    const indiceActual = estados.indexOf(estadoActual);
    let progreso = 0;
    
    // Calcular progreso incluyendo la selección de tipo
    if (estadoActual === 'inicio') progreso = 0;
    else if (estadoActual === 'identificacion') progreso = 15;
    else if (estadoActual === 'seleccion-tipo') progreso = 25;
    else if (estadoActual === 'registro') progreso = 35;
    else if (estadoActual === 'compra') progreso = 55;
    else if (estadoActual === 'carrito') progreso = 75;
    else if (estadoActual === 'pago') progreso = 90;
    else if (estadoActual === 'confirmacion') progreso = 100;

    if (estadoActual === 'inicio') return null;

    return (
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Progreso de compra</span>
            <span className="text-sm font-medium text-green-600">{progreso}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-custom h-2 rounded-full transition-all duration-500"
              style={{ width: `${progreso}%` }}
            ></div>
          </div>
        </div>
      </div>
    );
  };

  /** Renderizar encabezado con información del cliente */
  const renderEncabezado = () => {
    if (!cliente || estadoActual === 'inicio') return null;

    return (
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <i className="fas fa-user text-green-600"></i>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800">
                  {obtenerNombreCliente(cliente)}
                </h5>
                <p className="text-sm text-gray-600">{obtenerDocumentoCliente(cliente)}</p>
              </div>
            </div>
            <button
              className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
              onClick={() => {
                setCliente(null);
                setCedulaParaRegistro('');
                cambiarEstado('inicio');
              }}
            >
              <i className="fas fa-sign-out-alt mr-2"></i>
              Terminar Sesión
            </button>
          </div>
        </div>
      </div>
    );
  };

  /** Renderizar contenido según el estado actual */
  const renderContenido = () => {
    switch (estadoActual) {
      case 'inicio':
        return (
          <PantallaInicio 
            onIniciarCompra={() => cambiarEstado('identificacion')}
          />
        );

      case 'identificacion':
        return (
          <IdentificacionCliente
            onClienteIdentificado={handleClienteIdentificado}
            onClienteNoEncontrado={handleClienteNoEncontrado}
            onError={handleError}
          />
        );

      case 'seleccion-tipo':
        return (
          <SeleccionTipoCliente
            cedulaRif={cedulaParaRegistro}
            onTipoSeleccionado={handleTipoClienteSeleccionado}
            onVolver={() => cambiarEstado('identificacion')}
          />
        );

      case 'registro':
        return (
          <RegistroCliente
            cedulaRif={cedulaParaRegistro}
            onClienteRegistrado={handleClienteRegistrado}
            onVolver={() => cambiarEstado('seleccion-tipo')}
            onError={handleError}
          />
        );

      case 'compra':
        return (
          <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Panel principal de productos */}
                <div className="lg:col-span-3">
                  {/* Header con barra de búsqueda */}
                  <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                          <i className="fas fa-shopping-bag mr-3 text-green-600"></i>
                          Productos Disponibles
                        </h2>
                        <p className="text-gray-600">Selecciona los productos que deseas comprar</p>
                      </div>
                      
                      {/* Barra de búsqueda */}
                      <div className="flex-1 max-w-md">
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Buscar productos..."
                            value={filtros.busqueda}
                            onChange={(e) => setFiltros(prev => ({ ...prev, busqueda: e.target.value }))}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 shadow-sm hover:shadow-md bg-white"
                          />
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <i className="fas fa-search text-gray-400"></i>
                          </div>
                          {filtros.busqueda && (
                            <button
                              onClick={() => setFiltros(prev => ({ ...prev, busqueda: '' }))}
                              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Filtros */}
                    <div className="mt-4 flex flex-wrap gap-3">
                      <button 
                        onClick={() => setFiltros({ busqueda: '', soloOfertas: false })}
                        className={`px-4 py-2 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md ${
                          !filtros.soloOfertas ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <i className="fas fa-beer mr-2 text-green-600"></i>
                        Todos los Productos
                      </button>
                      <button 
                        onClick={() => setFiltros(prev => ({ ...prev, soloOfertas: !prev.soloOfertas }))}
                        className={`px-4 py-2 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md ${
                          filtros.soloOfertas ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <i className="fas fa-percent mr-2 text-red-500"></i>
                        Solo Ofertas
                      </button>
                      {productos.length > 0 && (
                        <div className="flex items-center text-sm text-gray-600 ml-auto">
                          <i className="fas fa-info-circle mr-2"></i>
                          {productos.filter(p => {
                            // Aplicar filtro de búsqueda
                            if (filtros.busqueda && filtros.busqueda.trim() !== '') {
                              const busquedaLower = filtros.busqueda.toLowerCase();
                              const coincideBusqueda = 
                                p.title.toLowerCase().includes(busquedaLower) ||
                                p.description.toLowerCase().includes(busquedaLower) ||
                                (p.tipo_cerveza && p.tipo_cerveza.toLowerCase().includes(busquedaLower)) ||
                                (p.miembro && p.miembro.toLowerCase().includes(busquedaLower));
                              
                              if (!coincideBusqueda) {
                                return false;
                              }
                            }
                            
                            // Aplicar filtro de ofertas
                            if (filtros.soloOfertas && !p.tiene_oferta) {
                              return false;
                            }
                            
                            return true;
                          }).length} productos encontrados
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Grid de productos - 3 columnas fijas */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cargandoProductos ? (
                      // Skeleton loading
                      Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className="bg-white rounded-xl shadow-md p-4 animate-pulse">
                          <div className="bg-gray-300 h-32 rounded-lg mb-4"></div>
                          <div className="bg-gray-300 h-4 rounded mb-2"></div>
                          <div className="bg-gray-300 h-3 rounded mb-4"></div>
                          <div className="bg-gray-300 h-6 rounded mb-4"></div>
                          <div className="bg-gray-300 h-10 rounded"></div>
                        </div>
                      ))
                    ) : productos.length > 0 ? (
                      productos
                        .filter(producto => {
                          // Debug: Log del producto y filtros
                          console.log('Producto:', producto.title, 'Tiene oferta:', producto.tiene_oferta, 'Filtros:', filtros);
                          
                          // Aplicar filtro de búsqueda
                          if (filtros.busqueda && filtros.busqueda.trim() !== '') {
                            const busquedaLower = filtros.busqueda.toLowerCase();
                            const coincideBusqueda = 
                              producto.title.toLowerCase().includes(busquedaLower) ||
                              producto.description.toLowerCase().includes(busquedaLower) ||
                              (producto.tipo_cerveza && producto.tipo_cerveza.toLowerCase().includes(busquedaLower)) ||
                              (producto.miembro && producto.miembro.toLowerCase().includes(busquedaLower));
                            
                            if (!coincideBusqueda) {
                              return false;
                            }
                          }
                          
                          // Aplicar filtro de ofertas
                          if (filtros.soloOfertas && !producto.tiene_oferta) {
                            return false;
                          }
                          
                          return true;
                        })
                        .map((producto) => (
                          <BeerProduct 
                            key={producto.id}
                            {...producto}
                            original_price={producto.original_price}
                            tiene_oferta={producto.tiene_oferta}
                            porcentaje_descuento={producto.porcentaje_descuento}
                            onAddToCart={() => {
                              setMensaje(`${producto.title} agregado al carrito`);
                              setTipoMensaje('success');
                              setTimeout(() => setMensaje(''), 3000);
                            }}
                          />
                        ))
                    ) : (
                      // Fallback a productos simulados si no hay conexión
                      productosSimulados.map((producto) => (
                        <BeerProduct 
                          key={producto.id}
                          {...producto} 
                          onAddToCart={() => {
                            setMensaje(`${producto.title} agregado al carrito`);
                            setTipoMensaje('success');
                            setTimeout(() => setMensaje(''), 3000);
                          }}
                        />
                      ))
                    )}
                  </div>
                </div>

                {/* Carrito lateral como isla sticky */}
                <div className="lg:col-span-1">
                  <div className="sticky top-4 h-screen overflow-y-auto pb-20">
                    <BeerCart 
                      showCheckoutButton={cartState.items.length > 0}
                      onCheckout={() => cambiarEstado('carrito')}
                    />
                    
                    {/* Información adicional */}
                    <div className="mt-6 bg-green-50 rounded-xl p-4 shadow-sm">
                      <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                        <i className="fas fa-info-circle mr-2 text-green-600"></i>
                        Información de compra
                      </h4>
                      <ul className="text-sm text-green-700 space-y-2">
                        <li className="flex items-center">
                          <i className="fas fa-star mr-2 text-yellow-500 text-xs"></i>
                          Ganas 1 punto por cada producto
                        </li>
                        <li className="flex items-center">
                          <i className="fas fa-truck mr-2 text-green-600 text-xs"></i>
                          Envío gratis en compras &gt;$50
                        </li>
                        <li className="flex items-center">
                          <i className="fas fa-check-circle mr-2 text-green-600 text-xs"></i>
                          Productos frescos y de calidad
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'carrito':
        return (
          <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-sm">
                  <div className="px-6 py-4 border-b flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-800">
                      <i className="fas fa-shopping-cart mr-3 text-green-600"></i>
                      Tu Carrito de Compras
                    </h2>
                    <button
                      className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-all duration-300 shadow-sm hover:shadow-md"
                      onClick={() => cambiarEstado('compra')}
                    >
                      <i className="fas fa-arrow-left mr-2"></i>
                      Seguir Comprando
                    </button>
                  </div>
                  <div className="p-6">
                    <BeerCart 
                      showCheckoutButton={cartState.items.length > 0}
                      onCheckout={() => cambiarEstado('pago')}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'pago':
        return (
          <MetodosPago
            total={cartState.total}
            cliente={cliente || undefined}
            onPagoCompletado={handlePagoCompletado}
            onVolver={() => cambiarEstado('carrito')}
          />
        );

      case 'confirmacion':
        return (
          <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-8">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                  <div className="text-center p-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                      <i className="fas fa-check-circle text-green-600 text-3xl"></i>
                    </div>
                    <h2 className="text-3xl font-bold text-green-600 mb-4">¡Compra Exitosa!</h2>
                    <p className="text-xl text-gray-600 mb-6">
                      Gracias por tu compra, {cliente ? obtenerNombreCliente(cliente) : ''}
                    </p>
                    
                    {/* Resumen del pago */}
                    {datosPagoFinal && (
                      <div className="bg-green-50 rounded-xl p-6 mb-6">
                        <h4 className="font-semibold text-green-800 mb-4">Resumen del Pago:</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Total:</span>
                            <span className="font-semibold">${datosPagoFinal.total.toFixed(2)}</span>
                          </div>
                          {datosPagoFinal.cambio && (
                            <div className="flex justify-between text-green-600">
                              <span>Cambio:</span>
                              <span className="font-semibold">${datosPagoFinal.cambio.toFixed(2)}</span>
                            </div>
                          )}
                          {datosPagoFinal.puntosSumados && (
                            <div className="flex justify-between text-yellow-600">
                              <span>Puntos ganados:</span>
                              <span className="font-semibold">{datosPagoFinal.puntosSumados}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <p className="text-gray-600 mb-8">
                      Tu recibo ha sido generado. Puedes recoger tus productos en el mostrador.
                    </p>
                    
                    <button
                      className="px-8 py-4 bg-gradient-custom text-white text-lg font-semibold rounded-xl hover:bg-gradient-custom transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                      onClick={() => {
                        setCliente(null);
                        setCedulaParaRegistro('');
                        setDatosPagoFinal(null);
                        cambiarEstado('inicio');
                      }}
                    >
                      <i className="fas fa-home mr-2"></i>
                      Nueva Compra
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="autopago-flow">
      {renderMensaje()}
      {renderProgreso()}
      {renderEncabezado()}
      {renderContenido()}
    </div>
  );
};

export default AutopagoFlow; 