# 🚀 GUÍA DE DESPLIEGUE - RoomMaster en Producción

## 📋 TABLA DE CONTENIDOS
1. [Requisitos Previos](#requisitos-previos)
2. [Estructura Local](#estructura-local)
3. [Build del Frontend](#build-del-frontend)
4. [Preparación de Archivos](#preparación-de-archivos)
5. [Acceso a Hostinger](#acceso-a-hostinger)
6. [Upload de Archivos](#upload-de-archivos)
7. [Configuración en Servidor](#configuración-en-servidor)
8. [Base de Datos](#base-de-datos)
9. [Testing Post-Deploy](#testing-post-deploy)
10. [Troubleshooting](#troubleshooting)

---

## ✅ REQUISITOS PREVIOS

### En Local (Tu PC)
- [x] Node.js 16+ instalado
- [x] npm 8+ instalado
- [x] Git instalado
- [x] Editor de código (VS Code)
- [x] Cliente FTP o SSH (FileZilla, WinSCP, terminal)

### En Hostinger
- [x] Cuenta activa en Hostinger
- [x] Dominio configurado (roommaster.site)
- [x] cPanel accesible
- [x] phpMyAdmin disponible
- [x] Soporte para PHP 7.4+

### Credenciales Necesarias
```
HOSTINGER:
✓ URL cPanel: https://cp.hostinger.com
✓ Usuario cPanel: [tu usuario]
✓ Contraseña cPanel: [tu contraseña]
✓ Base de Datos: u754245691_db_90IMt5ZM
✓ Usuario BD: u754245691_user
✓ Contraseña BD: [contraseña guardada]

FTP/SSH:
✓ Host: ftp.roommaster.site o srv.hostinger.com
✓ Usuario FTP: [tu usuario FTP]
✓ Contraseña FTP: [tu contraseña]
✓ Puerto FTP: 21
✓ Puerto SSH: 22
```

---

## 📁 ESTRUCTURA LOCAL

### Carpeta del Proyecto
```
c:\xampp\htdocs\RoomMaster-grupo\
├── frontend/
│   ├── src/
│   ├── public/
│   ├── dist/ ← Se crea después del build ⭐
│   ├── package.json
│   ├── vite.config.js
│   └── node_modules/
│
├── backend/
│   ├── config.php
│   ├── functions.php
│   ├── cors.php
│   ├── login.php
│   ├── usuarios.php
│   ├── clientes.php
│   ├── habitaciones.php
│   ├── productos.php
│   ├── ventas.php
│   ├── facturas.php
│   ├── inventario.php
│   ├── inventario_habitaciones.php
│   ├── estadias.php
│   ├── reportes.php
│   └── [otros módulos].php
│
├── BD ROOMMASTER/
│   └── roommaster_database_hostinger.sql
│
└── docs/
    ├── RESUMEN_PROYECTO_PRESENTACION.md
    ├── GUIA_DESPLIEGUE_PRODUCCION.md (este archivo)
    └── README.md
```

### Estructura en Hostinger (Destino)
```
/public_html/
├── index.html ← Frontend entry point
├── assets/
│   ├── index-[hash].js ← Bundle React compilado ⭐
│   ├── index-[hash].css ← Estilos compilados
│   └── images/
│       └── [assets estáticos]
│
└── backend/ ← APIs PHP
    ├── config.php
    ├── functions.php
    ├── login.php
    ├── usuarios.php
    ├── clientes.php
    ├── productos.php
    ├── ventas.php
    └── [todos los módulos]
```

---

## 🔨 BUILD DEL FRONTEND

### Paso 1: Limpiar Build Anterior (Opcional)
```bash
cd c:\xampp\htdocs\RoomMaster-grupo\frontend

# Eliminar carpeta dist anterior (si existe)
rm -r dist
# En Windows PowerShell:
Remove-Item -Recurse -Force .\dist
```

### Paso 2: Instalar Dependencias
```bash
npm install
# O si ya las tienes:
npm ci
```

### Paso 3: Build de Producción
```bash
npm run build
```

**Esperado:**
```
✓ 167 modules transformed, 3.13s build time
✓ index-[hash].js (451.20 KB) ← Main bundle
✓ index-[hash].css (44.52 KB) ← Estilos
✓ index.html (520 B) ← Entry point
```

### Paso 4: Verificar Output
```bash
cd dist
ls -la
# Debes ver:
# - index.html
# - assets/ (carpeta con los bundles)
```

### Paso 5: Probar Localmente (Opcional)
```bash
# Dentro de /dist
npx http-server

# Visita: http://localhost:8080
# Verifica que funciona antes de subir a producción
```

**⚠️ Importante:**
- El hash en el nombre del archivo cambia en cada build
- Hostinger cacheará el CSS/JS automáticamente
- Si necesitas limpiar cache: Vacía archivos en directorio `/assets/` antes de upload

---

## 📦 PREPARACIÓN DE ARCHIVOS

### Archivos a Subir

#### Frontend (después del build)
```
dist/
├── index.html ← Copiar a /public_html/
└── assets/
    ├── index-Dhxi5SrR.js ← Copiar a /public_html/assets/
    ├── index-CnbxwDQP.css ← Copiar a /public_html/assets/
    └── images/ ← Copiar todo a /public_html/assets/images/
```

#### Backend (todos los PHP)
```
backend/
├── config.php ← IMPORTANTE: Verificar conexión BD ⭐
├── functions.php
├── cors.php
├── login.php
├── usuarios.php
├── clientes.php
├── habitaciones.php
├── productos.php
├── ventas.php
├── facturas.php
├── inventario.php
├── inventario_habitaciones.php
├── estadias.php
├── reportes.php
├── dashboard_stats.php
└── personal_limpieza.php
```

### Checklist pre-Deploy
- [ ] ¿Build completado sin errores?
- [ ] ¿Hash del bundle generado correctamente?
- [ ] ¿config.php apunta a BD correcta? (u754245691_db_90IMt5ZM)
- [ ] ¿CORS configurado correctamente?
- [ ] ¿Todos los PHP files están en carpeta?
- [ ] ¿Tienes credenciales Hostinger?

---

## 🔐 ACCESO A HOSTINGER

### Opción 1: FTP (Más Fácil)

#### Con FileZilla
1. **Abrir FileZilla** → `File` → `Site Manager`
2. **Crear nuevo sitio:**
   - Host: `ftp.roommaster.site` o `srv.hostinger.com`
   - Protocol: `FTP`
   - Encryption: `Use explicit FTP over TLS if available`
   - Username: `[tu usuario FTP]`
   - Password: `[tu contraseña]`
   - Port: `21`
3. **Conectar** → Se mostrará árbol de carpetas
4. **Navegar a** `/public_html/`

#### Con WinSCP
1. **Protocol**: FTP
2. **Host name**: `ftp.roommaster.site`
3. **User name**: `[tu usuario FTP]`
4. **Password**: `[tu contraseña]`
5. **Port**: 21
6. **Login** → Navegar a `/public_html/`

### Opción 2: SSH (Más Rápido - Recomendado)

#### Con Terminal/PowerShell
```bash
# Conectar
ssh usuario@roommaster.site
# O con puerto específico:
ssh -p 22 usuario@srv.hostinger.com

# Ingresar contraseña cuando pida

# Navegar a public_html
cd /home/usuario/public_html

# Listar archivos
ls -la
```

#### Con WinSCP (SSH)
1. **Protocol**: SFTP
2. **Host name**: `roommaster.site`
3. **User name**: `[tu usuario]`
4. **Password**: `[tu contraseña]`
5. **Port**: 22
6. **Login** → Navegar a `/home/usuario/public_html/`

---

## 📤 UPLOAD DE ARCHIVOS

### Método 1: FTP Manual (FileZilla)

#### Paso 1: Crear Carpeta assets (si no existe)
```bash
# En FileZilla, dentro de /public_html/:
Click derecho → Create directory → "assets"
```

#### Paso 2: Subir Frontend
```
LOCAL:                          REMOTO:
c:\...\RoomMaster\frontend\dist\
├── index.html            →     /public_html/index.html
└── assets/               →     /public_html/assets/
    ├── index-[hash].js   
    ├── index-[hash].css
    └── images/
```

**En FileZilla:**
1. **Panel izquierdo** (Local): Navega a `frontend/dist/`
2. **Panel derecho** (Remoto): Navega a `/public_html/`
3. **Arrastra ficheros** del izquierdo al derecho
   - O hace click derecho → Upload

#### Paso 3: Subir Backend
```
LOCAL:                    REMOTO:
backend/                  /public_html/backend/
├── config.php      →     /public_html/backend/config.php
├── functions.php   →     /public_html/backend/functions.php
├── login.php       →     /public_html/backend/login.php
└── todos los .php  →     /public_html/backend/[archivo].php
```

**En FileZilla:**
1. **Panel izquierdo**: Navega a `backend/`
2. **Panel derecho**: En `/public_html/`, crea carpeta `backend`
3. **Arrastra todos los .php** a `backend/`

### Método 2: SFTP con Terminal (Más Rápido)

#### Conectar y Crear Estructura
```bash
ssh usuario@roommaster.site

# Crear carpeta backend (si no existe)
mkdir -p /home/usuario/public_html/backend
mkdir -p /home/usuario/public_html/assets

# Logout
exit
```

#### Upload desde Local (Sin conectar servidor)
```bash
# En tu terminal local (PowerShell/Git Bash)

# Upload Frontend
scp -r C:\xampp\htdocs\RoomMaster-grupo\frontend\dist\* usuario@roommaster.site:/home/usuario/public_html/

# Upload Backend
scp -r C:\xampp\htdocs\RoomMaster-grupo\backend\*.php usuario@roommaster.site:/home/usuario/public_html/backend/
```

#### Verificar que se subió correctamente
```bash
ssh usuario@roommaster.site

cd /home/usuario/public_html

# Ver contenido
ls -la

# Ver backend
ls -la backend/

# Ver assets
ls -la assets/

# Salir
exit
```

**Esperado:**
```
total 120
-rw-r--r--  1 user group     520 Mar 12 14:32 index.html
drwxr-xr-x  2 user group    4096 Mar 12 14:35 assets/
drwxr-xr-x  2 user group    4096 Mar 12 14:35 backend/

/backend:
-rw-r--r--  1 user group     2048 Mar 12 14:35 config.php
-rw-r--r--  1 user group     8192 Mar 12 14:35 functions.php
-rw-r--r--  1 user group     4096 Mar 12 14:35 login.php
... etc

/assets:
-rw-r--r--  1 user group   451200 Mar 12 14:35 index-Dhxi5SrR.js
-rw-r--r--  1 user group    44520 Mar 12 14:35 index-CnbxwDQP.css
drwxr-xr-x  2 user group    4096 Mar 12 14:35 images/
```

---

## ⚙️ CONFIGURACIÓN EN SERVIDOR

### Paso 1: Verificar config.php

**Ubicación:** `/public_html/backend/config.php`

**Contenido esperado:**
```php
<?php
// config.php

// Información de conexión MySQL
define('DB_HOST', 'localhost');
define('DB_USER', 'u754245691_user');
define('DB_PASS', '[contraseña guardada]');
define('DB_NAME', 'u754245691_db_90IMt5ZM');

// Crear conexión
$conexion = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

// Chequear conexión
if ($conexion->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Conexión BD fallida']));
}

// Set charset
$conexion->set_charset("utf8mb4");

// CORS
header("Access-Control-Allow-Origin: https://roommaster.site");
header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
?>
```

**⚠️ Verificar:**
- `DB_HOST`: `localhost` ✓
- `DB_USER`: `u754245691_user` ✓
- `DB_PASS`: Contraseña correcta ✓
- `DB_NAME`: `u754245691_db_90IMt5ZM` ✓
- `Access-Control-Allow-Origin`: `https://roommaster.site` ✓

### Paso 2: Verificar Permisos de Archivos

```bash
# Conectar SSH
ssh usuario@roommaster.site

# Cambiar permisos de archivos PHP (755 = lectura-ejecución)
chmod 755 /home/usuario/public_html/backend/*.php
chmod 755 /home/usuario/public_html/index.html

# Verificar
ls -la /home/usuario/public_html/backend/

# Esperado: -rwxr-xr-x
```

### Paso 3: Configurar index.html para SPA

**Importante:** React Router necesita que todas las rutas vuelvan a `index.html`

#### Opción A: .htaccess (Si no existe)

**Crear archivo:** `/public_html/.htaccess`

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Permitir acceso a backend
RewriteCond %{REQUEST_URI} ^/backend/ [L]
```

#### Opción B: Via cPanel

1. Acceder a cPanel → `File Manager`
2. Ir a `/public_html/`
3. Click derecho → **Create New File** → `.htaccess`
4. Pegar el contenido anterior
5. Guardar

### Paso 4: Verificar Conexión API

**Test endpoint:**
```bash
# Test login (ejemplo)
curl https://roommaster.site/backend/login.php

# Esperado: {"success": false, "message": "Email y contraseña requeridos"}
```

**Desde browser:**
```
https://roommaster.site/backend/login.php
```

**En consola (F12):**
```javascript
fetch('https://roommaster.site/backend/login.php', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'admin@roommaster.com', contraseña: 'Admin123!' })
})
.then(r => r.json())
.then(d => console.log(d))
```

**Esperado:**
```json
{
  "success": true,
  "usuario": { "id": 1, "nombre": "Admin", ... },
  "token": "...",
  "permisos": { ... }
}
```

---

## 🗄️ BASE DE DATOS

### Verificar BD Existe

**Via phpMyAdmin:**
1. Acceder: https://roommaster.site/phpmyadmin
2. Login con usuario BD: `u754245691_user`
3. Verificar que existe BD: `u754245691_db_90IMt5ZM`
4. Ver tablas (13 total):
   - usuarios
   - clientes
   - habitaciones
   - estadias
   - productos
   - ventas
   - facturas
   - inventario
   - inventario_habitaciones
   - suministros
   - personal_limpieza
   - actividades
   - permissions

### Si BD está Vacía: Importar SQL

**Opción 1: Via phpMyAdmin**
1. phpMyAdmin → Seleccionar BD
2. Pestaña `Import`
3. Seleccionar archivo: `roommaster_database_hostinger.sql`
4. Click `Go`

**Opción 2: Via Terminal SSH**
```bash
ssh usuario@roommaster.site

# Conectar a MySQL
mysql -u u754245691_user -p u754245691_db_90IMt5ZM < /ruta/al/archivo.sql

# O descargarlo primero
wget https://ruta/roommaster_database_hostinger.sql
mysql -u u754245691_user -p u754245691_db_90IMt5ZM < roommaster_database_hostinger.sql
```

### Verificar Datos

**Query de verificación:**
```sql
SELECT COUNT(*) as usuarios FROM usuarios;
SELECT COUNT(*) as clientes FROM clientes;
SELECT COUNT(*) as habitaciones FROM habitaciones;
SELECT COUNT(*) as productos FROM productos;

-- Esperado:
-- usuarios: 4 (1 admin + 3 recepcionistas)
-- clientes: 6
-- habitaciones: 10
-- productos: 17
```

---

## ✔️ TESTING POST-DEPLOY

### Checklist Funcional

#### 1. Frontend Carga
```
URL: https://roommaster.site
Esperado:
  ✓ Página carga sin error 404
  ✓ Spinner de carga visible
  ✓ Redirecciona a login si no autenticado
  ✓ CSS cargado correctamente
  ✓ Responsive en mobile/tablet/desktop
```

#### 2. Login Funciona
```
Credenciales: admin@roommaster.com / Admin123!
Esperado:
  ✓ Request POST a /backend/login.php
  ✓ Token guardado en localStorage
  ✓ Redirecciona a Dashboard
  ✓ Muestra nombre admin en navbar
```

#### 3. Dashboard Carga
```
Esperado:
  ✓ Estadísticas visibles
  ✓ Tabla de usuarios cargada
  ✓ Botones admin funcionales
  ✓ No hay errores en consola
```

#### 4. Endpoints API

**Test cada endpoint:**
```javascript
// Test GET
fetch('https://roommaster.site/backend/clientes.php')
  .then(r => r.json())
  .then(d => console.log(d))
  // Esperado: Array de clientes

// Test POST
fetch('https://roommaster.site/backend/login.php', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'admin@roommaster.com', contraseña: 'Admin123!' })
})
  .then(r => r.json())
  .then(d => console.log(d))
  // Esperado: { success: true, usuario, token }

// Test PATCH
fetch('https://roommaster.site/backend/usuarios.php', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ id: 2, estado: 'inactivo' })
})
  .then(r => r.json())
  .then(d => console.log(d))
  // Esperado: { success: true, message: 'Usuario actualizado' }

// Test DELETE (solo admin)
fetch('https://roommaster.site/backend/productos.php?id=1', {
  method: 'DELETE'
})
  .then(r => r.json())
  .then(d => console.log(d))
  // Esperado: { success: true, message: 'Producto eliminado' }
```

#### 5. Validaciones Funcionan

**Stock Dual-Source:**
```
1. Crear venta con productos en inventario
2. Verificar stock se descuenta
3. Crear venta con cantidad insuficiente
4. Esperado: Error "Stock insuficiente"
```

**Piso Habitación:**
```
1. Crear nueva habitación
2. Ingresar piso: "abc123def"
3. Esperado: Se valida automáticamente a "12"
```

**Permiso Admin:**
```
1. Login como recepcionista
2. Intentar eliminar producto
3. Esperado: Error acceso denegado
```

#### 6. Datos Persistentes

```
1. Login → Crear cliente → Logout
2. Login de nuevo → Ir a Clientes
3. Esperado: Cliente creado sigue en BD
```

---

## 🔧 TROUBLESHOOTING

### Problema 1: "Cannot GET /"

**Síntoma:**
```
Error: Cannot GET /
```

**Causa:** 
- No existe `index.html` en `/public_html/`
- O `.htaccess` no redirige correctamente

**Solución:**
```bash
# Verificar que existe
ls -la /public_html/index.html
# Debe mostrar el archivo

# Crear .htaccess si falta
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

# Permisos
chmod 644 /public_html/.htaccess
```

### Problema 2: "CORS Error" en Consola

**Síntoma:**
```
Access to XMLHttpRequest at 'https://roommaster.site/backend/login.php' 
from origin 'https://roommaster.site' has been blocked by CORS policy
```

**Causa:**
- CORS no configurado en `config.php`
- Header incorrecto

**Solución:**

**Archivo:** `/public_html/backend/config.php`

```php
<?php
// Asegurar que CORS va ANTES que cualquier output

header("Access-Control-Allow-Origin: https://roommaster.site");
header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

// Si es OPTIONS request, response y exit
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Resto del código
$conexion = new mysqli(...);
?>
```

### Problema 3: "Conexión a BD fallida"

**Síntoma:**
```json
{
  "success": false,
  "message": "Conexión BD fallida: Access denied for user 'u754245691_user'@'localhost'"
}
```

**Causa:**
- Contraseña BD incorrecta
- Usuario no existe
- BD no existe

**Solución:**

1. **Verificar en cPanel:**
   - cPanel → MySQL Databases
   - Ver lista de usuarios y sus contraseñas

2. **Actualizar config.php con credenciales correctas**

3. **Test conexión:**
```bash
ssh usuario@roommaster.site

mysql -u u754245691_user -p

# Ingresar contraseña
# Si conecta sin error, está correcta

show databases;
# Debe mostrar u754245691_db_90IMt5ZM
```

### Problema 4: "API retorna error 500"

**Síntoma:**
```
HTTP 500 - Internal Server Error
```

**Causa:**
- Error SQL
- Error en código PHP
- Archivo no existe

**Solución:**

1. **Ver error detallado:**
```bash
ssh usuario@roommaster.site

# Ver logs
tail -50 /var/log/php-errors.log

# O en cPanel:
# Error Reporter
```

2. **Verificar sintaxis PHP:**
```bash
php -l /home/usuario/public_html/backend/login.php

# Esperado: No syntax errors detected
```

3. **Test endpoint directo:**
```bash
curl -X GET https://roommaster.site/backend/clientes.php

# Ver respuesta completa
```

### Problema 5: "Bundle JS no se ejecuta"

**Síntoma:**
```
En consola: Uncaught SyntaxError: Unexpected token '<'
Indicador: Está cargando HTML en lugar de JS
```

**Causa:**
- Hash del archivo cambió y archivo cacheado
- Ruta incorrecta en index.html

**Solución:**

1. **Limpiar cache:**
```bash
rm -rf /public_html/assets/
```

2. **Re-subir todo el contenido de dist:**
```bash
scp -r frontend/dist/* usuario@roommaster.site:/home/usuario/public_html/
```

3. **Verificar paths en index.html:**
```html
<!-- En index.html, verificar que apunta a assets/ -->
<script type="module" src="/assets/index-[hash].js"></script>
<link rel="stylesheet" href="/assets/index-[hash].css">
```

### Problema 6: "Imágenes no cargan"

**Síntoma:**
```
Imágenes muestran X en lugar de imagen
```

**Causa:**
- Assets no están en `/assets/images/`
- Rutas relativas incorrectas

**Solución:**

```bash
# Verificar estructura
ls -la /public_html/assets/images/

# Si está vacía, subir imágenes
scp -r frontend/dist/assets/images/* usuario@roommaster.site:/home/usuario/public_html/assets/images/

# Verificar en source si rutas son absolutas:
# <img src="/assets/images/logo.png"> ✓
# NO: <img src="./images/logo.png"> ✗
```

### Problema 7: "Login funciona pero Dashboard no carga"

**Síntoma:**
```
Página en blanco después de login
Consola: Errores al cargar data
```

**Causa:**
- API no retorna datos
- Error en endpoint dashboard_stats.php
- Token no se envía correctamente

**Solución:**

1. **Verificar llamada a API:**
```javascript
// En navegador console (F12)
fetch('https://roommaster.site/backend/dashboard_stats.php', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  }
})
.then(r => r.json())
.then(d => console.log(d))
```

2. **Verificar que dashboard_stats.php existe:**
```bash
ls -la /public_html/backend/dashboard_stats.php
```

3. **Ver error en log:**
```bash
tail -50 /var/log/php-errors.log
```

---

## 📊 MONITOREO POST-DEPLOY

### Verificación Diaria

```bash
# SSH a servidor
ssh usuario@roommaster.site

# Check espacio disco
df -h

# Check uso memoria
free -h

# Check procesos PHP
ps aux | grep php

# Ver logs errores
tail -100 /var/log/php-errors.log | grep ERROR

# Ver acceso a BD
tail -50 /var/log/mysql-general.log | tail
```

### Performance

```javascript
// En consola browser
// Ver tiempos de carga
performance.timing.loadEventEnd - performance.timing.navigationStart
// Esperado: < 3000 ms (idealmente < 1500 ms)

// Ver tamaño archivos
fetch('https://roommaster.site/assets/index-[hash].js')
  .then(r => console.log(r.headers.get('content-length')))
// Esperado: < 500 KB
```

### Alertas a Configurar

1. **Space Disk Alert**: Si uso > 80%
2. **CPU Alert**: Si uso > 90%
3. **Memory Alert**: Si uso > 85%
4. **Database Size**: Monitor si crece anormalmente

---

## 🎯 CHECKLIST FINAL

### Antes de Presentación

- [ ] Frontend compila sin errores
- [ ] Build genera archivos correctamente
- [ ] config.php apunta a BD correcta
- [ ] Archivos subidos a Hostinger
- [ ] .htaccess configurado
- [ ] CORS funcionando
- [ ] BD poblada con datos
- [ ] Login funciona
- [ ] Dashboard carga
- [ ] Endpoints API responden
- [ ] Validaciones funcionan
- [ ] Permisos aplicados
- [ ] No hay errores en consola
- [ ] Responsive en mobile
- [ ] Dominio https funciona
- [ ] Certificado SSL válido

### Después de Presentación

- [ ] Hacer backup de BD
- [ ] Documentar cambios realizados
- [ ] Revisar logs de errores
- [ ] Ir a producción con mejoras
- [ ] Monitoreo activo 24/7 (si aplica)

---

## 📞 REFERENCIAS ÚTILES

### Hostinger Docs
- https://support.hostinger.com/es
- https://support.hostinger.com/es/articles/360001323054

### Comandos Útiles
```bash
# Ver versión PHP
php -v

# Ver extensiones instaladas
php -m | grep mysql

# Ver configuración
php -i | grep -A 10 "mysqli"

# Restart PHP (si es necesario)
# Contactar a Hostinger support
```

### Contacto Hostinger
- Email: support@hostinger.com
- Chat: https://support.hostinger.com
- Teléfono: [según tu país]

---

## ✅ CONCLUSIÓN

**Después de seguir esta guía:**
1. ✓ Frontend compilado y optimizado
2. ✓ Backend APIs en servidor
3. ✓ Base de datos configura y poblada
4. ✓ CORS y seguridad configurados
5. ✓ Todo tested y funcionando
6. ✓ Listo para presentación
7. ✓ Monitoreo activo

**RoomMaster está en producción y listo para uso.** 🚀

---

**Última actualización:** Marzo 12, 2026
**Versión:** 1.0
**Estado:** ✅ PRODUCTION READY
