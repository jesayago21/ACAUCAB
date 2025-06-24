/** 
 * Componente principal de gestión de reportes
 * Integra con los endpoints de JSReport del backend para generar y mostrar reportes
 */
import React, { useState, useRef, useEffect } from 'react';
import type { Usuario } from '../../types/auth';

interface ReportesManagementProps {
    user: Usuario;
}

type ReporteType = 'puntos' | 'evento' | 'ibu' | 'comparativa' | 'tiempo-entrega';

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
                throw new Error(`Error ${response.status}: ${response.statusText}`);
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
        // Agregar Chart.js CDN y script personalizado según el tipo de reporte
        const chartScript = `
            <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
            <script>
                // Esperar a que el DOM esté listo
                document.addEventListener('DOMContentLoaded', function() {
                    ${getChartScriptForReport(reporteId)}
                });
            </script>
        `;
        
        // Inyectar antes del cierre del body
        return htmlContent.replace('</body>', `${chartScript}</body>`);
    };

    /** Obtener script específico para cada reporte */
    const getChartScriptForReport = (reporteId: ReporteType): string => {
        switch (reporteId) {
            case 'puntos':
                return `
                    // Verificar si el canvas existe
                    const canvas = document.getElementById('puntosChart');
                    if (canvas) {
                        // Extraer datos del reporte si es posible
                        const tables = document.querySelectorAll('table');
                        let labels = [];
                        let data = [];
                        
                        // Intentar extraer datos de la tabla
                        if (tables.length > 0) {
                            const rows = tables[0].querySelectorAll('tbody tr');
                            rows.forEach((row, index) => {
                                if (index < 5) { // Limitar a 5 meses
                                    const cells = row.querySelectorAll('td');
                                    if (cells.length >= 3) {
                                        labels.push(cells[0].textContent || 'Mes ' + (index + 1));
                                        const value = parseInt(cells[2].textContent.replace(/[^0-9]/g, '')) || 0;
                                        data.push(value);
                                    }
                                }
                            });
                        }
                        
                        // Si no hay datos, usar datos de ejemplo
                        if (labels.length === 0) {
                            labels = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'];
                            data = [1200, 1900, 3000, 2500, 2800];
                        }
                        
                        // Crear gráfica
                        new Chart(canvas, {
                            type: 'bar',
                            data: {
                                labels: labels,
                                datasets: [{
                                    label: 'Puntos Canjeados',
                                    data: data,
                                    backgroundColor: 'rgba(255, 206, 86, 0.5)',
                                    borderColor: 'rgba(255, 206, 86, 1)',
                                    borderWidth: 1
                                }]
                            },
                            options: {
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    title: {
                                        display: true,
                                        text: 'Tendencia de Puntos Canjeados'
                                    }
                                }
                            }
                        });
                    }
                `;
            
            case 'comparativa':
                return `
                    const canvas = document.getElementById('comparativaChart');
                    if (canvas) {
                        // Intentar extraer datos de la tabla comparativa
                        const tables = document.querySelectorAll('table');
                        let labels = [];
                        let data = [];
                        
                        if (tables.length > 0) {
                            const rows = tables[0].querySelectorAll('tbody tr');
                            rows.forEach((row) => {
                                const cells = row.querySelectorAll('td');
                                if (cells.length >= 2) {
                                    labels.push(cells[0].textContent || '');
                                    const value = parseFloat(cells[1].textContent.replace(/[^0-9.]/g, '')) || 0;
                                    data.push(value);
                                }
                            });
                        }
                        
                        // Datos de ejemplo si no se encuentran
                        if (labels.length === 0) {
                            labels = ['IPA', 'Lager', 'Stout', 'Wheat', 'Pilsner'];
                            data = [30, 25, 20, 15, 10];
                        }
                        
                        new Chart(canvas, {
                            type: 'pie',
                            data: {
                                labels: labels,
                                datasets: [{
                                    label: 'Ventas por Tipo',
                                    data: data,
                                    backgroundColor: [
                                        'rgba(255, 99, 132, 0.5)',
                                        'rgba(54, 162, 235, 0.5)',
                                        'rgba(255, 206, 86, 0.5)',
                                        'rgba(75, 192, 192, 0.5)',
                                        'rgba(153, 102, 255, 0.5)'
                                    ]
                                }]
                            },
                            options: {
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    title: {
                                        display: true,
                                        text: 'Distribución de Ventas por Tipo de Cerveza'
                                    },
                                    legend: {
                                        position: 'bottom'
                                    }
                                }
                            }
                        });
                    }
                `;
                
            case 'tiempo-entrega':
                return `
                    const canvas = document.getElementById('tiempoChart');
                    if (canvas) {
                        // Datos de ejemplo para tiempo de entrega
                        const labels = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
                        const data = [2.5, 2.2, 2.8, 2.1, 3.2, 4.1];
                        
                        new Chart(canvas, {
                            type: 'line',
                            data: {
                                labels: labels,
                                datasets: [{
                                    label: 'Tiempo Promedio (horas)',
                                    data: data,
                                    borderColor: 'rgba(75, 192, 192, 1)',
                                    backgroundColor: 'rgba(75, 192, 192, 0.1)',
                                    tension: 0.1,
                                    fill: true
                                }]
                            },
                            options: {
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    title: {
                                        display: true,
                                        text: 'Tiempo de Entrega Promedio por Día'
                                    }
                                },
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        title: {
                                            display: true,
                                            text: 'Horas'
                                        }
                                    }
                                }
                            }
                        });
                    }
                `;
                
            case 'evento':
                return `
                    const canvas = document.getElementById('eventoChart');
                    if (canvas) {
                        // Datos de ejemplo para eventos
                        const labels = ['Festival de Verano', 'Oktoberfest', 'Feria Navideña', 'Expo Cervecera', 'Cata Premium'];
                        const entradas = [450, 680, 320, 510, 280];
                        const productos = [1200, 1800, 850, 1350, 720];
                        
                        new Chart(canvas, {
                            type: 'bar',
                            data: {
                                labels: labels,
                                datasets: [{
                                    label: 'Entradas Vendidas',
                                    data: entradas,
                                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                                    borderColor: 'rgba(54, 162, 235, 1)',
                                    borderWidth: 1
                                }, {
                                    label: 'Productos Vendidos',
                                    data: productos,
                                    backgroundColor: 'rgba(255, 159, 64, 0.5)',
                                    borderColor: 'rgba(255, 159, 64, 1)',
                                    borderWidth: 1
                                }]
                            },
                            options: {
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    title: {
                                        display: true,
                                        text: 'Comparación de Ventas por Evento'
                                    }
                                },
                                scales: {
                                    y: {
                                        beginAtZero: true
                                    }
                                }
                            }
                        });
                    }
                `;
                
            case 'ibu':
                return `
                    const canvas = document.getElementById('ibuChart');
                    if (canvas) {
                        // Datos de ejemplo para análisis IBU
                        const labels = ['Pilsner', 'IPA', 'Stout', 'Wheat Beer', 'Pale Ale', 'Porter'];
                        const ibuValues = [25, 65, 45, 15, 40, 35];
                        
                        new Chart(canvas, {
                            type: 'radar',
                            data: {
                                labels: labels,
                                datasets: [{
                                    label: 'Nivel de IBU',
                                    data: ibuValues,
                                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                                    borderColor: 'rgba(153, 102, 255, 1)',
                                    pointBackgroundColor: 'rgba(153, 102, 255, 1)',
                                    pointBorderColor: '#fff',
                                    pointHoverBackgroundColor: '#fff',
                                    pointHoverBorderColor: 'rgba(153, 102, 255, 1)'
                                }]
                            },
                            options: {
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    title: {
                                        display: true,
                                        text: 'Perfil de Amargor (IBU) por Tipo de Cerveza'
                                    }
                                },
                                scales: {
                                    r: {
                                        beginAtZero: true,
                                        max: 80,
                                        ticks: {
                                            stepSize: 20
                                        }
                                    }
                                }
                            }
                        });
                    }
                `;
                
            default:
                return '';
        }
    };

    /** Descargar reporte como archivo */
    const descargarReporte = async (reporte: ReporteInfo) => {
        if (!canGenerateReport(reporte.id)) {
            setError(`Por favor espera antes de descargar este reporte nuevamente. ${getTimeUntilNextGeneration(reporte.id)}`);
            return;
        }

        try {
            setLoading(true);
            const API_BASE_URL = import.meta.env.PUBLIC_API_BASE_URL || 'http://localhost:5000';
            let url = `${API_BASE_URL}${reporte.endpoint}`;
            
            if (reporte.supportsDates && fechaInicio && fechaFin) {
                url += `?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`;
            }
            
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = `${reporte.nombre.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.html`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);
            
            // Registrar descarga
            setGeneratedReports(prev => [
                ...prev.filter(r => r.reportId !== reporte.id),
                { reportId: reporte.id, timestamp: Date.now(), content: '', title: '', fechaInicio, fechaFin }
            ]);
            
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

    /** Obtener clases de color para los reportes */
    const getColorClasses = (color: 'blue' | 'purple' | 'green' | 'orange' | 'red'): string => {
        const colors = {
            blue: 'bg-blue-100 border-blue-300 hover:bg-blue-200 hover:border-blue-400 text-blue-900',
            purple: 'bg-purple-100 border-purple-300 hover:bg-purple-200 hover:border-purple-400 text-purple-900',
            green: 'bg-green-100 border-green-300 hover:bg-green-200 hover:border-green-400 text-green-900',
            orange: 'bg-orange-100 border-orange-300 hover:bg-orange-200 hover:border-orange-400 text-orange-900',
            red: 'bg-red-100 border-red-300 hover:bg-red-200 hover:border-red-400 text-red-900'
        };
        return colors[color] || colors.blue;
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

            {/* Selector de fechas */}
            <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">Configuración de Reportes</h3>
                    <button
                        onClick={() => setShowDatePicker(!showDatePicker)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                        {showDatePicker ? 'Ocultar' : 'Mostrar'} Filtros de Fecha
                    </button>
                </div>
                
                {showDatePicker && (
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Fecha Inicio
                            </label>
                            <input
                                type="date"
                                value={fechaInicio}
                                onChange={(e) => setFechaInicio(e.target.value)}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Fecha Fin
                            </label>
                            <input
                                type="date"
                                value={fechaFin}
                                onChange={(e) => setFechaFin(e.target.value)}
                                min={fechaInicio}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Panel de control de reportes */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Reportes Disponibles</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {reportesDisponibles.map((reporte) => {
                        const canGenerate = canGenerateReport(reporte.id);
                        const timeRemaining = getTimeUntilNextGeneration(reporte.id);
                        const enCache = existeEnCache(reporte.id);
                        
                        return (
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
                                
                                {reporte.supportsDates && (
                                    <p className="text-xs opacity-60 mb-2">
                                        ⚡ Soporta filtros de fecha
                                    </p>
                                )}
                                
                                {enCache && (
                                    <p className="text-xs text-green-600 mb-2">
                                        ✅ En caché (filtros actuales)
                                    </p>
                                )}
                                
                                {timeRemaining && !enCache && (
                                    <p className="text-xs text-red-600 mb-2">
                                        ⏱️ {timeRemaining}
                                    </p>
                                )}
                                
                                <div className="flex space-x-2">
                                    {enCache ? (
                                        <>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    verReporteCacheado(reporte);
                                                }}
                                                className="flex-1 bg-green-600/20 hover:bg-green-600/30 text-green-800 font-medium py-2 px-3 rounded transition-colors"
                                            >
                                                Ver en Caché
                                            </button>
                                            {canGenerate && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        generarReporte(reporte, true);
                                                    }}
                                                    disabled={loading}
                                                    className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-800 font-medium py-2 px-3 rounded transition-colors disabled:opacity-50"
                                                    title="Regenerar reporte"
                                                >
                                                    🔄
                                                </button>
                                            )}
                                        </>
                                    ) : (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                generarReporte(reporte, false);
                                            }}
                                            disabled={loading || (!canGenerate && !enCache)}
                                            className="flex-1 bg-white/20 hover:bg-white/30 text-current font-medium py-2 px-3 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {loading ? 'Generando...' : 'Generar Reporte'}
                                        </button>
                                    )}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            descargarReporte(reporte);
                                        }}
                                        disabled={loading || (!canGenerate && !enCache)}
                                        className="bg-white/20 hover:bg-white/30 text-current font-medium py-2 px-3 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="Descargar reporte"
                                    >
                                        ⬇️
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Controles adicionales */}
                {reporteContent && (
                    <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                        <div>
                            <h3 className="font-medium text-gray-900">
                                Reporte: {reporteTitle} 
                                {viewingCached && <span className="text-sm text-green-600 ml-2">(Desde caché)</span>}
                            </h3>
                            <p className="text-sm text-gray-600">
                                {viewingCached ? 'Versión cacheada' : 'Generado'} el {new Date().toLocaleString()}
                            </p>
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
                        <span className="text-blue-700 font-medium">
                            Generando reporte... Esto puede tomar varios segundos
                        </span>
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
                    <p className="text-sm text-gray-500 mt-2">
                        Los reportes pueden tomar tiempo en generarse. Una vez generado, debes esperar 5 minutos antes de regenerarlo.
                    </p>
                </div>
            )}
        </div>
    );
};

export default ReportesManagement; 