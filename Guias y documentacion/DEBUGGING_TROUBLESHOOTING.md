# 🐛 Debugging y Troubleshooting - RoomMaster

> Tips y trucos para encontrar y solucionar errores

---

## 🔍 Herramientas de Debugging

### 1. React DevTools
**Instalación:**
- Chrome: React Developer Tools extensión
- Firefox: React Developer Tools extensión

**Uso:**
- Inspeccionar componentes en tiempo real
- Ver props y estado de cada componente
- Seguir cambios de estado
- Rastrear renders

### 2. Console del Navegador (F12)
```javascript
// Abrir con F12
// Tab: Console
// Escribir comandos JavaScript

console.log('Texto normal')
console.warn('Advertencia')
console.error('Error')
console.table(arrayDeObjejos)  // Ver tabla formateada
```

### 3. LocalStorage Inspector
```javascript
// En la consola:
localStorage  // Ver todo
localStorage.getItem('user')  // Ver un item
localStorage.setItem('test', 'valor')
localStorage.removeItem('test')
localStorage.clear()  // Limpiar todo
```

### 4. Network Tab
- Tab: Network
- Ver solicitudes HTTP
- Ver tiempos de respuesta
- Depurar APIs

---

## 🛑 Errores Comunes

### Error: "Cannot read property of undefined"
```javascript
// ❌ PROBLEMA
const user = null
console.log(user.name)  // Error!

// ✅ SOLUCIÓN 1: Optional Chaining
console.log(user?.name)  // undefined (sin error)

// ✅ SOLUCIÓN 2: Verificar antes
if (user) {
  console.log(user.name)
}
```

---

### Error: "setItems is not a function"
```javascript
// ❌ PROBLEMA: Olvidar destructurar
const item = useState([])
console.log(item)  // Es un array: [value, function]

// ✅ SOLUCIÓN: Destructurar correctamente
const [items, setItems] = useState([])
```

---

### Error: "Built-in components can't be used as forwardRef refs"
```javascript
// ❌ PROBLEMA
<Modal ref={ref}>  // Mal: Modal no acepta ref

// ✅ SOLUCIÓN: Usar un estado
const [isOpen, setIsOpen] = useState(false)
<Modal isOpen={isOpen} />
```

---

### Error: "Too many re-renders"
```javascript
// ❌ PROBLEMA: Llamar función en lugar de pasar referencia
<button onClick={handleClick()}>Click</button>  // Se ejecuta infinitas veces

// ✅ SOLUCIÓN: Pasar referencia
<button onClick={handleClick}>Click</button>
<button onClick={() => handleClick()}>Click</button>
```

---

### Error: "Mutating the state directly"
```javascript
// ❌ PROBLEMA: Mutar estado directamente
const [items, setItems] = useState([...])
items[0].name = 'nuevo'  // MALO
setItems(items)

// ✅ SOLUCIÓN: Crear nuevo array
setItems(items.map((item, idx) =>
  idx === 0 ? {...item, name: 'nuevo'} : item
))
```

---

## 🔧 Técnicas de Debugging

### 1. Console.log estratégico
```jsx
export default function MyComponent() {
  const [count, setCount] = useState(0)

  console.log('Componente renderizado, count:', count)

  return (
    <button onClick={() => setCount(count + 1)}>
      {count}
    </button>
  )
}
```

### 2. Debugger Breakpoints
```jsx
export default function MyComponent() {
  const handleClick = () => {
    debugger  // Se pausa aquí cuando abre DevTools
    console.log('Click!')
  }

  return <button onClick={handleClick}>Click</button>
}
```

### 3. Verificar Tipos
```jsx
const data = { name: 'Carlos' }

// Ver tipo
console.log(typeof data)  // 'object'
console.log(typeof data.name)  // 'string'
console.log(Array.isArray(data))  // false

// Verificar propiedades
console.log('name' in data)  // true
console.log(data.hasOwnProperty('name'))  // true
```

---

### 4. Rastrear Cambios de Estado
```jsx
import { useState, useEffect } from 'react'

export default function MyComponent() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    console.log('User cambió:', user)
  }, [user])

  return (
    <button onClick={() => setUser({ name: 'Carlos' })}>
      Cambiar usuario
    </button>
  )
}
```

---

## 🎯 Debugging por Escenario

### El componente no renderiza

```jsx
// 1. ¿Está montado?
console.log('Componente montado')

// 2. ¿El estado es correcto?
console.log('State:', count)

// 3. ¿Las props llegaron?
console.log('Props:', props)

// 4. ¿El return está correcto?
return (
  <div>
    {/* Revisar que esto no sea null/undefined */}
  </div>
)
```

---

### El estado no actualiza

```jsx
// ❌ PROBLEMA
const [items, setItems] = useState([])

// Intentar actualizar directamente
items.push(newItem)  // MALO
setItems(items)

// ✅ SOLUCIÓN
setItems([...items, newItem])  // CORRECTO
```

---

### La función no se ejecuta

```jsx
// ❌ PROBLEMA
<button onClick={handleClick()}>Click</button>

// ✅ SOLUCIÓN
<button onClick={handleClick}>Click</button>
<button onClick={() => handleClick()}>Click</button>
<button onClick={(e) => handleClick(e)}>Click</button>
```

---

### Modal no abre/cierra

```jsx
// Verificar que useStates están correctos
const [isOpen, setIsOpen] = useState(false)

// Verificar que pasamos los props correctos
<Modal isOpen={isOpen} onClose={() => setIsOpen(false)} />

// En Modal, verificar que renderiza solo si isOpen es true
if (!isOpen) return null
```

---

### Tabla no muestra datos

```jsx
// 1. Verificar que data tiene elementos
console.log('Data:', data)
console.log('Data length:', data?.length)

// 2. Verificar que columns es correcto
console.log('Columns:', columns)

// 3. Verificar que las keys coinciden
// Si data = [{nombre: 'Carlos'}]
// columns debe tener { key: 'nombre', label: '...' }

// 4. Ver si hay error en console (F12)
```

---

### Autenticación no funciona

```jsx
// 1. Verificar si useAuth está siendo usado dentro de AuthProvider
// En App.jsx debe ser:
<AuthProvider>
  <Routes>...</Routes>
</AuthProvider>

// 2. Verificar que el user se guardó en localStorage
localStorage.getItem('user')

// 3. Verificar que ProtectedRoute redirige
// Si no autenticado → debe ir a /login

// 4. Verificar el contexto
const { user, isAuthenticated } = useAuth()
console.log('User:', user)
console.log('Authenticated:', isAuthenticated)
```

---

## 📊 Checklist de Debugging

cuando algo no funciona:

- [ ] Abrir consola (F12)
- [ ] Ver si hay errores rojos
- [ ] Hacer console.log de variables clave
- [ ] Verificar que useState está destructurado correctamente
- [ ] Verificar que los props se pasan correctamente
- [ ] Revisar que no hay funciones llamadas sin paréntesis
- [ ] Verificar que no se muta estado directamente
- [ ] Revisar que Modal/Condicionales tienen la clave correcta
- [ ] Limpiar localStorage si hay problemas de autenticación
- [ ] Recargar página (Ctrl+Shift+R) para limpiar caché

---

## 🧹 Limpiar Caché

A veces el navegador guarda versiones viejas:

**Chrome/Firefox:**
```
Ctrl + Shift + R (Reload sin caché)
o
F12 → Network → Desactivar caché
```

**LocalStorage problemático:**
```javascript
// En consola:
localStorage.clear()
// Recargar página
```

---

## 🌍 Contexto Remoto

Si necesitas depurar con datos reales (cuando conectes a servidor):

```javascript
// Hacer un fetch real y ver respuesta
fetch('http://tu-servidor.com/api/users')
  .then(res => res.json())
  .then(data => console.log('Datos del servidor:', data))
  .catch(error => console.error('Error:', error))
```

---

## 📱 Testing Manual

**Casos a probar:**
- [ ] Login con credenciales correctas
- [ ] Login con credenciales incorrectas
- [ ] Crear nuevo item
- [ ] Editar item
- [ ] Eliminar item
- [ ] Logout
- [ ] Recargar página (¿se mantiene sesión?)
- [ ] Abrir en incógnito (¿sin datos guardados?)
- [ ] Cambiar entre admin y recepcionista

---

## 💡 Tips Rápidos

| Problema | Solución |
|----------|----------|
| React no detecta cambios | Usar spread operator: `[...array]` |
| Modal no desaparece | Verificar `if (!isOpen) return null` |
| Función se ejecuta sola | Quitar paréntesis: `onClick={fn}` |
| State es undefined | Verificar localStorage o useEffect |
| Componente no renderiza | Ver console.log en return |
| Props no llegan | Verificar destructuración |
| Rol no se aplica | Verificar `localStorage.getItem('user')` |

---

## 🆘 Si Todo Falla

1. **Limpiar caché:**
   ```
   Ctrl + Shift + R
   ```

2. **Limpiar localStorage:**
   ```javascript
   localStorage.clear()
   ```

3. **Recargar módulo:**
   ```javascript
   window.location.reload()
   ```

4. **Abrir en incógnito** (sin extensiones problemáticas)

5. **Preguntar a:**
   - ChatGPT con el error exacto
   - Compañeros desarrolladores
   - Stack Overflow

---

Hecho con ❤️ para estudiantes ADSO
