import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthUser, AuthContextType, LoginCredentials } from '@/types/auth';
import { authService } from '@/services/authService';

// Crear el contexto de autenticaci�n
const AuthContext = createContext<AuthContextType | null>(null);

// Hook para usar el contexto de autenticaci�n
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
}

// Hook personalizado para manejar autenticación
export function useAuthProvider() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar usuario al inicializar la aplicación
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const currentUser = authService.getCurrentUser();
        const isAuthenticated = authService.isAuthenticated();

        if (currentUser && isAuthenticated) {
          setUser(currentUser);
          
          // Verificar si el token está próximo a expirar y renovarlo
          if (authService.isTokenExpiringSoon()) {
            try {
              await authService.refreshToken();
            } catch (error) {
              console.error('Error renovando token:', error);
              setUser(null);
            }
          }
        } else if (currentUser) {
          // Usuario existe pero token expirado, limpiar sesión
          authService.logout();
          setUser(null);
        }
      } catch (error) {
        console.error('Error inicializando autenticación:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Configurar renovación automática de token
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(async () => {
      if (authService.isTokenExpiringSoon()) {
        try {
          await authService.refreshToken();
        } catch (error) {
          console.error('Error en renovación automática de token:', error);
          logout();
        }
      }
    }, 60000); // Verificar cada minuto

    return () => clearInterval(interval);
  }, [user]);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await authService.login(credentials);
      setUser(response.user);
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await authService.logout();
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      setUser(null);
      setIsLoading(false);
    }
  };

  const refreshToken = async (): Promise<void> => {
    try {
      await authService.refreshToken();
      // El usuario no cambia, solo se renueva el token
    } catch (error) {
      console.error('Error renovando token:', error);
      setUser(null);
      throw error;
    }
  };

  const hasPermission = (permission: string): boolean => {
    return authService.hasPermission(permission);
  };

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    refreshToken,
    hasPermission,
  };
}

// Hook para obtener solo el usuario autenticado
export function useAuthUser(): AuthUser | null {
  const { user } = useAuth();
  return user;
}

// Hook para verificar si el usuario est� autenticado
export function useIsAuthenticated(): boolean {
  const { isAuthenticated } = useAuth();
  return isAuthenticated;
}

// Hook para verificar permisos específicos
export function usePermissions() {
  const { hasPermission } = useAuth();
  return { hasPermission };
}

// Exportar el contexto para el provider
export { AuthContext };