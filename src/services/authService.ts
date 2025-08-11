import { apiClient } from './apiClient';
import { AuthResponse, LoginCredentials, AuthUser, JwtPayload } from '../types/auth';

class AuthService {
  private readonly TOKEN_KEY = 'admin_token';
  private readonly REFRESH_TOKEN_KEY = 'admin_refresh_token';
  private readonly USER_KEY = 'admin_user';

  /**
   * Iniciar sesi�n de administrador
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/admin/auth/login', credentials);
      const authData = response.data;
      
      console.log('[DEBUG] Auth response:', authData);
      
      if (authData.token) {
        this.setTokens(authData.token, authData.refreshToken);
        this.setUser(authData.user);
        console.log('[DEBUG] Tokens and user saved successfully');
      }
      
      return authData;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  }

  /**
   * Cerrar sesi�n
   */
  async logout(): Promise<void> {
    try {
      const token = this.getToken();
      if (token) {
        await apiClient.post('/admin/auth/logout');
      }
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      this.clearSession();
    }
  }

  /**
   * Renovar token de acceso
   */
  async refreshToken(): Promise<string> {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await apiClient.post<{ token: string; refreshToken: string }>('/admin/auth/refresh', {
        refreshToken
      });

      const tokenData = response.data;
      this.setTokens(tokenData.token, tokenData.refreshToken);
      return tokenData.token;
    } catch (error) {
      console.error('Error renovando token:', error);
      this.clearSession();
      throw error;
    }
  }

  /**
   * Obtener usuario actual del localStorage
   */
  getCurrentUser(): AuthUser | null {
    try {
      const userStr = localStorage.getItem(this.USER_KEY);
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error obteniendo usuario:', error);
      return null;
    }
  }

  /**
   * Obtener token de acceso
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Obtener refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Verificar si el usuario est� autenticado
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = this.decodeToken(token);
      return payload.exp * 1000 > Date.now();
    } catch (error) {
      return false;
    }
  }

  /**
   * Verificar si el usuario tiene un permiso espec�fico
   */
  hasPermission(permission: string): boolean {
    const user = this.getCurrentUser();
    return user?.permisos.includes(permission) || false;
  }

  /**
   * Verificar si el usuario tiene un rol espec�fico
   */
  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.rol === role;
  }

  /**
   * Decodificar token JWT (solo para verificar expiraci�n, NO para validaci�n de seguridad)
   */
  private decodeToken(token: string): JwtPayload {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      throw new Error('Token inv�lido');
    }
  }

  /**
   * Guardar tokens en localStorage
   */
  private setTokens(token: string, refreshToken?: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    if (refreshToken) {
      localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    }
  }

  /**
   * Guardar usuario en localStorage
   */
  private setUser(user: AuthUser): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  /**
   * Limpiar toda la sesi�n
   */
  private clearSession(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  /**
   * Verificar si el token est� pr�ximo a expirar (5 minutos antes)
   */
  isTokenExpiringSoon(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = this.decodeToken(token);
      const expirationTime = payload.exp * 1000;
      const currentTime = Date.now();
      const fiveMinutes = 5 * 60 * 1000; // 5 minutos en millisegundos

      return (expirationTime - currentTime) < fiveMinutes;
    } catch (error) {
      return false;
    }
  }
}

// Instancia singleton del servicio de autenticaci�n
export const authService = new AuthService();
export default authService;