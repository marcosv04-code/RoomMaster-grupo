# Informe de Despliegue — RoomMaster

## 1. Datos del Proyecto

| Campo | Detalle |
|---|---|
| **Nombre del proyecto** | RoomMaster - Sistema de Gestión Hotelera |
| **Repositorio** | https://github.com/[usuario]/RoomMaster-grupo |
| **URL en producción** | https://roommaster.site |
| **Plataforma de despliegue** | Hostinger (Servidor compartido + cPanel) |
| **Fecha de despliegue** | Marzo 12, 2026 |
| **Estado** | ✅ PRODUCTION READY |

---

## 2. Tecnologías Usadas

### Frontend
- **Framework**: React 18.3.1
- **Bundler**: Vite 5.4.21 (para optimización y build rápido)
- **Router**: React Router DOM 6.30.3
- **HTTP Client**: Axios 1.7.2
- **Alertas UI**: SweetAlert2 11.13.3
- **Estilos**: CSS3 Personalizado (rem + clamp() para responsive)
- **Node.js**: 16+ / npm 8+

### Backend
- **Lenguaje**: PHP 7.4+
- **Base de Datos**: MariaDB 10.4+
- **Conexión BD**: MySQLi (driver nativo)
- **Formatos**: JSON para API responses
- **CORS**: Headers configurados para dominio específico
- **Encriptación**: SHA256 para contraseñas

### Herramientas & DevOps
- **Control de versiones**: Git + GitHub
- **Alojamiento**: Hostinger (Servidor Linux compartido)
- **Panel de control**: cPanel
- **Gestor BD**: phpMyAdmin
- **Transferencia archivos**: FTP/SSH
- **Editor de código**: VS Code
- **Testing API**: Postman/Insomnia
- **Debugging**: Chrome DevTools + phpMyAdmin logs

---

## 3. Pasos Realizados para el Despliegue

### 3.1 Preparación en Desarrollo Local

**Paso 1: Build del Frontend**
```bash
cd frontend
npm install
npm run build
```
- Genera carpeta `/dist/` con archivos optimizados:
  - `index-[hash].js` (451.20 KB - bundle React compilado)
  - `index-[hash].css` (44.52 KB - estilos compilados)
  - `index.html` (entry point)
  - `assets/images/` (imágenes estáticas)

**Paso 2: Verificar Backend Localmente**
- Todos los archivos PHP en `/backend/` fueron testeados en `localhost/RoomMaster-grupo/backend/`
- Conexión a BD local verificada en `config.php`
- Endpoints validados con Postman

**Paso 3: Validar Variables de Entorno**
- `config.php` contiene credenciales correctas para Hostinger
- CORS configurado para dominio: `https://roommaster.site`
- Rutas absolutas verificadas (no rutas relativas)

### 3.2 Despliegue en Hostinger

**Paso 4: Acceso a Hostinger via SSH**
```bash
ssh usuario@roommaster.site
# O conectar via cPanel File Manager
```

**Paso 5: Crear Estructura de Carpetas**
```bash
mkdir -p /home/usuario/public_html/assets
mkdir -p /home/usuario/public_html/backend
```

**Paso 6: Upload Frontend (SCP o FTP)**
```bash
# Opción SSH (desde máquina local):
scp -r frontend/dist/* usuario@roommaster.site:/home/usuario/public_html/

# O via FTP (FileZilla):
# - Copiar dist/index.html → /public_html/index.html
# - Copiar dist/assets/* → /public_html/assets/
```

**Paso 7: Upload Backend APIs**
```bash
# SSH:
scp -r backend/*.php usuario@roommaster.site:/home/usuario/public_html/backend/

# O FTP:
# - Copiar todos los .php → /public_html/backend/
```

**Paso 8: Configurar .htaccess para React Router**
```bash
cat > /public_html/.htaccess << 'EOF'
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
EOF
```

**Paso 9: Configurar Permisos**
```bash
chmod 755 /home/usuario/public_html/backend/*.php
chmod 644 /home/usuario/public_html/.htaccess
chmod 755 /home/usuario/public_html/index.html
```

### 3.3 Configuración de Base de Datos

**Paso 10: Importar SQL en Hostinger**
- Acceder a phpMyAdmin: `https://roommaster.site/phpmyadmin`
- Seleccionar BD: `u754245691_db_90IMt5ZM`
- Pestaña `Import`
- Subir archivo: `roommaster_database_hostinger.sql`
- Ejecutar import

**Paso 11: Verificar Datos Importados**
```sql
SELECT COUNT(*) FROM usuarios;      -- Esperado: 4
SELECT COUNT(*) FROM clientes;      -- Esperado: 6
SELECT COUNT(*) FROM habitaciones;  -- Esperado: 10
SELECT COUNT(*) FROM productos;     -- Esperado: 17
```

### 3.4 Testing Post-Deploy

**Paso 12: Verificar Frontend**
- URL: `https://roommaster.site`
- ✅ Página carga sin errores 404
- ✅ React Router funciona (navegación entre módulos)
- ✅ CSS cargado correctamente
- ✅ Responsive en mobile/tablet/desktop

**Paso 13: Verificar Backend APIs**
```bash
# Test login endpoint:
curl -X POST https://roommaster.site/backend/login.php \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@roommaster.com","contraseña":"Admin123!"}'

# Esperado: { success: true, usuario, token, ... }
```

**Paso 14: Test Funcionalidades Críticas**
- ✅ Login funciona (auth)
- ✅ Dashboard carga estadísticas
- ✅ CRUD de clientes (C-R-U-D)
- ✅ Ventas con validación dual-source de stock
- ✅ Permisos por rol (admin vs recepcionista)
- ✅ Búsqueda en tiempo real

---

## 4. Variables de Entorno

### Backend (`config.php`)

```php
// BASE DE DATOS
DB_HOST=localhost
DB_USER=u754245691_user
DB_PASS=[contraseña-guardada-en-hostinger]
DB_NAME=u754245691_db_90IMt5ZM

// CORS
CORS_ORIGIN=https://roommaster.site
CORS_METHODS=GET, POST, PUT, PATCH, DELETE
CORS_HEADERS=Content-Type, Authorization

// APLICACIÓN
APP_ENV=production
APP_DEBUG=false
APP_URL=https://roommaster.site
```

### Frontend (`.env` - No usado, compilado en build)

```javascript
// Vite - Variables compiladas en tiempo de build
VITE_API_URL=https://roommaster.site/backend
VITE_APP_NAME=RoomMaster
VITE_APP_VERSION=1.0.0
```

### Sistema (Hostinger cPanel)

```bash
# PHP Configuration
PHP_VERSION=7.4+
EXTENSION_MYSQLI=enabled
EXTENSION_JSON=enabled
EXTENSION_ZIP=enabled

# Server
PORT=80/443 (HTTPS habilitado)
DISK_SPACE=disponible
MEMORY_LIMIT=256M
MAX_EXECUTION_TIME=300s
```

---

## 5. Problemas Encontrados y Soluciones

| Problema | Causa Raíz | Solución Aplicada |
|---|---|---|
| **#1452 - Foreign Key Constraint Error en inventario_habitaciones** | IDs de habitaciones y suministros no coincidían (esperaba 1-10, estaban 60-69 y 7-14) | Corregir SQL con IDs reales: habitacion_id 60-69, suministro_id 7-14. Ejecutar INSERT correcto. |
| **PATCH Method No Funcionaba** | `obtenerDatos()` en functions.php no incluía PATCH en lista de métodos | Añadir: `if ($metodo === 'PATCH')` para soportar toggle de estado de usuarios |
| **DELETE Endpoints Incompletos** | usuarios.php y productos.php solo validaban permisos sin ejecutar eliminación | Implementar lógica completa: DELETE FROM inventario (si aplica), DELETE FROM tabla principal |
| **"Stock Insuficiente" Error Persistente** | Validación de stock solo verificaba tabla `inventario` (que estaba vacía) | Implementar validación dual-source: buscar en inventario, si no existe buscar en productos.stock |
| **CORS Error en Consola** | Headers CORS no configurados o mal ordenados | Añadir CORS headers antes de cualquier output en config.php. Asegurar que Access-Control-Allow-Origin es exacto. |
| **React Router Redirecciona a 404** | .htaccess no configurado para SPA (Single Page Application) | Crear .htaccess que redirija todas las rutas a index.html para que React Router maneje la navegación |
| **Búsqueda de Clientes No Filtraba** | JavaScript client-side filter vs data del servidor | Implementar filtrado en-tiempo-real con React state (useState + filter array) |
| **Piso Habitación Aceptaba Letras** | Input sin validación | Agregar: `filterOnlyNumbers(value).slice(0, 2)` + `<input max="99" />` |
| **CSS/JS No Cargaban en Servidor** | Rutas relativas en index.html vs rutas absolutas necesarias | Cambiar: `./assets/...` → `/assets/...` en index.html |
| **Conexión BD Fallaba en Hostinger** | Credenciales de usuario BD locales vs remotas diferentes | Actualizar config.php con credenciales de Hostinger: u754245691_user y contraseña del host |

---

## 6. Evidencia

### Captura 1: Frontend Funcionando - Login Page
```
✅ URL: https://roommaster.site
✅ Página carga correctamente
✅ Formulario de login visible
✅ CSS responsive aplicado
✅ No hay errores en consola
Muestra: Pantalla de login con email/contraseña, botón "Acceder", enlace registro
```

### Captura 2: Dashboard Post-Login (Admin)
```
✅ URL: https://roommaster.site/dashboard
✅ Estadísticas cargadas (clientes, habitaciones, ingresos)
✅ Tabla de usuarios visible
✅ Botones: password toggle, activar/desactivar, eliminar
✅ Todos los módulos accesibles en sidebar
Muestra: Dashboard con 4 usuarios, 10 habitaciones, 6+ clientes registrados
```

### Captura 3: API Endpoint Respondiendo
```
✅ POST /backend/login.php - Response: HTTP 200 + JSON con usuario y token
✅ GET /backend/clientes.php - Response: HTTP 200 + Array de clientes
✅ POST /backend/ventas.php - Response: HTTP 200 + Venta creada, stock actualizado
✅ DELETE /backend/productos.php - Response: HTTP 200 + Producto eliminado + inventario limpiado
Muestra: Testing en Postman/DevTools Network tab mostrando requests/responses exitosas
```

### Captura 4: phpMyAdmin - BD Poblada
```
✅ BD: u754245691_db_90IMt5ZM
✅ Tablas: 13 total (usuarios, clientes, habitaciones, productos, etc.)
✅ Datos: 
   - usuarios: 4 registros (admin + 3 recepcionistas)
   - clientes: 6 registros
   - habitaciones: 10 registros (IDs 60-69)
   - productos: 17 registros
   - inventario_habitaciones: 80+ registros (10 habitaciones × 8 suministros)
Muestra: phpMyAdmin structure tab mostrando todas las tablas y relaciones
```

---

## 7. Instrucciones para Correr el Proyecto Localmente

### 7.1 Requisitos Previos

```bash
# Verificar que tengas instalado:
node --version      # v16.0.0 o superior
npm --version       # v8.0.0 o superior
git --version       # 2.30.0 o superior
```

Si no los tienes, descargar desde:
- Node.js: https://nodejs.org/
- Git: https://git-scm.com/

### 7.2 Clonar el Repositorio

```bash
# Clonar proyecto
git clone https://github.com/[usuario]/RoomMaster-grupo.git

# Entrar a la carpeta
cd RoomMaster-grupo
```

### 7.3 Configurar Environment Local

```bash
# Backend - Crear/Configurar config.php para XAMPP local
cd backend

# Editar config.php:
# - DB_HOST=localhost
# - DB_USER=root (XAMPP default)
# - DB_PASS= (vacío por defecto)
# - DB_NAME=roommaster_db (o tu BD local)

# Asegurar que MySQL/MariaDB está corriendo (vía XAMPP Control Panel)
```

### 7.4 Frontend - Instalar y Ejecutar

```bash
# Ir a carpeta frontend
cd frontend

# 1. Instalar dependencias
npm install

# 2. Correr en modo desarrollo
npm run dev

# Output esperado:
# Local:   http://localhost:5173/
# ready in XXX ms

# Abrir navegador en http://localhost:5173/
```

### 7.5 Backend - Verificar Servidor Local

```bash
# Asegurar que XAMPP Apache está corriendo

# Verificar que los PHPs están en:
# C:/xampp/htdocs/RoomMaster-grupo/backend/

# Test backend en navegador:
http://localhost/RoomMaster-grupo/backend/login.php
# Esperado: {"success":false,"message":"Email y contraseña requeridos"}

# O via terminal:
curl -X GET http://localhost/RoomMaster-grupo/backend/clientes.php
```

### 7.6 Base de Datos Local

```bash
# 1. Abrir phpMyAdmin
http://localhost/phpmyadmin

# 2. Crear BD (si no existe)
CREATE DATABASE roommaster_db;

# 3. Importar SQL
# - Seleccionar BD: roommaster_db
# - Pestaña: Import
# - Archivo: BD ROOMMASTER/roommaster_database.sql
# - Clic: Go

# 4. Verificar datos
SELECT COUNT(*) FROM usuarios;
```

### 7.7 Login de Prueba

```
Credenciales:
- Email: admin@roommaster.com
- Contraseña: Admin123!

O recepcionista:
- Email: recepcionista1@roommaster.com
- Contraseña: Recep123!
```

### 7.8 Detener el Servidor

```bash
# Presionar en terminal frontend:
Ctrl + C

# Stopping XAMPP Apache:
# - Abrir XAMPP Control Panel
# - Click "Stop" en Apache
```

---

## 8. Reflexión Final

### ¿Qué fue lo más difícil del despliegue?

**La sincronización de IDs entre tablas relacionadas.** El mayor desafío fue descubrir que los IDs de habitaciones en Hostinger eran 60-69 (no 1-10 como localmente) y que los suministros comenzaban en ID 7 (no 1). Esto causó violaciones de foreign key constraints. La lección: siempre verificar que los IDs de las tablas padre coincidan ANTES de insertar en tablas hijo, y usar un script de validación o trigger en BD para evitar estas discrepancias.

### ¿Qué harías diferente en un próximo proyecto?

**Tres cambios principales:** (1) **Usar migrations automáticas** (Prisma, TypeORM) en lugar de SQL manual para garantizar coherencia entre ambientes; (2) **Implementar JWT tokens en lugar de localStorage** para seguridad más robusta y stateless authentication; (3) **Crear un CI/CD pipeline** (GitHub Actions, Jenkins) para automatizar testing y despliegue, evitando errores manuales y reduciendo tiempo de deploy de ~30 min a <5 min. Además, documentaría mejor el schema de BD con comentarios SQL y mantendría un archivo `.env.example` con todas las variables necesarias.

---

## 9. Conclusión

**RoomMaster está 100% funcional en producción** en https://roommaster.site. El sistema completo de gestión hotelera incluye autenticación, CRUD de clientes/habitaciones/productos, ventas con validación de stock dual-source, facturación, inventario y reportes. Todos los módulos han sido testeados y validados. El proyecto está listo para presentación en el SENA y para uso en producción.

**Estado**: ✅ DEPLOYMENT EXITOSO
**Fecha**: Marzo 12, 2026
**Responsable**: [Tu Equipo SENA]
**Soporte**: https://roommaster.site

---

## Anexos

### A. Comandos Útiles en Producción

```bash
# Ver logs de errores PHP
tail -50 /var/log/php-errors.log

# Ver estado de procesos
ps aux | grep php
ps aux | grep mysql

# Backup de BD
mysqldump -u u754245691_user -p u754245691_db_90IMt5ZM > backup.sql

# Restaurar BD
mysql -u u754245691_user -p u754245691_db_90IMt5ZM < backup.sql

# Ver espacio disco
df -h

# Ver tráfico entrada/salida
nethogs
```

### B. URLs de Referencia

- **Sitio en Producción**: https://roommaster.site
- **phpMyAdmin**: https://roommaster.site/phpmyadmin
- **Repositorio GitHub**: https://github.com/[usuario]/RoomMaster-grupo
- **Panel cPanel**: https://cp.hostinger.com
- **Hosting**: https://www.hostinger.com

### C. Contacto Soporte

- **Hostinger Support**: https://support.hostinger.com
- **Email**: support@hostinger.com
- **Chat**: https://support.hostinger.com/chat
- **Teléfono**: [Según tu país]

---

**Documento completado**: Marzo 12, 2026
**Versión**: 1.0
**Estado**: ✅ PRODUCTION DEPLOYMENT
