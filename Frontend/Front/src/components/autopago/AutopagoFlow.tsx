import React, { useState } from 'react';
import type { DatosPago } from '../../types/autopago';
import type { Cliente, ClienteNatural, ClienteJuridico } from '../../types/client';
import PantallaInicio from './PantallaInicio';
import IdentificacionCliente from './IdentificacionCliente';
import RegistroCliente from './RegistroCliente';
import MetodosPago from './MetodosPago';
import BeerProduct from '../products/BeerProduct'; // Asegúrate de que este componente también use Tailwind
import BeerCart from '../cart/BeerCart'; // Asegúrate de que este componente también use Tailwind
import { useStore } from '@nanostores/react';
import { cartStore } from '../../store/cartStore';
import type { Beer } from '../../types/beer';

// Definición de los estados del flujo de autopago
export type EstadoAutopago = 'inicio' | 'identificacion' | 'registro' | 'compra' | 'carrito' | 'pago' | 'confirmacion';

/** Componente principal que maneja el flujo completo del autopago con una interfaz de catálogo mejorada */
const AutopagoFlow: React.FC = () => {
  const [estadoActual, setEstadoActual] = useState<EstadoAutopago>('inicio');
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [cedulaParaRegistro, setCedulaParaRegistro] = useState<string>('');
  const [mensaje, setMensaje] = useState<string>('');
  const [tipoMensaje, setTipoMensaje] = useState<'success' | 'error' | 'info'>('info');
  const [datosPagoFinal, setDatosPagoFinal] = useState<DatosPago | null>(null);

  // Estado para el filtro de productos (si decides implementarlo)
  const [filtroCategoria, setFiltroCategoria] = useState<string>('todas'); // 'todas', 'cervezas', 'snacks', 'bebidas', 'ofertas'
  const [terminoBusqueda, setTerminoBusqueda] = useState<string>('');


  /** Helper para obtener el nombre completo o razón social del cliente */
  const obtenerNombreCliente = (cliente: Cliente): string => {
    if (cliente.tipo === 'natural') {
      const clienteNatural = cliente as ClienteNatural;
      return `${clienteNatural.nombre || clienteNatural.primer_nombre} ${clienteNatural.apellido || clienteNatural.primer_apellido}`;
    } else {
      const clienteJuridico = cliente as ClienteJuridico;
      return clienteJuridico.denominacion_comercial || clienteJuridico.razon_social;
    }
  };

  /** Helper para obtener el documento de identidad o RIF del cliente */
  const obtenerDocumentoCliente = (cliente: Cliente): string => {
    return cliente.documento?.toString() || cliente.rif.toString();
  };

  // Estado del carrito de Nanostores
  const cartState = useStore(cartStore) as { items: any[]; total: number };

  /** Datos simulados de productos disponibles (pueden venir de una API real) */
  const productos: Beer[] = [
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
    },
    {
      id: "cerveza-4",
      thumb_src: "/images/products/beer-4.jpg",
      thumb_alt: "IPA Lúpulo",
      title: "IPA Lúpulo Extremo",
      description: "Cerveza India Pale Ale con un potente aroma y amargor. Para los audaces.",
      price: 8.50,
      stock: 40
    },
    {
      id: "snack-2",
      thumb_src: "/images/products/snack-2.jpg",
      thumb_alt: "Maní Salado",
      title: "Maní Tostado Salado",
      description: "El snack perfecto para acompañar tu cerveza favorita.",
      price: 1.99,
      stock: 120
    },
  ];

  // Lógica de filtrado y búsqueda de productos
  const productosFiltrados = productos.filter(producto => {
    const coincideBusqueda = producto.title.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
                             producto.description.toLowerCase().includes(terminoBusqueda.toLowerCase());
    const coincideFiltro = filtroCategoria === 'todas';
    return coincideBusqueda && coincideFiltro;
  });


  /** Manejo de cambio de estado de la aplicación */
  const cambiarEstado = (nuevoEstado: EstadoAutopago) => {
    setEstadoActual(nuevoEstado);
    setMensaje(''); // Limpiar mensajes al cambiar de pantalla
  };

  /** Manejo de identificación exitosa del cliente */
  const handleClienteIdentificado = (clienteData: Cliente) => {
    setCliente(clienteData);
    setMensaje(`¡Bienvenido ${obtenerNombreCliente(clienteData)}!`);
    setTipoMensaje('success');
    cambiarEstado('compra');
  };

  /** Manejo de cliente no encontrado - ir a registro */
  const handleClienteNoEncontrado = (cedula: string) => {
    setCedulaParaRegistro(cedula);
    setMensaje('Cliente no encontrado. Por favor, complete el registro para continuar.');
    setTipoMensaje('info');
    cambiarEstado('registro');
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
    setMensaje('¡Pago procesado exitosamente! Disfrute su compra.');
    setTipoMensaje('success');
    cambiarEstado('confirmacion');
  };

  /** Manejo de errores */
  const handleError = (error: string) => {
    setMensaje(error);
    setTipoMensaje('error');
  };

  /** Renderizar mensaje de estado flotante */
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
      <div className="fixed top-6 right-6 z-50 max-w-sm w-full animate-fade-in-down">
        <div className={`${estilos[tipoMensaje]} border rounded-lg p-4 shadow-xl flex items-center justify-between`}>
          <div className="flex items-center">
            <i className={`fas ${iconos[tipoMensaje]} text-xl mr-3`}></i>
            <span className="text-base font-medium">{mensaje}</span>
          </div>
          <button
            onClick={() => setMensaje('')}
            className="ml-4 text-xl hover:opacity-75 transition-opacity"
            aria-label="Cerrar mensaje"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      </div>
    );
  };

  /** Renderizar barra de progreso del flujo */
  const renderProgreso = () => {
    if (estadoActual === 'inicio' || estadoActual === 'confirmacion') return null; // No mostrar en inicio ni confirmación

    let progreso = 0;
    switch (estadoActual) {
      case 'identificacion': progreso = 20; break;
      case 'registro': progreso = 35; break; // Un poco más de progreso si entra a registro
      case 'compra': progreso = 55; break;
      case 'carrito': progreso = 75; break;
      case 'pago': progreso = 90; break;
      default: progreso = 0;
    }

    return (
      <div className="bg-white shadow-md border-b border-gray-100">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700">Progreso de la Compra</span>
            <span className="text-sm font-semibold text-green-600">{progreso}% Completado</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-green-500 to-green-700 h-3 rounded-full transition-all duration-700 ease-out shadow-inner"
              style={{ width: `${progreso}%` }}
            ></div>
          </div>
        </div>
      </div>
    );
  };

  /** Renderizar encabezado con información del cliente autenticado */
  const renderEncabezadoCliente = () => {
    if (!cliente || estadoActual === 'inicio') return null; // Solo mostrar si hay cliente y no es la pantalla de inicio

    return (
      <div className="bg-white shadow-md border-b border-gray-100">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4 shadow-sm">
              <i className="fas fa-user-circle text-green-600 text-2xl"></i> {/* Icono de usuario */}
            </div>
            <div>
              <h5 className="font-bold text-lg text-gray-800">
                ¡Hola, {obtenerNombreCliente(cliente)}!
              </h5>
              <p className="text-sm text-gray-600">Documento: {obtenerDocumentoCliente(cliente)}</p>
            </div>
          </div>
          <button
            className="px-5 py-2 border border-red-300 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 active:bg-red-200 transition-all duration-200 shadow-sm hover:shadow-md"
            onClick={() => {
              setCliente(null);
              setCedulaParaRegistro('');
              cambiarEstado('inicio');
            }}
            aria-label="Terminar sesión y volver al inicio"
          >
            <i className="fas fa-sign-out-alt mr-2"></i>
            Terminar Sesión
          </button>
        </div>
      </div>
    );
  };

  /** Renderizar el contenido principal según el estado actual del flujo */
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
            onIrARegistro={() => cambiarEstado('registro')}
          />
        );

      case 'registro':
        return (
          <RegistroCliente
            cedulaRif={cedulaParaRegistro}
            onClienteRegistrado={handleClienteRegistrado}
            onVolver={() => cambiarEstado('identificacion')}
            onError={handleError}
          />
        );

      case 'compra':
        return (
          <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-6">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Panel principal de productos (ocupa 3 columnas en pantallas grandes) */}
                <div className="lg:col-span-3">
                  {/* Header con barra de búsqueda y filtros */}
                  <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
                      <div>
                        <h2 className="text-3xl font-extrabold text-gray-800 mb-2">
                          <i className="fas fa-store-alt mr-3 text-green-600"></i> {/* Icono de tienda */}
                          Nuestro Catálogo
                        </h2>
                        <p className="text-gray-600 text-lg">Descubre y selecciona tus productos favoritos</p>
                      </div>

                      {/* Barra de búsqueda */}
                      <div className="flex-1 max-w-md">
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Buscar cervezas, snacks, bebidas..."
                            className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-full focus:ring-4 focus:ring-green-200 focus:border-green-500 transition-all duration-300 shadow-sm text-gray-700 placeholder-gray-400 text-base"
                            value={terminoBusqueda}
                            onChange={(e) => setTerminoBusqueda(e.target.value)}
                          />
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <i className="fas fa-search text-gray-400 text-lg"></i>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Filtros de categoría */}
                    <div className="flex flex-wrap gap-3">
                      <button
                        className={`px-5 py-2.5 rounded-full font-semibold transition-all duration-300 shadow-sm hover:shadow-md ${filtroCategoria === 'todas' ? 'bg-green-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        onClick={() => setFiltroCategoria('todas')}
                      >
                        <i className="fas fa-list-alt mr-2"></i> Todas
                      </button>
                      <button
                        className={`px-5 py-2.5 rounded-full font-semibold transition-all duration-300 shadow-sm hover:shadow-md ${filtroCategoria === 'cervezas' ? 'bg-green-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        onClick={() => setFiltroCategoria('cervezas')}
                      >
                        <i className="fas fa-beer mr-2"></i> Cervezas
                      </button>
                      <button
                        className={`px-5 py-2.5 rounded-full font-semibold transition-all duration-300 shadow-sm hover:shadow-md ${filtroCategoria === 'snacks' ? 'bg-green-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        onClick={() => setFiltroCategoria('snacks')}
                      >
                        <i className="fas fa-cookie-bite mr-2"></i> Snacks
                      </button>
                      <button
                        className={`px-5 py-2.5 rounded-full font-semibold transition-all duration-300 shadow-sm hover:shadow-md ${filtroCategoria === 'bebidas' ? 'bg-green-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        onClick={() => setFiltroCategoria('bebidas')}
                      >
                        <i className="fas fa-glass-whiskey mr-2"></i> Bebidas
                      </button>
                      {/* Aquí podrías añadir un filtro de "Ofertas" si tienes esa lógica */}
                      {/* <button className="px-5 py-2.5 bg-yellow-100 text-yellow-800 rounded-full hover:bg-yellow-200 transition-all duration-300 shadow-sm hover:shadow-md">
                        <i className="fas fa-tag mr-2"></i> Ofertas
                      </button> */}
                    </div>
                  </div>

                  {/* Grid de productos */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {productosFiltrados.length > 0 ? (
                      productosFiltrados.map((producto) => (
                        <BeerProduct
                          key={producto.id}
                          {...producto}
                          onAddToCart={() => {
                            setMensaje(`"${producto.title}" agregado al carrito.`);
                            setTipoMensaje('success');
                            setTimeout(() => setMensaje(''), 3000); // Mensaje desaparece después de 3 segundos
                          }}
                        />
                      ))
                    ) : (
                      <div className="lg:col-span-3 text-center py-10 bg-white rounded-xl shadow-md text-gray-600">
                        <i className="fas fa-box-open text-5xl mb-4 text-gray-400"></i>
                        <p className="text-xl font-semibold">No se encontraron productos.</p>
                        <p className="mt-2">Intenta ajustar tu búsqueda o filtros.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Carrito lateral (sticky) */}
                <div className="lg:col-span-1">
                  <div className="sticky top-6 h-[calc(100vh-48px)] overflow-y-auto pb-4 custom-scrollbar"> {/* Ajuste para altura y sticky */}
                    <BeerCart
                      showCheckoutButton={cartState.items.length > 0}
                      onCheckout={() => cambiarEstado('carrito')}
                    />

                    {/* Información adicional de beneficios */}
                    <div className="mt-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 shadow-lg border border-green-200">
                      <h4 className="font-bold text-green-800 text-xl mb-3 flex items-center">
                        <i className="fas fa-award mr-2 text-green-600"></i>
                        Beneficios Exclusivos
                      </h4>
                      <ul className="text-sm text-green-700 space-y-3">
                        <li className="flex items-start">
                          <i className="fas fa-medal mr-3 mt-1 text-yellow-500"></i>
                          <div>
                            <span className="font-semibold">Programa de Fidelidad:</span> Gana <span className="font-bold">1 punto</span> por cada producto que añades a tu carrito. ¡Canjéalos por descuentos!
                          </div>
                        </li>
                        <li className="flex items-start">
                          <i className="fas fa-shipping-fast mr-3 mt-1 text-blue-500"></i>
                          <div>
                            <span className="font-semibold">Envío Rápido y Seguro:</span> Recibe tus productos en tiempo récord. <span className="font-bold">¡Envío gratis en compras mayores a $50!</span>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <i className="fas fa-leaf mr-3 mt-1 text-green-600"></i>
                          <div>
                            <span className="font-semibold">Calidad Garantizada:</span> Solo ofrecemos productos frescos y de la más alta calidad, seleccionados para ti.
                          </div>
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
            <div className="container mx-auto px-6">
              <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="px-7 py-5 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    <i className="fas fa-shopping-cart mr-3 text-green-600"></i>
                    Tu Carrito de Compras
                  </h2>
                  <button
                    className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-all duration-200 shadow-sm hover:shadow-md flex items-center"
                    onClick={() => cambiarEstado('compra')}
                    aria-label="Volver a la tienda para seguir comprando"
                  >
                    <i className="fas fa-arrow-left mr-2"></i>
                    Seguir Comprando
                  </button>
                </div>
                <div className="p-7">
                  <BeerCart
                    showCheckoutButton={cartState.items.length > 0}
                    onCheckout={() => cambiarEstado('pago')}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'pago':
        return (
          <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-6">
              <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="px-7 py-5 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    <i className="fas fa-credit-card mr-3 text-blue-600"></i>
                    Método de Pago
                  </h2>
                  <button
                    className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-all duration-200 shadow-sm hover:shadow-md flex items-center"
                    onClick={() => cambiarEstado('carrito')}
                    aria-label="Volver al carrito"
                  >
                    <i className="fas fa-arrow-left mr-2"></i>
                    Volver al Carrito
                  </button>
                </div>
                <div className="p-7">
                  <MetodosPago
                    total={cartState.total}
                    onPagoCompletado={handlePagoCompletado}
                    onVolver={() => cambiarEstado('carrito')}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'confirmacion':
        return (
          <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center py-8">
            <div className="container mx-auto px-6">
              <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden p-8 border border-green-200">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-8 animate-bounce-once-slow"> {/* Animación sutil */}
                      <i className="fas fa-check-circle text-green-600 text-5xl"></i>
                    </div>
                    <h2 className="text-4xl font-extrabold text-green-700 mb-5">¡Compra Exitosa!</h2>
                    <p className="text-xl text-gray-700 mb-8 max-w-lg mx-auto leading-relaxed">
                      ¡Felicidades! Tu pedido ha sido procesado con éxito. <span className="font-semibold">{cliente ? obtenerNombreCliente(cliente) : 'Estimado cliente'}</span>, agradecemos tu preferencia.
                    </p>

                    {/* Resumen del pago */}
                    {datosPagoFinal && (
                      <div className="bg-green-50 rounded-xl p-7 mb-8 border border-green-200 shadow-inner">
                        <h4 className="font-bold text-green-800 text-xl mb-4">Detalles del Pago:</h4>
                        <div className="space-y-3 text-lg text-gray-800">
                          <div className="flex justify-between items-center">
                            <span>Total Pagado:</span>
                            <span className="font-extrabold text-green-700">${datosPagoFinal.total.toFixed(2)}</span>
                          </div>
                          {datosPagoFinal.cambio !== undefined && datosPagoFinal.cambio > 0.01 && (
                            <div className="flex justify-between items-center border-t border-green-200 pt-3">
                              <span>Tu Cambio:</span>
                              <span className="font-extrabold text-green-600">${datosPagoFinal.cambio.toFixed(2)}</span>
                            </div>
                          )}
                          {datosPagoFinal.puntosSumados && datosPagoFinal.puntosSumados > 0 && (
                            <div className="flex justify-between items-center text-yellow-700 font-bold">
                              <span>Puntos de Fidelidad Ganados:</span>
                              <span>+{datosPagoFinal.puntosSumados} puntos <i className="fas fa-star ml-2 text-yellow-500"></i></span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <p className="text-gray-600 text-lg mb-10 leading-relaxed">
                      Tu recibo digital ha sido enviado. Puedes recoger tus productos en el área de entrega. ¡Que disfrutes tu compra!
                    </p>

                    <button
                      className="px-10 py-5 bg-gradient-to-r from-green-600 to-green-700 text-white text-xl font-bold rounded-xl
                                 hover:from-green-700 hover:to-green-800 transition-all duration-300 transform hover:scale-105
                                 shadow-xl hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-70"
                      onClick={() => {
                        setCliente(null);
                        setCedulaParaRegistro('');
                        setDatosPagoFinal(null);
                        cartStore.set({ items: [], total: 0 }); // Limpiar carrito
                        cambiarEstado('inicio');
                      }}
                      aria-label="Iniciar nueva compra"
                    >
                      <i className="fas fa-home mr-3 text-2xl"></i>
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
    <div className="bg-background min-h-screen font-sans antialiased">
      {renderMensaje()}
      {renderProgreso()}
      {renderEncabezadoCliente()}
      <main className="flex-grow flex items-center justify-center p-4">
        {renderContenido()}
      </main>
    </div>
  );
};

export default AutopagoFlow;