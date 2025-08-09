# CLAUDE.md - BioEntry Admin Web Panel

This file provides guidance to Claude Code (claude.ai/code) when working with the BioEntry Admin Web Panel, which is part of the complete BioEntry biometric attendance system ecosystem.

## System Context

The BioEntry Admin Web Panel is the **administrative frontend** for the complete BioEntry ecosystem, providing comprehensive management and monitoring capabilities for:

1. **API Backend** - FastAPI + DeepFace facial recognition server
2. **Mobile App** - Android application for employee self-service  
3. **Terminal Firmware** - Raspberry Pi-based fixed access control devices
4. **Admin Web Panel** - This React-based administrative interface

## Admin Panel Overview

The Admin Web Panel is a **React 18+ + TypeScript + Vite** application designed for supervisors and administrators to manage the entire biometric attendance system. It provides:

- **Dashboard Ejecutivo** - Real-time metrics, alerts, and system status
- **User Management** - Complete CRUD operations, bulk import, photo management
- **Multi-Company Control** - Independent configuration per client/company
- **Terminal Management** - Remote configuration and monitoring of physical devices
- **Attendance Monitoring** - Real-time feed, geographic visualization, manual corrections
- **Reports & Analytics** - Custom report builder, automated exports, KPIs
- **System Administration** - Granular permissions, audit logs, system configuration

## Key Design Principles

1. **Clarity** - Critical information visible immediately
2. **Efficiency** - Maximum 3 clicks for any action
3. **Consistency** - Uniform UI patterns throughout the system
4. **Accessibility** - WCAG 2.1 AA compliance
5. **Responsiveness** - Mobile-first but desktop-optimized

## Project Structure

```
admin-web-panel/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # Base UI components (Button, Input, etc.)
│   │   ├── forms/          # Form components
│   │   ├── charts/         # Data visualization components
│   │   └── layout/         # Layout components (Header, Sidebar, etc.)
│   ├── pages/              # Page components organized by feature
│   │   ├── dashboard/      # Dashboard and metrics overview
│   │   ├── users/          # User management pages
│   │   ├── companies/      # Company management
│   │   ├── terminals/      # Terminal configuration and monitoring
│   │   ├── attendance/     # Attendance records and real-time monitoring
│   │   ├── reports/        # Report generation and viewing
│   │   ├── settings/       # System settings and configuration
│   │   └── auth/           # Authentication pages
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API client services
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   └── styles/             # CSS and styling files
├── public/                 # Static assets
├── docker/                 # Docker configuration
└── docs/                   # Documentation
```

## Technology Stack

### Frontend Framework
- **React 18+** - Modern React with hooks and suspense
- **TypeScript 5+** - Strict typing and better developer experience
- **Vite** - Fast development server and build tool

### UI Components & Styling  
- **Tailwind CSS 3+** - Utility-first CSS framework with custom design system
- **Headless UI** - Unstyled, fully accessible UI components
- **Heroicons** - Consistent iconography throughout the system
- **Custom Component Library** - Reusable UI components in `src/components/ui/`
- **React Hook Form** - Form validation and management

### State Management & Data Fetching
- **React Query/TanStack Query** - Server state management and caching
- **React Context** - Local state management for UI state
- **Custom Hooks** - Reusable stateful logic (useUsers, useTerminals, etc.)

### Charts & Visualization
- **Recharts** - Modern, declarative charting library
- **Leaflet Maps** - Interactive geographic visualization for locations
- **Date-fns** - Date manipulation and formatting utilities

### Development & Testing
- **ESLint + Prettier** - Code linting and formatting with Husky pre-commit hooks
- **Jest + React Testing Library** - Unit and integration testing
- **Cypress** - End-to-end testing (optional)
- **TypeScript Strict Mode** - Maximum type safety

## API Integration

The Admin Panel integrates with the existing BioEntry API backend (`/home/jesus/BioEntry/api/API-FR-deepface/`) through:

### Existing Endpoints to Leverage
```typescript
// Current attendance records (from attendance_records.py)
GET /records/all                    // All attendance records
GET /records/{cedula}               // Records by user ID
GET /records/date/{fecha}           // Records by date
GET /records/company/{empresa}      // Records by company
GET /records/out-of-location        // Out-of-location records
GET /statistics/out-of-location     // Location statistics

// Current user registration (from user_registration.py) 
POST /register-user                 // Register new user with photo
```

### New Admin Endpoints Required
```typescript
// Authentication Admin
POST /admin/auth/login              // Admin login
POST /admin/auth/refresh            // Token refresh
POST /admin/auth/logout             // Logout

// Dashboard Metrics
GET /admin/dashboard/metrics        // Real-time metrics
GET /admin/dashboard/alerts         // Critical alerts
GET /admin/dashboard/activity       // Recent activity

// User Management (Enhanced CRUD)
GET /admin/users                    // Paginated user list with filters
POST /admin/users                   // Create new user
GET /admin/users/{id}               // Get specific user
PUT /admin/users/{id}               // Update user
DELETE /admin/users/{id}            // Deactivate user
POST /admin/users/bulk-import       // Bulk CSV/Excel import
POST /admin/users/{id}/photo        // Update facial photo

// Company Management
GET /admin/companies                // List companies
POST /admin/companies               // Create company
PUT /admin/companies/{id}           // Update company
GET /admin/companies/{id}/users     // Company users
GET /admin/companies/{id}/stats     // Company statistics

// Terminal Management
GET /admin/terminals                // List terminals with status
GET /admin/terminals/{id}/status    // Terminal status
PUT /admin/terminals/{id}/config    // Configure terminal
GET /admin/terminals/{id}/logs      // Terminal logs

// Reports & Analytics
GET /admin/reports/templates        // Available report templates
POST /admin/reports/generate        // Generate custom report
GET /admin/reports/{id}/download    // Download report

// System Configuration
GET /admin/settings                 // Global settings
PUT /admin/settings                 // Update settings
GET /admin/settings/backup          // Create backup
POST /admin/settings/restore        // Restore backup

// Audit & Security
GET /admin/audit/logs               // Audit logs
GET /admin/audit/sessions           // Active sessions
```

## Data Models

### User Profile (Based on existing user_registration.py)
```typescript
interface User {
  // Core fields from existing system
  cedula: string;
  nombre: string;
  empresa: string;
  email?: string;
  telefono?: string;
  perfil_ubicacion: 'fijo' | 'movil' | 'libre';
  ubicaciones: Location[];
  
  // Additional admin fields
  activo: boolean;
  estado: 'activo' | 'inactivo' | 'suspendido';
  fecha_registro: string;
  ultimo_acceso?: string;
  foto_facial?: string;  // Path to facial reference image
  departamento?: string;
  cargo?: string;
  jefe_directo?: string;
  horario_trabajo?: WorkSchedule;
}
```

### Company Profile
```typescript
interface Company {
  id: string;
  nombre: string;
  rut?: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  plan: 'basico' | 'premium' | 'enterprise';
  usuarios_limite: number;
  usuarios_activos: number;
  terminales_limite: number;
  terminales_activos: number;
  fecha_creacion: string;
  activa: boolean;
  configuracion: CompanySettings;
}
```

### Terminal Configuration
```typescript
interface Terminal {
  id: string;
  nombre: string;
  tipo: 'fijo' | 'movil';
  empresa: string;
  ubicacion: Location;
  estado: 'online' | 'offline' | 'error' | 'mantenimiento';
  version_firmware: string;
  ultima_conexion: string;
  configuracion: TerminalSettings;
  estadisticas: TerminalStats;
  sensores: {
    camara: boolean;
    huella: boolean;
    proximidad: boolean;
  };
}
```

### Attendance Record (Based on existing attendance_records.py)
```typescript
interface AttendanceRecord {
  // Core fields from existing system
  id: string;
  cedula: string;
  timestamp: string;
  tipo_registro: 'entrada' | 'salida';
  verificado: boolean;
  distancia: number;  // From existing model
  terminal_id?: string;
  web: boolean;  // From existing: differentiates web vs terminal
  empresa: string;
  fuera_de_ubicacion: boolean;
  comentario: string;
  ubicacion_nombre: string;
  distancia_ubicacion: number;  // Distance to nearest location in meters
  
  // Additional admin fields
  usuario_nombre?: string;  // Derived from user lookup
  metodo_verificacion?: 'facial' | 'huella' | 'manual';
  confianza?: number;  // Confidence score
  editado_por?: string;
  fecha_edicion?: string;
  ip_origen?: string;
}
```

### Location/Geofence (Based on existing system)
```typescript
interface Location {
  // Core fields (based on existing ubicaciones structure)
  lat: number;
  lng: number;
  radio_metros: number;
  nombre: string;
  
  // Additional admin fields
  id?: string;
  empresa: string;
  tipo: 'oficina' | 'obra' | 'cliente' | 'otro';
  direccion?: string;
  activa: boolean;
  horarios_permitidos?: TimeRange[];
  usuarios_asignados: string[];
  terminales: string[];
}

interface TimeRange {
  inicio: string;  // HH:MM format
  fin: string;     // HH:MM format
  dias: number[];  // 0-6 (Sunday-Saturday)
}
```

## Key Features & Workflows

### User Registration & Management
1. **Bulk Import** - Upload CSV/Excel with employee data
2. **Photo Capture/Upload** - Register facial reference images
3. **Location Assignment** - Assign users to geofenced locations
4. **Schedule Management** - Define work schedules and permissions
5. **Profile Management** - Update user information and settings

### Real-Time Monitoring
1. **Live Attendance Feed** - WebSocket connection for real-time updates
2. **Terminal Status Dashboard** - Monitor all terminal health and connectivity
3. **Location Occupancy** - Real-time headcount per location
4. **Alert System** - Notifications for unauthorized access, system errors
5. **Geographic View** - Map-based view of terminals and user locations

### Reporting & Analytics
1. **Attendance Reports** - Daily, weekly, monthly attendance summaries
2. **User Analytics** - Individual user attendance patterns and statistics
3. **Company Metrics** - Company-wide attendance and productivity metrics
4. **Custom Reports** - Flexible report builder with custom filters
5. **Export Capabilities** - PDF, Excel, CSV export formats

### System Administration
1. **Multi-Tenant Management** - Manage multiple companies
2. **Terminal Configuration** - Remote terminal setup and maintenance
3. **User Access Control** - Admin role management and permissions
4. **Audit Logging** - Complete system activity logs
5. **Backup & Recovery** - Data backup and restoration tools

## Development Commands

### Development Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev                     # Starts on http://localhost:5173

# Type checking
npm run type-check             # TypeScript compilation check

# Code quality
npm run lint                   # ESLint check
npm run lint:fix              # Auto-fix linting issues

# Testing
npm run test                   # Run Jest tests
npm run test:watch            # Jest in watch mode
npm run test:coverage         # Generate test coverage report

# E2E Testing (optional)
npm run test:e2e              # Cypress end-to-end tests
```

### Build & Deployment
```bash
# Production build
npm run build                  # Build for production
npm run preview               # Preview production build locally

# Docker deployment
docker-compose build          # Build Docker images
docker-compose up             # Run development environment
docker-compose -f docker-compose.prod.yml up -d  # Production deployment
```

## Environment Configuration

### Development Environment (.env)
```env
# API Configuration (matches existing FastAPI backend)
VITE_API_BASE_URL=http://localhost:8000
VITE_API_TIMEOUT=30000

# Authentication (integrates with existing JWT system)
VITE_JWT_SECRET=your_jwt_secret_here
VITE_SESSION_TIMEOUT=3600000

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_WEBSOCKETS=false        # Optional real-time features
VITE_ENABLE_DEBUGGING=true

# External Services (optional)
VITE_SENTRY_DSN=your_sentry_dsn
VITE_GA_TRACKING_ID=your_ga_id
```

### Production Environment (.env.production)
```env
# API Configuration (production API server)
VITE_API_BASE_URL=https://api.bioentry.com
VITE_API_TIMEOUT=15000

# Security
VITE_JWT_SECRET=production_jwt_secret
VITE_SESSION_TIMEOUT=1800000        # 30 minutes
VITE_SECURE_COOKIES=true

# Performance
VITE_ENABLE_SW=true                 # Service Worker
VITE_ENABLE_COMPRESSION=true

# Monitoring
VITE_SENTRY_DSN=your_production_sentry_dsn
VITE_ANALYTICS_KEY=your_analytics_key
VITE_ENABLE_DEBUGGING=false
```

## Component Architecture

### UI Component Library
```typescript
// Base components in src/components/ui/
- Button, Input, Select, Checkbox
- Modal, Alert, Tooltip, Loading
- Table, Pagination, Card
- Badge, Switch, Dropdown

// Form components in src/components/forms/
- UserForm, CompanyForm, TerminalForm
- LoginForm, RegistrationForm
- FiltersForm, LocationSelector
- PhotoUpload (for user registration)

// Chart components in src/components/charts/
- AttendanceChart, DashboardChart
- MetricsChart, LocationMap
- RealTimeChart, AnalyticsChart

// Layout components in src/components/layout/
- Layout, Header, Sidebar, Navigation
- Breadcrumbs (for page navigation)
```

### Custom Hooks
```typescript
// Authentication
useAuth() - Authentication state and methods
usePermissions() - Role-based access control

// Data fetching
useUsers() - User management operations
useCompanies() - Company management operations
useTerminals() - Terminal management operations
useAttendance() - Attendance records and real-time data

// Utility hooks
useDebounce() - Debounced input handling
useLocalStorage() - Persistent local storage
useWebSocket() - Real-time data connection
```

## API Client Architecture

### Service Layer
```typescript
// src/services/
- authService.ts - Authentication and session management
- userService.ts - User CRUD operations
- companyService.ts - Company management
- terminalService.ts - Terminal configuration and monitoring
- attendanceService.ts - Attendance records and analytics
- reportService.ts - Report generation and export
- api.ts - Base API client configuration
```

### Error Handling & Loading States
```typescript
// Standardized API response handling
interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
}

// Loading and error state management
interface QueryState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}
```

## Security Features

### Authentication & Authorization
- **JWT Token Authentication** - Secure token-based authentication
- **Role-Based Access Control** - Admin, manager, and viewer roles
- **Session Management** - Automatic token refresh and logout
- **Route Protection** - Private routes with permission checking

### Data Security
- **Input Validation** - Client-side and server-side validation
- **XSS Protection** - Sanitized user inputs and secure rendering
- **CSRF Protection** - Cross-site request forgery protection
- **Secure Headers** - Security headers for production deployment

### Privacy & Compliance
- **Data Encryption** - Sensitive data encryption in transit and at rest
- **Audit Logging** - Complete user action logging for compliance
- **Data Retention** - Configurable data retention policies
- **GDPR Compliance** - Data export and deletion capabilities

## Performance Optimization

### Frontend Performance
- **Code Splitting** - Route-based and component-based code splitting
- **Lazy Loading** - Deferred loading of non-critical components
- **Image Optimization** - Optimized image loading and caching
- **Bundle Analysis** - Regular bundle size monitoring

### Data Management
- **Query Caching** - Intelligent server state caching with React Query
- **Pagination** - Efficient data pagination for large datasets
- **Real-time Updates** - Optimized WebSocket connections
- **Background Sync** - Offline capability with background synchronization

## Testing Strategy

### Unit Testing
```bash
# Component testing
src/__tests__/components/
src/__tests__/hooks/
src/__tests__/services/
src/__tests__/utils/

# Test utilities
src/__tests__/test-utils.tsx - Custom render functions
src/__tests__/mocks/ - API and service mocks
```

### Integration Testing
- **API Integration Tests** - Test complete data flows
- **User Flow Tests** - Test critical user journeys
- **Form Validation Tests** - Test form submission and validation
- **Real-time Feature Tests** - Test WebSocket connections

### E2E Testing
```bash
# E2E test scenarios
tests/e2e/auth.spec.ts - Authentication flows
tests/e2e/user-management.spec.ts - User CRUD operations
tests/e2e/attendance.spec.ts - Attendance monitoring
tests/e2e/reports.spec.ts - Report generation
```

## Deployment & DevOps

### Docker Configuration
```dockerfile
# Multi-stage build for production
FROM node:18-alpine as builder
FROM nginx:alpine as runtime

# Production optimization
- Multi-stage builds for smaller images
- nginx configuration for SPA routing
- SSL/TLS termination
- gzip compression
```

### CI/CD Pipeline
```yaml
# GitHub Actions workflow
- Automated testing on PRs
- Type checking and linting
- Security vulnerability scanning  
- Automated deployment to staging/production
- Performance monitoring integration
```

## Implementation Phases

### Phase 1: Foundation (Weeks 1-3)
```typescript
// Deliverables:
- Project setup with React + TypeScript + Vite
- Tailwind CSS configuration with custom design system  
- JWT authentication integration with existing API
- Main layout with sidebar navigation and header
- Basic dashboard with mock metrics
- Integration with existing attendance endpoints

// Key Components:
- LoginForm component with JWT handling
- Layout with responsive sidebar navigation
- Dashboard with basic metrics cards
- API client service configuration
```

### Phase 2: Core Management (Weeks 4-7) 
```typescript
// Deliverables:
- Complete user CRUD with visual interface
- Attendance records visualization and filtering
- Advanced search and filtering system
- Basic data export functionality
- Company management interface
- Notification system

// Key Components:
- UserForm, UserList, UserDetail components
- AttendanceTable with advanced filtering
- DataExport utility for PDF/CSV/Excel
- CompanyForm and management interface
- Toast notification system
```

### Phase 3: Advanced Features (Weeks 8-11)
```typescript
// Deliverables:
- Terminal management and configuration
- Interactive location mapping with geofences
- Custom report generator
- Role-based permissions system
- Advanced system configuration
- Complete audit logging

// Key Components:
- TerminalConfig and monitoring dashboard
- LocationMap with Leaflet integration
- ReportBuilder with custom filters
- PermissionManager for roles
- AuditLog viewer and search
```

### Phase 4: Optimization & Extras (Weeks 12-14)
```typescript
// Deliverables:
- Performance optimization and caching
- Advanced analytics and BI metrics
- Optional real-time notifications
- Report automation and scheduling
- Comprehensive testing suite
- Complete documentation

// Key Components:
- Performance monitoring integration
- Advanced charts with Recharts
- WebSocket integration (optional)
- Automated report scheduling
- E2E test suite with Cypress
```

## Integration with Existing System

### API Backend Integration
The Admin Panel extends the existing API (`/home/jesus/BioEntry/api/API-FR-deepface/`) by:

1. **Leveraging Existing Endpoints** - Uses current `/records/*` and `/register-user` endpoints
2. **Adding Admin Endpoints** - New `/admin/*` routes for administrative functionality  
3. **Maintaining Data Compatibility** - Same JSON data structures and storage
4. **Preserving System Integration** - Mobile app and terminals continue working unchanged

### Mobile App Coordination
- **Shared User Database** - Same usuarios.json file and user profiles
- **Consistent Location System** - Same ubicaciones.json structure
- **Unified Attendance Records** - Same registros.json format
- **Synchronized Changes** - Admin changes immediately available to mobile app

### Terminal Integration
- **API Key Management** - Manage terminal API keys from admin panel
- **Configuration Sync** - Push configuration changes to terminals
- **Status Monitoring** - Real-time terminal health and connectivity status
- **Log Analysis** - Centralized terminal log viewing and analysis

## Monitoring & Maintenance

### System Health Monitoring
- **API Health Checks** - Monitor backend API availability
- **Terminal Connectivity** - Track terminal online/offline status
- **Database Performance** - Monitor query performance and data integrity
- **User Activity** - Track user login patterns and system usage

### Error Tracking & Logging
- **Frontend Error Tracking** - Sentry integration for error monitoring
- **User Action Logging** - Complete audit trail of admin actions
- **Performance Monitoring** - Core Web Vitals and user experience metrics
- **Security Event Logging** - Authentication failures and security events

## Common Admin Tasks

### Daily Operations
1. **Monitor Real-time Attendance** - Check live attendance dashboard
2. **Review Terminal Status** - Ensure all terminals are online and functioning
3. **Handle Manual Entries** - Process attendance corrections and manual entries
4. **Review Alerts** - Address system alerts and notifications

### Weekly/Monthly Operations
1. **Generate Reports** - Create attendance and analytics reports
2. **User Management** - Add/remove users, update profiles
3. **System Maintenance** - Review logs, perform backups
4. **Performance Review** - Analyze system performance and user feedback

### Configuration Tasks
1. **Terminal Setup** - Configure new terminal installations
2. **Location Management** - Add/modify geofenced locations
3. **Company Settings** - Update company configurations and limits
4. **User Permissions** - Manage admin roles and permissions

## Troubleshooting

### Common Issues
- **Real-time Updates Not Working** - Check WebSocket connection
- **Slow Report Generation** - Optimize queries and add pagination
- **Terminal Offline** - Check network connectivity and terminal health
- **Photo Upload Issues** - Verify file size limits and format support

### Debug Tools
- **React Developer Tools** - Component state inspection
- **Redux DevTools** - State management debugging (if using Redux)
- **Network Tab** - API request/response debugging
- **Console Logs** - Frontend error tracking

## Development Best Practices

### Code Organization (Based on README specifications)
```typescript
// Naming conventions
- Components: PascalCase (UserManagement.tsx)
- Hooks: camelCase with 'use' prefix (useUserData.ts)
- Utils: camelCase (formatDate.ts)  
- Constants: UPPER_SNAKE_CASE (API_ENDPOINTS.ts)
- Interfaces: PascalCase (User.ts)

// Project structure (from README)
src/
├── components/          # Reusable UI components
│   ├── ui/             # Basic components (Button, Input, etc.)
│   ├── forms/          # Specific form components
│   └── charts/         # Chart and visualization components
├── pages/              # Main page components
├── hooks/              # Custom React hooks
├── services/           # API service classes
├── utils/              # Utility functions and helpers
├── types/              # TypeScript type definitions
└── assets/             # Static resources
```

### Code Patterns (From README examples)
```typescript
// 1. Custom hooks for business logic
const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// 2. Service classes for API calls
class UserService {
  async getAll(filters?: UserFilters): Promise<User[]> {
    const response = await apiClient.get('/admin/users', { params: filters });
    return response.data;
  }
}

// 3. Functional components with TypeScript
interface UserCardProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onEdit, onDelete }) => {
  // Component implementation
};
```

### Quality Standards (From README)
- **ESLint + Prettier** - Automated code formatting with Husky pre-commit hooks
- **TypeScript Strict Mode** - Mandatory strict typing throughout
- **Jest + Testing Library** - Unit and integration testing
- **Cypress** - End-to-end testing (optional)
- **Lighthouse Score > 90** - Performance and accessibility standards

### Security Guidelines
- **JWT Token Management** - Secure token storage and validation
- **Input Sanitization** - Validate and sanitize all user inputs with Zod
- **Rate Limiting** - Implement form submission rate limits
- **Audit Logging** - Log all critical admin actions
- **Session Timeouts** - Implement automatic session expiration

## Success Criteria (From README)

### Functional Requirements
- ✅ Handle 1000+ users simultaneously
- ✅ Response time < 2 seconds for all views
- ✅ Export reports with 50,000+ records
- ✅ Real-time terminal synchronization
- ✅ System uptime > 99.5%

### UX/UI Requirements  
- ✅ Mobile responsive across all breakpoints
- ✅ WCAG 2.1 AA accessibility compliance
- ✅ Initial load time < 3 seconds
- ✅ Intuitive user flows (maximum 3 clicks)

### Technical Requirements
- ✅ Test coverage > 80%
- ✅ Bundle size < 500KB optimized
- ✅ TypeScript strict mode without errors
- ✅ Lighthouse performance score > 90

## Project Information

**Client**: INEMEC  
**Developer**: Ing. Jesús Cotes  
**Technology Stack**: React 18+ + TypeScript 5+ + Vite + Tailwind CSS  
**Integration**: FastAPI + DeepFace backend  
**License**: Proprietary - All rights reserved

This admin panel serves as the central command center for the entire BioEntry ecosystem, providing powerful administrative tools while maintaining seamless integration with the existing mobile app and terminal firmware components. The system handles sensitive employee data and operates in corporate environments, requiring the highest standards of security, performance, and reliability.