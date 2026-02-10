# 🏨 RoomMaster - Guía de Instalación y Ejecución

> Configurar y ejecutar el proyecto completo

---

## 📋 Requisitos Previos

Asegúrate de tener instalado:
- **Node.js** (v16+): https://nodejs.org
- **npm** (viene con Node.js)
- **Un editor** (VS Code recomendado): https://code.visualstudio.com

Verifica:
```powershell
node --version    # Debe mostrar v16 o superior
npm --version     # Debe mostrar 8 o superior
```

---

## 🚀 Instalación Paso a Paso

### 1️⃣ Clonar o descargar el proyecto

Si tienes git:
```powershell
git clone <url-del-repositorio>
cd RoomMaster_Prueba
```

Si descargaste como ZIP:
```powershell
# Extrae el ZIP y abre PowerShell en la carpeta
cd C:\Users\Usuario\Desktop\RoomMaster_Prueba
```

### 2️⃣ Instalar dependencias del frontend

```powershell
cd frontend
npm install
```

Espera a que termine (puede tomar 2-3 minutos la primera vez).

### 3️⃣ Arrancar el servidor Vite

```powershell
npm run dev
```

Verás algo como:
```
➜  Local:   http://localhost:5173/
```

📌 **No cierres esta terminal**, déjala corriendo.

### 4️⃣ Abrir en navegador

En tu navegador, ve a:
```
http://localhost:5173
```

¡Verás la página de login de RoomMaster! ✅

---

## 👤 Credenciales de Prueba

### Acceso Admin
- **Email**: admin@roommaster.com
- **Contraseña**: admin123
- **Rol**: Administrador (acceso a todo)

### Acceso Recepcionista
- **Email**: recepcionista@roommaster.com
- **Contraseña**: recep123
- **Rol**: Recepcionista (acceso limitado)

---

## 🗂️ Estructura de Carpetas Explicada

```
RoomMaster_Prueba/
│
├── frontend/                    # Todo lo visible en el navegador
│   ├── src/
│   │   ├── pages/              # Páginas/módulos (Clientes, Facturación, etc)
│   │   ├── components/         # Componentes reutilizables (Tabla, Modal, etc)
│   │   ├── context/            # AuthContext (gestiona el usuario)
│   │   ├── hooks/              # Hooks personalizados (useAuth)
│   │   ├── services/           # Llamadas a API (actualmente mock)
│   │   ├── styles/             # Estilos globales
│   │   ├── App.jsx             # Archivo principal con rutas
│   │   └── main.jsx            # Punto de entrada
│   │
│   ├── package.json            # Dependencias del proyecto
│   ├── vite.config.js          # Configuración de Vite
│   └── index.html              # HTML principal
│
├── DOCUMENTACION/              # Archivos de información
│   ├── GUIA_ARQUITECTURA.md     # Explicación completa del sistema
│   ├── PATRONES_COMUNES.md      # Plantillas y ejemplos
│   ├── DEBUGGING_TROUBLESHOOTING.md
│   ├── NUEVAS_FUNCIONALIDADES.md
│   └── INSTALACION_EJECUCION.md (este archivo)
│
└── README.md                   # Inicio rápido
```

---

## 🛠️ Comandos Útiles

### Desarrollo
```powershell
# En la carpeta frontend/
npm run dev          # Inicia servidor Vite (http://localhost:5173)
```

### Build para producción
```powershell
npm run build        # Crea carpeta dist/ lista para deployment
npm run preview      # Vista previa de la build
```

### Linting (revisar errores)
```powershell
npm run lint         # Busca errores de sintaxis (si está configurado)
```

---

## 🐛 Solucionar Problemas Comunes

### ❌ Problema: "npm: No se reconoce el término"
**Solución**: 
- Node.js no está instalado
- Cierra PowerShell y reabre después de instalar

```powershell
node --version      # Verifica si funciona
```

### ❌ Problema: Puerto 5173 ya está en uso
**Solución**:
```powershell
# Para Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# O simplemente inicia en otro puerto:
npm run dev -- --port 3000
```

### ❌ Problema: "Cannot find module"
**Solución**:
```powershell
# En frontend/
del node_modules -R
del package-lock.json
npm install
```

### ❌ Problema: Cambios no se reflejan
**Solución**:
1. Clear navegador cache: Ctrl + Shift + Supr
2. Cierra Vite (Ctrl + C)
3. Ejecuta `npm run dev` nuevamente

### ❌ Problema: Errores de sintaxis React
**Verificar**: 
- ¿Importaste los hooks? `import { useState } from 'react'`
- ¿Cerraste todos los paréntesis y llaves?
- ¿Los nombres de componentes empiezan con mayúscula?

---

## 🔍 Verificar que Todo Funciona

### ✅ Checklist de Inicio

- [ ] Node y npm instalados
- [ ] `npm install` completó sin errores
- [ ] `npm run dev` muestra "Local: http://localhost:5173"
- [ ] Navegador abre la página sin errores
- [ ] Puedo hacer login con admin@roommaster.com
- [ ] Puedo acceder a Clientes, Facturación, etc
- [ ] Puedo cambiar tema (light/dark)
- [ ] Puedo crear un nuevo cliente

Si toda la lista está marcada, **¡TODO ESTÁ BIEN!** ✅

---

## 🎓 Primeros Pasos de Desarrollo

### 1. Explorar la estructura
```powershell
# En VS Code, abre la carpeta:
code .
```

### 2. Leer la documentación de arquitectura
Abre: `GUIA_ARQUITECTURA.md`

### 3. Crear una copia de un módulo para practicar
```
1. Copia carpeta: frontend/src/pages/clientes/
2. Renombra a: frontend/src/pages/pracctica/
3. Modifica el nombre del componente
4. Agrega ruta en App.jsx
5. Prueba cambios
```

### 4. Ver cambios en tiempo real
- Modifica un archivo `.jsx`
- Guarda (Ctrl + S)
- El navegador se actualiza automáticamente ⚡

---

## 📱 Desarrollo Responsivo

Los estilos están optimizados para:
- 📱 Móvil (320px mínimo)
- 📲 Tablet (768px)
- 💻 Desktop (1024px+)

Ver en móvil:
1. F12 en navegador (DevTools)
2. Ctrl + Shift + M (modo responsivo)
3. Selecciona dispositivo

---

## 🌐 Conexión a Backend Real (Próximo)

Cuando tengas un servidor backend:

### Paso 1: Cambiar URL base
En `frontend/src/services/api.js`:
```javascript
const API_URL = 'http://localhost:3000/api'  // ← Cambiar aquí
```

### Paso 2: Reemplazar llamadas mock
Ejemplo en `ClientesPage.jsx`:
```javascript
// ANTES (mock):
const [items] = useState([
  { id: 1, nombre: 'Cliente 1', ... }
])

// DESPUÉS (real):
useEffect(() => {
  fetch(`${API_URL}/clientes`)
    .then(res => res.json())
    .then(data => setItems(data))
}, [])
```

---

## 🚀 Deploy a Internet

### Opción 1: Vercel (Recomendado)
```powershell
# 1. Registrate en vercel.com
# 2. Instala CLI
npm install -g vercel

# 3. Deploy
cd frontend
vercel           # Sigue las instrucciones
```

### Opción 2: Netlify
```powershell
# 1. Registrate en netlify.com
# 2. Ejecuta build
npm run build

# 3. Arrastra carpeta 'dist' a Netlify
```

Tu app estará en: `https://roommaster.vercel.app` (o similar)

---

## 📚 Recursos Útiles

- **Documentación de React**: https://react.dev
- **Vite**: https://vitejs.dev
- **JavaScript Moderno**: https://javascript.info
- **CSS**: https://css-tricks.com
- **React Hooks**: https://react.dev/reference/react/hooks

---

## 💬 Preguntas Frecuentes

**P: ¿Cómo agrego un nuevo módulo?**
R: Ver `NUEVAS_FUNCIONALIDADES.md`

**P: ¿Cómo cambio los estilos?**
R: Modifica archivos `.css` en la carpeta del componente

**P: ¿Dónde se guardan los datos?**
R: Actualmente en `localStorage` (navegador). Ver `GUIA_ARQUITECTURA.md`

**P: ¿Cómo hago que solo admins vean algo?**
R: Ver sección de roles en `PATRONES_COMUNES.md`

**P: ¿Se pierden datos si recargo la página?**
R: No, se guardan en localStorage. Mira la consola: F12 → Application → Local Storage

---

## 🔐 Seguridad (Importante)

⚠️ **ESTO ES UN PROYECTO EDUCATIVO**

- Los datos se guardan en el navegador (no es seguro en producción)
- Las contraseñas son simples (usa contraseñas reales en producción)
- No hay encriptación de datos
- Cuando conectes a backend real:
  - Usa HTTPS
  - Implementa autenticación real
  - Valida datos en el servidor
  - Use tokens JWT

---

## 📞 Soporte

Si tienes problemas:

1. **Lee** `DEBUGGING_TROUBLESHOOTING.md`
2. **Revisa** la consola: F12 en navegador
3. **Busca** el error en Google
4. **Pregunta** a compañeros o profesor

---

Hecho con ❤️ para estudiantes ADSO

**¡A programar se aprende programando!** 💪
