/** 
 * Componente principal de gestión de reportes
 * Integra con los endpoints de JSReport del backend para generar y mostrar reportes
 */
import React, { useState, useRef } from 'react';
import type { Usuario } from '../../types/auth';

interface ReportesManagementProps {
    user: Usuario;
}

type ReporteType = 'puntos' | 'eventos' | 'ibu';

interface ReporteInfo {
    id: ReporteType;
    nombre: string;
    descripcion: string;
    endpoint: string;
    icon: string;
    color: string;
}

const ReportesManagement: React.FC<ReportesManagementProps> = ({ user }) => {
    const [activeReporte, setActiveReporte] = useState<ReporteType>('puntos');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [reporteContent, setReporteContent] = useState<string>('');
    const [reporteTitle, setReporteTitle] = useState<string>('');
    const iframeRef = useRef<HTMLIFrameElement>(null);

    /** Verificar si el usuario tiene un permiso específico */
    const hasPermission = (permission: string): boolean => {
        return user.permisos.some(p => p.nombre.toLowerCase() === permission.toLowerCase());
    };

    /** Configuración de reportes disponibles */
    const reportesDisponibles: ReporteInfo[] = [
        {
            id: 'puntos',
            nombre: 'Puntos Canjeados',
            descripcion: 'Reporte de puntos canjeados por los usuarios del sistema',
            endpoint: '/api/reportes/reporte-puntos',
            icon: '⭐',
            color: 'yellow'
        },
        {
            id: 'eventos',
            nombre: 'Ventas de Eventos',
            descripcion: 'Reporte de ventas de entradas y productos en eventos',
            endpoint: '/api/reportes/reporte-evento',
            icon: '🎊',
            color: 'purple'
        },
        {
            id: 'ibu',
            nombre: 'Análisis IBU',
            descripcion: 'Análisis de amargor (IBU) de las cervezas producidas',
            endpoint: '/api/reportes/reporte-ibu',
            icon: '🍺',
            color: 'amber'
        }
    ];

    /** Verificar permisos de acceso */
    const canViewReportes = true; // Temporalmente permitir acceso
    /* Cuando se creen los permisos, usar:
    const canViewReportes = hasPermission('ver reportes ventas') || 
                           hasPermission('ver reportes inventario') ||
                           hasPermission('ver reportes financieros') ||
                           hasPermission('consultar reporte');
    */

    if (!canViewReportes) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <h2 className="text-xl font-bold text-red-900 mb-2">Acceso Denegado</h2>
                <p className="text-red-700">No tiene permisos para ver los reportes del sistema.</p>
            </div>
        );
    }

    /** Generar reporte */
    const generarReporte = async (reporte: ReporteInfo) => {
        try {
            setLoading(true);
            setError('');
            setReporteContent('');
            
            const API_BASE_URL = import.meta.env.PUBLIC_API_BASE_URL || 'http://localhost:5000';
            const response = await fetch(`${API_BASE_URL}${reporte.endpoint}`, {
                method: 'GET',
                headers: {
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
                }
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            // Obtener el contenido HTML del reporte
            const htmlContent = await response.text();
            setReporteContent(htmlContent);
            setReporteTitle(reporte.nombre);
            
            console.log(`✅ Reporte ${reporte.nombre} generado exitosamente`);

        } catch (error) {
            console.error('❌ Error generando reporte:', error);
            setError(error instanceof Error ? error.message : 'Error desconocido al generar el reporte');
        } finally {
            setLoading(false);
        }
    };

    /** Descargar reporte como archivo */
    const descargarReporte = async (reporte: ReporteInfo) => {
        try {
            setLoading(true);
            const API_BASE_URL = import.meta.env.PUBLIC_API_BASE_URL || 'http://localhost:5000';
            
            const response = await fetch(`${API_BASE_URL}${reporte.endpoint}`);
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${reporte.nombre.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.html`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            
        } catch (error) {
            console.error('❌ Error descargando reporte:', error);
            setError('Error al descargar el reporte');
        } finally {
            setLoading(false);
        }
    };

    /** Limpiar vista de reporte */
    const limpiarReporte = () => {
        setReporteContent('');
        setReporteTitle('');
        setError('');
    };

    /** Obtener color del reporte */
    const getColorClasses = (color: string) => {
        const colors = {
            yellow: 'bg-yellow-50 border-yellow-200 text-yellow-800 hover:bg-yellow-100',
            purple: 'bg-purple-50 border-purple-200 text-purple-800 hover:bg-purple-100',
            amber: 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100'
        };
        return colors[color as keyof typeof colors] || colors.yellow;
    };

    return (
        <div className="space-y-6">
            {/* Header principal */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Gestión de Reportes</h1>
                        <p className="text-indigo-100 mt-2">
                            Generación y visualización de reportes del sistema ACAUCAB
                        </p>
                    </div>
                    <div className="hidden md:block">
                        <svg className="w-16 h-16 text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Panel de control de reportes */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Reportes Disponibles</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {reportesDisponibles.map((reporte) => (
                        <div
                            key={reporte.id}
                            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${getColorClasses(reporte.color)}`}
                            onClick={() => setActiveReporte(reporte.id)}
                        >
                            <div className="flex items-center mb-3">
                                <span className="text-2xl mr-3">{reporte.icon}</span>
                                <h3 className="font-bold text-lg">{reporte.nombre}</h3>
                            </div>
                            <p className="text-sm opacity-80 mb-4">{reporte.descripcion}</p>
                            
                            <div className="flex space-x-2">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        generarReporte(reporte);
                                    }}
                                    disabled={loading}
                                    className="flex-1 bg-white/20 hover:bg-white/30 text-current font-medium py-2 px-3 rounded transition-colors disabled:opacity-50"
                                >
                                    {loading ? 'Generando...' : 'Ver Reporte'}
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        descargarReporte(reporte);
                                    }}
                                    disabled={loading}
                                    className="bg-white/20 hover:bg-white/30 text-current font-medium py-2 px-3 rounded transition-colors disabled:opacity-50"
                                    title="Descargar reporte"
                                >
                                    ⬇️
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Controles adicionales */}
                {reporteContent && (
                    <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                        <div>
                            <h3 className="font-medium text-gray-900">Reporte: {reporteTitle}</h3>
                            <p className="text-sm text-gray-600">Generado el {new Date().toLocaleString()}</p>
                        </div>
                        <button
                            onClick={limpiarReporte}
                            className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded transition-colors"
                        >
                            Limpiar Vista
                        </button>
                    </div>
                )}
            </div>

            {/* Mensajes de error */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center">
                        <span className="text-red-500 text-xl mr-3">⚠️</span>
                        <div>
                            <h3 className="font-medium text-red-900">Error al generar reporte</h3>
                            <p className="text-red-700 text-sm">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Loading indicator */}
            {loading && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                    <div className="flex items-center justify-center space-x-3">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="text-blue-700 font-medium">Generando reporte...</span>
                    </div>
                </div>
            )}

            {/* Visor de reportes */}
            {reporteContent && (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="bg-gray-50 border-b border-gray-200 p-4">
                        <h3 className="font-bold text-gray-900">Vista del Reporte: {reporteTitle}</h3>
                    </div>
                    
                    <div className="relative">
                        <iframe
                            ref={iframeRef}
                            srcDoc={reporteContent}
                            className="w-full h-[800px] border-0"
                            title={`Reporte: ${reporteTitle}`}
                            sandbox="allow-scripts allow-same-origin"
                        />
                    </div>
                </div>
            )}

            {/* Estado vacío */}
            {!reporteContent && !loading && !error && (
                <div className="bg-gray-50 rounded-lg p-12 text-center">
                    <div className="text-6xl mb-4">📊</div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">Selecciona un Reporte</h3>
                    <p className="text-gray-600">Haz clic en cualquiera de los reportes disponibles para generarlo y visualizarlo aquí.</p>
                </div>
            )}
        </div>
    );
};

export default ReportesManagement; 