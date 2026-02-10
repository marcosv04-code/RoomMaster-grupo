# 📖 Índice de Documentación - RoomMaster

> Guía completa para encontrar lo que necesitas

---

## 🎯 Para Empezar

### Si es tu PRIMER día:
1. Lee: **INSTALACION_EJECUCION.md** - Instala todo
2. Lee: **README.md** - Visión general del proyecto
3. Lee: **GUIA_ARQUITECTURA.md** - Entiende cómo funciona

**Tiempo estimado**: 30-40 minutos

---

### Si quieres APRENDER React:
1. **GUIA_ARQUITECTURA.md** 
   - Concepto de components, hooks, context
   - Cómo fluyen los datos en React
   - Patrones de desarrollo

2. **PATRONES_COMUNES.md**
   - Ejemplos de código reutilizables
   - Cómo hacer CRUD
   - Cómo usar formularios

3. Modificar el código y ver qué pasa
   - Abre un archivo `.jsx` en VS Code
   - Cambia algo y guarda
   - Mira cómo cambia en el navegador

**Tiempo estimado**: 2-3 horas

---

### Si quieres AGREGAR una característica:
1. **NUEVAS_FUNCIONALIDADES.md** - Paso a paso
   - Agregar página nuevo módulo
   - Agregar campos a formularios
   - Agregar búsqueda, filtros, validaciones

**Tiempo estimado**: 30-60 minutos por feature

---

### Si tienes un ERROR o BUG:
1. **DEBUGGING_TROUBLESHOOTING.md**
   - 5 errores comunes con soluciones
   - Cómo usar las herramientas de debugging
   - Checklist de pruebas

**Tiempo estimado**: 5-15 minutos

---

## 📁 Estructura de Documentación

```
📚 DOCUMENTACIÓN PRINCIPAL
├── README.md                          • Inicio rápido (5 min)
├── INSTALACION_EJECUCION.md          • Cómo ejecutar el proyecto (10 min)
├── INDICE_DOCUMENTACION.md (tú estás aquí)
│
📚 GUÍAS EDUCATIVAS
├── GUIA_ARQUITECTURA.md              • Explicación completa del sistema (30 min)
├── PATRONES_COMUNES.md               • Ejemplos y plantillas de código (20 min)
├── DEBUGGING_TROUBLESHOOTING.md      • Solucionar problemas (15 min)
├── NUEVAS_FUNCIONALIDADES.md         • Cómo agregar features (variable)
│
📚 ARCHIVOS DE REFERENCIA
├── ESTRUCTURA_PROYECTO.txt           • Mapeo de carpetas
├── ESTRUCTURA_VISUAL.txt             • Diagrama visual del proyecto
├── ARCHIVOS_CLAVE.txt                • Archivos más importantes
└── RESUMEN_FINAL.txt                 • Resumen de la implementación
```

---

## 🔍 Búsqueda por Tema

### 🔐 Autenticación y Roles

**Pregunta**: "¿Cómo funciona el login?"
- 🔗 Ver: **GUIA_ARQUITECTURA.md** → "Flujo de Autenticación"
- 📍 Código: `frontend/src/context/AuthContext.jsx`

**Pregunta**: "¿Cómo verifico si el usuario es admin?"
- 🔗 Ver: **PATRONES_COMUNES.md** → "Verificar Rol del Usuario"
- 📍 Código: Ver cualquier página, ej: `ClientesPage.jsx`

**Pregunta**: "¿Cómo cambio el sistema de roles?"
- 🔗 Ver: **GUIA_ARQUITECTURA.md** → "Sistema de Roles"
- 📍 Código: `frontend/src/context/AuthContext.jsx`

---

### 🗄️ Datos y Estado (useState, useContext)

**Pregunta**: "¿Cómo guardo datos en React?"
- 🔗 Ver: **GUIA_ARQUITECTURA.md** → "Data Flow Patterns"
- 📍 Patrón: **PATRONES_COMUNES.md** → "Estado Local"

**Pregunta**: "¿Cómo paso datos entre componentes?"
- 🔗 Ver: **GUIA_ARQUITECTURA.md** → "Props vs Context"
- 📍 Ejemplo: `Sidebar.jsx` recibe datos de `App.jsx`

**Pregunta**: "¿Dónde se guardan los datos del usuario?"
- 🔗 Ver: **GUIA_ARQUITECTURA.md** → "localStorage"
- 📍 Código: Abre Console (F12) → Application → Local Storage

---

### 📊 CRUD (Create, Read, Update, Delete)

**Pregunta**: "¿Cómo hago CRUD?"
- 🔗 Ver: **PATRONES_COMUNES.md** → "Patrón CRUD Completo"
- 🔗 Ejemplo en vida real: `ClientesPage.jsx`

**Pregunta**: "¿Cómo hago un formulario?"
- 🔗 Ver: **PATRONES_COMUNES.md** → "Formularios Controlados"
- 📍 Código: `LoginPage.jsx` (simple), `ClientesPage.jsx` (avanzado)

**Pregunta**: "¿Cómo valido un formulario?"
- 🔗 Ver: **NUEVAS_FUNCIONALIDADES.md** → "Validaciones Avanzadas"
- 📍 Código: `LoginPage.jsx` tiene validación de email

---

### 🎨 Componentes y Estilos

**Pregunta**: "¿Cómo creo un componente reutilizable?"
- 🔗 Ver: **GUIA_ARQUITECTURA.md** → "Reusable Components"
- 📍 Ejemplo: `Table.jsx`, `Modal.jsx`, `Card.jsx`

**Pregunta**: "¿Cómo personalizo los estilos?"
- 🔗 Ver: **NUEVAS_FUNCIONALIDADES.md** → "Estilos Personalizados"
- 📍 Archivos CSS: Cada componente tiene su `.css`

**Pregunta**: "¿Por qué algunos componentes usan `forwardRef`?"
- 🔗 Ver: **DEBUGGING_TROUBLESHOOTING.md** → "Error: setItems is not a function"
- 📍 Código: `Table.jsx` tiene ejemplo

---

### 🔧 Funciones y Hooks

**Pregunta**: "¿Qué es `useEffect`?"
- 🔗 Ver: **GUIA_ARQUITECTURA.md** → "React Hooks"
- 📍 Usa este patrón en: `ClientesPage.jsx`, `GestionEstadiaPage.jsx`

**Pregunta**: "¿Cómo hago un hook personalizado?"
- 🔗 Ver: **GUIA_ARQUITECTURA.md** → "Custom Hooks"
- 📍 Ejemplo: `useAuth.js` (acceso a contexto)

**Pregunta**: "¿Cómo actualizo arrays sin mutar?"
- 🔗 Ver: **PATRONES_COMUNES.md** → "Patrones de Arrays"
- 🔗 Error que evita: **DEBUGGING_TROUBLESHOOTING.md** → "Mutating State Directly"

---

### 🔍 Búsqueda y Filtrado

**Pregunta**: "¿Cómo agrego buscador?"
- 🔗 Ver: **NUEVAS_FUNCIONALIDADES.md** → "Búsqueda"
- 📍 Patrón completo con código

**Pregunta**: "¿Cómo filtro por rol?"
- 🔗 Ver: `ClientesPage.jsx` (tiene ejemplo comentado)
- 🔗 Patrón: **PATRONES_COMUNES.md** → "Condicionales en JSX"

**Pregunta**: "¿Cómo pagino resultados?"
- 🔗 Ver: **NUEVAS_FUNCIONALIDADES.md** → "Paginación"

---

### 🐛 Debugging y Errores

**Pregunta**: "Mi componente no renderiza"
- 🔗 Ver: **DEBUGGING_TROUBLESHOOTING.md** → "Debugging por Escenario"
- 🔗 Solución: Revisa console (F12)

**Pregunta**: "Mi estado no se actualiza"
- 🔗 Ver: **DEBUGGING_TROUBLESHOOTING.md** → "Error: Mutating State"
- 🔗 Técnica: Usa spread operator `[...array]`

**Pregunta**: "¿Qué es este error 'Cannot read property'?"
- 🔗 Ver: **DEBUGGING_TROUBLESHOOTING.md** → "5 Errores Comunes"

**Pregunta**: "¿Cómo debugueo aunque no entiendo?"
- 🔗 Ver: **DEBUGGING_TROUBLESHOOTING.md** → "Debugging Techniques"
- Usa console.log, React DevTools, o Network tab

---

### 🚀 Agregar Features Nuevas

**Pregunta**: "¿Cómo agrego un nuevo módulo?"
- 🔗 Ver: **NUEVAS_FUNCIONALIDADES.md** → "Agregar Nueva Página CRUD"
- 📍 Paso a paso con código

**Pregunta**: "¿Cómo agrego campos al formulario?"
- 🔗 Ver: **NUEVAS_FUNCIONALIDADES.md** → "Agregar Campo"

**Pregunta**: "¿Cómo hago que solo admins vean esto?"
- 🔗 Ver: **NUEVAS_FUNCIONALIDADES.md** → "Sistema de Roles"
- 📍 Patrón: `{user?.role === 'admin' && <div>...</div>}`

**Pregunta**: "¿Cómo conecto a una API real?"
- 🔗 Ver: **INSTALACION_EJECUCION.md** → "Connection a Backend Real"

---

### 📱 Responsive y Mobile

**Pregunta**: "¿Cómo hago que funcione en móvil?"
- 🔗 Ver: **INSTALACION_EJECUCION.md** → "Desarrollo Responsivo"
- 🔗 Técnica: F12 → Modo responsivo (Ctrl + Shift + M)

**Pregunta**: "¿Por qué no se ve bien en móvil?"
- 🔗 Ver: Los estilos usan media queries en archivos `.css`
- Busca en: `@media (max-width: 768px)`

---

## 📊 Mapa Mental de Conceptos

```
ROOMMASTER
├── 🔐 AUTENTICACIÓN
│   ├── LoginPage → Lee credenciales
│   ├── AuthContext → Almacena usuario
│   └── useAuth → Accede a usuario desde cualquier componente
│
├── 👥 ROLES Y PERMISOS
│   ├── Admin → Acceso total
│   ├── Receptionist → Acceso limitado
│   └── ProtectedRoute → Verifica permisos
│
├── 📄 PÁGINAS/MÓDULOS
│   ├── Clientes (CRUD admin)
│   ├── Gestión Estadía (CRUD ambos)
│   ├── Facturación (Ver ambos, crear recepcionista)
│   └── Tienda (Ver ambos, vender recepcionista)
│
├── 🧩 COMPONENTES REUTILIZABLES
│   ├── Table (muestra datos en tabla)
│   ├── Modal (ventana emergente)
│   ├── Card (caja con estilo)
│   └── Navbar (barra superior)
│
└── 💾 ALMACENAMIENTO
    ├── useState (estado local componente)
    ├── useContext (estado global)
    └── localStorage (persistencia navegador)
```

---

## ⏱️ Matriz de Tiempos

| Tarea | Tiempo | Dificultad | Documento |
|-------|--------|-----------|-----------|
| Instalar y ejecutar | 10 min | ⭐ Fácil | INSTALACION_EJECUCION.md |
| Entender arquitectura | 30 min | ⭐⭐ Medio | GUIA_ARQUITECTURA.md |
| Hacer tu primer CRUD | 45 min | ⭐⭐ Medio | PATRONES_COMUNES.md |
| Agregar nuevo módulo | 60 min | ⭐⭐ Medio | NUEVAS_FUNCIONALIDADES.md |
| Debuguear un error | 10-20 min | ⭐⭐⭐ Difícil | DEBUGGING_TROUBLESHOOTING.md |
| Conectar API real | 120 min | ⭐⭐⭐ Difícil | INSTALACION_EJECUCION.md |

---

## 🎓 Rutas de Aprendizaje

### 🟢 Ruta Principiante (4-6 horas)
```
1. INSTALACION_EJECUCION.md (10 min)
   ↓
2. README.md (5 min)
   ↓
3. GUIA_ARQUITECTURA.md (30 min)
   ↓
4. Juega con el código modificando estilos (30 min)
   ↓
5. PATRONES_COMUNES.md (20 min)
   ↓
6. Crea una copia de ClientesPage.jsx (30 min)
```

### 🟡 Ruta Intermedia (8-12 horas)
```
1. Leo Ruta Principiante ↑
   ↓
2. NUEVAS_FUNCIONALIDADES.md (30 min)
   ↓
3. Agrego búsqueda a Clientes (60 min)
   ↓
4. Agrego paginación (60 min)
   ↓
5. Creo un módulo nuevo desde cero (120 min)
   ↓
6. DEBUGGING_TROUBLESHOOTING.md (20 min)
   ↓
7. Debugueo mis propios errores (60 min)
```

### 🔴 Ruta Avanzada (20+ horas)
```
1. Leo Rutas Anteriores
   ↓
2. Conecto a API backend real
   ↓
3. Añado autenticación con JWT
   ↓
4. Implemento más validaciones
   ↓
5. Agrego testing con Jest
   ↓
6. Deploy a producción
```

---

## 💬 Guía Rápida por Pregunta

### "¿Por dónde empiezo?"
→ **INSTALACION_EJECUCION.md** + **README.md**

### "No entiendo cómo funciona"
→ **GUIA_ARQUITECTURA.md** (léelo A a Z)

### "Quiero ver una solución lista"
→ **PATRONES_COMUNES.md** (copiar-pegar)

### "Tengo un error"
→ **DEBUGGING_TROUBLESHOOTING.md** (busca tu error)

### "Quiero agregar algo"
→ **NUEVAS_FUNCIONALIDADES.md** (paso a paso)

---

## 🔗 Enlaces Rápidos a Secciones

| Documento | Sección | Para |
|-----------|---------|------|
| GUIA_ARQUITECTURA.md | Estructura del Proyecto | Entender carpetas |
| GUIA_ARQUITECTURA.md | Flujo de Autenticación | Entender login |
| GUIA_ARQUITECTURA.md | CRUD Pattern | Entender create/read/update/delete |
| PATRONES_COMUNES.md | Patrón CRUD Completo | Copiar plantilla |
| PATRONES_COMUNES.md | Verificar Rol | Ver si es admin |
| PATRONES_COMUNES.md | Formularios Controlados | Manejar forms |
| NUEVAS_FUNCIONALIDADES.md | Agregar Nueva Página | Crear módulo nuevo |
| DEBUGGING_TROUBLESHOOTING.md | 5 Errores Comunes | Solucionar bugs |
| INSTALACION_EJECUCION.md | Problemas Comunes | Fix errores instalación |

---

## 📞 Ayuda Rápida

**Si necesitas...** | **Entonces busca...**
---|---
Un template de CRUD | PATRONES_COMUNES.md
Entender qué hace esto → esta línea | GUIA_ARQUITECTURA.md (concepto)
Mi código no funciona | DEBUGGING_TROUBLESHOOTING.md
Agregar un botón nuevo | NUEVAS_FUNCIONALIDADES.md
Cómo se ejecuta el proyecto | INSTALACION_EJECUCION.md
Explicación visual | ESTRUCTURA_VISUAL.txt

---

## ✅ Checklist para Empezar

- [ ] Instalé Node.js
- [ ] Ejecuté `npm install`
- [ ] Ejecuté `npm run dev`
- [ ] Abrí http://localhost:5173
- [ ] Hice login (admin@roommaster.com / admin123)
- [ ] Exploré los módulos disponibles
- [ ] Leí GUIA_ARQUITECTURA.md
- [ ] Abrí DevTools (F12)
- [ ] Vi el código en VS Code
- [ ] Modifiqué algo y recargué

Si todo está ✅, **¡ESTÁS LISTO PARA APRENDER!**

---

## 🎯 Objetivo Final

Al terminar toda la documentación y práctica, deberías poder:

✅ Entender cómo funciona React  
✅ Crear un módulo nuevo desde cero  
✅ Hacer CRUD (crear, editar, eliminar)  
✅ Debuguear tus propios errores  
✅ Agregar validaciones  
✅ Manejar estado global  
✅ Conectar a una API backend  
✅ Ayudar a otros compañeros  

---

Hecho con ❤️ para estudiantes ADSO

**"La mejor forma de aprender programación es programando"** - Unknown

¡A por ello! 🚀
