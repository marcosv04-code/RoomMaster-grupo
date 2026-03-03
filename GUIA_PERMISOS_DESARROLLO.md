# 🔐 GUÍA RÁPIDA - Implementar Permisos en Módulos

## Cómo Usar el Sistema de Permisos en Componentes React

### 1️⃣ Importar el Hook

```javascript
import { usePermissions } from '../../hooks/usePermissions'
```

### 2️⃣ Usar en tu Componente

```javascript
export default function MiComponente() {
  const { can, isAdmin, isReceptionist } = usePermissions()

  return (
    <div>
      {/* Mostrar botón solo si tiene permiso */}
      {can('MI_PERMISO') && (
        <button onClick={handleClick}>
          Hacer algo
        </button>
      )}

      {/* Mostrar solo para admin */}
      {isAdmin && (
        <div>
          Contenido solo para administrador
        </div>
      )}

      {/* Mostrar solo para recepcionista */}
      {isReceptionist && (
        <div>
          Contenido solo para recepcionista
        </div>
      )}
    </div>
  )
}
```

---

## Ejemplos por Módulo

### 📱 GESTIÓN DE ESTADIA

```javascript
import { usePermissions } from '../../hooks/usePermissions'

export default function GestionEstadiaPage() {
  const { can } = usePermissions()

  return (
    <>
      {/* Mostrar botón crear si tiene permiso */}
      {can('ESTADIA_CREATE') && (
        <button onClick={handleCrearEstadia}>+ Nueva Estadía</button>
      )}

      {/* Pasar permisos a la tabla */}
      <Table
        data={estadias}
        showEdit={can('ESTADIA_EDIT')}
        showDelete={can('ESTADIA_DELETE')}
        showCancel={can('ESTADIA_CANCEL')}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCancel={handleCancel}
      />
    </>
  )
}
```

### 💳 FACTURACIÓN

```javascript
import { usePermissions } from '../../hooks/usePermissions'

export default function FacturacionPage() {
  const { can } = usePermissions()

  return (
    <>
      {/* Recepcionista solo puede marcar pagada, no editar */}
      {can('FACTURACION_CREATE') && (
        <button onClick={handleGenerarFactura}>
          Generar Factura
        </button>
      )}

      {can('FACTURACION_MARK_PAID') && (
        <button onClick={handleMarcarPagada}>
          Marcar como Pagada
        </button>
      )}

      <Table
        data={facturas}
        showEdit={can('FACTURACION_EDIT')}
        showDelete={can('FACTURACION_DELETE')}
      />
    </>
  )
}
```

### 🛒 TIENDA

```javascript
import { usePermissions } from '../../hooks/usePermissions'

export default function TiendaPage() {
  const { can } = usePermissions()

  return (
    <>
      {/* Recepcionista vende productos */}
      {can('TIENDA_CREATE') && (
        <form onSubmit={handleRegistrarVenta}>
          {/* Formulario de venta */}
        </form>
      )}

      {/* Solo admin puede editar inventario */}
      <Table
        data={productos}
        showEdit={can('TIENDA_EDIT')}
        showDelete={can('TIENDA_DELETE')}
      />
    </>
  )
}
```

### 👥 CLIENTES

```javascript
import { usePermissions } from '../../hooks/usePermissions'

export default function ClientesPage() {
  const { can } = usePermissions()

  return (
    <>
      {/* Ambos pueden crear clientes */}
      {can('CLIENTES_CREATE') && (
        <button onClick={handleCrearCliente}>
          + Nuevo Cliente
        </button>
      )}

      <Table
        data={clientes}
        showEdit={can('CLIENTES_EDIT')}
        showDelete={can('CLIENTES_DELETE')}
      />
    </>
  )
}
```

### 📦 INVENTARIO

```javascript
import { usePermissions } from '../../hooks/usePermissions'

export default function InventarioPage() {
  const { can } = usePermissions()

  return (
    <>
      {/* Solo admin puede editar */}
      {can('INVENTARIO_EDIT') && (
        <button onClick={handleAgregarProducto}>
          + Agregar Producto
        </button>
      )}

      <Table
        data={inventario}
        showEdit={can('INVENTARIO_EDIT')}
        showDelete={can('INVENTARIO_DELETE')}
      />
    </>
  )
}
```

### 📊 REPORTES

```javascript
import { usePermissions } from '../../hooks/usePermissions'
import DashboardLayout from '../../components/layouts/DashboardLayout'

export default function ReportesPage() {
  const { canViewReportes } = usePermissions()

  // Si no tiene permiso, no renderizar nada
  // (También está controlado en Sidebar y ProtectedRoute)
  if (!canViewReportes) {
    return (
      <DashboardLayout>
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <h2>❌ No tienes acceso a los reportes</h2>
          <p>Solo los administradores pueden ver esta sección.</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      {/* Contenido de reportes */}
    </DashboardLayout>
  )
}
```

---

## Cómo Implementar en el Backend

### 1️⃣ Incluir el archivo de permisos

```php
<?php
require_once 'permissions.php';
require_once 'config.php';
// ... resto del código
```

### 2️⃣ Obtener el rol del usuario

```php
// Se obtiene de la sesión/JWT
$rol_usuario = obtenerRolActual(); // Retorna 'admin' o 'receptionist'
```

### 3️⃣ Verificar permiso antes de hacer la acción

```php
// Opción 1: Abortar si no tiene permiso
verificarPermisoOAbortar('ESTADIA_EDIT');
// Si no tiene permiso, devuelve HTTP 403 automáticamente

// Opción 2: Verificar y actuar
if (tienePermiso($rol_usuario, 'ESTADIA_DELETE')) {
  $conexion->query("DELETE FROM estadias WHERE id = $id");
} else {
  responder(false, 'No tienes permiso para eliminar estadías', null, 403);
}
```

### Ejemplo Completo - Editar Estadía

```php
<?php
require_once 'permissions.php';
require_once 'config.php';
require_once 'functions.php';
require_once 'cors.php';

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
  // Verificar que el usuario sea admin para editar
  verificarPermisoOAbortar('ESTADIA_EDIT');
  
  $datos = obtenerDatos();
  $id = escapar($conexion, $datos['id']);
  $numero_huespedes = escapar($conexion, $datos['numero_huespedes']);
  // ... resto de campos
  
  $sql = "UPDATE estadias SET numero_huespedes='$numero_huespedes' WHERE id='$id'";
  if ($conexion->query($sql)) {
    responder(true, 'Estadía actualizada', null);
  } else {
    responder(false, 'Error al actualizar', null, 500);
  }
}
?>
```

---

## 🎯 Checklist para Nuevas Funciones

Cuando agregues una nueva función/endpoint:

- [ ] Definir el permiso en `permissions.js` (frontend)
- [ ] Definir el permiso en `permissions.php` (backend)
- [ ] Importar `usePermissions()` en el componente React
- [ ] Usar `can('PERMISO')` para mostrar/ocultar UI
- [ ] Importar `permissions.php` en el endpoint PHP
- [ ] Usar `verificarPermisoOAbortar()` al inicio del endpoint
- [ ] Documentar en `SISTEMA_DE_PERMISOS.md`
- [ ] Probar como admin
- [ ] Probar como recepcionista

---

## Lista de Permisos Disponibles

```
DASHBOARD_VIEW
ESTADIA_VIEW, CREATE, EDIT, DELETE, CANCEL
FACTURACION_VIEW, CREATE, MARK_PAID, EDIT, DELETE
TIENDA_VIEW, CREATE, EDIT, DELETE
CLIENTES_VIEW, CREATE, EDIT, DELETE
INVENTARIO_VIEW, EDIT, DELETE
REPORTES_VIEW
PERFIL_EDIT_SELF, EDIT_OTHERS, DELETE
```

---

## 💡 Tips Importantes

1. **Frontend no es suficiente**: Siempre verificar permisos en el backend también
2. **Mensajes claros**: Si un usuario intenta acceder sin permiso, mostrar mensaje amable
3. **Sin acceso = No visible**: No mostrar botones que no pueden usar
4. **Consistencia**: Usar siempre los mismos nombres de permisos
5. **Documentación**: Actualizar `SISTEMA_DE_PERMISOS.md` al agregar nuevos permisos
