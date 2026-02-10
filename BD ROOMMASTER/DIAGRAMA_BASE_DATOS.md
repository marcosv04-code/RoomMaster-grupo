# 📊 Diagrama de la Base de Datos RoomMaster

Este archivo muestra visualmente cómo se conectan todas las tablas de RoomMaster.

---

## 🔗 Relaciones entre tablas (Diagrama ER)

```
┌─────────────┐         ┌──────────────┐
│  USUARIOS   │◀───────▶│  ACTIVIDADES │
└─────────────┘         └──────────────┘
      ▲
      │
      │  auditoria
      │
┌─────┴─────────────────────────┐
│                               │
│  ┌──────────────────┐         │
│  │   CLIENTES       │         │
│  └──────────────────┘         │
│         │                     │
│         │ cliente_id          │
│         │ (1 a M)             │
│         ▼                     │
│  ┌──────────────────┐         │
│  │   ESTADÍAS       │────────►│
│  └──────────────────┘         │
│         ▲                     │
│         │ estadia_id          │
│         │                     │
│    ┌────┴───────┬──────────┐  │
│    │            │          │  │
│    ▼            ▼          ▼  │
│ ┌──────┐   ┌─────────┐ ┌──────────┐
│ │FACT│   │ VENTAS  │ │HABITACION│
│ │URAS│   └─────────┘ └──────────┘
│ └──────┘       │
│               │ producto_id
│               │
│               ▼
│        ┌─────────────┐
│        │ PRODUCTOS   │
│        └─────────────┘
│               │
│               └───────────┐
│                           │
│                    ┌──────┴──────┐
│                    │ INVENTARIO  │
│                    └─────────────┘
└───────────────────────────────────┘
```

---

## 📋 Tabla de Relaciones

| Tabla 1 | Relación | Tabla 2 | Descripción |
|---------|----------|---------|-------------|
| CLIENTES | 1 → M | ESTADÍAS | Un cliente puede tener muchas estadías |
| HABITACIONES | 1 → M | ESTADÍAS | Una habitación puede tener muchas estadías |
| ESTADÍAS | 1 → M | FACTURAS | Una estadía puede generar una factura |
| ESTADÍAS | 1 → M | VENTAS | En una estadía se pueden vender muchos productos |
| FACTURAS | 1 → M | VENTAS | Una factura puede incluir many productos |
| PRODUCTOS | 1 → M | VENTAS | Un producto puede venderse muchas veces |
| PRODUCTOS | 1 → 1 | INVENTARIO | Un producto tiene un registro en inventario |
| USUARIOS | 1 → M | ACTIVIDADES | Un usuario puede tener varias actividades |

---

## 🗂️ Estructura Completa

### USUARIOS
Para autenticación y control de acceso
```
id ───────────────────┐
nombre                │
email                 │── Primary Key + FK en ACTIVIDADES
contraseña            │
rol                   │
teléfono              │
hotel                 │
```

### CLIENTES
Información de huéspedes
```
id ───────────────────┐
nombre                │ Primary Key
email                 │
teléfono              ├─ FK en ESTADÍAS
documento_identidad  │
tipo_documento        │
ciudad                │
```

### HABITACIONES
Catálogo de habitaciones del hotel
```
id ───────────────────┐
numero_habitacion     │ Primary Key
piso                  │
tipo (simple/doble)   ├─ FK en ESTADÍAS
capacidad             │
precio_noche          │
estado                │
amenidades            │
```

### ESTADÍAS (El corazón del sistema)
Representa cada hospedaje
```
id ───────────────────┐
cliente_id ◀──────────────── FK CLIENTES
habitacion_id ◀──────────────── FK HABITACIONES
fecha_entrada         │ Primary Key
fecha_salida          ├─ FK en FACTURAS
numero_huespedes      │ FK en VENTAS
estado                │
numero_noches         │
```

### FACTURAS
Una factura por hospedaje
```
id ───────────────────┐
numero_factura        │ Primary Key
estadia_id ◀──────────────── FK ESTADÍAS
cliente_id ◀──────────────── FK CLIENTES
subtotal              │
impuesto              ├─ FK en VENTAS
total                 │
estado                │
metodo_pago           │
fecha_factura         │
```

### PRODUCTOS
Catálogo de lo que se vende
```
id ───────────────────┐
nombre                │ Primary Key
descripcion           │
precio                ├─ FK en VENTAS
stock                 │ FK en INVENTARIO
categoria             │
codigo_producto       │
estado                │
```

### VENTAS
Detalle de cada compra
```
id ───────────────────┐
factura_id ◀──────────────── FK FACTURAS (opcional)
estadia_id ◀──────────────── FK ESTADÍAS
producto_id ◀──────────────── FK PRODUCTOS
cantidad              │ Primary Key
precio_unitario       │
subtotal              │
huésped               │
fecha_venta           │
```

### INVENTARIO
Control de stock
```
id ───────────────────┐
producto_id ◀──────────────── FK PRODUCTOS (UNIQUE)
cantidad_actual       │ Primary Key
cantidad_minima       │
cantidad_maxima       │
ubicacion             │
ultimo_reabastecimiento
```

### ACTIVIDADES
Log de auditoría
```
id ───────────────────┐
tipo                  │ Primary Key
usuario_id ◀──────────────── FK USUARIOS
descripcion           │
tabla_afectada        │
registro_id           │
datos_anteriores (JSON)
datos_nuevos (JSON)   │
fecha_actividad       │
```

---

## 🔄 Flujo de datos típico

```
1. Cliente llega
   └─► Se crea registro en CLIENTES

2. Cliente se hospeda
   └─► Se crea ESTADÍA
       ├─► Se vincula a CLIENTE
       └─► Se vincula a HABITACIÓN

3. Cliente compra productos
   └─► Se registran en VENTAS
       ├─► Se vinculan a ESTADÍA
       └─► Se rebaja INVENTARIO

4. Cliente se va
   └─► Se crea FACTURA
       ├─► Se vincula a ESTADÍA
       ├─► Se suma total desde VENTAS
       └─► Se guarda en ACTIVIDADES

5. Se registra pago
   └─► Se actualiza estado en FACTURA
       └─► Se registra en ACTIVIDADES
```

---

## 📊 Ejemplo de Consulta Completa

Un cliente se hospeda, compra productos y se genera factura:

```
CLIENTES (Juan Pérez)
    │
    ├─► ESTADÍA (del 1-5 de feb en hab 102)
    │       │
    │       ├─► VENTAS (Café, Desayuno)
    │       │       │
    │       │       └─► PRODUCTOS (reducen stock en INVENTARIO)
    │       │
    │       └─► FACTURA (FAC-001 con total de habitación + ventas)
    │
    └─► ACTIVIDADES (registro de lo que pasó)
```

---

## 🎯 Índices para optimizar búsquedas

Para que las búsquedas sean rápidas, se usan índices en:

- ✅ `funcionarios.rol` - Para filtrar por rol
- ✅ `productos.categoria` - Para filtrar por tipo
- ✅ `facturas.estado` - Para filtrar pagadas, pendientes, etc
- ✅ `estadias.fecha_entrada` - Para buscar por rango de fechas
- ✅ `habitaciones.estado` - Para saber disponibilidad

---

## 🔐 Integridad referencial (ON DELETE CASCADE)

Cuando se elimina un registro:

```
DELETE cliente 1
    ↓
Todas sus ESTADÍAS se eliminan
    ↓
Todas sus FACTURAS se eliminan
    ↓
Todas sus VENTAS se eliminan
```

Esto evita "huérfanos" en la base de datos.

---

## 💡 Tips de diseño

1. **Primary Key** - Cada tabla tiene un `id` único
2. **Foreign Key** - Conectan tablas entre sí
3. **NOT NULL** - Campos obligatorios
4. **UNIQUE** - Valores que no se repiten (email, numero_factura)
5. **DEFAULT** - Valores por defecto
6. **DATETIME** - Automáticamente pone fecha/hora
7. **JSON** - Para datos complejos (en actividades)

---

Hecho en Colombia 🇨🇴
