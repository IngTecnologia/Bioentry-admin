import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/components/auth/AuthProvider'
import { ProtectedRoute, PublicOnlyRoute } from '@/components/auth/ProtectedRoute'
import { Layout } from '@/components/layout/Layout'
import { Login } from '@/pages/auth/Login'
import { Dashboard } from '@/pages/dashboard/Dashboard'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      retry: 2,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Rutas públicas */}
            <Route
              path="/login"
              element={
                <PublicOnlyRoute>
                  <Login />
                </PublicOnlyRoute>
              }
            />
            
            {/* Rutas protegidas */}
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              
              {/* Placeholder para futuras rutas */}
              <Route path="users" element={<div>Usuarios (Por implementar)</div>} />
              <Route path="attendance" element={<div>Asistencia (Por implementar)</div>} />
              <Route path="companies" element={<div>Empresas (Por implementar)</div>} />
              <Route path="terminals" element={<div>Terminales (Por implementar)</div>} />
              <Route path="reports" element={<div>Reportes (Por implementar)</div>} />
              <Route path="settings" element={<div>Configuración (Por implementar)</div>} />
            </Route>
            
            {/* Ruta por defecto */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
          
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App