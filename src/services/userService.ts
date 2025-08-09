import { apiClient } from './apiClient';

// Interfaces para usuarios
export interface User {
  cedula: string;
  nombre: string;
  email?: string;
  empresa: string;
  perfil_ubicacion: 'fijo' | 'movil' | 'libre';
  activo: boolean;
  fecha_registro: string;
  ultima_asistencia?: string;
  ubicaciones: UserLocation[];
  imagen_referencia?: string;
}

export interface UserLocation {
  id?: string;
  lat: number;
  lng: number;
  radio_metros: number;
  nombre: string;
  activa: boolean;
}

export interface CreateUserRequest {
  cedula: string;
  nombre: string;
  email?: string;
  empresa: string;
  perfil_ubicacion: 'fijo' | 'movil' | 'libre';
  imagen_referencia?: File;
  ubicaciones?: Omit<UserLocation, 'id'>[];
}

export interface UpdateUserRequest {
  nombre?: string;
  email?: string;
  empresa?: string;
  perfil_ubicacion?: 'fijo' | 'movil' | 'libre';
  activo?: boolean;
  imagen_referencia?: File;
}

export interface UserFilters {
  search?: string;
  empresa?: string;
  perfil_ubicacion?: string;
  activo?: boolean;
  page?: number;
  limit?: number;
}

export interface PaginatedUsers {
  users: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UserStats {
  total: number;
  activos: number;
  por_empresa: Record<string, number>;
  por_perfil: Record<string, number>;
  registros_ultimo_mes: number;
}

export interface ImportUsersRequest {
  file: File;
  empresa: string;
  perfil_ubicacion_default?: 'fijo' | 'movil' | 'libre';
}

export interface ImportResult {
  success: number;
  errors: Array<{
    row: number;
    cedula: string;
    error: string;
  }>;
  warnings: Array<{
    row: number;
    cedula: string;
    warning: string;
  }>;
}

class UserService {
  // Obtener lista de usuarios con filtros y paginación
  async getUsers(filters: UserFilters = {}): Promise<PaginatedUsers> {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.empresa) params.append('empresa', filters.empresa);
    if (filters.perfil_ubicacion) params.append('perfil_ubicacion', filters.perfil_ubicacion);
    if (filters.activo !== undefined) params.append('activo', filters.activo.toString());
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const response = await apiClient.get(`/admin/users?${params.toString()}`);
    return response.data;
  }

  // Obtener usuario específico
  async getUser(cedula: string): Promise<User> {
    const response = await apiClient.get(`/user-profile/${cedula}`);
    return response.data;
  }

  // Crear nuevo usuario
  async createUser(userData: CreateUserRequest): Promise<User> {
    const formData = new FormData();
    
    formData.append('cedula', userData.cedula);
    formData.append('nombre', userData.nombre);
    formData.append('empresa', userData.empresa);
    formData.append('perfil_ubicacion', userData.perfil_ubicacion);
    
    if (userData.email) {
      formData.append('email', userData.email);
    }
    
    if (userData.imagen_referencia) {
      formData.append('imagen_referencia', userData.imagen_referencia);
    }

    if (userData.ubicaciones) {
      formData.append('ubicaciones', JSON.stringify(userData.ubicaciones));
    }

    const response = await apiClient.post('/register-user', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  }

  // Actualizar usuario existente
  async updateUser(cedula: string, userData: UpdateUserRequest): Promise<User> {
    if (userData.imagen_referencia) {
      // Si hay nueva imagen, usar FormData
      const formData = new FormData();
      
      Object.entries(userData).forEach(([key, value]) => {
        if (key === 'imagen_referencia' && value instanceof File) {
          formData.append('imagen_referencia', value);
        } else if (value !== undefined) {
          formData.append(key, value.toString());
        }
      });

      const response = await apiClient.put(`/user-profile/${cedula}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } else {
      // Sin imagen, usar JSON
      const response = await apiClient.put(`/user-profile/${cedula}`, userData);
      return response.data;
    }
  }

  // Eliminar usuario
  async deleteUser(cedula: string): Promise<void> {
    await apiClient.delete(`/admin/users/${cedula}`);
  }

  // Activar/desactivar usuario
  async toggleUserStatus(cedula: string, activo: boolean): Promise<User> {
    const response = await apiClient.patch(`/admin/users/${cedula}/status`, { activo });
    return response.data;
  }

  // Agregar ubicación a usuario
  async addUserLocation(cedula: string, location: Omit<UserLocation, 'id'>): Promise<UserLocation> {
    const response = await apiClient.post(`/user-locations/${cedula}`, location);
    return response.data;
  }

  // Actualizar ubicación de usuario
  async updateUserLocation(cedula: string, locationId: string, location: Partial<UserLocation>): Promise<UserLocation> {
    const response = await apiClient.put(`/user-locations/${cedula}/${locationId}`, location);
    return response.data;
  }

  // Eliminar ubicación de usuario
  async deleteUserLocation(cedula: string, locationId: string): Promise<void> {
    await apiClient.delete(`/user-locations/${cedula}/${locationId}`);
  }

  // Obtener estadísticas de usuarios
  async getUserStats(): Promise<UserStats> {
    const response = await apiClient.get('/admin/users/stats');
    return response.data;
  }

  // Obtener lista de empresas para filtros
  async getCompanies(): Promise<string[]> {
    const response = await apiClient.get('/admin/companies');
    return response.data.map((company: any) => company.nombre);
  }

  // Importar usuarios desde archivo
  async importUsers(importData: ImportUsersRequest): Promise<ImportResult> {
    const formData = new FormData();
    formData.append('file', importData.file);
    formData.append('empresa', importData.empresa);
    
    if (importData.perfil_ubicacion_default) {
      formData.append('perfil_ubicacion_default', importData.perfil_ubicacion_default);
    }

    const response = await apiClient.post('/admin/users/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  }

  // Exportar usuarios a Excel/CSV
  async exportUsers(filters: UserFilters = {}, format: 'excel' | 'csv' = 'excel'): Promise<Blob> {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.empresa) params.append('empresa', filters.empresa);
    if (filters.perfil_ubicacion) params.append('perfil_ubicacion', filters.perfil_ubicacion);
    if (filters.activo !== undefined) params.append('activo', filters.activo.toString());
    
    params.append('format', format);

    const response = await apiClient.get(`/admin/users/export?${params.toString()}`, {
      responseType: 'blob',
    });
    
    return response.data;
  }

  // Obtener registros de asistencia de un usuario
  async getUserAttendance(cedula: string, startDate?: string, endDate?: string): Promise<any[]> {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);

    const response = await apiClient.get(`/records/${cedula}?${params.toString()}`);
    return response.data;
  }

  // Validar cédula (verificar si ya existe)
  async validateCedula(cedula: string): Promise<{ exists: boolean; user?: User }> {
    try {
      const user = await this.getUser(cedula);
      return { exists: true, user };
    } catch (error: any) {
      if (error.response?.status === 404) {
        return { exists: false };
      }
      throw error;
    }
  }
}

export const userService = new UserService();