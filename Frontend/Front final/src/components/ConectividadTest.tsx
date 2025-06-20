/** Componente para probar la conectividad con el backend */
import React, { useState, useEffect } from 'react';
import { conectividadService } from '../services/api';

interface EstadoConectividad {
  conectado: boolean;
  mensaje: string;
  cargando: boolean;
  ultimaComprobacion?: string;
  infoServidor?: {
    version: string;
    environment: string;
    uptime: number;
  };
}

const ConectividadTest: React.FC = () => {
  const [estado, setEstado] = useState<EstadoConectividad>({
    conectado: false,
    mensaje: 'Sin comprobar',
    cargando: false
  });

  const verificarConectividad = async () => {
    setEstado(prev => ({ ...prev, cargando: true }));
    
    try {
      const resultado = await conectividadService.verificarConectividad();
      const info = await conectividadService.obtenerInfoServidor();
      
      setEstado({
        conectado: true,
        mensaje: resultado.message || 'Conexión exitosa',
        cargando: false,
        ultimaComprobacion: new Date().toLocaleTimeString(),
        infoServidor: info
      });
    } catch (error) {
      setEstado({
        conectado: false,
        mensaje: error instanceof Error ? error.message : 'Error de conexión',
        cargando: false,
        ultimaComprobacion: new Date().toLocaleTimeString()
      });
    }
  };

  useEffect(() => {
    verificarConectividad();
  }, []);

  return (
    <div className="card max-w-md mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-texto">
          Estado del Backend
        </h3>
        <button
          onClick={verificarConectividad}
          disabled={estado.cargando}
          className="btn-secondary text-sm py-2 px-3 disabled:opacity-50"
        >
          {estado.cargando ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Comprobando...
            </div>
          ) : (
            'Comprobar'
          )}
        </button>
      </div>

      <div className="space-y-3">
        {/* Estado de conexión */}
        <div className="flex items-center gap-3">
          <div 
            className={`w-3 h-3 rounded-full ${
              estado.conectado ? 'bg-green-500' : 'bg-red-500'
            }`}
          />
          <span className="text-sm font-medium">
            {estado.conectado ? 'Conectado' : 'Desconectado'}
          </span>
        </div>

        {/* Mensaje */}
        <div className="text-sm text-gray-600">
          <strong>Estado:</strong> {estado.mensaje}
        </div>

        {/* Última comprobación */}
        {estado.ultimaComprobacion && (
          <div className="text-xs text-gray-500">
            Última comprobación: {estado.ultimaComprobacion}
          </div>
        )}

        {/* Información del servidor */}
        {estado.infoServidor && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-semibold mb-2">Información del servidor:</h4>
            <div className="space-y-1 text-xs text-gray-600">
              <div><strong>Versión:</strong> {estado.infoServidor.version}</div>
              <div><strong>Entorno:</strong> {estado.infoServidor.environment}</div>
              <div><strong>Tiempo activo:</strong> {Math.round(estado.infoServidor.uptime / 1000)}s</div>
            </div>
          </div>
        )}

        {/* URL de la API */}
        <div className="text-xs text-gray-500 border-t pt-2">
          <strong>API URL:</strong> {import.meta.env.PUBLIC_API_BASE_URL || 'http://localhost:5000'}
        </div>
      </div>
    </div>
  );
};

export default ConectividadTest; 