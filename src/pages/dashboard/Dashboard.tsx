import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { dashboardService, RegistroAsistencia, TerminalStatus } from '../../services/dashboardService';

export function Dashboard() {
  // Query para métricas principales
  const { data: metrics, isLoading: metricsLoading, error: metricsError } = useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: dashboardService.getMetrics,
    refetchInterval: 30000, // Actualizar cada 30 segundos
  });

  // Query para actividad reciente
  const { data: recentActivity = [], isLoading: activityLoading } = useQuery({
    queryKey: ['recent-activity'],
    queryFn: () => dashboardService.getRecentActivity(10),
    refetchInterval: 15000, // Actualizar cada 15 segundos
  });

  // Query para estado de terminales
  const { data: terminalsStatus = [], isLoading: terminalsLoading } = useQuery({
    queryKey: ['terminals-status'],
    queryFn: dashboardService.getTerminalsStatus,
    refetchInterval: 30000, // Actualizar cada 30 segundos
  });

  // Query para asistencia por hora
  const { data: attendanceByHour = [] } = useQuery({
    queryKey: ['attendance-by-hour'],
    queryFn: dashboardService.getAttendanceByHour,
    refetchInterval: 60000, // Actualizar cada minuto
  });

  // Formatear métricas para mostrar
  const formatMetrics = () => {
    if (!metrics) return [];
    
    return [
      {
        title: 'Usuarios Activos',
        value: metrics.usuariosActivos,
        description: 'Usuarios registrados en el sistema',
        icon: '👥',
      },
      {
        title: 'Registros Hoy',
        value: metrics.registrosHoy,
        description: 'Registros de asistencia del día',
        icon: '📝',
      },
      {
        title: 'Terminales Online',
        value: metrics.terminalesOnline,
        description: 'Terminales conectadas',
        icon: '🖥️',
      },
      {
        title: 'Empresas Activas',
        value: metrics.empresasActivas,
        description: 'Empresas usando el sistema',
        icon: '🏢',
      },
    ];
  };

  // Formatear tiempo relativo
  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours} horas`;
    return `Hace ${diffDays} días`;
  };

  // Formatear estado de terminal
  const getTerminalStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-success-500';
      case 'offline': return 'bg-error-500';
      case 'mantenimiento': return 'bg-warning-500';
      default: return 'bg-gray-500';
    }
  };

  const getTerminalStatusText = (status: string) => {
    switch (status) {
      case 'online': return 'Online';
      case 'offline': return 'Offline';
      case 'mantenimiento': return 'Mantenimiento';
      default: return 'Desconocido';
    }
  };

  const formattedMetrics = formatMetrics();

  // Estados de carga y error
  if (metricsError) {
    return (
      <div className="space-y-6">
        <div className="bg-error-50 border border-error-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-error-500">⚠️</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-error-800">
                Error al cargar datos del dashboard
              </h3>
              <div className="mt-2 text-sm text-error-700">
                <p>No se pudieron obtener las métricas. Verifica la conexión con la API.</p>
              </div>
              <div className="mt-4">
                <button 
                  onClick={() => window.location.reload()}
                  className="btn-secondary text-sm"
                >
                  Reintentar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header del Dashboard */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Dashboard
          </h2>
          <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <span className="inline-flex items-center">
                📊 Vista general del sistema
              </span>
            </div>
          </div>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0">
          <button className="btn-secondary mr-3">
            📄 Generar Reporte
          </button>
          <button className="btn-primary">
            👥 Nuevo Usuario
          </button>
        </div>
      </div>

      {/* Tarjetas de métricas */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {metricsLoading ? (
          // Skeleton loading para métricas
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="metric-card animate-pulse">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <div className="h-4 bg-gray-300 rounded w-20 mb-2"></div>
                  <div className="h-6 bg-gray-300 rounded w-16 mb-1"></div>
                  <div className="h-3 bg-gray-300 rounded w-32"></div>
                </div>
              </div>
            </div>
          ))
        ) : (
          formattedMetrics.map((metric, index) => (
            <div key={index} className="metric-card">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-2xl">{metric.icon}</span>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {metric.title}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {metric.value.toLocaleString()}
                      </div>
                    </dd>
                    <dd className="mt-1 text-sm text-gray-500">
                      {metric.description}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Contenido principal del dashboard */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Gráfico de asistencia */}
        <div className="lg:col-span-8">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">
                Asistencia por Hora
              </h3>
              <p className="text-sm text-gray-500">
                Registros de entrada y salida del día
              </p>
            </div>
            <div className="card-body">
              {attendanceByHour.length > 0 ? (
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center text-gray-500">
                    <span className="text-4xl mb-4 block">📊</span>
                    <p className="text-sm">Datos disponibles: {attendanceByHour.length} horas</p>
                    <p className="text-xs">(Gráfico se implementará con Recharts)</p>
                  </div>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center text-gray-500">
                    <span className="text-4xl mb-4 block">📈</span>
                    <p className="text-sm">No hay datos de asistencia para hoy</p>
                    <p className="text-xs">Los gráficos aparecerán cuando haya registros</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actividad reciente */}
        <div className="lg:col-span-4">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">
                Actividad Reciente
              </h3>
              <p className="text-sm text-gray-500">
                Últimos registros del sistema
              </p>
            </div>
            <div className="card-body">
              <div className="flow-root">
                {activityLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="animate-pulse flex space-x-3">
                        <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-300 rounded w-1/4"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : recentActivity.length > 0 ? (
                  <ul className="-mb-8">
                    {recentActivity.map((registro, index) => (
                      <li key={registro.id}>
                        <div className={`relative ${index !== recentActivity.length - 1 ? 'pb-8' : ''}`}>
                          {index !== recentActivity.length - 1 && (
                            <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                          )}
                          <div className="relative flex space-x-3">
                            <div>
                              <span className={`h-8 w-8 rounded-full ${
                                registro.tipo_registro === 'entrada' 
                                  ? 'bg-success-500' 
                                  : registro.web 
                                  ? 'bg-info-500' 
                                  : 'bg-warning-500'
                              } flex items-center justify-center ring-8 ring-white`}>
                                <span className="text-white text-sm">
                                  {registro.tipo_registro === 'entrada' ? '→' : '←'}
                                </span>
                              </span>
                            </div>
                            <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                              <div>
                                <p className="text-sm text-gray-500">
                                  <span className="font-medium text-gray-900">
                                    {registro.nombre || `Usuario ${registro.cedula}`}
                                  </span>{' '}
                                  registró {registro.tipo_registro}
                                  {registro.web && ' (Móvil)'}
                                  {registro.terminal_id && ` (${registro.terminal_id})`}
                                </p>
                                <p className="text-xs text-gray-400">
                                  {registro.empresa}
                                </p>
                              </div>
                              <div className="whitespace-nowrap text-right text-sm text-gray-500">
                                <time>{formatTimeAgo(registro.timestamp)}</time>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <span className="text-4xl mb-4 block">📝</span>
                    <p className="text-sm">No hay actividad reciente</p>
                    <p className="text-xs">Los registros aparecerán aquí conforme ocurran</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Segunda fila */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Mapa de ubicaciones */}
        <div className="lg:col-span-7">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">
                Mapa de Ubicaciones
              </h3>
              <p className="text-sm text-gray-500">
                Ubicaciones y terminales activas
              </p>
            </div>
            <div className="card-body">
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center text-gray-500">
                  <span className="text-4xl mb-4 block">🗺️</span>
                  <p className="text-sm">Mapa interactivo</p>
                  <p className="text-xs">(Se implementará con Leaflet)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Estado de terminales */}
        <div className="lg:col-span-5">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">
                Estado de Terminales
              </h3>
              <p className="text-sm text-gray-500">
                Monitoreo en tiempo real
              </p>
            </div>
            <div className="card-body">
              {terminalsLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="animate-pulse flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-gray-300 rounded-full mr-3"></div>
                        <div className="h-4 bg-gray-300 rounded w-40"></div>
                      </div>
                      <div className="h-3 bg-gray-300 rounded w-16"></div>
                    </div>
                  ))}
                </div>
              ) : terminalsStatus.length > 0 ? (
                <div className="space-y-4">
                  {terminalsStatus.map((terminal) => (
                    <div key={terminal.terminal_id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 ${getTerminalStatusColor(terminal.status)} rounded-full mr-3`}></div>
                        <span className="text-sm text-gray-900">
                          {terminal.terminal_id} - {terminal.nombre}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {getTerminalStatusText(terminal.status)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <span className="text-4xl mb-4 block">🖥️</span>
                  <p className="text-sm">No hay terminales registradas</p>
                  <p className="text-xs">Las terminales aparecerán aquí cuando se conecten</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}