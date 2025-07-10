import React, { useState, useEffect } from 'react';
import { clienteService } from '../services/api';
import type { Lugar } from '../types/api';

interface DireccionEnvioProps {
  onDireccionChange: (direccion: string, lugarId: number | null) => void;
  cliente: { 
    direccion_habitacion?: string, 
    fk_direccion_habitacion?: number,
    direccion_fisica?: string,
    fk_direccion_fisica?: number,
    tipo: 'natural' | 'juridico'
  };
}

export default function DireccionEnvio({ onDireccionChange, cliente }: DireccionEnvioProps) {
  const [parroquias, setParroquias] = useState<Lugar[]>([]);
  
  const initialLugarId = cliente.tipo === 'natural' 
    ? cliente.fk_direccion_habitacion 
    : cliente.fk_direccion_fisica;
  const initialDireccion = cliente.tipo === 'natural'
    ? cliente.direccion_habitacion
    : cliente.direccion_fisica;

  const [lugarId, setLugarId] = useState<number | null>(initialLugarId || null);
  const [direccion, setDireccion] = useState(initialDireccion || '');

  useEffect(() => {
    const cargarParroquias = async () => {
      try {
        const todosLosLugares = await clienteService.obtenerLugares();
        const listaParroquias = todosLosLugares.filter(l => l.tipo === 'parroquia');
        setParroquias(listaParroquias);
      } catch (error) {
        console.error("Error cargando parroquias:", error);
      }
    };
    cargarParroquias();
  }, []);

  useEffect(() => {
    onDireccionChange(direccion, lugarId);
  }, [direccion, lugarId, onDireccionChange]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-[#2C2C2C] mb-4">Dirección de Envío</h3>
      <div className="space-y-4">
        <div>
          <label htmlFor="direccion" className="block text-sm font-medium text-[#2C2C2C] mb-2">
            Dirección (Calle, Casa/Apto, Urbanización)
          </label>
          <input
            id="direccion"
            type="text"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A1B5A0]"
            placeholder="Ej: Av. Principal, Res. Las Flores, Apto 1A"
          />
        </div>
        <div>
          <label htmlFor="parroquia" className="block text-sm font-medium text-[#2C2C2C] mb-2">
            Parroquia
          </label>
          <select
            id="parroquia"
            value={lugarId ?? ''}
            onChange={(e) => setLugarId(e.target.value ? parseInt(e.target.value) : null)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A1B5A0] bg-white"
          >
            <option value="">Seleccione una parroquia</option>
            {parroquias.map((parroquia) => (
              <option key={parroquia.clave} value={parroquia.clave}>
                {parroquia.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
} 