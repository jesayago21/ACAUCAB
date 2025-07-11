
import React, { useState, useEffect } from 'react';
import { eventService } from '../../services/eventService';
import type { Evento } from '../../services/eventService';

interface Venta {
  venta_id: number;
  fecha: string;
  presentacion: string;
  cerveza: string;
  cantidad: number;
  precio_unitario: number | string;
  total_linea: number | string;
}

const VentasEventoManagement: React.FC = () => {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [selectedEvento, setSelectedEvento] = useState<string>('');
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        setIsLoading(true);
        const data = await eventService.getEventos();
        setEventos(data);
        setError(null);
      } catch (err) {
        setError('Error al cargar los eventos.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventos();
  }, []);

  const handleEventoChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const eventoId = event.target.value;
    setSelectedEvento(eventoId);

    if (eventoId) {
      try {
        setIsLoading(true);
        const result = await eventService.getVentasByEventoId(Number(eventoId));
        if (result.success) {
          setVentas(result.data);
        } else {
          setVentas([]);
        }
        setError(null);
      } catch (err) {
        setError('Error al cargar las ventas del evento.');
        console.error(err);
        setVentas([]);
      } finally {
        setIsLoading(false);
      }
    } else {
      setVentas([]);
    }
  };

  const totalVentas = ventas.reduce((acc, venta) => acc + Number(venta.total_linea), 0);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Ventas por Evento</h1>

      <div className="mb-4">
        <label htmlFor="evento-select" className="block text-sm font-medium text-gray-700 mb-2">
          Seleccione un Evento:
        </label>
        <select
          id="evento-select"
          value={selectedEvento}
          onChange={handleEventoChange}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          disabled={isLoading}
        >
          <option value="">-- Todos los Eventos --</option>
          {eventos.map((evento) => (
            <option key={evento.clave} value={evento.clave}>
              {evento.nombre}
            </option>
          ))}
        </select>
      </div>

      {isLoading && <p>Cargando...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {selectedEvento && !isLoading && !error && (
        <div>
          <h2 className="text-xl font-semibold mb-2">
            Reporte de Ventas para: {eventos.find(e => e.clave === Number(selectedEvento))?.nombre}
          </h2>
          {ventas.length > 0 ? (
            <>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio Unitario</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {ventas.map((venta) => (
                    <tr key={venta.venta_id + '-' + venta.presentacion}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{venta.cerveza} - {venta.presentacion}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{venta.cantidad}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${Number(venta.precio_unitario).toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${Number(venta.total_linea).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4 text-right">
                <p className="text-lg font-bold">Total General: ${totalVentas.toFixed(2)}</p>
              </div>
            </>
          ) : (
            <p>No se encontraron ventas para este evento.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default VentasEventoManagement; 