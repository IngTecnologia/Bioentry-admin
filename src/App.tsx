import { BrowserRouter as Router } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'

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
      <Router>
        <div className="min-h-screen bg-gray-50">
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-primary-600 mb-4">
                BioEntry Admin Panel
              </h1>
              <p className="text-gray-600 mb-8">
                Sistema de Control de Asistencia Biométrica
              </p>
              <div className="bg-white p-8 rounded-lg shadow-soft">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Configuración inicial completada 
                </h2>
                <ul className="text-left text-gray-600 space-y-2">
                  <li>" React 18 + TypeScript 5</li>
                  <li>" Vite configurado</li>
                  <li>" Tailwind CSS con diseño personalizado</li>
                  <li>" React Query para gestión de estado</li>
                  <li>" Configuración de proxy para API</li>
                </ul>
                <div className="mt-6">
                  <button className="btn-primary">
                    Siguiente: Autenticación JWT
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
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
    </QueryClientProvider>
  )
}

export default App