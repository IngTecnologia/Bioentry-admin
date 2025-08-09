# 🚀 Guía de Despliegue - BioEntry Admin Panel

## Requisitos Previos

- Docker 20.10+ y Docker Compose 2.0+
- Al menos 2GB de RAM libre
- Puertos 3000 y 8000 disponibles

## 🔧 Configuración Rápida

### 1. Preparar Variables de Entorno

```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar variables (especialmente JWT_SECRET_KEY)
nano .env
```

### 2. Verificar API Backend

El admin panel necesita que la API de FastAPI esté funcionando. Verifica que existe:
```bash
# Desde el directorio BioEntry
ls -la api/API-FR-deepface/
```

### 3. Desplegar con Docker Compose

```bash
# Construir y levantar servicios
docker-compose up --build -d

# Ver logs en tiempo real
docker-compose logs -f
```

### 4. Verificar Despliegue

- **Admin Panel**: http://localhost:3000
- **API Backend**: http://localhost:8000
- **Health Check**: http://localhost:3000/health

## 📋 Comandos Útiles

### Gestión de Contenedores
```bash
# Ver estado de servicios
docker-compose ps

# Parar servicios
docker-compose down

# Reiniciar un servicio específico
docker-compose restart bioentry-admin

# Ver logs de un servicio
docker-compose logs bioentry-admin

# Acceder al contenedor
docker exec -it bioentry-admin-panel sh
```

### Desarrollo y Debugging
```bash
# Construir sin cache
docker-compose build --no-cache

# Ver métricas de recursos
docker stats

# Limpiar volúmenes y imágenes no utilizadas
docker system prune -a
```

## 🔐 Configuración de Seguridad

### Variables de Entorno Importantes

```bash
# JWT Secret (OBLIGATORIO cambiar en producción)
JWT_SECRET_KEY=your-super-secure-secret-key-here

# Base URL de la API
VITE_API_BASE_URL=http://localhost:8000

# Timeout de API (30 segundos)
VITE_API_TIMEOUT=30000
```

### HTTPS en Producción (Opcional)

Para usar HTTPS, modifica el nginx.conf y agrega certificados SSL:
```bash
# Crear directorio para certificados
mkdir -p docker/ssl/

# Copiar certificados
cp your-cert.pem docker/ssl/
cp your-key.pem docker/ssl/
```

## 🚨 Solución de Problemas

### Error: Puerto 3000 en uso
```bash
# Ver qué proceso usa el puerto
lsof -i :3000

# Cambiar puerto en docker-compose.yml
ports:
  - "3001:80"  # Usar puerto 3001 en lugar de 3000
```

### Error: No se puede conectar a la API
```bash
# Verificar que la API está corriendo
curl http://localhost:8000/health

# Verificar logs de la API
docker-compose logs bioentry-api

# Verificar variables de entorno
docker exec bioentry-admin-panel env | grep VITE
```

### Error: Build falla por falta de memoria
```bash
# Aumentar memoria de Docker Desktop
# O usar build de desarrollo:
docker-compose -f docker-compose.yml up --build
```

## 📊 Monitoreo

### Health Checks
```bash
# Check del admin panel
curl http://localhost:3000/health

# Check de la API
curl http://localhost:8000/health

# Status de contenedores
docker-compose ps
```

### Logs Importantes
```bash
# Logs del frontend
docker-compose logs -f bioentry-admin

# Logs del backend
docker-compose logs -f bioentry-api

# Logs de Nginx
docker exec bioentry-admin-panel tail -f /var/log/nginx/access.log
```

## 🎯 Primeros Pasos después del Despliegue

1. **Acceder al Panel**: http://localhost:3000
2. **Login**: Usar credenciales de admin de tu API existente
3. **Verificar Dashboard**: Las métricas deben mostrar datos reales
4. **Probar Usuarios**: Navegar a "Usuarios" para ver la lista

## 🔄 Actualización

Para actualizar el admin panel:
```bash
# Parar servicios
docker-compose down

# Actualizar código
git pull

# Reconstruir y levantar
docker-compose up --build -d
```

## ⚠️ Notas Importantes

- **Datos Reales**: El panel consume datos reales de tu API, no simulados
- **Autenticación**: Usa el sistema JWT existente de tu FastAPI
- **Persistencia**: Los datos se guardan en la base de datos de la API
- **CORS**: Ya está configurado para desarrollo local

## 📞 Soporte

Si encuentras problemas:
1. Revisa los logs: `docker-compose logs`
2. Verifica puertos disponibles: `netstat -tulpn`
3. Confirma que la API funciona: `curl http://localhost:8000`