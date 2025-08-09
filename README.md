# 🎛️ Admin Web Panel - Sistema de Control de Asistencia Biométrica

![React](https://img.shields.io/badge/React-18+-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-3+-green?logo=tailwindcss)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-green?logo=fastapi)
![Licencia](https://img.shields.io/badge/Licencia-INEMEC-red)

Panel de administración web completo para el sistema de control de asistencia con reconocimiento facial biométrico. Desarrollado para integrarse perfectamente con la **API de Reconocimiento Facial** existente.

---

## 🎯 Propósito del Sistema

Este panel web administrativo está diseñado para gestionar y supervisar de manera integral el sistema de control de asistencia biométrica existente, proporcionando:

- **Control centralizado** de múltiples empresas y usuarios
- **Supervisión en tiempo real** de registros de asistencia
- **Gestión avanzada** de ubicaciones y terminales físicas
- **Generación automática** de reportes empresariales
- **Administración granular** de permisos y configuraciones

---

## 🏗️ Arquitectura del Sistema

### **Ecosistema Completo**
```
┌─────────────────┐    ┌──────────────────┐    ┌────────────────┐
│   App Android   │────│   API FastAPI    │────│  Admin Web     │
│  (Empleados)    │    │  (Reconocimiento │    │ (Supervisores) │
└─────────────────┘    │    Facial)       │    └────────────────┘
                       └──────────────────┘
                              │
                       ┌──────────────────┐
                       │ Terminales Físicas│
                       │   (Hardware)      │
                       └──────────────────┘
```

### **Stack Tecnológico Frontend**
- **React 18+** con TypeScript para tipado fuerte
- **Tailwind CSS** para diseño moderno y responsive
- **React Router v6** para navegación SPA
- **React Query (TanStack Query)** para estado del servidor
- **Axios** para comunicación HTTP
- **Recharts** para visualizaciones de datos
- **Headless UI** para componentes accesibles
- **Heroicons** para iconografía consistente

### **Integración Backend**
- **API REST** existente (FastAPI + DeepFace)
- **Autenticación JWT** ya implementada
- **WebSockets** para actualizaciones en tiempo real (opcional)
- **Endpoints específicos** para funcionalidades admin

---

## 📋 Funcionalidades Principales

### 1. **Dashboard Ejecutivo** 📊
- **Métricas en tiempo real**: presentes, ausencias, retardos
- **Gráficos dinámicos**: asistencia por hora, tendencias
- **Alertas críticas**: registros fuera de ubicación, fallos
- **Estado de terminales**: conexión y actividad
- **Resumen por empresa**: multi-cliente

### 2. **Gestión de Usuarios** 👥
- **CRUD completo**: crear, leer, actualizar, eliminar
- **Perfiles de ubicación**: Libre, Móvil, Fijo
- **Importación masiva**: CSV/Excel con validación
- **Gestión de imágenes**: subida y actualización de fotos faciales
- **Estados de usuario**: activo, inactivo, suspendido
- **Historial de cambios**: auditoría completa

### 3. **Control de Asistencia** ⏰
- **Monitor en tiempo real**: feed live de registros
- **Filtros avanzados**: fecha, empresa, usuario, tipo
- **Mapa de ubicaciones**: visualización geográfica
- **Corrección manual**: edición de registros excepcionales
- **Exportación**: PDF, Excel, CSV personalizable
- **Aprobación de excepciones**: workflow de autorización

### 4. **Gestión Multi-Empresa** 🏢
- **Configuración independiente** por cliente
- **Ubicaciones geográficas**: coordenadas y radios de tolerancia
- **Horarios personalizados**: por empresa y usuario
- **Terminales asignadas**: control por cliente
- **Branding personalizado**: logos y colores corporativos

### 5. **Control de Terminales** 🖥️
- **Estado en tiempo real**: online/offline, última actividad
- **Configuración remota**: parámetros y actualizaciones
- **Logs detallados**: actividad y errores por terminal
- **Diagnóstico**: pruebas de conectividad y rendimiento
- **Gestión de API Keys**: seguridad y rotación

### 6. **Reportes y Analytics** 📈
- **Reportes predefinidos**: diarios, semanales, mensuales
- **Constructor personalizado**: filtros y métricas específicas
- **Análisis de patrones**: detección de tendencias
- **Métricas de productividad**: KPIs empresariales
- **Exportación automatizada**: envío programado por email
- **Dashboards personalizados**: por rol y empresa

### 7. **Configuración del Sistema** ⚙️
- **Parámetros de reconocimiento facial**: umbral de confianza
- **Tolerancias de ubicación**: radios globales y específicos
- **Horarios laborales**: configuración global y excepciones
- **Notificaciones**: alertas por email/SMS
- **Mantenimiento**: respaldos y limpieza de datos

### 8. **Administración de Accesos** 🔐
- **Roles granulares**: super admin, admin empresa, supervisor
- **Permisos específicos**: lectura, escritura, eliminación
- **Usuarios administrativos**: gestión de staff interno
- **Auditoría completa**: logs de todas las acciones
- **Sesiones activas**: control y revocación remota

---

## 🎨 Guía de Diseño UI/UX

### **Principios de Diseño**
1. **Claridad**: Información crítica visible de inmediato
2. **Eficiencia**: Máximo 3 clics para cualquier acción
3. **Consistencia**: Patrones de UI uniformes en todo el sistema
4. **Accesibilidad**: WCAG 2.1 AA compliance
5. **Responsividad**: Mobile-first pero desktop-optimized

### **Paleta de Colores**
```css
/* Colores Primarios */
--primary-50: #eef2ff;
--primary-500: #6366f1;  /* Índigo principal */
--primary-600: #5b21b6;
--primary-900: #312e81;

/* Colores de Estado */
--success: #10b981;      /* Verde éxito */
--warning: #f59e0b;      /* Ámbar advertencia */
--error: #ef4444;        /* Rojo error */
--info: #3b82f6;         /* Azul información */

/* Grises */
--gray-50: #f8fafc;      /* Fondos claros */
--gray-100: #f1f5f9;     /* Bordes suaves */
--gray-500: #64748b;     /* Texto secundario */
--gray-900: #0f172a;     /* Texto principal */
```

### **Componentes Clave**
- **Sidebar Navigation**: Colapsable con iconos Heroicons
- **Header Global**: Búsqueda, notificaciones, perfil de usuario
- **Data Tables**: Sorteable, filtrable, paginación infinita
- **Cards Dashboard**: Métricas con micro-animaciones
- **Modal System**: Confirmaciones y formularios complejos
- **Toast Notifications**: Feedback inmediato de acciones

### **Responsive Breakpoints**
```css
/* Mobile First */
sm: 640px   /* Tablets pequeñas */
md: 768px   /* Tablets */
lg: 1024px  /* Desktop pequeño */
xl: 1280px  /* Desktop estándar */
2xl: 1536px /* Desktop grande */
```

---

## 🔌 Integración con API Existente

### **Endpoints Actuales a Utilizar**
```typescript
// Registros de asistencia
GET /records/all                    // Obtener todos los registros
GET /records/{cedula}               // Registros por usuario
GET /records/date/{fecha}           // Registros por fecha
GET /records/company/{empresa}      // Registros por empresa
GET /records/out-of-location        // Registros fuera de ubicación
GET /statistics/out-of-location     // Estadísticas de ubicación

// Usuarios (archivo JSON actual)
// Se requiere endpoint REST completo
```

### **Nuevos Endpoints Requeridos**
```typescript
// Autenticación Admin
POST /admin/auth/login              // Login de administradores
POST /admin/auth/refresh            // Renovar token
POST /admin/auth/logout             // Cerrar sesión

// Dashboard
GET /admin/dashboard/metrics        // Métricas en tiempo real
GET /admin/dashboard/alerts         // Alertas críticas
GET /admin/dashboard/activity       // Actividad reciente

// Gestión de Usuarios
GET /admin/users                    // Lista paginada con filtros
POST /admin/users                   // Crear usuario
GET /admin/users/{id}               // Obtener usuario específico
PUT /admin/users/{id}               // Actualizar usuario
DELETE /admin/users/{id}            // Eliminar usuario
POST /admin/users/bulk-import       // Importación masiva
POST /admin/users/{id}/photo        // Actualizar foto facial

// Gestión de Empresas
GET /admin/companies                // Lista de empresas
POST /admin/companies               // Crear empresa
PUT /admin/companies/{id}           // Actualizar empresa
GET /admin/companies/{id}/users     // Usuarios por empresa
GET /admin/companies/{id}/stats     // Estadísticas por empresa

// Control de Terminales
GET /admin/terminals                // Lista de terminales
GET /admin/terminals/{id}/status    // Estado de terminal
PUT /admin/terminals/{id}/config    // Configurar terminal
GET /admin/terminals/{id}/logs      // Logs de terminal

// Reportes
GET /admin/reports/templates        // Plantillas disponibles
POST /admin/reports/generate        // Generar reporte personalizado
GET /admin/reports/{id}/download    // Descargar reporte

// Configuración
GET /admin/settings                 // Configuración global
PUT /admin/settings                 // Actualizar configuración
GET /admin/settings/backup          // Generar respaldo
POST /admin/settings/restore        // Restaurar respaldo

// Auditoría
GET /admin/audit/logs               // Logs de auditoría
GET /admin/audit/sessions           // Sesiones activas
```

### **Estructura de Datos TypeScript**
```typescript
// Interfaces principales
interface User {
  id: string;
  cedula: string;
  nombre: string;
  empresa: string;
  perfil_ubicacion: 'libre' | 'movil' | 'fijo';
  estado: 'activo' | 'inactivo' | 'suspendido';
  foto_facial?: string;
  ubicaciones: Location[];
  created_at: string;
  updated_at: string;
}

interface AttendanceRecord {
  id: string;
  cedula: string;
  tipo_registro: 'entrada' | 'salida';
  timestamp: string;
  lat: number;
  lng: number;
  fuera_de_ubicacion: boolean;
  empresa: string;
  terminal_id?: string;
  confidence_score: number;
}

interface Company {
  id: string;
  nombre: string;
  ubicaciones: Location[];
  horarios: Schedule[];
  configuracion: CompanyConfig;
  branding: BrandingConfig;
}

interface Terminal {
  id: string;
  nombre: string;
  ubicacion: Location;
  estado: 'online' | 'offline' | 'mantenimiento';
  ultima_actividad: string;
  empresa_id: string;
  configuracion: TerminalConfig;
}
```

---

## 🚀 Fases de Implementación

### **Fase 1: Fundación (Semanas 1-3)**
```bash
Objetivos:
□ Setup inicial del proyecto React + TypeScript
□ Configuración de Tailwind CSS y componentes base
□ Sistema de autenticación con JWT
□ Layout principal con sidebar y header
□ Dashboard básico con métricas simuladas
□ Integración inicial con endpoints existentes

Entregables:
- Proyecto base configurado
- Login funcional
- Dashboard con métricas básicas
- Navegación principal operativa
```

### **Fase 2: Gestión Core (Semanas 4-7)**
```bash
Objetivos:
□ CRUD completo de usuarios con interfaz visual
□ Visualización de registros de asistencia
□ Sistema de filtros y búsqueda avanzada
□ Exportación básica de datos
□ Gestión de empresas básica
□ Sistema de notificaciones

Entregables:
- Gestión completa de usuarios
- Visualización de asistencia
- Filtros operativos
- Exportación funcional
```

### **Fase 3: Funcionalidades Avanzadas (Semanas 8-11)**
```bash
Objetivos:
□ Control de terminales físicas
□ Mapa interactivo de ubicaciones
□ Generador de reportes personalizado
□ Sistema de roles y permisos
□ Configuraciones granulares del sistema
□ Auditoría completa

Entregables:
- Control de terminales
- Reportes personalizados
- Sistema de permisos
- Configuración avanzada
```

### **Fase 4: Optimización y Extras (Semanas 12-14)**
```bash
Objetivos:
□ Optimización de rendimiento
□ Analytics avanzados y métricas de BI
□ Notificaciones en tiempo real
□ Automatización de reportes
□ Pruebas exhaustivas
□ Documentación completa

Entregables:
- Sistema optimizado
- Analytics avanzados
- Automatizaciones
- Documentación final
```

---

## 🛠️ Guía de Desarrollo

### **Convenciones de Código**
```typescript
// Naming conventions
- Componentes: PascalCase (UserManagement.tsx)
- Hooks: camelCase con 'use' prefix (useUserData.ts)
- Utils: camelCase (formatDate.ts)
- Constants: UPPER_SNAKE_CASE (API_ENDPOINTS.ts)
- Interfaces: PascalCase con 'I' prefix opcional (User.ts)

// Estructura de carpetas
src/
├── components/          # Componentes reutilizables
│   ├── ui/             # Componentes básicos (Button, Input, etc.)
│   ├── forms/          # Formularios específicos
│   └── charts/         # Componentes de gráficos
├── pages/              # Páginas principales
├── hooks/              # Custom hooks
├── services/           # Servicios de API
├── utils/              # Utilidades y helpers
├── types/              # Definiciones TypeScript
└── assets/             # Recursos estáticos
```

### **Patrones de Código**
```typescript
// 1. Custom hooks para lógica de negocio
const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// 2. Servicios para llamadas a API
class UserService {
  async getAll(filters?: UserFilters): Promise<User[]> {
    const response = await apiClient.get('/admin/users', { params: filters });
    return response.data;
  }
}

// 3. Componentes funcionales con TypeScript
interface UserCardProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onEdit, onDelete }) => {
  // Implementación del componente
};
```

### **Estándares de Calidad**
- **ESLint + Prettier**: Formateo automático
- **TypeScript Strict**: Tipado estricto obligatorio
- **Husky + lint-staged**: Pre-commit hooks
- **Jest + Testing Library**: Pruebas unitarias
- **Cypress**: Pruebas e2e (opcional)

---

## 🔒 Consideraciones de Seguridad

### **Frontend Security**
```typescript
// 1. Validación de tokens JWT
const useAuth = () => {
  const [token, setToken] = useState(localStorage.getItem('admin_token'));
  
  useEffect(() => {
    if (token && isTokenExpired(token)) {
      logout();
    }
  }, [token]);
};

// 2. Sanitización de inputs
const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input);
};

// 3. Validación con Zod
const userSchema = z.object({
  cedula: z.string().min(8).max(12),
  nombre: z.string().min(2).max(100),
  empresa: z.string().min(1),
});
```

### **Buenas Prácticas**
- **No almacenar datos sensibles** en localStorage
- **Validar todas las entradas** de usuario
- **Implementar timeouts** de sesión
- **Logs de auditoría** para acciones críticas
- **Rate limiting** en formularios
- **Sanitización XSS** en contenido dinámico

---

## 📊 Métricas y Monitoreo

### **KPIs del Sistema**
```typescript
interface SystemMetrics {
  // Operacionales
  usuarios_activos: number;
  registros_hoy: number;
  tasa_exito_reconocimiento: number;
  tiempo_respuesta_promedio: number;
  
  // Negocio
  empresas_activas: number;
  terminales_online: number;
  registros_fuera_ubicacion: number;
  alertas_pendientes: number;
}
```

### **Analytics de Uso**
- **Google Analytics 4**: Tracking de eventos
- **Sentry**: Monitoreo de errores
- **Performance monitoring**: Core Web Vitals
- **User behavior**: Heatmaps con Hotjar (opcional)

---

## 🎯 Criterios de Éxito

### **Funcionales**
- ✅ Gestión completa de 1000+ usuarios simultáneos
- ✅ Tiempo de respuesta < 2 segundos en todas las vistas
- ✅ Exportación de reportes con 50,000+ registros
- ✅ Sincronización en tiempo real con terminales
- ✅ Uptime > 99.5%

### **UX/UI**
- ✅ Mobile responsive en todos los breakpoints
- ✅ Accesibilidad WCAG 2.1 AA
- ✅ Tiempo de carga inicial < 3 segundos
- ✅ Flujos de usuario intuitivos (max 3 clics)

### **Técnicos**
- ✅ Cobertura de tests > 80%
- ✅ Bundle size optimizado < 500KB
- ✅ TypeScript strict mode sin errores
- ✅ Lighthouse score > 90

---

## 📚 Recursos y Referencias

### **Documentación Técnica**
- [React 18 Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Query Guide](https://tanstack.com/query/latest)

### **Guías de Diseño**
- [Material Design 3](https://m3.material.io)
- [Apple Human Interface Guidelines](https://developer.apple.com/design)
- [Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref)

### **Herramientas de Desarrollo**
- **Figma**: Para mockups y prototipos
- **Postman**: Para testing de APIs
- **VS Code**: Editor recomendado con extensiones específicas
- **Chrome DevTools**: Para debugging y performance

---

## 🤝 Instrucciones para Agentes de IA

### **Contexto del Proyecto**
Este es un panel de administración web que se integra con un sistema existente de control de asistencia biométrica. El sistema actual incluye:
- API en Python con FastAPI y DeepFace para reconocimiento facial
- App Android para empleados
- Terminales físicas de registro
- Sistema multi-empresa operativo

### **Objetivo del Desarrollo**
Crear una interfaz web moderna y profesional que permita a los administradores gestionar completamente el sistema de asistencia sin necesidad de acceder directamente a archivos JSON o la línea de comandos.

### **Restricciones Técnicas**
- **Debe integrarse** con la API existente sin modificaciones mayores
- **Debe soportar** el sistema multi-empresa actual
- **Debe mantener** la compatibilidad con terminales físicas existentes
- **Debe ser responsive** y accesible
- **Debe tener** tipos TypeScript estrictos

### **Prioridades de Desarrollo**
1. **Funcionalidad**: Todas las características deben ser completamente operativas
2. **UX**: Interfaz intuitiva que no requiera capacitación técnica
3. **Performance**: Carga rápida y operación fluida con grandes volúmenes de datos
4. **Mantenibilidad**: Código limpio, bien documentado y escalable

### **Estilo de Código Esperado**
- **Componentes funcionales** con TypeScript
- **Hooks personalizados** para lógica compleja
- **Servicios separados** para comunicación con API
- **Validación robusta** de datos
- **Manejo de errores** comprehensivo
- **Comentarios descriptivos** en funciones complejas

### **Consideraciones Especiales**
- El sistema maneja datos sensibles de empleados
- Debe funcionar en entornos corporativos con restricciones de red
- Los usuarios finales son administradores de RRHH, no técnicos
- El rendimiento es crítico para empresas con 500+ empleados

---

## 📝 Notas de Implementación

### **Variables de Entorno**
```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000
VITE_API_TIMEOUT=30000

# Authentication
VITE_JWT_SECRET=your_jwt_secret_here
VITE_SESSION_TIMEOUT=3600000

# Features
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_WEBSOCKETS=false
VITE_ENABLE_DEBUGGING=false

# External Services
VITE_SENTRY_DSN=your_sentry_dsn
VITE_GA_TRACKING_ID=your_ga_id
```

### **Scripts Disponibles**
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext .ts,.tsx",
    "lint:fix": "eslint src --ext .ts,.tsx --fix",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:e2e": "cypress run"
  }
}
```

---

## 👤 Información del Proyecto

**Cliente**: INEMEC  
**Desarrollador**: Ing. Jesús Cotes  
**Repositorio**: [Pendiente de creación]  
**Versión**: 1.0.0  
**Licencia**: Propietaria - Todos los derechos reservados

---
