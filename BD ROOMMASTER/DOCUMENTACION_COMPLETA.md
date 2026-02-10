# 📖 DOCUMENTACIÓN COMPLETA DE BASE DE DATOS ROOMMASTER

Bienvenido a la documentación completa para crear y trabajar con la base de datos de **RoomMaster** - Sistema de Gestión Hotelera.

---

## 📚 Archivos de documentación incluidos

### 1. **GUIA_BASE_DATOS.md** 👨‍🎓
- Para: Estudiantes principiantes del SENA
- Contenido:
  - ✅ Paso a paso para instalar phpMyAdmin
  - ✅ Cómo ejecutar el script SQL
  - ✅ Explicación sencilla de cada tabla
  - ✅ Verificación de que todo funcionó
  - ✅ Solución de problemas

**👉 COMIENZA AQUÍ si es tu primera vez**

---

### 2. **roommaster_database.sql** 🗄️
- Para: Ejecutar en phpMyAdmin
- Contenido:
  - ✅ Script SQL completo que crea la BD
  - ✅ 9 tablas principales
  - ✅ Datos de ejemplo listos para probar
  - ✅ Comentarios explicativos en cada tabla
  - ✅ Relaciones entre tablas (FOREIGN KEYS)

**👉 Este archivo lo ejecutas en phpMyAdmin**

---

### 3. **CONSULTAS_UTILES.md** 🔍
- Para: Trabajar con datos desde código
- Contenido:
  - ✅ 24 consultas SQL útiles
  - ✅ Reportes y estadísticas
  - ✅ Consultas para el frontend
  - ✅ Ejemplos de INSERT, UPDATE, DELETE
  - ✅ Cómo usarlas en PHP y Node.js

**👉 Cuando necesites una consulta específica, busca aquí**

---

### 4. **backend_ejemplo.php** 💻
- Para: Desarrolladores PHP
- Contenido:
  - ✅ Conexión a la base de datos
  - ✅ Funciones CRUD completas
  - ✅ Gestión de clientes
  - ✅ Facturación
  - ✅ Gestión de tienda/productos
  - ✅ Reportes y estadísticas
  - ✅ Código comentado paso a paso

**👉 Copia este archivo como base para tu backend PHP**

---

### 5. **DIAGRAMA_BASE_DATOS.md** 📊
- Para: Entender la arquitectura
- Contenido:
  - ✅ Diagrama visual de relaciones
  - ✅ Tabla de relaciones entre tablas
  - ✅ Flujo de datos típico
  - ✅ Estructura de cada tabla
  - ✅ Tips de diseño y optimización

**👉 Cuando necesites entender cómo se conecta todo**

---

## 🚀 INICIO RÁPIDO (5 MINUTOS)

### Paso 1: Instalar phpMyAdmin (si no está instalado)
- Descargar XAMPP o WAMP
- Instalar
- Iniciar Apache + MySQL

### Paso 2: Crear la base de datos
1. Abre: `http://localhost/phpmyadmin`
2. Haz clic en **SQL**
3. Abre `roommaster_database.sql`
4. Copia TODO el contenido
5. Pégalo en phpMyAdmin
6. Haz clic en **Ejecutar** ✅

### Paso 3: Verificar
- En la izquierda, busca `roommaster_db`
- Deberías ver 9 tablas

### Paso 4: Empezar a usar
Usa las consultas en `CONSULTAS_UTILES.md` o copia `backend_ejemplo.php`

---

## 📋 ARQUITECTURA DE LA BASE DE DATOS

Tenemos **9 tablas principales**:

```
1. USUARIOS          ← Logins y roles
2. CLIENTES          ← Huéspedes
3. HABITACIONES      ← Catálogo de cuartos
4. ESTADÍAS          ← Hospedajes (CENTER del sistema)
5. FACTURAS          ← Facturas de cobro
6. PRODUCTOS         ← Tienda del hotel
7. VENTAS            ← Productos vendidos
8. INVENTARIO        ← Control de stock
9. ACTIVIDADES       ← Auditoría/Log

Todas conectadas por RELACIONES (FOREIGN KEYS)
```

---

## 🔄 FLUJO DE TRABAJO TÍPICO

### Cuando un cliente llega:
1. **Crear cliente** en tabla `CLIENTES`
2. **Crear estadía** en tabla `ESTADÍAS` (vinculado a cliente + habitación)
3. **Marcar habitación** como "ocupada"

### Cuando el cliente compra algo:
1. **Registrar venta** en tabla `VENTAS`
2. **Rebajar stock** en tabla `INVENTARIO`
3. **Actualizar total** de la estadía

### Cuando se va:
1. **Crear factura** en tabla `FACTURAS`
2. **Calcular total** (habitación + ventas)
3. **Marcar habitación** como "disponible"

---

## 💾 DATOS DE EJEMPLO INCLUIDOS

El script SQL ya trae:

```
✅ 3 usuarios (admin, gerente, recepcionista)
✅ 4 clientes de ejemplo
✅ 5 habitaciones diferentes
✅ 2 estadías activas
✅ 3 facturas (FAC-001, FAC-002, FAC-003)
✅ 8 productos de tienda
✅ 8 registros de inventario
✅ 4 ventas de ejemplo
```

**Puedes usar esto para probar todo rápidamente**

---

## 📖 GUÍA POR NIVEL

### 👶 Nivel 1: Principiante
1. Lee: **GUIA_BASE_DATOS.md**
2. Ejecuta: **roommaster_database.sql**
3. Explora en phpMyAdmin

### 👦 Nivel 2: Intermedio
1. Lee: **CONSULTAS_UTILES.md**
2. Practica: Escribe consultas en phpMyAdmin
3. Lee: **DIAGRAMA_BASE_DATOS.md**

### 👨 Nivel 3: Avanzado
1. Estudia: **backend_ejemplo.php**
2. Crea tu backend considerando:
   - Validaciones
   - Seguridad (SQL injection)
   - Manejo de errores
   - Transacciones

### 👨‍💼 Nivel 4: Experto
1. Optimiza consultas
2. Añade índices
3. Maneja concurrencia
4. Implementa cache
5. Auditoría completa

---

## 🔧 REQUISITOS TÉCNICOS

- **Servidor**: Cualquiera (puede ser local)
- **Base de datos**: MySQL 5.7 o superior
- **PHP**: 7.0 o superior (si usas backend_ejemplo.php)
- **Node.js**: 12+ (si prefieres Node.js)
- **Frontend**: Ya listo en React + Vite

---

## 🔐 SEGURIDAD IMPORTANTE

⚠️ **Para producción:**

1. **No dejes usuario en blanco:**
   ```php
   $usuario = "roommaster_user"; // No "root"
   $contraseña = "contraseña_segura"; // No vacío
   ```

2. **Usa prepared statements:**
   ```php
   // ❌ MAL:
   $sql = "SELECT * FROM clientes WHERE email = '$email'";
   
   // ✅ BIEN:
   $stmt = $conexion->prepare("SELECT * FROM clientes WHERE email = ?");
   $stmt->bind_param("s", $email);
   $stmt->execute();
   ```

3. **Valida siempre los datos:**
   ```php
   if(!filter_var($email, FILTER_VALIDATE_EMAIL)) {
       echo "Email inválido";
   }
   ```

4. **Encripta contraseñas:**
   ```php
   $hash = password_hash($contraseña, PASSWORD_DEFAULT);
   ```

---

## 📞 SOLUCIÓN DE PROBLEMAS

### P: "Base de datos ya existe"
**R:** Que se ejecute el script dos veces es normal, todo está bien.

### P: "Error de conexión"
**R:** Verifica que MySQL esté corriendo en XAMPP/WAMP.

### P: "No veo los datos"
**R:** Haz clic en Actualizar o F5.

### P: "¿Cómo conecto desde Python?"
**R:** Usa `mysql-connector-python` o similar:
```python
import mysql.connector
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="roommaster_db"
)
```

---

## 📊 PRÓXIMOS PASOS

**1. Entiende la estructura**
   - Lee DIAGRAMA_BASE_DATOS.md
   - Explora las tablas en phpMyAdmin

**2. Aprende las consultas**
   - Practica con CONSULTAS_UTILES.md
   - Escribe tus propias consultas

**3. Crea tu backend**
   - Usa backend_ejemplo.php como referencia
   - Implementa los endpoints para tu frontend

**4. Conecta con el frontend**
   - El frontend en React ya existe
   - Solo necesitas un API que devuelva JSON

**5. Incrementa seguridad**
   - Valida todos los inputs
   - Usa autenticación con tokens
   - Encripta datos sensibles

---

## 🎓 TIPS PARA ESTUDIANTES SENA

1. **ENTIENDE, no copies:**
   - Comprende por qué cada componente existe
   - Lee los comentarios en el código
   - Pregunta a tu instructor

2. **PRACTICA:**
   - Crea tus propias consultas
   - Experimenta en phpMyAdmin
   - No tengas miedo de hacer errores

3. **DOCUMENTA:**
   - Comenta tu código
   - Explica qué hace cada función
   - Mantén notas de aprendizaje

4. **ESTRUCTURA:**
   - Mantén tu código organizado
   - Separa lógica de presentación
   - Reutiliza código

5. **PRUEBA:**
   - Prueba todos los casos
   - Intenta romper tu sistema
   - Corrige errores

---

## 📞 ¿PREGUNTAS?

Consulta con:
- ✅ Tu instructor del SENA
- ✅ La documentación en este archivo
- ✅ Busca en Google el tema específico
- ✅ Practica en phpMyAdmin

---

## 🎉 ¡FELICIDADES!

Ya tienes:
- ✅ Base de datos diseñada y estructurada
- ✅ Datos de ejemplo para probar
- ✅ Funciones PHP listas para usar
- ✅ Documentación completa
- ✅ Frontend en React ya montado

**Ahora solo necesitas:**
1. Entender cómo funciona
2. Conectar tu backend con el frontend
3. ¡Implementar tu hotel! 🏨

---

## 🇨🇴 Hecho en Colombia

Desarrollado para estudiantes del SENA.

Versión: 1.0.0
Última actualización: Febrero 2026

**¡A programar se dijo!** 💻
