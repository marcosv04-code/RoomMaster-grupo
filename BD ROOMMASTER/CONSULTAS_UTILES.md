# 🔍 Consultas SQL Útiles para RoomMaster

**Nivel: Intermedio - SENA** 👨‍🎓

Este documento muestra consultas SQL que puedes usar en phpMyAdmin o en tu código PHP/Node.js para trabajar con RoomMaster.

---

## 📈 REPORTES Y ESTADÍSTICAS

### 1. Ver todas las facturas y sus clientes
```sql
SELECT 
    f.numero_factura,
    c.nombre,
    c.email,
    f.total,
    f.estado,
    f.fecha_factura
FROM facturas f
INNER JOIN clientes c ON f.cliente_id = c.id
ORDER BY f.fecha_factura DESC;
```

**¿Qué hace?** Muestra todas las facturas con el nombre del cliente y los detalles importantes.

---

### 2. Ingresos totales por estado
```sql
SELECT 
    estado,
    COUNT(*) as cantidad,
    SUM(total) as total_ingresos
FROM facturas
GROUP BY estado;
```

**¿Qué hace?** Muestra cuánto dinero tienes en facturas pagadas, pendientes y canceladas.

---

### 3. Habitaciones y su ocupación actual
```sql
SELECT 
    numero_habitacion,
    tipo,
    precio_noche,
    SUM(CASE WHEN estado = 'ocupada' THEN 1 ELSE 0 END) as ocupadas,
    estado
FROM habitaciones
GROUP BY numero_habitacion;
```

**¿Qué hace?** Muestra qué habitaciones están ocupadas y cuáles disponibles.

---

### 4. Productos más vendidos
```sql
SELECT 
    p.nombre,
    p.categoria,
    COUNT(v.id) as veces_vendido,
    SUM(v.subtotal) as ingresos_generados
FROM productos p
LEFT JOIN ventas v ON p.id = v.producto_id
GROUP BY p.id, p.nombre, p.categoria
ORDER BY veces_vendido DESC
LIMIT 10;
```

**¿Qué hace?** Muestra los 10 productos más vendidos.

---

### 5. Huéspedes nuevos vs recurrentes
```sql
SELECT 
    COUNT(DISTINCT cliente_id) as total_clientes,
    COUNT(CASE WHEN cliente_id IN (
        SELECT cliente_id FROM estadias GROUP BY cliente_id HAVING COUNT(*) > 1
    ) THEN 1 END) as clientes_recurrentes
FROM estadias;
```

**¿Qué hace?** Muestra cuántos clientes son nuevos y cuántos han vuelto.

---

## 👥 GESTIÓN DE CLIENTES

### 6. Ver todos los clientes registrados
```sql
SELECT 
    id,
    nombre,
    email,
    telefono,
    ciudad,
    fecha_registro
FROM clientes
ORDER BY fecha_registro DESC;
```

**¿Qué hace?** Lista todos los clientes del sistema.

---

### 7. Clientes con más reservas
```sql
SELECT 
    c.nombre,
    c.email,
    COUNT(e.id) as total_reservas,
    SUM(e.numero_noches) as total_noches
FROM clientes c
LEFT JOIN estadias e ON c.id = e.cliente_id
GROUP BY c.id
ORDER BY total_reservas DESC;
```

**¿Qué hace?** Muestra quiénes son los clientes más frecuentes.

---

## 🛏️ GESTIÓN DE HABITACIONES

### 8. Ocupación de habitaciones por tipo
```sql
SELECT 
    tipo,
    COUNT(*) as total,
    SUM(CASE WHEN estado = 'disponible' THEN 1 ELSE 0 END) as disponibles,
    SUM(CASE WHEN estado = 'ocupada' THEN 1 ELSE 0 END) as ocupadas,
    ROUND(SUM(CASE WHEN estado = 'ocupada' THEN 1 ELSE 0 END) / COUNT(*) * 100, 2) as porcentaje_ocupacion
FROM habitaciones
GROUP BY tipo;
```

**¿Qué hace?** Muestra la ocupación por tipo de habitación (simple, doble, suite, etc).

---

### 9. Ingresos por habitación
```sql
SELECT 
    h.numero_habitacion,
    h.tipo,
    COUNT(e.id) as reservas,
    SUM(e.numero_noches) as total_noches,
    h.precio_noche * SUM(e.numero_noches) as ingresos_totales
FROM habitaciones h
LEFT JOIN estadias e ON h.id = e.habitacion_id
GROUP BY h.id
ORDER BY ingresos_totales DESC;
```

**¿Qué hace?** Muestra cuánto dinero genera cada habitación.

---

## 💰 GESTIÓN FINANCIERA

### 10. Facturas pendientes de pago
```sql
SELECT 
    numero_factura,
    c.nombre,
    total,
    fecha_factura,
    DATEDIFF(NOW(), fecha_factura) as dias_pendiente
FROM facturas f
INNER JOIN clientes c ON f.cliente_id = c.id
WHERE f.estado = 'Pendiente'
ORDER BY fecha_factura ASC;
```

**¿Qué hace?** Muestra qué facturas no han sido pagadas y hace cuántos días.

---

### 11. Dinero por cobrar
```sql
SELECT 
    SUM(CASE WHEN estado = 'Pendiente' THEN total ELSE 0 END) as por_cobrar,
    SUM(CASE WHEN estado = 'Vencida' THEN total ELSE 0 END) as vencidas,
    SUM(CASE WHEN estado = 'Pagada' THEN total ELSE 0 END) as pagadas,
    SUM(total) as total_facturas
FROM facturas;
```

**¿Qué hace?** Muestra el resumen financiero del hotel.

---

### 12. Ingresos por mes
```sql
SELECT 
    YEAR(fecha_factura) as año,
    MONTH(fecha_factura) as mes,
    COUNT(*) as cantidad_facturas,
    SUM(total) as ingresos
FROM facturas
WHERE f.estado = 'Pagada'
GROUP BY año, mes
ORDER BY año DESC, mes DESC;
```

**¿Qué hace?** Muestra ingresos mes a mes.

---

## 📦 GESTIÓN DE INVENTARIO

### 13. Productos con stock bajo
```sql
SELECT 
    p.nombre,
    p.categoria,
    i.cantidad_actual,
    i.cantidad_minima,
    p.precio
FROM productos p
INNER JOIN inventario i ON p.id = i.producto_id
WHERE i.cantidad_actual < i.cantidad_minima
ORDER BY i.cantidad_actual ASC;
```

**¿Qué hace?** Muestra qué productos necesitan reordenarse.

---

### 14. Valor total del inventario
```sql
SELECT 
    SUM(i.cantidad_actual * p.precio) as valor_total_inventario,
    COUNT(p.id) as cantidad_productos
FROM productos p
INNER JOIN inventario i ON p.id = i.producto_id;
```

**¿Qué hace?** Calcula cuánto dinero está invertido en inventario.

---

## 👨‍💼 EDITAR/ACTUALIZAR DATOS

### 15. Cambiar estado de una factura a pagada
```sql
UPDATE facturas
SET 
    estado = 'Pagada',
    metodo_pago = 'transferencia',
    fecha_pago = NOW()
WHERE numero_factura = 'FAC-001';
```

**¿Qué hace?** Marca la factura FAC-001 como pagada.

---

### 16. Cambiar estado de una habitación a mantenimiento
```sql
UPDATE habitaciones
SET estado = 'mantenimiento'
WHERE numero_habitacion = '101';
```

**¿Qué hace?** Marca la habitación 101 fuera de servicio.

---

### 17. Rebajar stock de un producto
```sql
UPDATE inventario
SET cantidad_actual = cantidad_actual - 5
WHERE producto_id = 1;
```

**¿Qué hace?** Reduce 5 unidades del producto con ID 1.

---

## ❌ ELIMINAR DATOS

### 18. Eliminar una estadía cancelada
```sql
DELETE FROM estadias
WHERE id = 5 AND estado = 'cancelada';
```

**¿Qué hace?** Borra una estadía cancelada.

---

## ☑️ INSERTS BÁSICOS

### 19. Crear una nueva factura
```sql
INSERT INTO facturas (numero_factura, estadia_id, cliente_id, subtotal, impuesto, total, estado, metodo_pago)
VALUES ('FAC-004', 3, 2, 300.00, 50.00, 350.00, 'Pendiente', NULL);
```

**¿Qué hace?** Crea una nueva factura en el sistema.

---

### 20. Crear un nuevo cliente
```sql
INSERT INTO clientes (nombre, email, telefono, documento_identidad, tipo_documento, ciudad)
VALUES ('Pedro González', 'pedro@email.com', '3001234571', '3333333333', 'cedula', 'Santa Marta');
```

**¿Qué hace?** Crea un nuevo cliente en el sistema.

---

### 21. Registrar una venta
```sql
INSERT INTO ventas (factura_id, estadia_id, producto_id, cantidad, precio_unitario, subtotal, huésped)
VALUES (1, 1, 3, 2, 6.00, 12.00, 'Juan Pérez');
```

**¿Qué hace?** Registra que Juan Pérez compró 2 unidades del producto 3.

---

## 🔧 QUERIES ÚTILES PARA EL FRONTEND

### 22. Obtener datos para el Dashboard
```sql
SELECT 
    (SELECT COUNT(*) FROM estadias WHERE estado = 'activa') as huespedes_actuales,
    (SELECT COUNT(*) FROM habitaciones WHERE estado = 'disponible') as habitaciones_disponibles,
    (SELECT SUM(total) FROM facturas WHERE fecha_factura >= DATE_SUB(NOW(), INTERVAL 30 DAY)) as ingresos_mes,
    (SELECT SUM(CASE WHEN estado = 'Pendiente' THEN total ELSE 0 END) FROM facturas) as pendiente_cobro;
```

**¿Qué hace?** Trae los datos principales para mostrar en el dashboard.

---

### 23. Obtener facturas para la tabla del frontend
```sql
SELECT 
    id,
    numero_factura as numero,
    (SELECT nombre FROM clientes WHERE id = cliente_id) as cliente,
    total as monto,
    estado,
    DATE_FORMAT(fecha_factura, '%Y-%m-%d') as fecha
FROM facturas
ORDER BY fecha_factura DESC
LIMIT 10;
```

**¿Qué hace?** Trae las últimas 10 facturas formateadas para mostrar en una tabla.

---

### 24. Obtener productos para la tienda
```sql
SELECT 
    id,
    nombre,
    precio,
    (SELECT cantidad_actual FROM inventario WHERE producto_id = p.id) as stock,
    categoria
FROM productos p
WHERE estado = 'activo'
ORDER BY categoria, nombre;
```

**¿Qué hace?** Trae todos los productos activos con su stock.

---

## 🎓 CÓMO USAR ESTAS CONSULTAS

### En phpMyAdmin:
1. Ve a SQL
2. Copia y pega una consulta
3. Haz clic en Ejecutar
4. Verás los resultados

### En PHP:
```php
$conexion = new mysqli("localhost", "root", "", "roommaster_db");
$sql = "SELECT * FROM facturas WHERE estado = 'Pagada'";
$resultado = $conexion->query($sql);

while($fila = $resultado->fetch_assoc()) {
    echo $fila['numero_factura'] . " - " . $fila['total'];
}
```

### En Node.js:
```javascript
const mysql = require('mysql');
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'roommaster_db'
});

conn.query("SELECT * FROM facturas", (err, results) => {
    if(err) throw err;
    console.log(results);
});
```

---

## 💡 TIPS

- **LIMIT**: Limita la cantidad de resultados (ej: `LIMIT 10` solo 10 registros)
- **ORDER BY**: Ordena los resultados (ej: `ORDER BY total DESC` de mayor a menor)
- **WHERE**: Filtra (ej: `WHERE estado = 'Pagada'`)
- **COUNT()**: Cuenta registros
- **SUM()**: Suma valores
- **AVG()**: Promedio
- **GROUP BY**: Agrupa resultados
- **JOIN**: Conecta tablas

---

**¡Ahora estás listo para trabajar con la base de datos!** 🚀

Preguntas? Consulta a tu instructor del SENA.

Hecho en Colombia 🇨🇴
