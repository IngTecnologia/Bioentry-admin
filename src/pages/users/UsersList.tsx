import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { userService, User, UserFilters } from '../../services/userService';

export function UsersList() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // Estados para filtros
  const [filters, setFilters] = useState<UserFilters>({
    page: 1,
    limit: 20,
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Query para obtener usuarios
  const { data, isLoading, error } = useQuery({
    queryKey: ['users', filters],
    queryFn: () => userService.getUsers(filters),
    keepPreviousData: true,
  });

  // Query para obtener empresas (para filtros)
  const { data: companies = [] } = useQuery({
    queryKey: ['companies'],
    queryFn: userService.getCompanies,
  });

  // Mutation para cambiar estado de usuario
  const toggleStatusMutation = useMutation({
    mutationFn: ({ cedula, activo }: { cedula: string; activo: boolean }) =>
      userService.toggleUserStatus(cedula, activo),
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      toast.success('Estado del usuario actualizado');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Error al actualizar usuario');
    },
  });

  // Mutation para eliminar usuario
  const deleteUserMutation = useMutation({
    mutationFn: userService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      toast.success('Usuario eliminado correctamente');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Error al eliminar usuario');
    },
  });

  // Manejar b�squeda
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters(prev => ({
      ...prev,
      search: searchTerm || undefined,
      page: 1,
    }));
  };

  // Manejar cambio de filtros
  const handleFilterChange = (key: keyof UserFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined,
      page: 1,
    }));
  };

  // Manejar paginaci�n
  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  // Manejar toggle de estado
  const handleToggleStatus = (user: User) => {
    if (window.confirm(`�${user.activo ? 'Desactivar' : 'Activar'} a ${user.nombre}?`)) {
      toggleStatusMutation.mutate({ cedula: user.cedula, activo: !user.activo });
    }
  };

  // Manejar eliminaci�n
  const handleDeleteUser = (user: User) => {
    if (window.confirm(`�Eliminar permanentemente a ${user.nombre}? Esta acci�n no se puede deshacer.`)) {
      deleteUserMutation.mutate(user.cedula);
    }
  };

  // Formatear fecha
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Obtener badge de perfil
  const getProfileBadge = (perfil: string) => {
    const badges = {
      fijo: 'bg-blue-100 text-blue-800',
      movil: 'bg-green-100 text-green-800',
      libre: 'bg-purple-100 text-purple-800',
    };
    return badges[perfil as keyof typeof badges] || 'bg-gray-100 text-gray-800';
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-error-50 border border-error-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-error-800">
            Error al cargar usuarios
          </h3>
          <p className="mt-2 text-sm text-error-700">
            No se pudieron cargar los usuarios. Verifica la conexi�n con la API.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900">
            Gesti�n de Usuarios
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Administra usuarios del sistema de asistencia biom�trica
          </p>
        </div>
        <div className="mt-4 flex space-x-3 md:ml-4 md:mt-0">
          <Link to="/users/import" className="btn-secondary">
            =� Importar
          </Link>
          <Link to="/users/create" className="btn-primary">
            =e Nuevo Usuario
          </Link>
        </div>
      </div>

      {/* Filtros y b�squeda */}
      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSearch} className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-4">
            {/* B�squeda */}
            <div className="lg:col-span-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400">=</span>
                </div>
                <input
                  type="text"
                  className="input pl-10"
                  placeholder="Buscar por c�dula o nombre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Filtro por empresa */}
            <div className="lg:col-span-3">
              <select
                className="input"
                value={filters.empresa || ''}
                onChange={(e) => handleFilterChange('empresa', e.target.value)}
              >
                <option value="">Todas las empresas</option>
                {companies.map(company => (
                  <option key={company} value={company}>
                    {company}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro por perfil */}
            <div className="lg:col-span-2">
              <select
                className="input"
                value={filters.perfil_ubicacion || ''}
                onChange={(e) => handleFilterChange('perfil_ubicacion', e.target.value)}
              >
                <option value="">Todos los perfiles</option>
                <option value="fijo">Fijo</option>
                <option value="movil">M�vil</option>
                <option value="libre">Libre</option>
              </select>
            </div>

            {/* Filtro por estado */}
            <div className="lg:col-span-2">
              <select
                className="input"
                value={filters.activo !== undefined ? filters.activo.toString() : ''}
                onChange={(e) => handleFilterChange('activo', e.target.value ? e.target.value === 'true' : undefined)}
              >
                <option value="">Todos los estados</option>
                <option value="true">Activos</option>
                <option value="false">Inactivos</option>
              </select>
            </div>

            {/* Bot�n de b�squeda */}
            <div className="lg:col-span-1">
              <button type="submit" className="btn-primary w-full">
                Buscar
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Tabla de usuarios */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Lista de Usuarios
              </h3>
              {data && (
                <p className="text-sm text-gray-500">
                  {data.total} usuarios encontrados
                </p>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <select
                className="input"
                value={filters.limit}
                onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
              >
                <option value={10}>10 por p�gina</option>
                <option value={20}>20 por p�gina</option>
                <option value={50}>50 por p�gina</option>
                <option value={100}>100 por p�gina</option>
              </select>
            </div>
          </div>
        </div>

        <div className="card-body p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Empresa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Perfil
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    �ltima Asistencia
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  // Skeleton loading
                  Array.from({ length: 10 }).map((_, index) => (
                    <tr key={index} className="animate-pulse">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
                          <div className="ml-4">
                            <div className="h-4 bg-gray-300 rounded w-32"></div>
                            <div className="h-3 bg-gray-300 rounded w-24 mt-1"></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-300 rounded w-24"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-6 bg-gray-300 rounded w-16"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-6 bg-gray-300 rounded w-16"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-300 rounded w-20"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex justify-end space-x-2">
                          <div className="h-8 w-8 bg-gray-300 rounded"></div>
                          <div className="h-8 w-8 bg-gray-300 rounded"></div>
                          <div className="h-8 w-8 bg-gray-300 rounded"></div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : data?.users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="text-gray-500">
                        <span className="text-4xl mb-4 block">=e</span>
                        <h3 className="text-sm font-medium">No hay usuarios</h3>
                        <p className="text-sm">
                          {filters.search || filters.empresa || filters.perfil_ubicacion || filters.activo !== undefined
                            ? 'No se encontraron usuarios con los filtros seleccionados.'
                            : 'A�n no hay usuarios registrados en el sistema.'
                          }
                        </p>
                        <div className="mt-4">
                          <Link to="/users/create" className="btn-primary">
                            Crear primer usuario
                          </Link>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  data?.users.map((user) => (
                    <tr key={user.cedula} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-primary-600 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-white">
                              {user.nombre.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.nombre}
                            </div>
                            <div className="text-sm text-gray-500">
                              {user.cedula}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.empresa}</div>
                        {user.email && (
                          <div className="text-sm text-gray-500">{user.email}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getProfileBadge(user.perfil_ubicacion)}`}>
                          {user.perfil_ubicacion.charAt(0).toUpperCase() + user.perfil_ubicacion.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.activo 
                            ? 'bg-success-100 text-success-800'
                            : 'bg-error-100 text-error-800'
                        }`}>
                          {user.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.ultima_asistencia ? formatDate(user.ultima_asistencia) : 'Nunca'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Link
                            to={`/users/${user.cedula}`}
                            className="text-info-600 hover:text-info-900 p-1"
                            title="Ver detalles"
                          >
                            =A
                          </Link>
                          <Link
                            to={`/users/${user.cedula}/edit`}
                            className="text-primary-600 hover:text-primary-900 p-1"
                            title="Editar"
                          >
                            
                          </Link>
                          <button
                            onClick={() => handleToggleStatus(user)}
                            className={`p-1 ${
                              user.activo 
                                ? 'text-warning-600 hover:text-warning-900'
                                : 'text-success-600 hover:text-success-900'
                            }`}
                            title={user.activo ? 'Desactivar' : 'Activar'}
                            disabled={toggleStatusMutation.isLoading}
                          >
                            {user.activo ? '=' : '='}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user)}
                            className="text-error-600 hover:text-error-900 p-1"
                            title="Eliminar"
                            disabled={deleteUserMutation.isLoading}
                          >
                            =�
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Paginaci�n */}
        {data && data.totalPages > 1 && (
          <div className="card-footer">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Mostrando {((data.page - 1) * data.limit) + 1} a {Math.min(data.page * data.limit, data.total)} de {data.total} usuarios
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => handlePageChange(data.page - 1)}
                  disabled={data.page <= 1}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                
                {/* N�meros de p�gina */}
                {Array.from({ length: Math.min(5, data.totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, data.page - 2) + i;
                  if (pageNum > data.totalPages) return null;
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-2 text-sm font-medium border rounded-md ${
                        pageNum === data.page
                          ? 'text-primary-600 bg-primary-50 border-primary-300'
                          : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => handlePageChange(data.page + 1)}
                  disabled={data.page >= data.totalPages}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}