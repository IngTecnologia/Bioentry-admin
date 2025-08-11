import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

// Formulario de login simple sin dependencias externas por ahora
export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Todos los campos son requeridos');
      return;
    }

    try {
      setIsLoading(true);
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (error: any) {
      console.error('Error en login:', error);
      
      // Manejar errores espec�ficos del servidor
      if (error.response?.status === 401) {
        setError('Credenciales incorrectas. Verifica tu email y contrase�a.');
      } else if (error.response?.status === 403) {
        setError('Tu cuenta no tiene permisos de administrador.');
      } else if (error.response?.status >= 500) {
        setError('Error del servidor. Por favor, intenta nuevamente.');
      } else {
        setError('Error de conexi�n. Verifica tu conexi�n a internet.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Panel izquierdo - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary-600 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-800"></div>
        <div className="relative z-10 text-center text-white px-8">
          <div className="mb-8">
            <div className="w-20 h-20 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <span className="text-3xl font-bold">B</span>
            </div>
            <h1 className="text-4xl font-bold mb-4">BioEntry</h1>
            <p className="text-xl text-primary-100">
              Panel de Administraci�n
            </p>
          </div>
          <div className="space-y-4 text-primary-100">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-2 h-2 bg-primary-300 rounded-full"></div>
              <span>Control de Asistencia Biom�trica</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <div className="w-2 h-2 bg-primary-300 rounded-full"></div>
              <span>Gesti�n Multi-empresa</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <div className="w-2 h-2 bg-primary-300 rounded-full"></div>
              <span>Reportes en Tiempo Real</span>
            </div>
          </div>
        </div>
        
        {/* Elementos decorativos */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full animate-pulse-slow"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-white/10 rounded-full animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Panel derecho - Formulario */}
      <div className="flex-1 flex items-center justify-center px-8 py-12 bg-gray-50">
        <div className="max-w-md w-full">
          {/* Logo para m�vil */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-primary-600 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-white">B</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">BioEntry</h1>
            <p className="text-gray-600">Panel de Administraci�n</p>
          </div>

          <div className="bg-white rounded-xl shadow-medium p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Iniciar Sesi�n
              </h2>
              <p className="text-gray-600">
                Accede al panel de administraci�n
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-error-50 border border-error-200 rounded-lg">
                <p className="text-sm text-error-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                  placeholder="admin@empresa.com"
                  disabled={isLoading}
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Contrase�a
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input pr-10"
                    placeholder="••••••••••"
                    disabled={isLoading}
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <span className="text-gray-400">=H</span>
                    ) : (
                      <span className="text-gray-400">=A</span>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    disabled={isLoading}
                  />
                  <span className="ml-2 text-sm text-gray-700">Recordar sesi�n</span>
                </label>

                <button
                  type="button"
                  className="text-sm text-primary-600 hover:text-primary-500"
                  onClick={() => setError('Contacta al administrador del sistema')}
                >
                  �Olvidaste tu contrase�a?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full py-3 text-base"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2 inline-block"></div>
                    Iniciando sesi�n...
                  </>
                ) : (
                  'Iniciar Sesi�n'
                )}
              </button>
            </form>

            <div className="mt-8 text-center text-sm text-gray-500">
              <p>� 2024 INEMEC - Todos los derechos reservados</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}