# 🔧 CREAR LA BASE DE DATOS CORRECTAMENTE

## ⚠️ SI SIGUE SIN FUNCIONAR, HAZLO MANUALMENTE

### PASO 1: Abre phpMyAdmin
```
http://localhost/phpmyadmin
```

### PASO 2: Crea la base de datos
1. **Arriba a la izquierda**, haz clic en: **"Nueva"** (o **"New"** si está en inglés)
2. Escribe en el campo: `roommaster_db`
3. Haz clic en **Crear** (Create)

### PASO 3: Ejecuta el SQL
1. Haz clic en la base de datos `roommaster_db`
2. Ve a la pestaña: **SQL**
3. Abre el archivo: `BD ROOMMASTER/roommaster_database.sql`
4. **Copia TODO** el contenido
5. Pégalo en el editor SQL de phpMyAdmin
6. Haz clic en **Ejecutar** (Execute / Run)

---

## ✅ SI FUNCIONA

Verás esto:

```
Las 9 tablas fueron creadas:

✓ usuarios
✓ clientes
✓ habitaciones
✓ estadías
✓ facturas
✓ productos
✓ ventas
✓ inventario
✓ actividades
```

---

## 🔐 VERIFICA QUE EL USUARIO ADMIN EXISTE

1. Haz clic en la tabla: **usuarios**
2. Debe mostrar 3 usuarios:
   - Carlos Rodriguez (admin@roommaster.com) ← Este es el que usarás
   - María García (maria@roommaster.com)
   - Juan López (juan@roommaster.com)

---

## 🚀 AHORA INTENTA LOGIN

Email: `admin@roommaster.com`
Contraseña: `admin123`

¿Funciona? ✅

---

## 📺 SI SIGUE SIN FUNCIONAR

1. Abre DevTools (F12)
2. Ve a **Network**
3. Intenta hacer login
4. Busca la solicitud a `login.php`
5. Mira la pestaña **Response**
6. Comparte conmigo qué dice
