/** 
 * Componente principal de gestión de reportes
 * Integra con los endpoints de JSReport del backend para generar y mostrar reportes
 */
import React, { useState, useRef, useEffect } from 'react';
import type { Usuario } from '../../types/auth';

interface ReportesManagementProps {
    user: Usuario;
}

type ReporteType = 'puntos' | 'evento' | 'ibu' | 'comparativa' | 'tiempo-entrega' | 'tendencia-ventas' | 'mejores-productos';

interface ReporteInfo {
    id: ReporteType;
    nombre: string;
    descripcion: string;
    endpoint: string;
    icon: string;
    color: 'blue' | 'purple' | 'green' | 'orange' | 'red';
    supportsDates?: boolean;
}

interface GeneratedReport {
    reportId: ReporteType;
    timestamp: number;
    content: string;
    title: string;
    fechaInicio?: string;
    fechaFin?: string;
}

const ReportesManagement: React.FC<ReportesManagementProps> = ({ user }) => {
    const [activeReporte, setActiveReporte] = useState<ReporteType>('puntos');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [reporteContent, setReporteContent] = useState<string>('');
    const [reporteTitle, setReporteTitle] = useState<string>('');
    const [fechaInicio, setFechaInicio] = useState<string>('');
    const [fechaFin, setFechaFin] = useState<string>('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [generatedReports, setGeneratedReports] = useState<GeneratedReport[]>([]);
    const [viewingCached, setViewingCached] = useState(false);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        const iframe = iframeRef.current;
        if (!iframe) return;

        const handleLoad = () => {
            const body = iframe.contentWindow?.document.body;
            if (body) {
                // +20px para un pequeño margen inferior
                const newHeight = body.scrollHeight + 20; 
                iframe.style.height = `${newHeight}px`;
            }
        };

        iframe.addEventListener('load', handleLoad);
        return () => iframe.removeEventListener('load', handleLoad);
    }, [reporteContent]); // Se ejecuta cada vez que el contenido del reporte cambia

    /** Verificar si el usuario tiene un permiso específico */
    const hasPermission = (permission: string): boolean => {
        return user.permisos.some(p => p.nombre.toLowerCase() === permission.toLowerCase());
    };

    /** Configuración de reportes disponibles */
    const reportesDisponibles: ReporteInfo[] = [
        {
            id: 'puntos',
            nombre: 'Puntos Canjeados',
            descripcion: 'Análisis de puntos de fidelidad utilizados por clientes',
            endpoint: '/api/reportes/reporte-puntos',
            icon: '🎯',
            color: 'blue',
            supportsDates: true
        },
        {
            id: 'evento',
            nombre: 'Ventas de Eventos',
            descripcion: 'Reporte de ventas de entradas y productos en eventos',
            endpoint: '/api/reportes/reporte-evento',
            icon: '🎟️',
            color: 'purple',
            supportsDates: true
        },
        {
            id: 'ibu',
            nombre: 'Análisis IBU',
            descripcion: 'Análisis de amargor y perfiles de cerveza',
            endpoint: '/api/reportes/reporte-ibu',
            icon: '🍺',
            color: 'orange',
            supportsDates: false
        },
        {
            id: 'comparativa',
            nombre: 'Comparativa de Cerveza',
            descripcion: 'Comparación de ingresos por tipo de cerveza',
            endpoint: '/api/reportes/reporte-comparativa-cerveza',
            icon: '📊',
            color: 'green',
            supportsDates: true
        },
        {
            id: 'tiempo-entrega',
            nombre: 'Tiempo de Entrega',
            descripcion: 'Análisis de tiempos de entrega en ventas online',
            endpoint: '/api/reportes/reporte-tiempo-entrega',
            icon: '⏱️',
            color: 'red',
            supportsDates: true
        },
        {
            id: 'tendencia-ventas',
            nombre: 'Tendencia de Ventas',
            descripcion: 'Gráfico de ingresos por ventas a lo largo del tiempo',
            endpoint: '/api/reportes/reporte-tendencia-ventas',
            icon: '📈',
            color: 'purple',
            supportsDates: true
        },
        {
            id: 'mejores-productos',
            nombre: 'Top 10 Productos',
            descripcion: 'Muestra los 10 productos más vendidos por ingresos',
            endpoint: '/api/reportes/reporte-mejores-productos',
            icon: '🏆',
            color: 'orange',
            supportsDates: true
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

    /** Limpiar reportes antiguos generados hace más de 1 hora */
    useEffect(() => {
        const hourAgo = Date.now() - (60 * 60 * 1000);
        setGeneratedReports(prev => prev.filter(report => report.timestamp > hourAgo));
    }, []);

    /** Verificar si se puede generar un reporte */
    const canGenerateReport = (reportId: ReporteType): boolean => {
        const lastGenerated = generatedReports.find(r => r.reportId === reportId);
        if (!lastGenerated) return true;
        
        // No permitir generar el mismo reporte dentro de 5 minutos
        const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
        return lastGenerated.timestamp < fiveMinutesAgo;
    };

    /** Obtener tiempo restante para generar */
    const getTimeUntilNextGeneration = (reportId: ReporteType): string => {
        const lastGenerated = generatedReports.find(r => r.reportId === reportId);
        if (!lastGenerated) return '';
        
        const timePassed = Date.now() - lastGenerated.timestamp;
        const timeRemaining = (5 * 60 * 1000) - timePassed;
        
        if (timeRemaining <= 0) return '';
        
        const minutes = Math.floor(timeRemaining / 60000);
        const seconds = Math.floor((timeRemaining % 60000) / 1000);
        
        return `Espera ${minutes}:${seconds.toString().padStart(2, '0')} min`;
    };

    if (!canViewReportes) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <h2 className="text-xl font-bold text-red-900 mb-2">Acceso Denegado</h2>
                <p className="text-red-700">No tiene permisos para ver los reportes del sistema.</p>
            </div>
        );
    }

    /** Ver reporte desde caché */
    const verReporteCacheado = (reporte: ReporteInfo) => {
        const cachedReport = generatedReports.find(r => 
            r.reportId === reporte.id && 
            r.content && 
            r.fechaInicio === fechaInicio && 
            r.fechaFin === fechaFin
        );
        
        if (cachedReport) {
            setReporteContent(cachedReport.content);
            setReporteTitle(cachedReport.title);
            setViewingCached(true);
            setError('');
            console.log(`📂 Mostrando reporte ${reporte.nombre} desde caché`);
        } else {
            setError('No hay una versión en caché de este reporte con los filtros seleccionados');
        }
    };

    /** Verificar si existe en caché */
    const existeEnCache = (reporteId: ReporteType): boolean => {
        return generatedReports.some(r => 
            r.reportId === reporteId && 
            r.content &&
            r.fechaInicio === fechaInicio && 
            r.fechaFin === fechaFin
        );
    };

    /** Generar reporte */
    const generarReporte = async (reporte: ReporteInfo, forceNew: boolean = false) => {
        // Si no es forzado y existe en caché, mostrar desde caché
        if (!forceNew && existeEnCache(reporte.id)) {
            verReporteCacheado(reporte);
            return;
        }

        // Si es forzado, verificar si puede generar uno nuevo
        if (forceNew && !canGenerateReport(reporte.id)) {
            setError(`Por favor espera antes de generar este reporte nuevamente. ${getTimeUntilNextGeneration(reporte.id)}`);
            return;
        }

        try {
            setLoading(true);
            setError('');
            setReporteContent('');
            setViewingCached(false);
            
            const API_BASE_URL = import.meta.env.PUBLIC_API_BASE_URL || 'http://localhost:5000';
            let url = `${API_BASE_URL}${reporte.endpoint}`;
            
            // Agregar fechas si están disponibles y el reporte las soporta
            if (reporte.supportsDates && fechaInicio && fechaFin) {
                url += `?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`;
            }
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error ${response.status}: ${errorText || response.statusText}`);
            }

            // Obtener el contenido HTML del reporte
            const htmlContent = await response.text();
            
            // Inyectar Chart.js si el reporte necesita gráficas
            const enhancedContent = injectChartScript(htmlContent, reporte.id);
            
            setReporteContent(enhancedContent);
            setReporteTitle(reporte.nombre);
            
            // Registrar que se generó el reporte
            setGeneratedReports(prev => [
                ...prev.filter(r => r.reportId !== reporte.id),
                { reportId: reporte.id, timestamp: Date.now(), content: enhancedContent, title: reporte.nombre, fechaInicio, fechaFin }
            ]);
            
            console.log(`✅ Reporte ${reporte.nombre} generado exitosamente`);

        } catch (error) {
            console.error('❌ Error generando reporte:', error);
            setError(error instanceof Error ? error.message : 'Error desconocido al generar el reporte');
        } finally {
            setLoading(false);
        }
    };

    /** Inyectar script de Chart.js para gráficas */
    const injectChartScript = (htmlContent: string, reporteId: ReporteType): string => {
        // No inyectar si el script ya está
        if (htmlContent.includes('<script src="https://cdn.jsdelivr.net/npm/chart.js">')) {
            return htmlContent;
        }

        const scriptContent = getChartScriptForReport(reporteId);
        if (!scriptContent) return htmlContent;

        const chartScript = `
            <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
            <script>
                document.addEventListener('DOMContentLoaded', function() {
                    ${scriptContent}
                });
            </script>
        `;
        return htmlContent.replace('</body>', `${chartScript}</body>`);
    };

    /** Devolver el script JS específico para un reporte */
    const getChartScriptForReport = (reporteId: ReporteType): string => {
        // Esta función podría usarse para reportes que NO incluyen su propio script
        // Para 'tendencia-ventas', el script está en la plantilla, por lo que devolvemos ''
        switch (reporteId) {
            case 'tendencia-ventas':
                return ''; // No inyectar, la plantilla lo tiene
            default:
                return ''; // Por defecto, no inyectar nada
        }
    };

    const handleSelectReporte = (reporteId: ReporteType) => {
        setActiveReporte(reporteId);
        const reporteSeleccionado = reportesDisponibles.find(r => r.id === reporteId);
        if (reporteSeleccionado?.supportsDates) {
            setShowDatePicker(true);
        } else {
            setShowDatePicker(false);
        }
        limpiarReporte();
    };

    const handleGenerarClick = () => {
        const reporteSeleccionado = reportesDisponibles.find(r => r.id === activeReporte);
        if (reporteSeleccionado) {
            generarReporte(reporteSeleccionado, true);
        }
    };

    const descargarReporte = async (reporte: ReporteInfo) => {
        setLoading(true);
        setError('');
        try {
            const API_BASE_URL = import.meta.env.PUBLIC_API_BASE_URL || 'http://localhost:5000';
            let url = `${API_BASE_URL}${reporte.endpoint}`;
            
            if (reporte.supportsDates && fechaInicio && fechaFin) {
                url += `?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`;
            }
            
            const response = await fetch(url);
            if (!response.ok) throw new Error('No se pudo descargar el reporte');

            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            
            const disposition = response.headers.get('content-disposition');
            let filename = `reporte_${reporte.id}.html`;
            if (disposition && disposition.indexOf('attachment') !== -1) {
                const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                const matches = filenameRegex.exec(disposition);
                if (matches != null && matches[1]) {
                    filename = matches[1].replace(/['"]/g, '');
                }
            }

            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(downloadUrl);
            a.remove();
        } catch (error) {
            console.error('Error al descargar el reporte', error);
            setError('No se pudo descargar el reporte.');
        } finally {
            setLoading(false);
        }
    };

    const limpiarReporte = () => {
        setReporteContent('');
        setReporteTitle('');
        setError('');
        setViewingCached(false);
    };

    const getColorClasses = (color: 'blue' | 'purple' | 'green' | 'orange' | 'red'): string => {
        const colorMap = {
            blue: 'border-blue-500 bg-blue-50 text-blue-800 focus:ring-blue-500',
            purple: 'border-purple-500 bg-purple-50 text-purple-800 focus:ring-purple-500',
            green: 'border-green-500 bg-green-50 text-green-800 focus:ring-green-500',
            orange: 'border-orange-500 bg-orange-50 text-orange-800 focus:ring-orange-500',
            red: 'border-red-500 bg-red-50 text-red-800 focus:ring-red-500'
        };
        return colorMap[color] || '';
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen flex flex-col space-y-6">
            <header>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Gestión de Reportes</h1>
                <p className="text-gray-600">Seleccione, configure y genere reportes del sistema.</p>
            </header>

            {/* Controles de Reportes */}
            <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
                <section>
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Seleccione un Reporte</h2>
                    <div className="flex space-x-4 overflow-x-auto pb-4">
                        {reportesDisponibles.map((reporte) => (
                            <button
                                key={reporte.id}
                                onClick={() => handleSelectReporte(reporte.id)}
                                className={`flex-shrink-0 w-64 text-left p-4 rounded-lg transition-all duration-200 flex items-start space-x-4 ${
                                    activeReporte === reporte.id
                                        ? `${getColorClasses(reporte.color)} ring-2 ring-offset-2 ${getColorClasses(reporte.color).replace('border-', 'ring-')}`
                                        : 'bg-gray-50 hover:bg-gray-100'
                                }`}
                            >
                                <div className="text-3xl pt-1">{reporte.icon}</div>
                                <div>
                                    <p className="font-bold text-gray-800">{reporte.nombre}</p>
                                    <p className="text-sm text-gray-600">{reporte.descripcion}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </section>

                <section>
                    {showDatePicker && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label htmlFor="fechaInicio" className="block text-sm font-medium text-gray-700 mb-1">Fecha de Inicio</label>
                                <input
                                    type="date"
                                    id="fechaInicio"
                                    value={fechaInicio}
                                    onChange={(e) => setFechaInicio(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="fechaFin" className="block text-sm font-medium text-gray-700 mb-1">Fecha de Fin</label>
                                <input
                                    type="date"
                                    id="fechaFin"
                                    value={fechaFin}
                                    onChange={(e) => setFechaFin(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    )}
                    <button
                        onClick={handleGenerarClick}
                        disabled={loading}
                        className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                    >
                        {loading ? 'Generando...' : 'Generar Reporte'}
                    </button>
                    {error && <p className="text-red-600 mt-4">{error}</p>}
                </section>
            </div>
            
            {/* Visualizador de Reportes */}
            <div className="bg-white rounded-xl shadow-lg flex-grow flex flex-col">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800">{reporteTitle || 'Visualizador de Reportes'}</h2>
                    {reporteContent && (
                        <button
                            onClick={limpiarReporte}
                            className="text-sm text-gray-500 hover:text-gray-800"
                        >
                            Cerrar
                        </button>
                    )}
                </div>
                <div className="flex-grow p-1">
                    {loading && (
                        <div className="flex justify-center items-center h-full">
                            <div className="text-center">
                                <svg className="animate-spin h-8 w-8 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <p className="mt-2 text-gray-600">Cargando reporte...</p>
                            </div>
                        </div>
                    )}
                    {reporteContent ? (
                        <iframe
                            ref={iframeRef}
                            srcDoc={reporteContent}
                            title={reporteTitle}
                            className="w-full border-0" // La altura se establece dinámicamente
                            sandbox="allow-scripts allow-same-origin"
                        ></iframe>
                    ) : (
                        !loading && (
                        <div className="flex justify-center items-center h-full p-8">
                            <div className="text-center text-gray-500">
                                <p>Seleccione un tipo de reporte y haga clic en "Generar Reporte" para visualizarlo aquí.</p>
                            </div>
                        </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReportesManagement; 