import React, { useState, useEffect, useMemo } from 'react';
import { clienteService } from '../services/api';

// Tipos para la estructura anidada de lugares
interface Parroquia {
  clave: number;
  nombre: string;
}
interface Municipio {
  clave: number;
  nombre: string;
  parroquias: Parroquia[];
}
interface Estado {
  clave: number;
  nombre: string;
  municipios: Municipio[];
}

interface DireccionEnvioProps {
  onDireccionChange: (direccion: string, lugarId: number | null) => void;
  cliente: {
    direccion_habitacion?: string;
    fk_direccion_habitacion?: number;
    direccion_fisica?: string;
    fk_direccion_fisica?: number;
    tipo: 'natural' | 'juridico';
  };
}

export default function DireccionEnvio({ onDireccionChange, cliente }: DireccionEnvioProps) {
  const [estados, setEstados] = useState<Estado[]>([]);
  const [estadoId, setEstadoId] = useState<number | null>(null);
  const [municipioId, setMunicipioId] = useState<number | null>(null);
  const [parroquiaId, setParroquiaId] = useState<number | null>(null);
  const [direccion, setDireccion] = useState('');

  // Cargar todos los estados al montar el componente
  useEffect(() => {
    const cargarEstados = async () => {
      const data = await clienteService.obtenerLugares();
      setEstados(data);
    };
    cargarEstados();
  }, []);

  // Efecto para actualizar la dirección en el componente padre
  useEffect(() => {
    onDireccionChange(direccion, parroquiaId);
  }, [direccion, parroquiaId, onDireccionChange]);

  // Efecto para inicializar con la dirección del cliente
  useEffect(() => {
    const direccionCliente = cliente.tipo === 'natural' ? cliente.direccion_habitacion : cliente.direccion_fisica;
    setDireccion(direccionCliente || '');

    const lugarIdCliente = cliente.tipo === 'natural' ? cliente.fk_direccion_habitacion : cliente.fk_direccion_fisica;
    
    if (lugarIdCliente && estados.length > 0) {
      // Buscar el path (estado, municipio) para la parroquia del cliente
      for (const estado of estados) {
        for (const municipio of estado.municipios) {
          if (municipio.parroquias.some(p => p.clave === lugarIdCliente)) {
            setEstadoId(estado.clave);
            setMunicipioId(municipio.clave);
            setParroquiaId(lugarIdCliente);
            return; // Salir de los bucles una vez encontrado
          }
        }
      }
    }
  }, [cliente, estados]);


  // Listas filtradas para los menús desplegables
  const municipios = useMemo(() => {
    if (!estadoId) return [];
    const estado = estados.find(e => e.clave === estadoId);
    return estado ? estado.municipios : [];
  }, [estados, estadoId]);

  const parroquias = useMemo(() => {
    if (!municipioId) return [];
    const municipio = municipios.find(m => m.clave === municipioId);
    return municipio ? municipio.parroquias : [];
  }, [municipios, municipioId]);


  // Handlers
  const handleEstadoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = parseInt(e.target.value, 10) || null;
    setEstadoId(id);
    setMunicipioId(null);
    setParroquiaId(null);
  };

  const handleMunicipioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = parseInt(e.target.value, 10) || null;
    setMunicipioId(id);
    setParroquiaId(null);
  };

  const handleParroquiaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = parseInt(e.target.value, 10) || null;
    setParroquiaId(id);
  };
  
  const handleDireccionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDireccion(e.target.value);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-700">Dirección de Envío</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Estado */}
        <div>
          <label htmlFor="estado" className="block text-sm font-medium text-gray-600">Estado</label>
          <select id="estado" value={estadoId ?? ''} onChange={handleEstadoChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
            <option value="">Seleccione un estado</option>
            {estados.map(estado => (
              <option key={estado.clave} value={estado.clave}>{estado.nombre}</option>
            ))}
          </select>
        </div>

        {/* Municipio */}
        <div>
          <label htmlFor="municipio" className="block text-sm font-medium text-gray-600">Municipio</label>
          <select id="municipio" value={municipioId ?? ''} onChange={handleMunicipioChange} disabled={!estadoId} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md disabled:bg-gray-50">
            <option value="">Seleccione un municipio</option>
            {municipios.map(municipio => (
              <option key={municipio.clave} value={municipio.clave}>{municipio.nombre}</option>
            ))}
          </select>
        </div>

        {/* Parroquia */}
        <div>
          <label htmlFor="parroquia" className="block text-sm font-medium text-gray-600">Parroquia</label>
          <select id="parroquia" value={parroquiaId ?? ''} onChange={handleParroquiaChange} disabled={!municipioId} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md disabled:bg-gray-50">
            <option value="">Seleccione una parroquia</option>
            {parroquias.map(parroquia => (
              <option key={parroquia.clave} value={parroquia.clave}>{parroquia.nombre}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Dirección Específica */}
      <div>
        <label htmlFor="direccion" className="block text-sm font-medium text-gray-600">Dirección Específica (Calle, Casa, Apto)</label>
        <input 
          type="text" 
          id="direccion" 
          value={direccion} 
          onChange={handleDireccionChange}
          placeholder="Ej: Urb. La Floresta, Calle 5, Casa #123"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
    </div>
  );
} 