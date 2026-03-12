# 🏨 RoomMaster - Sistema de Gestión Hotelera
## Resumen Completo para Presentación SENA

---

## 📋 ÍNDICE
1. [Arquitectura General](#arquitectura-general)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Módulo de Autenticación](#módulo-de-autenticación)
4. [Módulo Dashboard](#módulo-dashboard)
5. [Módulo Gestión de Clientes](#módulo-gestión-de-clientes)
6. [Módulo Gestión de Habitaciones](#módulo-gestión-de-habitaciones)
7. [Módulo Tienda/Productos](#módulo-tiendaproductos)
8. [Módulo Ventas](#módulo-ventas)
9. [Módulo Facturación](#módulo-facturación)
10. [Módulo Inventario](#módulo-inventario)
11. [Módulo Reportes](#módulo-reportes)
12. [Base de Datos](#base-de-datos)
13. [Seguridad y Permisos](#seguridad-y-permisos)

---

## 🏗️ ARQUITECTURA GENERAL

### Patrón MVC (Model-View-Controller)

```
ROOMMASTER
├── FRONTEND (Capa de Presentación)
│   ├── Views (React Components)
│   ├── Controllers (Hooks personalizados)
│   ├── Models (Context API)
│   └── Services (API calls)
│
├── BACKEND (Lógica de Negocio)
│   ├── Models (funciones.php - abstracción de datos)
│   ├── Controllers (módulos específicos)
│   └── Routes (APIs RESTful)
│
└── DATABASE (Persistencia)
    └── MariaDB (13 tablas)
```

**Flujo:**
1. El usuario interactúa con la interfaz (View - React)
2. Se dispara un evento/acción (Controller - Hook/Event)
3. Se envía petición HTTP al backend (Service - Axios)
4. Backend procesa y consulta BD (Model - SQL)
5. Se retorna respuesta al frontend
6. Componente se actualiza (Re-render React)

---

## 💻 STACK TECNOLÓGICO

### Frontend
| Tecnología | Versión | Propósito |
|---|---|---|
| **React** | 18.3.1 | Framework principal |
| **Vite** | 5.4.21 | Bundler y dev server (construir y optimizar) |
| **React Router** | 6.30.3 | Navegación entre páginas |
| **Axios** | 1.7.2 | HTTP client (peticiones al backend) |
| **SweetAlert2** | 11.13.3 | Alertas y confirmaciones |
| **CSS Personalizado** | - | Estilos responsive |

### Backend
| Tecnología | Versión | Propósito |
|---|---|---|
| **PHP** | 7.4+ | Lenguaje servidor |
| **MySQLi** | - | Conexión a base de datos |
| **CORS** | - | Allow cross-origin requests |
| **JSON** | - | Comunicación API |

### Base de Datos
| Tecnología | Versión | Propósito |
|---|---|---|
| **MariaDB** | 10.4+ | Base de datos relacional |
| **phpMyAdmin** | - | Gestor de BD |

### Hosting
| Plataforma | Características |
|---|---|
| **Hostinger** | Servidor dedicado en roommaster.site |
| **Linux** | Sistema operativo servidor |

---

## 🔐 MÓDULO DE AUTENTICACIÓN

### Ubicación
- **Frontend**: `/frontend/src/pages/auth/`
- **Backend**: `/backend/login.php`, `/backend/register.php`

### Funciones Principales

#### 1. **Login** (Autenticación)
```php
// Backend - login.php
FUNCION: validarCredenciales()
- Recibe: email, contraseña
- Verifica credenciales contra tabla 'usuarios'
- Valida rol y estado del usuario
- Retorna: token, usuario, permisos (JSON)

VALIDACIONES:
- Email existe en BD
- Contraseña correcta (hash SHA256)
- Usuario está activo
- Rol es válido (admin/recepcionista)
```

#### 2. **Register** (Registro de Nuevos Usuarios)
```php
// Backend - register.php
FUNCION: crearUsuario()
- Recibe: nombre, email, contraseña, rol
- Valida email único
- Hashea contraseña
- Inserta en tabla 'usuarios'
- Retorna: confirmación y datos de usuario
```

#### 3. **Gestión de Sesión**
```jsx
// Frontend - AuthContext.jsx
CONTEXTO: AuthContext
- Almacena: usuario actual, token, rol
- Proporciona: login(), logout(), isAuthenticated()
- Persiste en localStorage
- Usado por: ProtectedRoute (prototección de rutas)

COMPONENTE: ProtectedRoute
- Verifica si usuario está autenticado
- Redirige a login si no está autenticado
- Valida permisos por rol
```

### Librerías Usadas
- **SHA256**: Hasheo de contraseñas
- **LocalStorage**: Persistencia de sesión
- **React Context**: Gestión de estado global

### Endpoints (API)
```
POST /backend/login.php
- Body: { email, contraseña }
- Response: { success, usuario, token, permisos }

POST /backend/register.php
- Body: { nombre, email, contraseña, telefono, rol }
- Response: { success, usuario_id }
```

---

## 📊 MÓDULO DASHBOARD

### Ubicación
- **Frontend**: `/frontend/src/pages/dashboard/DashboardPage.jsx`
- **Backend**: `/backend/dashboard_stats.php`

### Funciones Principales

#### 1. **Estadísticas Generales**
```js
FUNCIÓN: obtenerEstadísticas()
- Total de clientes registrados
- Total de habitaciones disponibles/ocupadas
- Ingresos del mes actual
- Reservas activas
- Productos en bajo stock
```

#### 2. **Gestión de Usuarios** (Admin Only)
```jsx
COMPONENTE: UserManagementTable
FUNCIONES:
- Listar todos los usuarios (tabla)
- Toggle de visibilidad de contraseña (SVG eye icon)
  * Implementación: useState(mostrarPassword)
  * Visual: Ícono azul (visible) / gris (oculto)
  
- Activar/Desactivar usuario (solo admin)
  * Estado: 'activo' / 'inactivo'
  * Botón azul (inactivo) / rojo (activo)
  * Petición: PATCH /backend/usuarios.php
  
- Eliminar usuario (solo admin)
  * Confirmación SweetAlert2
  * Petición: DELETE /backend/usuarios.php
  * Protección: No permite borrar admin logueado
```

#### 3. **Estadísticas en Tiempo Real**
```jsx
HOOKS USADOS:
- useEffect(): Cargar datos al montar
- useState(): Gestionar estado de datos
- useAuth(): Obtener rol del usuario actual
- usePermissions(): Validar permisos de admin
```

### Backend Functions
```php
// dashboard_stats.php
function obtenerEstadísticas() {
    // COUNT de tablas
    // SUM de precios
    // Validaciones de permisos
    // Retorna JSON
}

// usuarios.php (PATCH - actualizar estado)
function actualizarEstado() {
    UPDATE usuarios SET estado = 'activo'|'inactivo'
}

// usuarios.php (DELETE - eliminar usuario)
function eliminarUsuario() {
    DELETE FROM usuarios WHERE id = ?
    DELETE FROM actividades WHERE usuario_id = ? (cascada)
}
```

### Métodos HTTP Utilizados
| Método | Endpoint | Propósito |
|---|---|---|
| GET | `/backend/dashboard_stats.php` | Obtener estadísticas |
| GET | `/backend/usuarios.php` | Listar usuarios |
| PATCH | `/backend/usuarios.php` | Activar/desactivar |
| DELETE | `/backend/usuarios.php` | Eliminar usuario |

### Librerías Usadas
- **SweetAlert2**: Confirmaciones elegantes
- **React Context**: Estado global del usuario
- **Axios**: Peticiones HTTP

---

## 👥 MÓDULO GESTIÓN DE CLIENTES

### Ubicación
- **Frontend**: `/frontend/src/pages/clientes/ClientesPage.jsx`
- **Backend**: `/backend/clientes.php`

### Funciones Principales

#### 1. **Listar Clientes**
```jsx
FUNCIÓN: obtenerClientes()
- GET /backend/clientes.php
- Retorna array de todos los clientes
- Campos: id, nombre, email, teléfono, documento
```

#### 2. **Búsqueda/Filtrado Avanzado**
```jsx
COMPONENTE: SearchBar
BÚSQUEDA EN TIEMPO REAL sobre:
- Nombre
- Email
- Número de documento
- Teléfono
- Ciudad

IMPLEMENTACIÓN:
const [busqueda, setBusqueda] = useState('')
const clientesFiltrados = clientes.filter(c =>
    c.nombre.toLowerCase().includes(busqueda) ||
    c.email?.toLowerCase().includes(busqueda) ||
    c.documento_identidad?.includes(busqueda) ||
    c.telefono?.includes(busqueda) ||
    c.ciudad?.toLowerCase().includes(busqueda)
)

RESULTADO: Display dinámico de coincidencias
```

#### 3. **CRUD de Clientes**
```php
// Backend - clientes.php

GET /clientes.php
- Retorna: SELECT * FROM clientes

POST /clientes.php
- Recibe: nombre, email, teléfono, documento, tipo_documento
- Validaciones: Email único, documento válido
- Crea nuevo cliente

PUT /clientes.php?id=X
- Actualiza datos del cliente
- Validaciones UNIQUE en email

DELETE /clientes.php?id=X
- Elimina cliente
- Cascada: Elimina estadías relacionadas
```

#### 4. **Validaciones**
```js
- Email válido y único
- Teléfono formato correcto
- Documento de identidad requerido
- Nombre requerido
```

### Campos de la Tabla
| Campo | Tipo | Propósito |
|---|---|---|
| id | INT | Identificador único |
| nombre | VARCHAR | Nombre completo |
| email | VARCHAR | Email único |
| teléfono | VARCHAR | Contacto |
| documento_identidad | VARCHAR | Cédula/Pasaporte |
| tipo_documento | VARCHAR | cedula/pasaporte/nit |
| país | VARCHAR | País de origen |
| ciudad | VARCHAR | Ciudad actual |
| dirección | VARCHAR | Dirección física |
| estado | VARCHAR | activo/inactivo |
| fecha_registro | DATETIME | Fecha de creación |

### Endpoints
```
GET /backend/clientes.php
POST /backend/clientes.php
PUT /backend/clientes.php?id=X
DELETE /backend/clientes.php?id=X
```

---

## 🛏️ MÓDULO GESTIÓN DE HABITACIONES

### Ubicación
- **Frontend**: `/frontend/src/pages/dashboard/DashboardPage.jsx` (Rooms Tab)
- **Backend**: `/backend/habitaciones.php`

### Funciones Principales

#### 1. **Listar Habitaciones**
```jsx
FUNCIÓN: obtenerHabitaciones()
- GET /backend/habitaciones.php
- Muestra: número, piso, tipo, capacidad, precio, estado
```

#### 2. **Estados de Habitación**
```
Estados posibles:
- 'disponible' (Verde) - Se puede reservar
- 'ocupada' (Rojo) - Huésped hospedado
- 'mantenimiento' (Amarillo) - No disponible
```

#### 3. **Crear Habitación**
```jsx
VALIDACIONES EN FRONTEND:
- Número de habitación único
- Piso: SOLO NÚMEROS, máximo 2 dígitos (00-99)
  * Implementación: filterOnlyNumbers(value).slice(0, 2)
  * HTML: <input max="99" />
  
- Tipo: select (simple, doble, suite, deluxe)
- Capacidad: número entre 1-10
- Precio: número decimal positivo

PETICIÓN:
POST /backend/habitaciones.php
Body: {
    numero_habitacion,
    piso,
    tipo,
    capacidad,
    precio_noche,
    estado
}
```

#### 4. **Editar Habitación**
```php
PUT /backend/habitaciones.php?id=X
- Actualiza todos los campos
- Validaciones iguales a creación
```

#### 5. **Eliminar Habitación**
```php
DELETE /backend/habitaciones.php?id=X
- Verifica que no tenga estadías activas
- Si hay estadías canceladas, mueve a estado 'mantenimiento'
- Si no hay estadías, elimina completamente
```

### Campos de la Tabla
| Campo | Tipo | Propósito |
|---|---|---|
| id | INT | Identificador (60-69 en Hostinger) |
| numero_habitacion | VARCHAR | 101, 102, 201, 301, etc |
| piso | INT | 1, 2, 3, etc (validado a 2 dígitos) |
| tipo | VARCHAR | simple/doble/suite/deluxe |
| capacidad | INT | Número de personas |
| precio_noche | DECIMAL | Precio por noche de hospedaje |
| amenidades | VARCHAR | TV, AC, WiFi, Minibar, etc |
| estado | VARCHAR | disponible/ocupada/mantenimiento |
| descripcion | TEXT | Descripción adicional |
| activa | BOOLEAN | TRUE/FALSE |
| fecha_creacion | DATETIME | Auto timestamp |

### Validaciones Frontend
```jsx
// filterOnlyNumbers + slice
const validarPiso = (value) => {
    return value.replace(/[^0-9]/g, '').slice(0, 2)
}

// Resultado: "abc123def" → "12"
// Resultado: "999" → "99"
```

### Endpoints
```
GET /backend/habitaciones.php
POST /backend/habitaciones.php
PUT /backend/habitaciones.php?id=X
DELETE /backend/habitaciones.php?id=X
```

---

## 🛒 MÓDULO TIENDA/PRODUCTOS

### Ubicación
- **Frontend**: `/frontend/src/pages/tienda/TiendaPage.jsx`
- **Backend**: `/backend/productos.php`

### Funciones Principales

#### 1. **Listar Productos**
```jsx
FUNCIÓN: obtenerProductos()
- GET /backend/productos.php
- Muestra: nombre, descripción, precio, stock, categoría
```

#### 2. **Categorías de Productos**
```
Categorías predefinidas:
- 'bebidas' - Jugos, refrescos, cerveza, vino
- 'comidas' - Snacks, sandwiches, postres
- 'servicios' - Masaje, room service, lavandería
- 'amenities' - Artículos de aseo personal
```

#### 3. **Crear Producto**
```jsx
FUNCIÓN: crearProducto()
POST /backend/productos.php

CAMPOS:
- nombre: VARCHAR (requerido)
- descripción: TEXT
- precio: DECIMAL (positivo)
- stock: INT (cantidad disponible)
- categoria: ENUM (bebidas/comidas/servicios/amenities)
- codigo_producto: VARCHAR (único)

VALIDACIONES:
- Nombre no vacío
- Precio > 0
- Stock >= 0
- Código único
```

#### 4. **Actualizar Producto**
```php
PUT /backend/productos.php?id=X
- Actualiza campos excepto código
- Validaciones iguales
```

#### 5. **Eliminar Producto** ⚠️ FUNCIÓN CRITICA
```php
DELETE /backend/productos.php?id=X

PROCESO:
1. Verificar permiso: Solo ADMIN (validado en backend)
2. Eliminar registros de inventario relacionados
   DELETE FROM inventario WHERE producto_id = X
3. Eliminar producto
   DELETE FROM productos WHERE id = X
4. Retornar confirmación

RESPUESTA:
{ success: true, message: "Producto eliminado y registros de inventario limpiados" }
```

#### 6. **Gestión de Stock**
```php
TABLA: inventario

CAMPOS:
- producto_id (FK)
- cantidad_actual (INT)
- fecha_actualizacion (DATETIME)

ACTUALIZACIONES:
- Cuando se crea una venta: stock -= cantidad
- Cuando se devuelve producto: stock += cantidad
- Stock nunca puede ser < 0
```

### Campos de la Tabla
| Campo | Tipo | Propósito |
|---|---|---|
| id | INT | Identificador |
| nombre | VARCHAR | Nombre del producto |
| descripción | TEXT | Detalles |
| precio | DECIMAL | Precio unitario |
| stock | INT | Cantidad disponible |
| categoria | VARCHAR | Clasificación |
| codigo_producto | VARCHAR | Código único |
| activo | BOOLEAN | Disponible |
| fecha_creacion | DATETIME | Timestamp |

### Endpoints
```
GET /backend/productos.php
POST /backend/productos.php
PUT /backend/productos.php?id=X
DELETE /backend/productos.php?id=X (ADMIN ONLY)
```

---

## 💳 MÓDULO VENTAS

### Ubicación
- **Frontend**: `/frontend/src/pages/tienda/TiendaPage.jsx` (Ventas Tab)
- **Backend**: `/backend/ventas.php`

### Funciones Principales

#### 1. **Crear Venta**
```jsx
FUNCIÓN: crearVenta()
POST /backend/ventas.php

CAMPOS:
- habitacion_id: ID del huésped/habitación (opcional)
- cliente_id: ID del cliente
- producto_id: Producto vendido
- cantidad: Cantidad vendida
- precio_unitario: Precio en ese momento
- metodo_pago: 'efectivo' / 'tarjeta' / 'otro'
- notas: Observaciones

VALIDACIONES:
1. Producto existe
2. STOCK INSUFICIENTE - Sistema dual:
   a) Busca en tabla 'inventario'
   b) Si no existe, busca en 'productos.stock'
   
3. Precio positivo
4. Cantidad > 0
```

#### 2. **Validación de Stock (DUAL-SOURCE)** ⭐ CRITICA
```php
// Backend - ventas.php

// Paso 1: Buscar en tabla inventario (prioridad)
$sql_inv = "SELECT cantidad_actual FROM inventario 
            WHERE producto_id = $producto_id";
$inv_result = $conexion->query($sql_inv);
$inv_fila = $inv_result->fetch_assoc();

// Paso 2: Si no existe en inventario, buscar en productos
$sql_prod = "SELECT stock FROM productos 
             WHERE id = $producto_id";
$prod_result = $conexion->query($sql_prod);
$prod_fila = $prod_result->fetch_assoc();

// Paso 3: Determinar stock disponible
$stock_disponible = $inv_fila ? $inv_fila['cantidad_actual'] : 
                               $prod_fila['stock'];

// Paso 4: Validar cantidad
if ($stock_disponible < $cantidad) {
    responder(false, 'Stock insuficiente. Disponible: ' . $stock_disponible, null, 400);
}
```

#### 3. **Rebajar Stock**
```php
// IMPORTANTE: Rebajar del origen correcto

if ($inv_fila) {
    // Si existe en inventario, rebajar del inventario
    UPDATE inventario SET cantidad_actual -= $cantidad 
    WHERE producto_id = $producto_id
} else {
    // Si no, rebajar de productos
    UPDATE productos SET stock -= $cantidad 
    WHERE id = $producto_id
}
```

#### 4. **Registrar Venta en Base de Datos**
```php
INSERT INTO ventas (
    cliente_id, 
    producto_id, 
    cantidad, 
    precio_unitario, 
    subtotal, 
    impuesto, 
    total, 
    metodo_pago, 
    estado, 
    fecha_venta
) VALUES (...)

ESTADO VENTA: 'completada' / 'pendiente' / 'cancelada'
```

#### 5. **Devoluciones**
```php
FUNCIÓN: devolverProducto()
PATCH /backend/ventas.php?id=X

PROCESO:
1. Obtener información de venta original
2. Revertir stock al origen correcto
3. Cambiar estado venta a 'devuelto'
4. Crear nota en auditoría
```

### Campos de la Tabla Ventas
| Campo | Tipo | Propósito |
|---|---|---|
| id | INT | Identificador |
| cliente_id | INT | FK Cliente |
| producto_id | INT | FK Producto |
| cantidad | INT | Unidades vendidas |
| precio_unitario | DECIMAL | Precio en momento venta |
| subtotal | DECIMAL | cantidad * precio |
| impuesto | DECIMAL | IVA (19% típico) |
| total | DECIMAL | subtotal + impuesto |
| metodo_pago | VARCHAR | efectivo/tarjeta/otro |
| estado | VARCHAR | completada/pendiente/cancelada |
| notas | TEXT | Observaciones |
| fecha_venta | DATETIME | Timestamp venta |

### Endpoints
```
GET /backend/ventas.php
POST /backend/ventas.php
PATCH /backend/ventas.php?id=X (devolver)
DELETE /backend/ventas.php?id=X (cancelar)
```

### Diagrama Flujo Stock
```
CREAR VENTA
    ↓
¿Stock en inventario? 
    ├─ SÍ → Usar inventario.cantidad_actual
    └─ NO → Usar productos.stock
    ↓
¿Cantidad disponible >= cantidad solicitada?
    ├─ SÍ → Proceder
    └─ NO → Error "Stock insuficiente"
    ↓
REBAJAR STOCK del origen correcto
    ↓
REGISTRAR VENTA
    ↓
Retornar confirmación ✓
```

---

## 📄 MÓDULO FACTURACIÓN

### Ubicación
- **Frontend**: `/frontend/src/pages/facturacion/FacturacionPage.jsx`
- **Backend**: `/backend/facturas.php`

### Funciones Principales

#### 1. **Generar Factura**
```jsx
FUNCIÓN: crearFactura()
POST /backend/facturas.php

CAMPOS:
- numero_factura: FAC-001, FAC-002, etc (auto-generado)
- estadia_id: FK Estadía (FK)
- cliente_id: FK Cliente (FK)
- subtotal: DECIMAL (suma de items)
- impuesto: DECIMAL (IVA 19%)
- total: DECIMAL (subtotal + impuesto)
- estado: 'Pagada' / 'Pendiente' / 'Anulada'
- metodo_pago: 'efectivo' / 'tarjeta' / 'transferencia' / NULL
- fecha_factura: DATETIME (actual)
- fecha_pago: DATETIME (opcional)
```

#### 2. **Validaciones**
```js
- Estadía asociada existe
- Cliente existe
- Subtotal > 0
- Números únicos no repetidos
- Solo usuarios autorizados pueden crear
```

#### 3. **Numeración Automática**
```php
FUNCIÓN: generarNumeroFactura()

// Obtener último número
$sql = "SELECT numero_factura FROM facturas 
        ORDER BY id DESC LIMIT 1";
$resultado = $conexion->query($sql);
$fila = $resultado->fetch_assoc();

// Extraer número
$ultimoNumero = (int)str_replace('FAC-', '', $fila['numero_factura']);
$nuevoNumero = str_pad($ultimoNumero + 1, 3, '0', STR_PAD_LEFT);
$numeroFactura = 'FAC-' . $nuevoNumero;

// Resultado: FAC-001, FAC-002, FAC-003...
```

#### 4. **Actualizar Estado Factura**
```php
PUT /backend/facturas.php?id=X

TRANSITIONS:
- Pendiente → Pagada (registrar fecha_pago)
- Cualquier → Anulada (registrar motivo en notas)
- NO: Pagada → Pendiente (transacción completada)
```

#### 5. **Reporte de Facturas**
```jsx
FILTROS:
- Por rango de fechas
- Por cliente
- Por estado
- Por método de pago

CÁLCULOS:
- Total ingresos período
- Facturas pagadas
- Facturas pendientes
- Promedio por factura
```

### Campos de la Tabla
| Campo | Tipo | Propósito |
|---|---|---|
| id | INT | Identificador |
| numero_factura | VARCHAR | FAC-001 (único) |
| estadia_id | INT | FK Estadía |
| cliente_id | INT | FK Cliente |
| subtotal | DECIMAL | Base gravable |
| impuesto | DECIMAL | IVA aplicado |
| total | DECIMAL | Subtotal + impuesto |
| estado | VARCHAR | Pagada/Pendiente/Anulada |
| metodo_pago | VARCHAR | Como se pagó |
| fecha_factura | DATETIME | Cuando se creó |
| fecha_pago | DATETIME | Cuando se pagó (si aplica) |
| notas | TEXT | Observaciones |

### Endpoints
```
GET /backend/facturas.php
GET /backend/facturas.php?id=X (detalle)
POST /backend/facturas.php
PUT /backend/facturas.php?id=X
DELETE /backend/facturas.php?id=X
```

---

## 📦 MÓDULO INVENTARIO

### Ubicación
- **Frontend**: `/frontend/src/pages/inventario/InventarioPage.jsx`
- **Backend**: `/backend/inventario.php`, `/backend/inventario_habitaciones.php`

### Funciones Principales

#### 1. **Inventario de Productos (General)**
```jsx
TABLA: inventario

CAMPOS:
- producto_id (FK)
- cantidad_actual (INT)
- cantidad_minima (INT)
- cantidad_maxima (INT)
- fecha_actualizacion (DATETIME)

FUNCIONES:
- Ver stock actual de cada producto
- Alertas si cantidad_actual < cantidad_minima
- Historial de movimientos
```

#### 2. **Inventario de Habitaciones (Por Suministros)**
```jsx
TABLA: inventario_habitaciones

CAMPOS:
- id (PK)
- habitacion_id (FK)
- suministro_id (FK)
- cantidad_actual (INT)
- cantidad_estandar (INT)
- fecha_actualizacion (DATETIME)

PROPÓSITO:
Rastrear suministros en cada habitación:
- Toallas (cantidad_estandar: 3)
- Sábanas (cantidad_estandar: 2)
- Almohadas (cantidad_estandar: 1)
- Etc.

EJEMPLO DATA (Habitación 101 - ID 60):
- (60, 7, 2, 2) → 2 de 2 sábanas
- (60, 8, 3, 3) → 3 de 3 toallas
- (60, 9, 2, 2) → 2 de 2 toallas mano
```

#### 3. **Listar Inventario**
```jsx
GET /backend/inventario.php
GET /backend/inventario_habitaciones.php

RETORNA:
[
  {
    habitacion_id: 60,
    numero_habitacion: "101",
    suministros: [
      { suministro_id: 7, nombre: "Sábanas", cantidad: 2, estandar: 2 },
      { suministro_id: 8, nombre: "Toallas", cantidad: 3, estandar: 3 }
    ]
  },
  ...
]
```

#### 4. **Actualizar Stock**
```php
PUT /backend/inventario.php?producto_id=X

Body: { cantidad_actual, cantidad_minima, cantidad_maxima }

VALIDACIONES:
- cantidad_actual >= 0
- cantidad_minima < cantidad_maxima
- cantidad_actual <= cantidad_maxima
```

#### 5. **Actualizar Suministros Habitación**
```php
PUT /backend/inventario_habitaciones.php?id=X

Body: { cantidad_actual }

VALIDACIONES:
- cantidad_actual >= 0
- cantidad_actual <= cantidad_estandar + 10 (margen)

TRIGGERS:
- Si cantidad < cantidad_estandar → Alerta para reposición
- Registra en log de cambios
```

#### 6. **Alertas de Stock Bajo**
```jsx
FUNCIÓN: verificarStockBajo()

LÓGICA:
Cada producto/suministro con:
cantidad_actual < cantidad_minima → ALERTA

DISPLAY:
- Badge rojo en inventario
- Notificación en dashboard
- Reporte prioritario
```

### Suministros Disponibles (En BD Hostinger)
| ID | Nombre | Tipo |
|---|---|---|
| 7 | Sábanas blancas | Ropa cama |
| 8 | Toallas de baño | Textiles |
| 9 | Toallas de mano | Textiles |
| 10 | Desinfectante multiusos | Limpieza |
| 11 | Papel higiénico | Limpieza |
| 12 | Champú y jabón | Higiene |
| 13 | Almohadas | Ropa cama |
| 14 | Mantas | Ropa cama |

### Endpoints
```
GET /backend/inventario.php
GET /backend/inventario_habitaciones.php
PUT /backend/inventario.php?producto_id=X
PUT /backend/inventario_habitaciones.php?id=X
POST /backend/inventario.php
POST /backend/inventario_habitaciones.php
```

---

## 📊 MÓDULO REPORTES

### Ubicación
- **Frontend**: `/frontend/src/pages/reportes/ReportesPage.jsx`
- **Backend**: `/backend/reportes.php`

### Reportes Disponibles

#### 1. **Reporte de Ocupación**
```jsx
FILTROS:
- Rango de fechas
- Tipo de habitación
- Estado

DATOS MOSTRADOS:
- Total habitaciones: 10
- Ocupadas: X
- Disponibles: Y
- Mantenimiento: Z
- % Ocupación
- Ingresos por ocupación
```

#### 2. **Reporte de Ventas**
```jsx
FILTROS:
- Rango de fechas
- Categoría producto
- Método de pago

CÁLCULOS:
- Total vendido
- Cantidad de transacciones
- Promedio por venta
- Producto más vendido
- Ganancias netas (total - costo)
```

#### 3. **Reporte de Clientes**
```jsx
FILTROS:
- Nuevos vs Recurrentes
- Por ciudad
- Por tipo documento

DATOS:
- Total clientes
- Clientes activos/inactivos
- Estadías por cliente
- Gasto promedio cliente
```

#### 4. **Reporte de Facturas**
```jsx
FILTROS:
- Estado: Pagada/Pendiente/Anulada
- Rango de fechas
- Método de pago

CÁLCULOS:
- Total facturado
- Total cobrado
- Total pendiente
- % Morosidad
```

#### 5. **Reporte de Inventario**
```jsx
FILTROS:
- Stock bajo
- Por categoría
- Por habitación

ALERTAS:
- Productos para reabastecer
- Suministros faltantes
- Stock crítico
```

### Funciones Backend
```php
// reportes.php

function reporteOcupacion($fecha_inicio, $fecha_fin) {
    SELECT COUNT(*) as total,
           SUM(CASE WHEN estado = 'ocupada' THEN 1 ELSE 0 END) as ocupadas,
           SUM(CASE WHEN estado = 'disponible' THEN 1 ELSE 0 END) as disponibles
    FROM habitaciones
}

function reporteVentas($fecha_inicio, $fecha_fin) {
    SELECT COUNT(*) as cantidad,
           SUM(total) as total,
           AVG(total) as promedio
    FROM ventas
    WHERE fecha_venta BETWEEN fecha_inicio AND fecha_fin
}

function reporteClientesTop() {
    SELECT cliente_id, COUNT(*) as estadias, SUM(cantidad_gasto)
    FROM estadias
    GROUP BY cliente_id
    ORDER BY SUM(cantidad_gasto) DESC
    LIMIT 10
}
```

### Endpoints
```
GET /backend/reportes.php?tipo=ocupacion&desde=2026-03-01&hasta=2026-03-31
GET /backend/reportes.php?tipo=ventas&desde=2026-03-01&hasta=2026-03-31
GET /backend/reportes.php?tipo=clientes
GET /backend/reportes.php?tipo=facturas&estado=Pendiente
GET /backend/reportes.php?tipo=inventario&categoria=productos
```

---

## 🗄️ BASE DE DATOS

### Arquitectura

```
ROOMMASTER DATABASE (u754245691_db_90IMt5ZM)
│
├── 📋 TABLAS USUARIO & ACCESO (3)
│   ├── usuarios (admin, recepcionistas)
│   ├── actividades (auditoría)
│   └── permissions (roles y permisos)
│
├── 👥 TABLAS CLIENTE (1)
│   └── clientes (hospedados)
│
├── 🛏️ TABLAS HOSPEDAJE (2)
│   ├── habitaciones (habitaciones del hotel)
│   └── estadias (reservas/hospedajes)
│
├── 🛍️ TABLAS COMERCIO (3)
│   ├── productos (tienda)
│   ├── ventas (transacciones)
│   └── facturas (facturas emitidas)
│
├── 📦 TABLAS INVENTARIO (2)
│   ├── inventario (stock productos)
│   └── inventario_habitaciones (suministros por cuarto)
│
├── 🧹 TABLAS OPERATIVAS (1)
│   ├── suministros (tipos de suministros)
│   └── personal_limpieza (staff limpieza)
│
└── 📊 TABLA REPORTES (1)
    └── (reportes generados por queries)
```

### Tablas Detalladas

#### 1. **USUARIOS**
```sql
CREATE TABLE usuarios (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  contraseña VARCHAR(255) NOT NULL, -- SHA256
  rol VARCHAR(50) NOT NULL DEFAULT 'recepcionista', -- admin, recepcionista
  telefono VARCHAR(20),
  hotel VARCHAR(100),
  estado VARCHAR(20) DEFAULT 'activo', -- activo, inactivo
  fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
  fecha_modificacion DATETIME ON UPDATE CURRENT_TIMESTAMP
);
```

#### 2. **CLIENTES**
```sql
CREATE TABLE clientes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100),
  telefono VARCHAR(20),
  documento_identidad VARCHAR(50),
  tipo_documento VARCHAR(20), -- cedula, pasaporte, nit
  pais VARCHAR(50),
  ciudad VARCHAR(50),
  direccion VARCHAR(200),
  estado VARCHAR(20) DEFAULT 'activo',
  fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### 3. **HABITACIONES**
```sql
CREATE TABLE habitaciones (
  id INT PRIMARY KEY AUTO_INCREMENT,
  numero_habitacion VARCHAR(20) UNIQUE NOT NULL, -- 101, 102, etc
  piso INT, -- piso del hotel (0-99, máx 2 dígitos)
  tipo VARCHAR(50) NOT NULL, -- simple, doble, suite, deluxe
  capacidad INT NOT NULL,
  precio_noche DECIMAL(10, 2) NOT NULL,
  amenidades VARCHAR(255),
  estado VARCHAR(20) DEFAULT 'disponible', -- disponible, ocupada, mantenimiento
  descripcion TEXT,
  activa BOOLEAN DEFAULT TRUE,
  fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### 4. **ESTADÍAS**
```sql
CREATE TABLE estadias (
  id INT PRIMARY KEY AUTO_INCREMENT,
  cliente_id INT NOT NULL,
  habitacion_id INT NOT NULL,
  fecha_entrada DATE NOT NULL,
  fecha_salida DATE NOT NULL,
  numero_huespedes INT NOT NULL,
  estado VARCHAR(20) DEFAULT 'activa', -- activa, completada, cancelada
  notas TEXT,
  precio_total DECIMAL(10, 2),
  numero_noches INT,
  fecha_reserva DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
  FOREIGN KEY (habitacion_id) REFERENCES habitaciones(id) ON DELETE CASCADE
);
```

#### 5. **PRODUCTOS**
```sql
CREATE TABLE productos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10, 2) NOT NULL,
  stock INT DEFAULT 0,
  categoria VARCHAR(50), -- bebidas, comidas, servicios, amenities
  codigo_producto VARCHAR(50) UNIQUE,
  activo BOOLEAN DEFAULT TRUE,
  fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### 6. **VENTAS** ⭐
```sql
CREATE TABLE ventas (
  id INT PRIMARY KEY AUTO_INCREMENT,
  cliente_id INT NOT NULL,
  producto_id INT NOT NULL,
  cantidad INT NOT NULL,
  precio_unitario DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  impuesto DECIMAL(10, 2),
  total DECIMAL(10, 2) NOT NULL,
  metodo_pago VARCHAR(50), -- efectivo, tarjeta, otro
  estado VARCHAR(20) DEFAULT 'completada', -- completada, pendiente, cancelada
  notas TEXT,
  fecha_venta DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
  FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
);
```

#### 7. **FACTURAS**
```sql
CREATE TABLE facturas (
  id INT PRIMARY KEY AUTO_INCREMENT,
  numero_factura VARCHAR(50) UNIQUE NOT NULL, -- FAC-001, FAC-002
  estadia_id INT,
  cliente_id INT NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  impuesto DECIMAL(10, 2),
  total DECIMAL(10, 2) NOT NULL,
  estado VARCHAR(20) DEFAULT 'Pendiente', -- Pagada, Pendiente, Anulada
  metodo_pago VARCHAR(50),
  fecha_factura DATETIME DEFAULT CURRENT_TIMESTAMP,
  fecha_pago DATETIME,
  notas TEXT,
  
  FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
  FOREIGN KEY (estadia_id) REFERENCES estadias(id) ON DELETE SET NULL
);
```

#### 8. **INVENTARIO**
```sql
CREATE TABLE inventario (
  id INT PRIMARY KEY AUTO_INCREMENT,
  producto_id INT NOT NULL UNIQUE,
  cantidad_actual INT DEFAULT 0,
  cantidad_minima INT DEFAULT 5,
  cantidad_maxima INT DEFAULT 100,
  fecha_actualizacion DATETIME ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
);
```

#### 9. **INVENTARIO_HABITACIONES**
```sql
CREATE TABLE inventario_habitaciones (
  id INT PRIMARY KEY AUTO_INCREMENT,
  habitacion_id INT NOT NULL,
  suministro_id INT NOT NULL,
  cantidad_actual INT DEFAULT 0,
  cantidad_estandar INT DEFAULT 0,
  fecha_actualizacion DATETIME ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (habitacion_id) REFERENCES habitaciones(id) ON DELETE CASCADE,
  FOREIGN KEY (suministro_id) REFERENCES suministros(id) ON DELETE CASCADE,
  UNIQUE KEY (habitacion_id, suministro_id)
);
```

#### 10. **SUMINISTROS**
```sql
CREATE TABLE suministros (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  tipo VARCHAR(50), -- ropa cama, textiles, limpieza, higiene
  codigo_suministro VARCHAR(50) UNIQUE,
  descripcion TEXT,
  activo BOOLEAN DEFAULT TRUE
);
```

### Relaciones (Foreign Keys)
```
estadias → (cliente_id) clientes
estadias → (habitacion_id) habitaciones
ventas → (cliente_id) clientes
ventas → (producto_id) productos
facturas → (cliente_id) clientes
facturas → (estadia_id) estadias
inventario → (producto_id) productos
inventario_habitaciones → (habitacion_id) habitaciones
inventario_habitaciones → (suministro_id) suministros
```

### Índices Principales
```sql
-- Para búsquedas rápidas
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_clientes_email ON clientes(email);
CREATE INDEX idx_clientes_documento ON clientes(documento_identidad);
CREATE INDEX idx_habitaciones_numero ON habitaciones(numero_habitacion);
CREATE INDEX idx_estadias_cliente ON estadias(cliente_id);
CREATE INDEX idx_estadias_habitacion ON estadias(habitacion_id);
CREATE INDEX idx_ventas_cliente ON ventas(cliente_id);
CREATE INDEX idx_ventas_producto ON ventas(producto_id);
CREATE INDEX idx_facturas_cliente ON facturas(cliente_id);
CREATE INDEX idx_facturas_numero ON facturas(numero_factura);
```

---

## 🔐 SEGURIDAD Y PERMISOS

### Sistema de Permisos

```
ROLES DISPONIBLES:
├── ADMIN
│   ├── Ver todos los usuarios
│   ├── Crear/Editar/Eliminar usuarios
│   ├── Activar/Desactivar usuarios
│   ├── Ver dashboard estadísticas
│   ├── Eliminar productos ⭐
│   ├── Ver todos los reportes
│   └── Acceso a configuración
│
└── RECEPCIONISTA
    ├── Ver/Crear clientes
    ├── Ver/Crear/Editar habitaciones
    ├── Ver/Crear estadías
    ├── Ver/Crear ventas
    ├── Ver/Crear facturas
    ├── Ver inventario (solo lectura)
    └── NO puede eliminar productos
```

### Funciones de Seguridad

#### 1. **Validación de Permisos en Backend** ⭐ CRITICA
```php
// functions.php
function validarPermiso($permiso_requerido) {
    // 1. Verificar JWT/token
    // 2. Obtener rol del usuario autenticado
    // 3. Validar que rol tiene permiso
    // 4. Retornar true/false
}

// ejemplos en usuarios.php
if (!validarPermiso('USUARIOS_MANAGE')) {
    responder(false, 'Acceso denegado', null, 403);
    exit;
}

// En productos.php para DELETE
if (!validarPermiso('PRODUCTOS_DELETE')) {
    responder(false, 'Solo administradores pueden eliminar productos', null, 403);
    exit;
}
```

#### 2. **Validación de Permisos en Frontend**
```jsx
// usePermissions.js
function usePermissions() {
    const { user } = useAuth()
    
    return {
        isAdmin: () => user.role === 'admin',
        canDeleteProducts: () => user.role === 'admin',
        canManageUsers: () => user.role === 'admin',
        canViewReports: () => user.role === 'admin'
    }
}

// Uso en componentes
{permissions.isAdmin() && (
    <button onClick={handleDeleteUser}>Eliminar Usuario</button>
)}
```

#### 3. **Métodos HTTP Soportados**
```php
// functions.php - obtenerDatos()
if ($metodo === 'POST') { ... }
if ($metodo === 'PUT') { ... }
if ($metodo === 'PATCH') { ... } ⭐ AÑADIDO
if ($metodo === 'DELETE') { ... }

// Permite toggle de estado con PATCH
// Evita necesidad de POST/PUT extra
```

#### 4. **Validaciones de Entrada**
```php
// Sanitización de datos
$email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
$nombre = htmlspecialchars($_POST['nombre']);

// Validación de tipos
$cantidad = (int)$_POST['cantidad'];
$precio = (float)$_POST['precio'];

// Evita SQL injection
$sql = "SELECT * FROM usuarios WHERE id = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("i", $id);
$stmt->execute();
```

#### 5. **CORS (Cross-Origin Resource Sharing)**
```php
// cors.php
header("Access-Control-Allow-Origin: https://roommaster.site");
header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Requiere token/autenticación para acceso
```

#### 6. **Auditoría de Acciones**
```php
// Cada acción crítica se registra
function registrarActividad($usuario_id, $tipo, $descripcion) {
    INSERT INTO actividades (usuario_id, tipo, descripcion, timestamp)
    VALUES ($usuario_id, $tipo, $descripcion, NOW())
    
    TIPOS:
    - 'DELETE_USER': Eliminación de usuario
    - 'DELETE_PRODUCT': Eliminación de producto
    - 'MODIFY_STOCK': Cambio de inventario
    - 'VENTA_CREADA': Nueva venta registrada
    - 'LOGIN': Acceso al sistema
}
```

#### 7. **Encriptación de Contraseñas**
```php
// Al crear usuario
$contraseña_hash = hash('sha256', $contraseña);

// Al validar login
if (hash('sha256', $contraseña_ingresada) === $hash_almacenado) {
    // Contraseña correcta
}
```

### Endpoints Protegidos por Rol

| Endpoint | GET | POST | PUT | PATCH | DELETE |
|---|---|---|---|---|---|
| `/usuarios.php` | ADMIN | ADMIN | ADMIN | ADMIN | ADMIN |
| `/clientes.php` | REC+ | REC+ | REC+ | - | ADMIN |
| `/habitaciones.php` | REC+ | REC+ | REC+ | - | REC+ |
| `/estadias.php` | REC+ | REC+ | REC+ | - | ADMIN |
| `/productos.php` | REC+ | REC+ | REC+ | - | ADMIN ⭐ |
| `/ventas.php` | REC+ | REC+ | - | REC+ | ADMIN |
| `/facturas.php` | REC+ | REC+ | REC+ | - | ADMIN |
| `/reportes.php` | ADMIN | - | - | - | - |

(*REC+ = Recepcionista y Admin)

---

## 🛠️ TECNOLOGÍAS Y HERRAMIENTAS UTILIZADAS

### Frontend Stack
```javascript
{
  "name": "RoomMaster",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.3.1",           // Framework UI
    "react-dom": "^18.3.1",       // Render DOM
    "react-router-dom": "^6.30.3", // Enrutamiento
    "axios": "^1.7.2",            // HTTP Client
    "sweetalert2": "^11.13.3",    // Alertas UI
    "react-icons": "^5.x"         // Iconografía
  },
  "devDependencies": {
    "vite": "^5.4.21",            // Bundler
    "@vitejs/plugin-react": "^4", // Plugin React para Vite
    "css-loader": "latest"        // Carga CSS
  }
}
```

### Backend Stack
- **PHP**: 7.4+
- **MySQLi**: Driver de conexión
- **JSON**: Formato de respuesta API
- **cURL**: Requests HTTP
- **SHA256**: Encriptación contraseñas

### Hosting & DevOps
- **Hostinger**: Servidor compartido
- **cPanel**: Panel de control
- **phpMyAdmin**: Gestor BD
- **FTP/SSH**: Deploy de archivos
- **Git**: Control de versiones

### Tools & Utilities
- **VS Code**: Editor de código
- **Postman/Insomnia**: Testing API
- **Chrome DevTools**: Debugging frontend
- **phpMyAdmin**: BD management
- **Linux terminal**: Scripts y deploy

---

## 📈 FLUJO DE DATOS (DATA FLOW)

### Creación de Venta (Ejemplo)
```
┌─────────────────────────────────────────────────────────────┐
│ 1. UI - Usuario selecciona producto y cantidad             │
└──────────────────┬──────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. Frontend - TiendaPage.jsx                               │
│    - Valida cantidad > 0                                   │
│    - Llama: crearVenta(producto, cantidad)                 │
└──────────────────┬──────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. API Service - api.js                                    │
│    - POST /backend/ventas.php                              │
│    - Headers: { Authorization: token }                     │
│    - Body: { cliente_id, producto_id, cantidad, ...}       │
└──────────────────┬──────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. Backend - ventas.php                                    │
│    a) Validar permiso (usuario autenticado)               │
│    b) Obtener datos JSON del body                          │
│    c) Validar producto existe                             │
│    d) VALIDAR STOCK (dual-source):                         │
│       - Buscar en inventario                              │
│       - Si no existe, buscar en productos                 │
│    e) Si stock insuficiente → return error                │
│    f) Rebajar stock (origen correcto)                      │
│    g) INSERT INTO ventas                                  │
│    h) Registrar en auditoría                              │
│    i) return { success: true, venta_id }                  │
└──────────────────┬──────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. Database - MariaDB                                      │
│    - UPDATE inventario SET cantidad_actual -= ?            │
│    - INSERT INTO ventas VALUES (...)                       │
│    - INSERT INTO actividades (auditoría)                   │
└──────────────────┬──────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. Response JSON a Frontend                                │
│    { success: true, venta_id: 123, mensaje: "Venta..." }  │
└──────────────────┬──────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────────┐
│ 7. Frontend - Actualizar UI                                │
│    - Toast/SweetAlert: "Venta completada!"                │
│    - Recargar tabla de ventas                             │
│    - Actualizar stock mostrado                            │
│    - Limpiar formulario                                   │
└─────────────────────────────────────────────────────────────┘
```

---

## ✅ CHECKLIST FUNCIONALIDADES

### Módulo Autenticación
- [x] Login con email/contraseña
- [x] Registro de usuarios
- [x] Gestión de sesión (localStorage)
- [x] Protección de rutas (ProtectedRoute)
- [x] Validación de permisos por rol

### Módulo Dashboard
- [x] Estadísticas generales (clientes, habitaciones, ingresos)
- [x] Tabla de usuarios (CRUD)
- [x] Toggle de visibilidad de contraseña
- [x] Activar/Desactivar usuarios (PATCH)
- [x] Eliminar usuarios (DELETE con confirmación)
- [x] Validaciones de permisos (admin only)

### Módulo Gestión de Clientes
- [x] Listar clientes
- [x] CRUD completo (Create, Read, Update, Delete)
- [x] Búsqueda en tiempo real (multi-campo)
- [x] Validaciones de datos
- [x] Historial de hospedajes por cliente

### Módulo Gestión de Habitaciones
- [x] Listar habitaciones
- [x] CRUD completo
- [x] Validación de piso (solo números, max 2 dígitos)
- [x] Estados: disponible, ocupada, mantenimiento
- [x] Información de amenidades

### Módulo Tienda/Productos
- [x] Listar productos por categoría
- [x] CRUD completo
- [x] Gestión de categorías
- [x] Eliminar productos ⭐ (con cleanup inventario)
- [x] Almacenamiento de código único

### Módulo Ventas
- [x] Crear ventas
- [x] Validación dual-source de stock ⭐
- [x] Rebajar stock del origen correcto
- [x] Métodos de pago (efectivo, tarjeta)
- [x] Cálculo de impuestos (IVA)
- [x] Historial de ventas
- [x] Devoluciones/Reembolsos

### Módulo Facturación
- [x] Generar facturas
- [x] Numeración automática (FAC-001)
- [x] Estados: Pagada, Pendiente, Anulada
- [x] Historial de facturas
- [x] Cálculo de totales y impuestos

### Módulo Inventario
- [x] Inventario de productos (general)
- [x] Inventario de habitaciones (suministros)
- [x] Alertas de stock bajo
- [x] Historial de movimientos
- [x] Actualizaciones en tiempo real

### Módulo Reportes
- [x] Reporte de ocupación
- [x] Reporte de ventas
- [x] Reporte de clientes
- [x] Reporte de facturas
- [x] Reporte de inventario
- [x] Filtros por fecha, categoría, estado

### Seguridad
- [x] Autenticación (login/logout)
- [x] Autorización por rol
- [x] CORS configurado
- [x] Sanitización de entrada
- [x] Encriptación de contraseñas (SHA256)
- [x] Auditoría de acciones
- [x] Validación de permisos en backend

### Responsive Design
- [x] Mobile (480px)
- [x] Tablet (768px)
- [x] Desktop (1024px+)
- [x] Ultra-wide (1440px+)
- [x] Unidades rem + clamp() para escalabilidad

---

## 🚀 DEPLOYMENT & PRODUCCIÓN

### Servidor Actual
- **URL**: https://roommaster.site
- **Hosting**: Hostinger
- **BD**: MariaDB (u754245691_db_90IMt5ZM)
- **PHP**: 7.4+

### Archivos en Producción
```
/public_html/
├── index.html (Cliente)
├── assets/
│   ├── index-Dhxi5SrR.js (Main bundle - React compiled)
│   ├── index-CnbxwDQP.css (Estilos compilados)
│   └── images/
│       └── [Assets]
└── /backend/ (PHP APIs)
    ├── config.php
    ├── functions.php
    ├── cors.php
    ├── login.php
    ├── usuarios.php
    ├── clientes.php
    ├── habitaciones.php
    ├── productos.php
    ├── ventas.php
    ├── facturas.php
    ├── inventario.php
    ├── inventario_habitaciones.php
    ├── reportes.php
    ├── dashboard_stats.php
    ├── estadias.php
    └── [otros módulos]
```

### Build Process
```bash
# Local development
npm run dev                # Start dev server + hot reload

# Production build
npm run build              # Vite compiles React
# Genera output en /dist:
#  - index-[hash].js (Main bundle)
#  - index-[hash].css (Estilos)
#  - index.html (Entry point)

# Deploy to Hostinger
# 1. Copiar /dist/* a /public_html/assets/
# 2. Copiar index.html a /public_html/
# 3. Verificar /backend/ APIs están en servidor
# 4. Verificar BD conexión desde config.php
```

---

## 🎯 PUNTOS CLAVE PARA PRESENTACIÓN

### 1. **Arquitectura MVC Clara**
- Frontend es la Vista (React)
- Backend es el Controlador (PHP)
- BD es el Modelo (MariaDB)

### 2. **Sistema de Ventas Robusto**
- Validación dual-source de stock ⭐
- Descuenta del origen correcto
- Valida antes de procesar

### 3. **Seguridad Implementada**
- Autenticación con tokens
- Autorización por rol (admin/recepcionista)
- Validaciones en backend (nunca confiar cliente)
- Encriptación de contraseñas

### 4. **CRUD Completo en Todos los Módulos**
- Create, Read, Update, Delete
- Validaciones de datos
- Manejo de errores

### 5. **Métodos HTTP Utilizados**
- GET: Lectura de datos
- POST: Crear nuevos registros
- PUT: Reemplazar registros
- PATCH: Actualizaciones parciales (ej: toggle estado) ⭐
- DELETE: Eliminar registros

### 6. **Responsive Design**
- Mobile-first approach
- rem + clamp() para escalabilidad
- Funciona en todas las resoluciones

### 7. **Base de Datos Normalizada**
- 10 tablas principales
- Relaciones con Foreign Keys
- Índices para rendimiento
- Cascadas ON DELETE para integridad

### 8. **Stack Moderno**
- React 18 (UI library)
- Vite (bundler rápido)
- Axios (HTTP client elegante)
- SweetAlert2 (UX mejorada)
- PHP/MySQLi (backend robusto)

---

## 💡 MEJORAS FUTURAS (Scope Expansion)

1. **JWT Tokens**: Reemplazar localStorage con JWT
2. **Gráficos Avanzados**: Integrar Chart.js/Recharts para reportes
3. **Email**: Envío de facturas por email (PHPMailer)
4. **SMS**: Notificaciones SMS a clientes (Twilio)
5. **Payments**: Integración de pasarelas (Stripe, PayPal)
6. **Booking**: Sistema de reservas online
7. **Reviews**: Sistema de ratings y reseñas
8. **Multi-idioma**: i18n (Inglés, Español, Portugués)
9. **Pruebas**: Unit tests (Jest), E2E tests (Cypress)
10. **PWA**: Progressive Web App para offline mode

---

## 📞 CONTACTO & SOPORTE

**Proyecto**: RoomMaster - Sistema de Gestión Hotelera
**Desarrollado por**: [Tu Equipo SENA]
**Presentación**: Marzo 2026
**Tecnologías**: React, PHP, MariaDB
**Deploy**: https://roommaster.site

---

**¡Listo para la presentación! Good luck! 🚀**
