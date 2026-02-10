# 🚀 COMIENZA AQUÍ - Tu Sistema Está Listo

## ⏱️ 5 MINUTOS PARA QUE TODO FUNCIONE

### Paso 1️⃣ - Verificar Backend (2 min)

Abre en tu navegador:
```
http://localhost/roommaster/backend/clientes.php
```

**¿Ves JSON?** ✅ Ve al Paso 2

**¿Error 404?** ❌ Los archivos no están en la ruta correcta:
- Copia carpeta `/backend` a: `C:\xampp\htdocs\roommaster\backend\`

**¿Error de BD?** ❌ Ejecuta el SQL:
1. Abre `http://localhost/phpmyadmin`
2. Copia contenido de `BD ROOMMASTER/roommaster_database.sql`
3. Pega en pestaña SQL
4. Presiona Ejecutar

---

### Paso 2️⃣ - Verificar React API (1 min)

En tu archivo `src/services/api.js`, verifica:

```javascript
const API_BASE_URL = 'http://localhost/roommaster/backend';
```

¿Está así? ✅ Ve al Paso 3

¿No? ❌ Cámbialo según tu ruta:
```javascript
// Si copiaste en otra carpeta:
const API_BASE_URL = 'http://localhost/tuCarpeta/backend';
```

---

### Paso 3️⃣ - Test en Console (1 min)

Abre `localhost:3002` en navegador

Presiona `F12` y ve a Console

Ejecuta esto:

```javascript
fetch('http://localhost/roommaster/backend/login.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        email: 'admin@roommaster.com',
        contraseña: 'admin123'
    })
}).then(r => r.json()).then(d => console.log(d));
```

**¿Ves respuesta JSON con token?** ✅ ¡LISTO!

---

## 🎉 ¡Ya Está Funcionando!

Ahora puedes:

1. **Usar los servicios en React:**
   ```javascript
   import { clientesService } from '../services/api';
   
   clientesService.obtener().then(res => {
       console.log(res.data.datos); // Aquí están los clientes
   });
   ```

2. **Copiar componentes ejemplo:**
   ```javascript
   import { ClientesPageConectada } from '../backend/componentes_ejemplo.jsx';
   ```

3. **Ir a cualquiera de tus páginas y conectarlas**

---

## 📚 Documentación Según Necesites

| Necesito... | Leer esto |
|------------|-----------|
| Ir rápido | `backend/GUIA_RAPIDA.md` |
| Entender BD | `BD ROOMMASTER/GUIA_BASE_DATOS.md` |
| Ver ejemplos React | `backend/componentes_ejemplo.jsx` |
| Entender APIs | `backend/README.md` |
| Ver todo listado | `INDICE_ARCHIVOS_CREADOS.md` |

---

## ⚠️ Si Algo No Funciona

### ❌ CORS Error
```
Access to XMLHttpRequest has been blocked by CORS policy
```
**Solución:** Los archivos PHP necesitan este include:
```php
require_once 'cors.php';
```
Verifica que esté en todos los archivos.

### ❌ 404 Not Found
Verifica que los archivos están en:
```
C:\xampp\htdocs\roommaster\backend\
```

### ❌ Database connection failed
1. Abre phpMyAdmin
2. Verifica que existe `roommaster_db`
3. Si no existe, ejecuta el SQL en `BD ROOMMASTER/roommaster_database.sql`

### ❌ No ves cambios
Limpia localStorage:
```javascript
localStorage.clear();
location.reload();
```

---

## 🎯 Próximo: Conectar Tus Componentes

1. Abre `src/pages/clientes/ClientesPage.jsx`

2. Importa el servicio:
   ```javascript
   import { clientesService } from '../../services/api';
   ```

3. Usa similar a `backend/componentes_ejemplo.jsx`:
   ```javascript
   useEffect(() => {
       clientesService.obtener()
           .then(res => setClientes(res.data.datos))
           .catch(err => console.error(err));
   }, []);
   ```

Repite para cada página (Facturas, Tienda, Reportes, etc)

---

## 📞 Emergencia rápida

**¿Dónde está _?**
→ `INDICE_ARCHIVOS_CREADOS.md` tiene el mapa completo

**¿Cómo hago para _?**
→ `backend/GUIA_RAPIDA.md` tiene los "cómo"

**¿De dónde viene _?**
→ `backend/README.md` explica la arquitectura

**¿Qué es este archivo _?**
→ Arriba de este documento encontrarás la documentación

---

## ✅ Checklist Mínimo

- [ ] XAMPP corriendo (Apache + MySQL)
- [ ] http://localhost/roommaster/backend/clientes.php devuelve JSON
- [ ] Test en console (login) funciona
- [ ] API_BASE_URL correcta en api.js
- [ ] React corre en localhost:3002

¿Todo ✓? **¡Continualo! 🚀**

¿Algo ✗? **Lee el archivo `backend/GUIA_RAPIDA.md` para troubleshooting**

---

**¿Primer uso?** 👉 Lee esto primero, luego `backend/GUIA_RAPIDA.md`

**¿Ya lo leíste?** 👉 Abre `backend/componentes_ejemplo.jsx` y copia

**¿Necesitas todo?** 👉 Mira `INDICE_ARCHIVOS_CREADOS.md`

¡Bienvenido a RoomMaster! 🎉
