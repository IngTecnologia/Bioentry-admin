import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

// Configuración del menú de navegación
const navigationItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: '=Ê',
    permission: 'dashboard.view',
  },
  {
    name: 'Usuarios',
    href: '/users',
    icon: '=e',
    permission: 'users.view',
    children: [
      { name: 'Lista de Usuarios', href: '/users', permission: 'users.view' },
      { name: 'Crear Usuario', href: '/users/create', permission: 'users.create' },
      { name: 'Importar Usuarios', href: '/users/import', permission: 'users.import' },
    ],
  },
  {
    name: 'Asistencia',
    href: '/attendance',
    icon: 'ð',
    permission: 'attendance.view',
    children: [
      { name: 'Registros', href: '/attendance', permission: 'attendance.view' },
      { name: 'Monitor en Vivo', href: '/attendance/live', permission: 'attendance.monitor' },
      { name: 'Mapa de Ubicaciones', href: '/attendance/map', permission: 'attendance.view' },
    ],
  },
  {
    name: 'Empresas',
    href: '/companies',
    icon: '<â',
    permission: 'companies.view',
    children: [
      { name: 'Lista de Empresas', href: '/companies', permission: 'companies.view' },
      { name: 'Crear Empresa', href: '/companies/create', permission: 'companies.create' },
    ],
  },
  {
    name: 'Terminales',
    href: '/terminals',
    icon: '=¥',
    permission: 'terminals.view',
    children: [
      { name: 'Lista de Terminales', href: '/terminals', permission: 'terminals.view' },
      { name: 'Estado de Terminales', href: '/terminals/status', permission: 'terminals.monitor' },
      { name: 'Configuración', href: '/terminals/config', permission: 'terminals.config' },
    ],
  },
  {
    name: 'Reportes',
    href: '/reports',
    icon: '=È',
    permission: 'reports.view',
    children: [
      { name: 'Generar Reportes', href: '/reports', permission: 'reports.create' },
      { name: 'Reportes Programados', href: '/reports/scheduled', permission: 'reports.view' },
      { name: 'Plantillas', href: '/reports/templates', permission: 'reports.manage' },
    ],
  },
  {
    name: 'Configuración',
    href: '/settings',
    icon: '™',
    permission: 'settings.view',
    children: [
      { name: 'General', href: '/settings', permission: 'settings.view' },
      { name: 'Usuarios Admin', href: '/settings/admins', permission: 'settings.admin' },
      { name: 'Logs del Sistema', href: '/settings/logs', permission: 'settings.logs' },
      { name: 'Respaldos', href: '/settings/backup', permission: 'settings.backup' },
    ],
  },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const { hasPermission } = useAuth();

  // Filtrar elementos del menú según permisos (por ahora permitir todo para desarrollo)
  const filteredNavigation = navigationItems;

  const isActive = (href: string) => {
    return location.pathname === href || 
           (href !== '/dashboard' && location.pathname.startsWith(href));
  };

  return (
    <>
      {/* Sidebar para desktop */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0 px-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold text-gray-900">BioEntry</h1>
                <p className="text-xs text-gray-500">Admin Panel</p>
              </div>
            </div>
          </div>

          {/* Navegación */}
          <nav className="mt-8 flex-1 px-2 space-y-1">
            {filteredNavigation.map((item) => (
              <div key={item.name}>
                <Link
                  to={item.href}
                  className={`
                    group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-150
                    ${isActive(item.href)
                      ? 'bg-primary-100 text-primary-900 border-r-2 border-primary-500'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  {item.name}
                </Link>

                {/* Submenú */}
                {item.children && isActive(item.href) && (
                  <div className="ml-6 mt-1 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        to={child.href}
                        className={`
                          group flex items-center px-2 py-2 text-sm rounded-md transition-colors duration-150
                          ${isActive(child.href)
                            ? 'text-primary-700 bg-primary-50'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                          }
                        `}
                      >
                        <span className="mr-2">"</span>
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Footer del sidebar */}
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="text-xs text-gray-500">
              <div className="mb-2">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-success-500 rounded-full mr-2"></div>
                  <span>API Conectada</span>
                </div>
              </div>
              <div className="text-gray-400">
                v1.0.0 - INEMEC 2024
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar para móvil */}
      <div className={`lg:hidden fixed inset-0 z-50 ${isOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={onClose} />
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={onClose}
            >
              <span className="sr-only">Cerrar sidebar</span>
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            {/* Logo móvil */}
            <div className="flex items-center flex-shrink-0 px-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">B</span>
                </div>
                <div className="ml-3">
                  <h1 className="text-xl font-bold text-gray-900">BioEntry</h1>
                  <p className="text-xs text-gray-500">Admin Panel</p>
                </div>
              </div>
            </div>

            {/* Navegación móvil */}
            <nav className="mt-8 px-2 space-y-1">
              {filteredNavigation.map((item) => (
                <div key={item.name}>
                  <Link
                    to={item.href}
                    onClick={onClose}
                    className={`
                      group flex items-center px-2 py-2 text-base font-medium rounded-md transition-colors duration-150
                      ${isActive(item.href)
                        ? 'bg-primary-100 text-primary-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                  >
                    <span className="mr-4 text-xl">{item.icon}</span>
                    {item.name}
                  </Link>

                  {/* Submenú móvil */}
                  {item.children && isActive(item.href) && (
                    <div className="ml-8 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          to={child.href}
                          onClick={onClose}
                          className={`
                            group flex items-center px-2 py-2 text-sm rounded-md transition-colors duration-150
                            ${isActive(child.href)
                              ? 'text-primary-700 bg-primary-50'
                              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                            }
                          `}
                        >
                          <span className="mr-2">"</span>
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>

          {/* Footer móvil */}
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="text-xs text-gray-500">
              <div className="mb-2">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-success-500 rounded-full mr-2"></div>
                  <span>API Conectada</span>
                </div>
              </div>
              <div className="text-gray-400">
                v1.0.0 - INEMEC 2024
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}