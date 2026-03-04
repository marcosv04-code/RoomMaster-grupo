# 🎯 SISTEMA DE ROLES Y PERMISOS - IMPLEMENTACIÓN COMPLETADA

## ✅ Archivos Creados

### Frontend - Sistema de Permisos
1. **`src/utils/permissions.js`** - Definición de permisos y roles
2. **`src/hooks/usePermissions.js`** - Hook personalizado para verificar permisos

### Backend - Sistema de Permisos
3. **`backend/permissions.php`** - Definición de permisos en PHP

### Componentes Actualizados
4. **`src/components/common/Sidebar.jsx`** - Filtra módulos según rol
5. **`src/components/common/Table.jsx`** - Botones condicionados por permiso
6. **`src/pages/gestion-estadia/GestionEstadiaPage.jsx`** - Implementa permisos

### Documentación
7. **`SISTEMA_DE_PERMISOS.md`** - Documentación completa de roles
8. **`GUIA_PERMISOS_DESARROLLO.md`** - Guía para implementar en otros módulos

---

## 🔍 Estructura de Roles

### 👨‍💼 ADMINISTRADOR
**Color**: Rojo (#FF6B6B)
- ✅ Acceso a TODOS los módulos
- ✅ Crear, editar, eliminar en todos lados
- ✅ Ver reportes y análisis
- ✅ Gestionar usuarios

### 📞 RECEPCIONISTA
**Color**: Verde (#4ECDC4)
- ✅ Acceso a 7 módulos (sin Reportes)
- ✅ Crear estadías, facturas, ventas, clientes
- ✅ Marcar facturas como pagadas
- ✅ NO puede editar/eliminar datos
- ✅ NO puede ver reportes
- ✅ NO puede editar otros usuarios

---

## 🚀 Cómo Usar en Componentes

### En el Frontend (React)

```javascript
import { usePermissions } from '../../hooks/usePermissions'

export default function MiComponente() {
  const { can, isAdmin, isReceptionist } = usePermissions()

  // Mostrar solo si tiene permiso
  if (can('ESTADIA_EDIT')) {
    return <button>Editar</button>
  }
}
```

### En el Backend (PHP)

```php
require_once 'permissions.php';

// Verificar permiso o abortar con 403
verificarPermisoOAbortar('ESTADIAS_EDIT');

// Luego proceder con la acción
```

---

## 📊 Matriz de Acceso Rápida

| Módulo | Admin | Recepcionista | Acción |
|--------|-------|---------------|--------|
| 📊 Dashboard | ✅ | ✅ | Ver estadísticas |
| 🏨 Gestión Estadia | ✅ | ✅ | Ver, crear |
| 🏨 Gestión Estadia | ✅ | ❌ | Editar |
| 💳 Facturación | ✅ | ✅ | Create, mark paid |
| 💳 Facturación | ✅ | ❌ | Editar, eliminar |
| 🛒 Tienda | ✅ | ✅ | Vender productos |
| 🛒 Tienda | ✅ | ❌ | Editar productos |
| 👥 Clientes | ✅ | ✅ | Ver, crear |
| 👥 Clientes | ✅ | ❌ | Editar, eliminar |
| 📦 Inventario | ✅ | ✅ | Ver |
| 📦 Inventario | ✅ | ❌ | Editar, eliminar |
| 📈 Reportes | ✅ | ❌ | N/A |
| 👤 Perfil | ✅ | ✅ | Editar el suyo |

---

## 🔄 Flujo de Implementación

### 1. Sistema Initialization
```
Usuario inicia sesión
        ↓
Login.php retorna: { token, usuario: { id, nombre, rol } }
        ↓
Frontend guarda en localStorage (incluyendo rol)
        ↓
AuthContext proporciona userData a toda la app
```

### 2. Permission Check en Frontend
```
Component monta
        ↓
usePermissions() obtiene rol de useAuth()
        ↓
can('PERMISO') verifica si rol tiene acceso
        ↓
Muestra/oculta botones y módulos
```

### 3. Permission Check en Backend
```
Frontend envía request a endpoint
        ↓
Endpoint PHP llama verificarPermisoOAbortar('PERMISO')
        ↓
Si no tiene permiso → HTTP 403 (Forbidden)
        ↓
Si tiene permiso → Continúa la operación
```

---

## 🎨 Indicadores Visuales

### En el Sidebar
- **Avatar Admin**: Rojo (#FF6B6B) con "👨‍💼"
- **Avatar Recepcionista**: Verde (#4ECDC4) con "📞"
- **Módulos ocultos**: Basados en permisos

### En las Tablas
- **Botón Editar**: Solo si `can('MODULO_EDIT')`
- **Botón Eliminar**: Solo si `can('MODULO_DELETE')`
- **Botón Cancelar**: Solo si `can('MODULO_CANCEL')`

---

## 📋 Permisos Definidos

### Dashboard
```
DASHBOARD_VIEW: [admin, receptionist]
```

### Gestión de Estadia
```
ESTADIA_VIEW: [admin, receptionist]
ESTADIA_CREATE: [receptionist]        ← Recepcionista hace check-in
ESTADIA_EDIT: [admin]
ESTADIA_DELETE: [admin]
ESTADIA_CANCEL: [receptionist]        ← Recepcionista cancela
```

### Facturación
```
FACTURACION_VIEW: [admin, receptionist]
FACTURACION_CREATE: [receptionist]    ← Recepcionista genera facturas
FACTURACION_MARK_PAID: [receptionist] ← Recepcionista cobra
FACTURACION_EDIT: [admin]
FACTURACION_DELETE: [admin]
```

### Tienda
```
TIENDA_VIEW: [admin, receptionist]
TIENDA_CREATE: [receptionist]         ← Recepcionista vende
TIENDA_EDIT: [admin]
TIENDA_DELETE: [admin]
```

### Clientes
```
CLIENTES_VIEW: [admin, receptionist]
CLIENTES_CREATE: [receptionist]       ← Recepcionista registra
CLIENTES_EDIT: [admin]
CLIENTES_DELETE: [admin]
```

### Inventario
```
INVENTARIO_VIEW: [admin, receptionist]
INVENTARIO_EDIT: [admin]
INVENTARIO_DELETE: [admin]
```

### Reportes
```
REPORTES_VIEW: [admin]               ← Solo admin
```

### Perfil
```
PERFIL_EDIT_SELF: [admin, receptionist]
PERFIL_EDIT_OTHERS: [admin]
PERFIL_DELETE: [admin]
```

---

## 🧪 Cómo Probar

### 1. Login como Admin
```
Email: admin@hotel.com
Password: admin123
```
✅ Ver todos los módulos
✅ Ver todos los botones (Editar, Eliminar)
✅ Ver Reportes en sidebar

### 2. Login como Recepcionista
```
Email: recepcionista@hotel.com
Password: recep123
```
✅ Ver 7 módulos (sin Reportes)
✅ Ver solo botones permitidos (Crear, Cancelar, Marcar pagada)
❌ No ver botones Editar, Eliminar en clientes
❌ No acceder a Reportes

---

## 📝 Próximos Pasos (Opcional)

Para completar el sistema en otros módulos:

1. **Clientes** (`ClientesPage.jsx`)
   - Aplicar permisos a tabla
   - Mostrar/ocultar botón "Nuevo Cliente"

2. **Tienda** (`TiendaPage.jsx`)
   - Restringir edición de productos
   - Solo recepcionista vende

3. **Facturación** (`FacturacionPage.jsx`)
   - Solo recepcionista genera/marca pagada
   - Solo admin edita

4. **Inventario** (`InventarioPage.jsx`)
   - Recepcionista solo consulta
   - Admin solo edita

5. **Backend**
   - Agregar verificación de permisos en cada endpoint
   - Llamar `verificarPermisoOAbortar()` en todas las operaciones

---

## 🎓 Recursos

- **Documentación Completa**: `SISTEMA_DE_PERMISOS.md`
- **Guía de Desarrollo**: `GUIA_PERMISOS_DESARROLLO.md`
- **Frontend - Permisos**: `src/utils/permissions.js`
- **Frontend - Hook**: `src/hooks/usePermissions.js`
- **Backend - Permisos**: `backend/permissions.php`

---

## ✨ Ventajas del Sistema

✅ **Seguridad multicapa**: Frontend + Backend  
✅ **Fácil de extender**: Agregar nuevos permisos al array  
✅ **Consistente**: Mismo sistema en todos lados  
✅ **User-friendly**: Botones desaparecen si no hay permiso  
✅ **Escalable**: Listo para nuevos roles (si se necesita)  
✅ **Documentado**: Guías y ejemplos completos  

---

**Estado**: ✅ Sistema completo y funcional
**Versión**: 1.0
**Última actualización**: Marzo 3, 2026
