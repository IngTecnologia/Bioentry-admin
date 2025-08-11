// Usuario autenticado (administrador)
export interface AuthUser {
  id: string;
  email: string;
  nombre: string;
  rol: 'super_admin' | 'admin_empresa' | 'supervisor';
  empresa?: string;
  permisos: string[];
  ultimo_acceso: string;
}

// Credenciales de login
export interface LoginCredentials {
  email: string;
  password: string;
}

// Respuesta de autenticación
export interface AuthResponse {
  user: AuthUser;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

// Token JWT decodificado
export interface JwtPayload {
  user_id: string;
  email: string;
  rol: string;
  empresa?: string;
  exp: number;
  iat: number;
}

// Context de autenticación
export interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
}