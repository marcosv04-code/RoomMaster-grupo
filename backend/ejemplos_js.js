/**
 * ============================================
 * EJEMPLOS DE USO DEL API DESDE JAVASCRIPT
 * Copiar en tu frontend React
 * ============================================
 */

// URL base del API
const API_URL = 'http://localhost/roommaster/backend';

// ============================================
// 1. FUNCIONES BÁSICAS
// ============================================

// Función genérica para hacer peticiones
async function hacerPeticion(endpoint, metodo = 'GET', datos = null) {
    const opciones = {
        method: metodo,
        headers: {
            'Content-Type': 'application/json'
        }
    };
    
    if (datos) {
        opciones.body = JSON.stringify(datos);
    }
    
    try {
        const respuesta = await fetch(`${API_URL}/${endpoint}`, opciones);
        const resultado = await respuesta.json();
        return resultado;
    } catch (error) {
        console.error('Error:', error);
        return { success: false, mensaje: 'Error de conexión' };
    }
}

// ============================================
// 2. AUTENTICACIÓN
// ============================================

async function login(email, contraseña) {
    const resultado = await hacerPeticion('login.php', 'POST', {
        email: email,
        contraseña: contraseña
    });
    
    if (resultado.success) {
        // Guardar token y usuario
        localStorage.setItem('token', resultado.datos.token);
        localStorage.setItem('usuario', JSON.stringify(resultado.datos.usuario));
    }
    
    return resultado;
}

// Ejemplo de uso:
// login('admin@roommaster.com', 'admin123').then(res => {
//     if (res.success) {
//         console.log('Login exitoso:', res.datos.usuario);
//     } else {
//         console.log('Error:', res.mensaje);
//     }
// });

// ============================================
// 3. CLIENTES
// ============================================

async function obtenerClientes() {
    return await hacerPeticion('clientes.php', 'GET');
}

async function obtenerCliente(id) {
    return await hacerPeticion(`clientes.php?id=${id}`, 'GET');
}

async function crearCliente(nombre, email, telefono, documento = '', ciudad = '') {
    return await hacerPeticion('clientes.php', 'POST', {
        nombre: nombre,
        email: email,
        telefono: telefono,
        documento_identidad: documento,
        tipo_documento: 'cedula',
        ciudad: ciudad
    });
}

async function actualizarCliente(id, nombre, email, telefono) {
    return await hacerPeticion('clientes.php', 'PUT', {
        id: id,
        nombre: nombre,
        email: email,
        telefono: telefono
    });
}

async function eliminarCliente(id) {
    return await hacerPeticion('clientes.php', 'DELETE', {
        id: id
    });
}

// Ejemplos:
// obtenerClientes().then(res => console.log(res.datos));
// crearCliente('Pedro Gómez', 'pedro@email.com', '3001234567', '9999999999', 'Cali');

// ============================================
// 4. FACTURAS
// ============================================

async function obtenerFacturas(estado = null) {
    let endpoint = 'facturas.php';
    if (estado) {
        endpoint += `?estado=${estado}`;
    }
    return await hacerPeticion(endpoint, 'GET');
}

async function crearFactura(estadia_id, cliente_id, subtotal, impuesto, total, metodo_pago = '') {
    return await hacerPeticion('facturas.php', 'POST', {
        estadia_id: estadia_id,
        cliente_id: cliente_id,
        subtotal: subtotal,
        impuesto: impuesto,
        total: total,
        estado: 'Pendiente',
        metodo_pago: metodo_pago
    });
}

async function marcarFacturaComoPagada(id, metodo_pago = 'tarjeta') {
    return await hacerPeticion('facturas.php', 'PUT', {
        id: id,
        estado: 'Pagada',
        metodo_pago: metodo_pago
    });
}

// Ejemplos:
// obtenerFacturas('Pagada').then(res => console.log(res.datos));
// crearFactura(1, 1, 450, 50, 500, 'tarjeta').then(res => console.log(res.datos.numero_factura));

// ============================================
// 5. PRODUCTOS
// ============================================

async function obtenerProductos(categoria = null) {
    let endpoint = 'productos.php';
    if (categoria) {
        endpoint += `?categoria=${categoria}`;
    }
    return await hacerPeticion(endpoint, 'GET');
}

async function crearProducto(nombre, precio, categoria, descripcion = '', stock = 0) {
    return await hacerPeticion('productos.php', 'POST', {
        nombre: nombre,
        precio: precio,
        categoria: categoria,
        descripcion: descripcion,
        stock: stock
    });
}

async function actualizarProducto(id, nombre, precio, stock) {
    return await hacerPeticion('productos.php', 'PUT', {
        id: id,
        nombre: nombre,
        precio: precio,
        stock: stock
    });
}

async function eliminarProducto(id) {
    return await hacerPeticion('productos.php', 'DELETE', {
        id: id
    });
}

// Ejemplos:
// obtenerProductos('bebidas').then(res => console.log(res.datos));
// crearProducto('Jugo de Naranja', 6.00, 'bebidas', 'Jugo natural', 50);

// ============================================
// 6. VENTAS
// ============================================

async function obtenerVentas(estadia_id = null) {
    let endpoint = 'ventas.php';
    if (estadia_id) {
        endpoint += `?estadia_id=${estadia_id}`;
    }
    return await hacerPeticion(endpoint, 'GET');
}

async function registrarVenta(estadia_id, producto_id, cantidad, factura_id = 0, huésped = '') {
    return await hacerPeticion('ventas.php', 'POST', {
        estadia_id: estadia_id,
        producto_id: producto_id,
        cantidad: cantidad,
        factura_id: factura_id,
        huésped: huésped
    });
}

// Ejemplos:
// obtenerVentas(1).then(res => console.log(res.datos));
// registrarVenta(1, 2, 3, 1, 'Juan Pérez').then(res => console.log(res.mensaje));

// ============================================
// 7. ESTADÍAS
// ============================================

async function obtenerEstadias(estado = null) {
    let endpoint = 'estadias.php';
    if (estado) {
        endpoint += `?estado=${estado}`;
    }
    return await hacerPeticion(endpoint, 'GET');
}

async function crearEstadia(cliente_id, habitacion_id, fecha_entrada, fecha_salida, numero_huespedes = 1) {
    return await hacerPeticion('estadias.php', 'POST', {
        cliente_id: cliente_id,
        habitacion_id: habitacion_id,
        fecha_entrada: fecha_entrada,
        fecha_salida: fecha_salida,
        numero_huespedes: numero_huespedes
    });
}

async function completarEstadia(id, precio_total = 0) {
    return await hacerPeticion('estadias.php', 'PUT', {
        id: id,
        estado: 'completada',
        precio_total: precio_total
    });
}

// Ejemplos:
// obtenerEstadias('activa').then(res => console.log(res.datos));
// crearEstadia(1, 1, '2026-02-10', '2026-02-15', 2);

// ============================================
// 8. REPORTES
// ============================================

async function obtenerReportes(tipo = 'general') {
    return await hacerPeticion(`reportes.php?tipo=${tipo}`, 'GET');
}

async function obtenerDashboard() {
    return await hacerPeticion('reportes.php?tipo=dashboard', 'GET');
}

// Ejemplos:
// obtenerDashboard().then(res => {
//     console.log('Huéspedes actuales:', res.datos.dashboard.huespedes_actuales);
//     console.log('Habitaciones disponibles:', res.datos.dashboard.habitaciones_disponibles);
// });

// ============================================
// 9. USAR EN REACT (EJEMPLO)
// ============================================

/*
En tu componente React, puedes usarlo así:

import { useState, useEffect } from 'react'

export function ClientesPage() {
    const [clientes, setClientes] = useState([])
    const [loading, setLoading] = useState(true)
    
    useEffect(() => {
        cargarClientes()
    }, [])
    
    async function cargarClientes() {
        const res = await obtenerClientes()
        if (res.success) {
            setClientes(res.datos)
        }
        setLoading(false)
    }
    
    async function handleCrearCliente(nombre, email, telefono) {
        const res = await crearCliente(nombre, email, telefono)
        if (res.success) {
            // Recargar lista
            cargarClientes()
            alert('Cliente creado')
        } else {
            alert('Error: ' + res.mensaje)
        }
    }
    
    if (loading) return <div>Cargando...</div>
    
    return (
        <div>
            <h1>Clientes</h1>
            {clientes.map(cliente => (
                <div key={cliente.id}>
                    {cliente.nombre} - {cliente.email}
                </div>
            ))}
        </div>
    )
}
*/

// ============================================
// 10. EXPORTAR FUNCIONES
// ============================================

export {
    hacerPeticion,
    login,
    obtenerClientes,
    crearCliente,
    actualizarCliente,
    eliminarCliente,
    obtenerFacturas,
    crearFactura,
    marcarFacturaComoPagada,
    obtenerProductos,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    obtenerVentas,
    registrarVenta,
    obtenerEstadias,
    crearEstadia,
    completarEstadia,
    obtenerReportes,
    obtenerDashboard
};
