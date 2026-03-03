# 📋 SISTEMA DE ROLES Y PERMISOS - RoomMaster

## Descripción General

El sistema RoomMaster implementa un modelo de dos roles con permisos específicos:

- **👨‍💼 Administrador (Admin)**: Acceso completo a todas las funciones
- **📞 Recepcionista (Receptionist)**: Acceso limitado a funciones operativas

---

## 📊 Matriz de Permisos

### 1️⃣ DASHBOARD
| Función | Admin | Recepcionista |
|---------|-------|---------------|
| Ver estadísticas | ✅ | ✅ |
| Ver reportes | ✅ | ✅ |

---

### 2️⃣ GESTIÓN DE ESTADÍA (Check-in/Check-out)
| Función | Admin | Recepcionista |
|---------|-------|---------------|
| Ver estadías | ✅ | ✅ |
| Crear check-in | ✅ | ✅ |
| Editar estadía | ✅ | ❌ |
| Cancelar estadía | ✅ | ✅ |
| Eliminar estadía | ✅ | ❌ |

**Descripción**:
- El **recepcionista** registra las llegadas (check-in) de los huéspedes
- El **recepcionista** puede cancelar estadías si es necesario
- Solo el **admin** puede editar datos de una estadía ya creada

---

### 3️⃣ FACTURACIÓN (Generación de Facturas)
| Función | Admin | Recepcionista |
|---------|-------|---------------|
| Ver facturas | ✅ | ✅ |
| Generar facturas | ✅ | ✅ |
| Marcar como pagada | ✅ | ✅ |
| Editar factura | ✅ | ❌ |
| Eliminar factura | ✅ | ❌ |

**Descripción**:
- El **recepcionista** genera facturas automáticas cuando el huésped se va
- El **recepcionista** marca la factura como "Pagada" cuando recibe el pago
- Solo el **admin** puede editar o eliminar facturas (correcciones)

---

### 4️⃣ TIENDA / VENTAS (Venta de Productos)
| Función | Admin | Recepcionista |
|---------|-------|---------------|
| Ver productos | ✅ | ✅ |
| Registrar venta | ✅ | ✅ |
| Editar producto | ✅ | ❌ |
| Eliminar producto | ✅ | ❌ |

**Descripción**:
- El **recepcionista** vende productos a los huéspedes (snacks, etc.)
- Solo el **admin** puede agregar/editar/eliminar productos del inventario

---

### 5️⃣ CLIENTES (Gestión de Huéspedes)
| Función | Admin | Recepcionista |
|---------|-------|---------------|
| Ver clientes | ✅ | ✅ |
| Crear nuevo cliente | ✅ | ✅ |
| Editar cliente | ✅ | ❌ |
| Eliminar cliente | ✅ | ❌ |

**Descripción**:
- El **recepcionista** registra nuevos clientes al llegar
- Solo el **admin** puede editar/eliminar información de clientes

---

### 6️⃣ INVENTARIO (Control de Stock)
| Función | Admin | Recepcionista |
|---------|-------|---------------|
| Ver inventario | ✅ | ✅ |
| Editar stock | ✅ | ❌ |
| Agregar producto | ✅ | ❌ |
| Eliminar producto | ✅ | ❌ |

**Descripción**:
- El **recepcionista** puede ver qué hay disponible
- Solo el **admin** gestiona el inventario

---

### 7️⃣ REPORTES (Análisis y Estadísticas)
| Función | Admin | Recepcionista |
|---------|-------|---------------|
| Ver reportes | ✅ | ❌ |
| Acceder módulo | ✅ | ❌ |

**Descripción**:
- Solo el **admin** accede a análisis de ingresos, ocupación, clientes frecuentes, etc.
- El **recepcionista** NO tiene acceso a este módulo

---

### 8️⃣ PERFIL (Configuración Personal)
| Función | Admin | Recepcionista |
|---------|-------|---------------|
| Editar su perfil | ✅ | ✅ |
| Editar otros perfiles | ✅ | ❌ |
| Eliminar usuarios | ✅ | ❌ |

**Descripción**:
- Todos pueden cambiar su contraseña y datos personales
- Solo el **admin** puede crear/editar/eliminar otros usuarios

---

## 🔐 Implementación

### Frontend
Los controles se implementan mediante:
1. **usePermissions()** - Hook que verifica permisos
2. **Sidebar filtrado** - Oculta módulos según rol
3. **Botones condicionados** - Mostrar/ocultar botones de acción

Ejemplo:
```javascript
const { can, isAdmin } = usePermissions()

if (can('ESTADIA_EDIT')) {
  // Mostrar botón de editar
}
```

### Backend
Los controles se implementan mediante:
1. **permissions.php** - Definición de permisos
2. **verificarPermisoOAbortar()** - Valida permiso o rechaza solicitud
3. **obtenerRolActual()** - Obtiene rol del usuario

Ejemplo:
```php
verificarPermisoOAbortar('ESTADIA_EDIT');
// Si no tiene permiso, devuelve error 403
```

---

## 📱 Experiencia del Usuario

### 👨‍💼 ADMINISTRADOR VE:
- ✅ Todos los módulos: Dashboard, Estadías, Facturación, Tienda, Clientes, Inventario, Reportes, Perfil
- ✅ Todos los botones: crear, editar, eliminar, marcar pagado
- ✅ Acceso a análisis completos y configuración

### 📞 RECEPCIONISTA VE:
- ✅ Dashboard, Estadías, Facturación, Tienda, Clientes, Inventario, Perfil
- ❌ Reportes (módulo no visible en sidebar)
- ⚠️ Botones limitados:
  - Puede crear/cancelar estadías, pero NO editar
  - Puede generar facturas y marcar pagadas
  - Puede vender productos, pero NO editar inventario
  - Puede registrar clientes nuevos, pero NO editar existentes

---

## 🔄 Flujo de Trabajo Recomendado

### Día típico en el Hotel:

**Mañana - Recepcionista**:
1. Huésped llega → Crea estadía (check-in) en Gestión de Estadía
2. Huésped se registra → Crea cliente en Clientes
3. Huésped quiere comprar snacks → Registra venta en Tienda

**Tarde - Recepcionista**:
4. Huésped se va → Genera factura en Facturación
5. Huésped paga → Marca factura como "Pagada"
6. Sistema automático → Estadía pasa a "finalizada", habitación a "Mantenimiento"

**Noche - Administrador**:
7. Revisa reportes de ocupación e ingresos
8. Agrega nuevos productos al inventario
9. Edita datos de clientes si es necesario

---

## ⚙️ Cómo Agregar Nuevos Permisos

1. **Frontend (`src/utils/permissions.js`)**:
   ```javascript
   NUEVA_ACCION_CREAR: ['admin', 'receptionist']
   ```

2. **Backend (`permissions.php`)**:
   ```php
   'NUEVA_ACCION_CREAR' => [ROLE_ADMIN, ROLE_RECEPTIONIST],
   ```

3. **En tu componente/endpoint**:
   ```javascript
   const { can } = usePermissions()
   if (can('NUEVA_ACCION_CREAR')) { ... }
   ```

---

## 📝 Notas Importantes

- Los permisos se verifican **tanto en frontend como en backend**
- El backend siempre es la fuente de verdad (no confiar solo en frontend)
- Si un rol no tiene permiso, recibe error HTTP 403
- Los datos sensibles (reportes, análisis) nunca se envían a recepcionistas
