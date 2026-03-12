# 🚀 GUÍA DE DESPLIEGUE A HOSTING COMPARTIDO (roommaster.site)

## Resumen Rápido
Tu aplicación RoomMaster está lista para despliegue. Necesitas subir los archivos a tu hosting compartido con Apache y PHP.

---

## 1️⃣ PREPARACIÓN PREVIA

### Credenciales necesarias:
- **Dominio:** roommaster.site
- **Servidor:** Apache con PHP
- **Base de datos:** Ya configurada en backend/config.php

### Archivos creados/listos:
✅ Frontend compilado en `frontend/dist/`
✅ `.htaccess` para React Router en `frontend/`
✅ `.htaccess` para Backend API en `backend/`
✅ `.env.production` configurado en `frontend/`

---

## 2️⃣ ESTRUCTURA DE CARPETAS EN EL HOSTING

```
public_html/                    (raíz del dominio)
├── index.html                  (del build del frontend)
├── .htaccess                   (gestión de rutas React)
├── assets/                     (CSS, JS compilado)
└── backend/                    (archivos PHP)
    ├── config.php
    ├── login.php
    ├── .htaccess
    └── ... (rest de archivos)
```

---

## 3️⃣ PASOS DE DESPLIEGUE (VÍA cPanel/Hosting Compartido)

### Paso 1: Entra en cPanel
1. Abre tu panel de control del hosting
2. Ve a **File Manager** o usa FTP

### Paso 2: Sube los archivos del Frontend
1. **Copia TODOS los archivos de `frontend/dist/` a `public_html/`**
   - Incluye: `index.html`, `assets/`, los `.css` y `.js` compilados
   
2. **Sube el `.htaccess` del frontend a `public_html/`**
   - Asegúrate de que "Show Hidden Files" está activado en cPanel

### Paso 3: Sube los archivos del Backend
1. **Crea la carpeta `backend/` dentro de `public_html/`**

2. **Copia todos los archivos PHP a `public_html/backend/`**
   ```
   - config.php
   - login.php
   - register.php
   - clientes.php
   - habitaciones.php
   - estadias.php
   - facturas.php
   - ventas.php
   - usuarios.php
   - inventario.php
   - inventario_habitaciones.php
   - productos.php
   - personal_limpieza.php
   - reportes.php
   - dashboard_stats.php
   - functions.php
   - cors.php
   - permissions.php
   ```

3. **Sube el `.htaccess` del backend a `public_html/backend/`**

### Paso 4: Importa la Base de Datos
1. Ve a **phpMyAdmin** en cPanel
2. Crea una nueva base de datos si no existe: `u754245691_db_90IMt5ZM`
3. Importa el archivo SQL: `BD ROOMMASTER/roommaster_database.sql`
4. Verifica que el usuario tiene permisos: `u754245691_usr_90IMt5ZM`

### Paso 5: Verifica las Permisos de Carpetas
En cPanel File Manager:
- `public_html/` → Permisos: 755
- `public_html/backend/` → Permisos: 755
- Archivos PHP → Permisos: 644

---

## 4️⃣ VERIFICACIÓN POSTERIOR AL DESPLIEGUE

### Prueba el Frontend:
```
https://roommaster.site
```
Debería cargar la aplicación normalmente.

### Prueba el Backend:
```
https://roommaster.site/backend/login.php
```
Debería responder con JSON (intent de login).

### Tips de Debugging:
- Si hay error 404: Verifica que `.htaccess` está en ambas carpetas
- Si hay error CORS: El backend en config.php ya maneja esto
- Si hay error de BD: Verifica credenciales en backend/config.php

---

## 5️⃣ ARCHIVO DE CONFIGURACIÓN ACTUAL

### Backend (config.php)
```php
// PRODUCCIÓN - Hostinger
DB_HOST: localhost
DB_USER: u754245691_usr_90IMt5ZM
DB_PASS: RoomMaster2024!@
DB_NAME: u754245691_db_90IMt5ZM
```

### Frontend (.env.production)
```
VITE_API_URL=https://roommaster.site/backend
```

---

## 6️⃣ CHECKLIST FINAL

- [ ] Los archivos de `frontend/dist/` están en `public_html/`
- [ ] El `.htaccess` del frontend está en `public_html/`
- [ ] La carpeta `backend/` existe en `public_html/`
- [ ] Todos los archivos PHP están en `public_html/backend/`
- [ ] El `.htaccess` del backend está en `public_html/backend/`
- [ ] La base de datos está creada e importada
- [ ] Permisos de carpetas son 755
- [ ] El archivo config.php tiene las credenciales correctas
- [ ] Las URLs funcionan correctamente

---

## 7️⃣ SOPORTE Y ROLLBACK

### Si algo falla:
1. Restaura desde el backup anterior
2. Verifica los permisos de los archivos
3. Revisa los logs de PHP en cPanel (Error Logs)
4. Verifica que mod_rewrite está habilitado (Essential > Apache Modules)

### Para cambios futuros:
1. Edita los archivos locales
2. Ejecuta `npm run build` en la carpeta frontend
3. Sube los archivos actualizados de `frontend/dist/` a `public_html/`
4. No es necesario compilar el backend (son archivos PHP)

---

**¡Tu aplicación está lista para despliegue! 🎉**
