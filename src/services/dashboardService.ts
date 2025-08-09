import { apiClient } from './apiClient';

// Interfaces para los datos de la API
export interface DashboardMetrics {
  usuariosActivos: number;
  registrosHoy: number;
  terminalesOnline: number;
  empresasActivas: number;
}

export interface RegistroAsistencia {
  id: string;
  cedula: string;
  nombre?: string;
  timestamp: string;
  tipo_registro: 'entrada' | 'salida';
  verificado: boolean;
  terminal_id?: string;
  web: boolean;
  empresa: string;
  comentario?: string;
}

export interface TerminalStatus {
  terminal_id: string;
  nombre: string;
  status: 'online' | 'offline' | 'mantenimiento';
  ultima_actividad: string;
}

export interface AsistenciaPorHora {
  hora: string;
  entradas: number;
  salidas: number;
}

class DashboardService {
  // Obtener métricas del dashboard
  async getMetrics(): Promise<DashboardMetrics> {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Llamadas paralelas a los endpoints
      const [registrosResponse, usuariosResponse, terminalesResponse, empresasResponse] = await Promise.all([
        apiClient.get(`/records/date/${today}`),
        apiClient.get('/admin/users/count'), // Endpoint para contar usuarios
        apiClient.get('/admin/terminals/status'), // Endpoint para estado de terminales
        apiClient.get('/admin/companies/active') // Endpoint para empresas activas
      ]);

      const registrosHoy = registrosResponse.data?.length || 0;
      const usuariosActivos = usuariosResponse.data?.count || 0;
      const terminalesData = terminalesResponse.data || [];
      const terminalesOnline = terminalesData.filter((t: any) => t.status === 'online').length;
      const empresasActivas = empresasResponse.data?.length || 0;

      return {
        usuariosActivos,
        registrosHoy,
        terminalesOnline,
        empresasActivas,
      };
    } catch (error) {
      console.error('Error obteniendo métricas:', error);
      // En caso de error, devolver valores en 0
      return {
        usuariosActivos: 0,
        registrosHoy: 0,
        terminalesOnline: 0,
        empresasActivas: 0,
      };
    }
  }

  // Obtener registros recientes para actividad
  async getRecentActivity(limit: number = 10): Promise<RegistroAsistencia[]> {
    try {
      const response = await apiClient.get('/admin/records/recent', {
        params: { limit }
      });
      return response.data || [];
    } catch (error) {
      console.error('Error obteniendo actividad reciente:', error);
      return [];
    }
  }

  // Obtener estado de terminales
  async getTerminalsStatus(): Promise<TerminalStatus[]> {
    try {
      const response = await apiClient.get('/admin/terminals/status');
      return response.data || [];
    } catch (error) {
      console.error('Error obteniendo estado de terminales:', error);
      return [];
    }
  }

  // Obtener datos de asistencia por hora para gráfico
  async getAttendanceByHour(): Promise<AsistenciaPorHora[]> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await apiClient.get(`/admin/analytics/attendance-by-hour/${today}`);
      return response.data || [];
    } catch (error) {
      console.error('Error obteniendo asistencia por hora:', error);
      return [];
    }
  }
}

export const dashboardService = new DashboardService();