import React, { useState, useEffect } from 'react';
import { lugarService, type Lugar } from '../../services/api';

interface LugaresSelectorProps {
  value?: number;
  onChange: (lugarId: number | null, lugar?: Lugar) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  showFullPath?: boolean;
}

/**
 * Componente para seleccionar lugares de forma jerárquica
 * Permite navegar de estado -> municipio -> parroquia
 */
export default function LugaresSelector({
  value,
  onChange,
  placeholder = "Seleccionar lugar",
  required = false,
  className = "",
  showFullPath = true
}: LugaresSelectorProps) {
  const [lugaresData, setLugaresData] = useState<any>(null);
  const [estados, setEstados] = useState<any[]>([]);
  const [municipios, setMunicipios] = useState<any[]>([]);
  const [parroquias, setParroquias] = useState<any[]>([]);
  
  const [selectedEstado, setSelectedEstado] = useState<any>(null);
  const [selectedMunicipio, setSelectedMunicipio] = useState<any>(null);
  const [selectedParroquia, setSelectedParroquia] = useState<any>(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentLevel, setCurrentLevel] = useState<'estado' | 'municipio' | 'parroquia'>('estado');

  useEffect(() => {
    loadLugares();
  }, []);

  /** Función para cargar todos los lugares y organizarlos jerárquicamente */
  const loadLugares = async () => {
    try {
      setLoading(true);
      const data = await lugarService.obtenerEstados();
      console.log('Datos de lugares recibidos:', data); // Debug
      setLugaresData(data);
      setEstados(data);
      setError(null);
    } catch (err) {
      console.error('Error cargando lugares:', err); // Debug
      setError(err instanceof Error ? err.message : 'Error al cargar lugares');
    } finally {
      setLoading(false);
    }
  };

  /** Cargar municipios de un estado específico */
  const loadMunicipios = (estado: any) => {
    if (estado && estado.municipios) {
      setMunicipios(estado.municipios);
      setParroquias([]); // Limpiar parroquias
      setSelectedMunicipio(null);
      setSelectedParroquia(null);
    } else {
      setMunicipios([]);
    }
  };

  /** Cargar parroquias de un municipio específico */
  const loadParroquias = (municipio: any) => {
    if (municipio && municipio.parroquias) {
      setParroquias(municipio.parroquias);
      setSelectedParroquia(null);
    } else {
      setParroquias([]);
    }
  };

  /** Manejar selección de estado */
  const handleEstadoSelect = (estado: any) => {
    setSelectedEstado(estado);
    setSelectedMunicipio(null);
    setSelectedParroquia(null);
    loadMunicipios(estado);
    setCurrentLevel('municipio');
  };

  /** Manejar selección de municipio */
  const handleMunicipioSelect = (municipio: any) => {
    setSelectedMunicipio(municipio);
    setSelectedParroquia(null);
    loadParroquias(municipio);
    setCurrentLevel('parroquia');
  };

  /** Manejar selección de parroquia */
  const handleParroquiaSelect = (parroquia: any) => {
    setSelectedParroquia(parroquia);
    onChange(parroquia.clave, parroquia);
    setShowDropdown(false);
  };

  /** Obtener el lugar seleccionado actualmente */
  const getSelectedLugar = (): any => {
    if (selectedParroquia) {
      return selectedParroquia;
    }
    if (selectedMunicipio) {
      return selectedMunicipio;
    }
    if (selectedEstado) {
      return selectedEstado;
    }
    return null;
  };

  /** Obtener la ruta completa del lugar seleccionado */
  const getFullPath = (): string => {
    if (!selectedEstado) return '';
    
    let path = selectedEstado.nombre || '';
    
    if (selectedMunicipio) {
      path += ` > ${selectedMunicipio.nombre || ''}`;
    }
    
    if (selectedParroquia) {
      path += ` > ${selectedParroquia.nombre || ''}`;
    }
    
    return path;
  };

  /** Volver al nivel anterior */
  const goBack = () => {
    if (currentLevel === 'parroquia') {
      setCurrentLevel('municipio');
      setSelectedParroquia(null);
    } else if (currentLevel === 'municipio') {
      setCurrentLevel('estado');
      setSelectedMunicipio(null);
      setMunicipios([]);
    }
  };

  /** Resetear selección */
  const reset = () => {
    setSelectedEstado(null);
    setSelectedMunicipio(null);
    setSelectedParroquia(null);
    setMunicipios([]);
    setParroquias([]);
    setCurrentLevel('estado');
    onChange(null);
  };

  const displayValue = showFullPath ? getFullPath() : getSelectedLugar()?.nombre || '';

  return (
    <div className={`relative ${className}`}>
      {/* Input display */}
      <div
        onClick={() => setShowDropdown(!showDropdown)}
        className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white cursor-pointer flex items-center justify-between"
      >
        <span className={displayValue ? 'text-gray-900' : 'text-gray-500'}>
          {displayValue || placeholder}
        </span>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-80 overflow-auto">
          {loading && (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          )}

          {error && (
            <div className="p-4 text-red-600 text-sm">
              {error}
            </div>
          )}

          {!loading && !error && (
            <>
              {/* Header con navegación */}
              <div className="p-3 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    {currentLevel === 'estado' && 'Seleccionar Estado'}
                    {currentLevel === 'municipio' && 'Seleccionar Municipio'}
                    {currentLevel === 'parroquia' && 'Seleccionar Parroquia'}
                  </span>
                  <div className="flex space-x-2">
                    {currentLevel !== 'estado' && (
                      <button
                        onClick={goBack}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        ← Volver
                      </button>
                    )}
                    {displayValue && (
                      <button
                        onClick={reset}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Limpiar
                      </button>
                    )}
                  </div>
                </div>
                
                {showFullPath && displayValue && (
                  <div className="text-xs text-gray-500 mt-1">
                    Ruta actual: {displayValue}
                  </div>
                )}
              </div>

              {/* Lista de opciones */}
              <div className="max-h-60 overflow-y-auto">
                {currentLevel === 'estado' && estados.map((estado) => (
                  <button
                    key={estado.clave}
                    onClick={() => handleEstadoSelect(estado)}
                    className={`w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors ${
                      selectedEstado?.clave === estado.clave ? 'bg-blue-100 text-blue-800' : ''
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="mr-2">🏛️</span>
                      {estado.nombre}
                    </div>
                  </button>
                ))}

                {currentLevel === 'municipio' && municipios.map((municipio) => (
                  <button
                    key={municipio.clave}
                    onClick={() => handleMunicipioSelect(municipio)}
                    className={`w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors ${
                      selectedMunicipio?.clave === municipio.clave ? 'bg-blue-100 text-blue-800' : ''
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="mr-2">🏢</span>
                      {municipio.nombre}
                    </div>
                  </button>
                ))}

                {currentLevel === 'parroquia' && parroquias.map((parroquia) => (
                  <button
                    key={parroquia.clave}
                    onClick={() => handleParroquiaSelect(parroquia)}
                    className={`w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors ${
                      selectedParroquia?.clave === parroquia.clave ? 'bg-blue-100 text-blue-800' : ''
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="mr-2">🏘️</span>
                      {parroquia.nombre}
                    </div>
                  </button>
                ))}

                {currentLevel === 'municipio' && municipios.length === 0 && (
                  <div className="p-4 text-gray-500 text-sm text-center">
                    No hay municipios disponibles para este estado
                  </div>
                )}

                {currentLevel === 'parroquia' && parroquias.length === 0 && (
                  <div className="p-4 text-gray-500 text-sm text-center">
                    No hay parroquias disponibles para este municipio
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
} 