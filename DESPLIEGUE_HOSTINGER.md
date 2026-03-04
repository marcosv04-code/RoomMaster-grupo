# 📦 Guía de Despliegue en Hostinger - RoomMaster

## Paso a Paso para roommaster.site

### 1️⃣ PREPARAR LOS ARCHIVOS LOCALMENTE

Antes de subir a Hostinger, compila el frontend:

```bash
cd frontend
npm run build
```

Esto creará una carpeta `dist/` con los archivos optimizados.

---

### 2️⃣ ESTRUCTURA EN HOSTINGER

Crea esta estructura en tu hosting:

```
public_html/
├── index.html          (copiar de frontend/dist/)
├── assets/            (copiar de frontend/dist/assets/)
├── backend/           (copiar toda la carpeta)
│   ├── config.php
│   ├── cors.php
│   ├── login.php
│   ├── register.php
│   ├── usuarios.php
│   └── ... (todos los archivos .php)
└── [otros archivos estáticos de frontend/dist/]
```

**Resumen:**
- **Frontend compilado (React)**: en `public_html/`
- **Backend (PHP)**: en `public_html/backend/`

---

### 3️⃣ CONFIGURAR LA BASE DE DATOS EN HOSTINGER

1. Ve a **cPanel** → **MySQL Bases de Datos**
2. Crea una nueva BD. Ejemplo: `usuario_roommaster` (Hostinger agrega prefijo)
3. Crea un usuario MySQL con contraseña fuerte
4. Asigna el usuario a la BD con **TODOS los permisos**

Toma nota de:
- Nombre de la BD (ej: `usuario_roommaster_db`)
- Usuario (ej: `usuario_roommaster_admin`)
- Contraseña: `tu_contraseña_segura`
- Host: `localhost` (casi siempre en Hostinger)

---

### 4️⃣ ACTUALIZAR `backend/config.php`

Abre `public_html/backend/config.php` en cPanel → File Manager y cambia:

```php
<?php
define('DB_HOST', 'localhost');           // Casi siempre localhost en Hostinger
define('DB_USER', 'usuario_roommaster_admin');  // Tu usuario MySQL
define('DB_PASS', 'tu_contraseña_segura');     // Tu contraseña
define('DB_NAME', 'usuario_roommaster_db');    // Tu BD
```

**Guarda el archivo.**

---

### 5️⃣ IMPORTAR LA BASE DE DATOS

1. En cPanel → **phpMyAdmin**
2. Selecciona tu BD (`usuario_roommaster_db`)
3. Ve a la pestaña **Import**
4. Sube el archivo `BD ROOMMASTER/roommaster_database.sql`
5. Click en **Import**

Espera a que termine. Las tablas se crearán automáticamente.

---

### 6️⃣ VERIFICAR DIRECTORIOS Y PERMISOS

En cPanel → File Manager, asegúrate que:
- `backend/` tenga permisos **755** (ejecutable)
- Los archivos `.php` tengan permisos **644**

Comandos en Terminal (SSH) si lo necesitas:
```bash
chmod 755 backend/
chmod 644 backend/*.php
```

---

### 7️⃣ CREAR UN `.htaccess` PARA REACT ROUTER (IMPORTANTE)

Crea un archivo `.htaccess` en `public_html/` con este contenido:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # No procesar carpetas y archivos reales
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  
  # Redirigir todo a index.html (para React Router)
  RewriteRule ^ index.html [QSA,L]
</IfModule>
```

Esto es **CRÍTICO** para que React Router funcione en las URLs como `/dashboard`, `/clientes`, etc.

---

### 8️⃣ PROBAR LA CONEXIÓN

1. Abre tu navegador: `https://roommaster.site`
2. Deberías ver la página de Login
3. Intenta hacer login (primero crea un admin en la BD o usa el script de inserción)
4. Si todo funciona, ¡success! ✅

---

### ⚠️ CHECKLIST FINAL

- [ ] Frontend compilado con `npm run build`
- [ ] Archivos de `dist/` copiados a `public_html/`
- [ ] Carpeta `backend/` con todos los `.php` en `public_html/backend/`
- [ ] `config.php` actualizado con credenciales reales de Hostinger
- [ ] BD importada en phpMyAdmin
- [ ] `.htaccess` creado en `public_html/`
- [ ] HTTPS habilitado en Hostinger (automático con Let's Encrypt)
- [ ] Dominio apunta a `public_html/`

---

### 🐛 SOLUCIÓN DE PROBLEMAS

**"Error: No se puede conectar al backend"**
- Verifica que `config.php` tenga las credenciales correctas
- Asegúrate que `backend/` esté en la ruta correcta

**"Error 404 al navegar a /dashboard"**
- Asegúrate de crear el `.htaccess` correctamente
- Revisa que `mod_rewrite` esté habilitado en Apache

**"Página blanca en login"**
- Abre la consola (F12) y ve los errores
- Probablemente sea un error de CORS en `cors.php`

**"SQL error: base de datos no encontrada"**
- Verifica que importaste el `.sql` en la BD correcta
- Asegúrate que el nombre en `config.php` coincide exactamente

---

### 📞 SOPORTE HOSTINGER

Si necesitas ayuda con:
- cPanel: `hpanel.hostinger.com`
- SSH: Solicita credenciales en panel
- Base de datos: Contáctate con soporte

---

**¡Éxito con tu despliegue! 🚀**

