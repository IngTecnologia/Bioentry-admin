import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Configuraci�n base del cliente API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 30000;

class ApiClient {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: API_BASE_URL,
      timeout: API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor - agregar token JWT
    this.instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('admin_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - manejar errores globalmente
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error) => {
        if (error.response?.status === 401) {
          // Token expirado o inv�lido
          localStorage.removeItem('admin_token');
          localStorage.removeItem('admin_user');
          window.location.href = '/login';
          console.error('Sesi�n expirada. Por favor, inicia sesi�n nuevamente.');
        } else if (error.response?.status >= 500) {
          console.error('Error del servidor. Por favor, intenta nuevamente.');
        } else if (error.code === 'NETWORK_ERROR' || error.code === 'ECONNABORTED') {
          console.error('Error de conexi�n. Verifica tu conexi�n a internet.');
        }
        
        return Promise.reject(error);
      }
    );
  }

  // M�todos HTTP b�sicos
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.put<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.delete<T>(url, config);
    return response.data;
  }

  // M�todo para upload de archivos
  async uploadFile<T>(url: string, formData: FormData): Promise<T> {
    const response = await this.instance.post<T>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // Verificar conectividad con la API
  async checkHealth(): Promise<boolean> {
    try {
      await this.get('/');
      return true;
    } catch (error) {
      return false;
    }
  }
}

// Instancia singleton del cliente API
export const apiClient = new ApiClient();

// Exportar para uso en servicios espec�ficos
export default apiClient;