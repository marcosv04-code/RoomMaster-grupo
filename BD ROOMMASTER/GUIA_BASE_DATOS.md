# 📚 Guía: Crear Base de Datos RoomMaster en phpMyAdmin

**Nivel: Principiante - SENA** 👨‍🎓

Este tutorial te enseña a crear la base de datos de RoomMaster paso a paso, de forma que cualquier estudiante lo entienda.

---

## ❓ ¿Qué es una base de datos?

Una **base de datos** es como un armario gigante donde guardas toda la información del hotel de forma organizada:
- Clientes/huéspedes
- Habitaciones
- Facturas
- Productos que vendes
- Etc.

**phpMyAdmin** es una herramienta que te permite administrar esta información sin escribir código complicado.

---

## 🚀 Pasos para crear la base de datos

### **Paso 1: Acceder a phpMyAdmin**
1. Abre tu navegador (Chrome, Firefox, Edge, etc)
2. Escribe en la barra de direcciones: `http://localhost/phpmyadmin`
3. Si te pide usuario y contraseña:
   - Usuario: `root`
   - Contraseña: (dejar vacío o la que configuraste en XAMPP/WAMP)

### **Paso 2: Buscar la opción SQL**
1. Arriba a la izquierda busca el menú principal de phpMyAdmin
2. Haz clic en **"SQL"** (está en la barra superior)
3. Verás una pantalla con una caja de texto grande (ahí escribes comandos SQL)

### **Paso 3: Copiar el código de la base de datos**
1. En tu computadora, busca el archivo: `roommaster_database.sql`
2. Abre el archivo con Notepad o cualquier editor de texto
3. Selecciona TODO el contenido (Ctrl + A)
4. Copia (Ctrl + C)

### **Paso 4: Pegar el código en phpMyAdmin**
1. En phpMyAdmin, haz clic en la caja de texto donde se escribe SQL
2. Pega el código (Ctrl + V)
3. Haz clic en el botón **"Ejecutar"** (botón azul en la parte inferior)

### **Paso 5: ¡Espera un poco!**
- Si aparece un mensaje verde que dice: **"MySQL devolvió una consulta vacía"**
- ¡Significa que todo funcionó! ✅

---

## ✅ Verificar que funcionó

1. En el lado izquierdo de phpMyAdmin, busca **"roommaster_db"**
2. Haz clic en ella
3. Deberías ver todas las tablas creadas:
   - ✅ usuarios
   - ✅ clientes
   - ✅ habitaciones
   - ✅ estadias
   - ✅ facturas
   - ✅ productos
   - ✅ ventas
   - ✅ inventario
   - ✅ actividades

Si ves todas estas tablas, ¡ya está listo! 🎉

---

## 📊 ¿Qué contiene cada tabla? (EXPLICADO SIMPLE)

### **1️⃣ USUARIOS** 
📌 Guarda a toda la gente que trabaja en el hotel
```
- id: número único de cada persona
- nombre: "Carlos Rodriguez"
- email: "carlos@hotel.com"
- contraseña: protegida
- rol: "admin", "gerente" o "recepcionista"
- teléfono: número de contacto
- hotel: nombre del hotel
- estado: "activo" o "inactivo"
```

### **2️⃣ CLIENTES**
👤 Información de los huéspedes que se hospedan
```
- id: número único
- nombre: "Juan Pérez"
- email: "juan@email.com"
- teléfono: número de contacto
- documento_identidad: "1234567890"
- tipo_documento: "cedula", "pasaporte", "nit"
- ciudad: "Bogotá"
```

### **3️⃣ HABITACIONES**
🛏️ Las habitaciones del hotel
```
- id: número único
- numero_habitacion: "101", "102", etc
- piso: 1, 2, 3, etc
- tipo: "simple", "doble", "suite", "deluxe"
- capacidad: cuántas personas caben (1, 2, 3, etc)
- precio_noche: cuánto cuesta por noche ($80, $120, etc)
- estado: "disponible", "ocupada", "mantenimiento"
- amenidades: "TV, AC, WiFi, Minibar"
```

### **4️⃣ ESTADÍAS**
📅 Cada vez que alguien se hospeda
```
- id: número único
- cliente_id: quién se hospeda (conecta con CLIENTES)
- habitacion_id: en qué habitación (conecta con HABITACIONES)
- fecha_entrada: cuándo llega (2026-02-09)
- fecha_salida: cuándo se va (2026-02-12)
- numero_huespedes: cuántas personas
- estado: "activa", "completada", "cancelada"
- numero_noches: cuántas noches se queda
```

### **5️⃣ FACTURAS**
💰 Las facturas de cada hospedaje
```
- id: número único
- numero_factura: "FAC-001", "FAC-002" (como en el frontend)
- estadia_id: a qué estadía corresponde
- cliente_id: a qué cliente
- subtotal: suma sin impuestos
- impuesto: IVA u otro impuesto
- total: subtotal + impuesto
- estado: "Pendiente", "Pagada", "Cancelada"
- metodo_pago: "efectivo", "tarjeta", "transferencia"
```

### **6️⃣ PRODUCTOS** 
🛒 Lo que vende el hotel (tienda)
```
- id: número único
- nombre: "Café Expreso", "Agua Embotellada"
- precio: $5, $15, $20
- stock: cuánta cantidad hay en bodega
- categoria: "bebidas", "comidas", "servicios"
- codigo_producto: "BEBA-001" (código interno)
- estado: "activo", "inactivo"
```

### **7️⃣ VENTAS**
📦 Registro de cada producto vendido
```
- id: número único
- factura_id: a qué factura corresponde
- estadia_id: en qué estadía se vendió
- producto_id: qué producto se vendió
- cantidad: cuántos se vendieron
- precio_unitario: precio de uno
- subtotal: cantidad × precio_unitario
- huésped: "María González" (quién compró)
- fecha_venta: cuándo se vendió
```

### **8️⃣ INVENTARIO**
📊 Control de cantidad de productos
```
- id: número único
- producto_id: qué producto es
- cantidad_actual: cuántos hay ahora
- cantidad_minima: cuándo avisar que se acaba (por ejemplo 5)
- ubicacion: dónde está guardado ("Cocina", "Minibar")
- ultimo_reabastecimiento: cuándo se compró
```

### **9️⃣ ACTIVIDADES**
📝 Registro de todo lo que pasa (para auditoría)
```
- id: número único
- tipo: qué pasó ("entrada_huésped", "venta", "factura")
- usuario_id: quién lo hizo
- descripcion: qué hizo
- fecha_actividad: cuándo lo hizo
```

---

## 🔗 ¿Cómo se conectan las tablas?

Las tablas se conectan usando **"llaves extranjeras" (FOREIGN KEY)**. Es como si dijera:

**ESTADÍAS dice:** "Este cliente viene de la tabla CLIENTES"
**FACTURAS dice:** "Esta estadía viene de la tabla ESTADÍAS"
**VENTAS dice:** "Este producto viene de la tabla PRODUCTOS"

Esto hace que la información no se repita y se mantenga organizada.

---

## 🎯 Datos de ejemplo incluidos

El script SQL ya incluye datos de ejemplo para que puedas probar:

✅ 3 usuarios (admin, gerente, recepcionista)
✅ 4 clientes ejemplo
✅ 5 habitaciones de diferentes tipos
✅ 2 estadías
✅ 3 facturas (FAC-001, FAC-002, FAC-003) - como aparecen en el frontend
✅ 8 productos de tienda
✅ 4 ventas de ejemplo

---

## 🔄 Para trabajar con la base de datos desde PHP/Node.js

Cuando hagas conexión a la BD desde tu código backend, usa estos datos:

```
HOST: localhost
USUARIO: root
CONTRASEÑA: (la que configuraste en XAMPP/WAMP o dejar vacío)
PUERTO: 3306
BASE DE DATOS: roommaster_db
```

---

## ❌ Si algo sale mal

### Problema: "Base de datos ya existe"
**Solución**: No hay problema, significa que ya la habías creado. Puedes:
- Crearla con otro nombre
- O simplemente ignorar el mensaje

### Problema: "Error de sintaxis"
**Solución**: Verifica que:
- Copiaste el código COMPLETO (no falta nada)
- Pegaste correctamente en phpMyAdmin
- No hay caracteres especiales raros

### Problema: "No aparecen las tablas"
**Solución**: 
- Haz clic en el botón "Actualizar" (flechas circulares)
- O recarga la página (F5)

### Problema: "Conexión rechazada"
**Solución**: Verifica que:
- XAMPP/WAMP esté corriendo
- El servidor MySQL esté iniciado
- Puerto 3306 esté disponible

---

## 💡 Consejos para estudiantes SENA

1. **Entiende la estructura**: Cada tabla representa "cosas" del hotel
2. **Las relaciones**: Usa FOREIGN KEY para conectar tablas
3. **Auto Increment**: El ID se genera automáticamente, no lo escribas
4. **Estado**: Muchas tablas tienen un campo "estado" para marcar si está activo
5. **Timestamps**: DATETIME guarda cuándo se creó cada registro
6. **Índices**: `INDEX` hace búsquedas más rápidas
7. **ON DELETE CASCADE**: Cuando borras un cliente, se borran todas sus estadías

---

## 🎓 Próximos pasos

Una vez tengas la base de datos:

1. Conecta tu backend (PHP, Node.js, Python) a `roommaster_db`
2. Crea los endpoints/rutas para:
   - Crear clientes
   - Crear facturas
   - Crear productos
   - Vender productos
3. El frontend ya está listo en React + Vite

---

**¡Ya puedes empezar a desarrollar RoomMaster!** 🚀

Preguntas? Consulta a tu instructor del SENA.

Hecho en Colombia 🇨🇴
