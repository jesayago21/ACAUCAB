/** Componente de debug para el scanner de códigos de barras */
import React, { useState, useEffect } from 'react';

export default function ScannerDebug() {
  const [isScanning, setIsScanning] = useState(false);
  const [buffer, setBuffer] = useState('');
  const [lastKeyTime, setLastKeyTime] = useState(0);
  const [keyLog, setKeyLog] = useState<string[]>([]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isScanning) return;

      const currentTime = Date.now();
      
      // Si han pasado más de 50ms desde la última tecla, reiniciar el buffer
      if (currentTime - lastKeyTime > 50) {
        setBuffer('');
        console.log('🔄 Buffer reiniciado');
      }
      
      setLastKeyTime(currentTime);
      
      // Log de la tecla
      const keyInfo = `${event.key} (${event.keyCode}) - ${new Date().toLocaleTimeString()}`;
      setKeyLog(prev => [...prev.slice(-9), keyInfo]); // Mantener solo los últimos 10
      console.log('🔢 Tecla presionada:', keyInfo);
      
      // Agregar la tecla al buffer (solo números y letras)
      if (event.key.length === 1 && /[0-9A-Za-z]/.test(event.key)) {
        setBuffer(prev => {
          const newBuffer = prev + event.key;
          console.log('📦 Buffer actualizado:', newBuffer);
          return newBuffer;
        });
      }
      
      // Si se presiona Enter, procesar el código
      if (event.key === 'Enter') {
        const code = buffer.trim();
        if (code.length > 0) {
          console.log('📦 Código completo escaneado:', code);
          alert(`Código escaneado: ${code}`);
          setBuffer('');
        }
      }
    };

    if (isScanning) {
      document.addEventListener('keydown', handleKeyDown);
      console.log('🎯 Event listener agregado para debug');
    } else {
      document.removeEventListener('keydown', handleKeyDown);
      console.log('🎯 Event listener removido para debug');
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isScanning, buffer, lastKeyTime]);

  const startScanning = () => {
    console.log('🚀 Iniciando scanner debug');
    setIsScanning(true);
    setBuffer('');
    setKeyLog([]);
  };

  const stopScanning = () => {
    console.log('⏹️ Deteniendo scanner debug');
    setIsScanning(false);
    setBuffer('');
  };

  const clearLog = () => {
    setKeyLog([]);
    setBuffer('');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Debug del Scanner de Códigos de Barras
          </h1>

          {/* Controles */}
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="p-3 bg-white rounded border">
                <span className="font-medium">Estado:</span>
                <span className={`ml-2 ${isScanning ? 'text-green-600' : 'text-red-600'}`}>
                  {isScanning ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              <div className="p-3 bg-white rounded border">
                <span className="font-medium">Buffer:</span>
                <span className="ml-2 text-gray-600 font-mono">
                  {buffer || 'vacío'}
                </span>
              </div>
              <div className="p-3 bg-white rounded border">
                <span className="font-medium">Última tecla:</span>
                <span className="ml-2 text-gray-600">
                  {keyLog.length > 0 ? keyLog[keyLog.length - 1] : 'ninguna'}
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
                    <p className="font-medium mb-1">Scanner debug activo</p>
                    <p>Presione teclas o use su scanner USB. Todas las teclas se registrarán abajo.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Log de teclas */}
          <div className="bg-white border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Log de Teclas ({keyLog.length})
              </h3>
              <button
                onClick={clearLog}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded hover:bg-gray-50"
              >
                Limpiar Log
              </button>
            </div>
            
            {keyLog.length === 0 ? (
              <p className="text-gray-500 text-sm">No se han registrado teclas aún</p>
            ) : (
              <div className="space-y-1 max-h-64 overflow-y-auto">
                {keyLog.map((log, index) => (
                  <div key={index} className="p-2 bg-gray-50 border rounded text-sm font-mono">
                    {log}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Instrucciones */}
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">Instrucciones de Debug</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Haga clic en "Activar Scanner"</li>
              <li>• Presione teclas en su teclado o use un scanner USB</li>
              <li>• Observe el log de teclas abajo</li>
              <li>• El buffer se reinicia si hay más de 50ms entre teclas</li>
              <li>• Presione Enter para procesar el código del buffer</li>
              <li>• Use "Limpiar Log" para borrar el historial</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 