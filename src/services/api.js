/**
 * ============================================
 * CONFIGURACIÓN DEL API PARA ROOMMASTER
 * Backend: PHP en localhost/RoomMaster_Prueba/backend
 * Frontend: React en localhost:3002
 * ============================================
 */

import axios from 'axios';

// ============================================
// CONFIGURAR SEGÚN TU RUTA DE PROYECTO
// ============================================

// Si copiaste en: C:/xampp/htdocs/roommaster/
const API_BASE_URL = 'http://localhost/RoomMaster_Prueba/backend';

// Si copiaste en otra carpeta, cambia aquí:
// const API_BASE_URL = 'http://localhost/tuCarpeta/backend';

// ============================================
// CREAR INSTANCIA DE AXIOS
// ============================================

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: false // Si necesitas credenciales, cambia a true
});

// ============================================
// INTERCEPTOR: AGREGAR TOKEN EN REQUESTS
// ============================================

api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

// ============================================
// INTERCEPTOR: MANEJAR RESPUESTAS
// ============================================

api.interceptors.response.use(
    response => {
        // Si success: false, tratarlo como error
        if (response.data && response.data.success === false) {
            return Promise.reject(new Error(response.data.mensaje || 'Error desconocido'));
        }
        return response;
    },
    error => {
        if (error.response?.status === 401) {
            // Token expirado o inválido
            localStorage.removeItem('token');
            localStorage.removeItem('usuario');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// ============================================
// FUNCIONES DE AUTENTICACIÓN
// ============================================

export const authService = {
    login: (email, contraseña) => 
        api.post('/login.php', { email, contraseña }),
    
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
    },
    
    getToken: () => localStorage.getItem('token'),
    
    getUsuario: () => {
        const usuario = localStorage.getItem('usuario');
        return usuario ? JSON.parse(usuario) : null;
    }
};

// ============================================
// FUNCIONES DE CLIENTES
// ============================================

export const clientesService = {
    obtener: () => api.get('/clientes.php'),
    
    obtenerPorId: (id) => api.get(`/clientes.php?id=${id}`),
    
    crear: (cliente) => api.post('/clientes.php', cliente),
    
    actualizar: (id, cliente) => 
        api.put('/clientes.php', { id, ...cliente }),
    
    eliminar: (id) => api.delete('/clientes.php', { data: { id } })
};

// ============================================
// FUNCIONES DE FACTURAS
// ============================================

export const facturasService = {
    obtener: (estado = null) => {
        const endpoint = estado 
            ? `/facturas.php?estado=${estado}` 
            : '/facturas.php';
        return api.get(endpoint);
    },
    
    crear: (factura) => api.post('/facturas.php', factura),
    
    actualizar: (id, factura) => 
        api.put('/facturas.php', { id, ...factura }),
    
    marcarPagada: (id, metodo_pago = 'efectivo') =>
        api.put('/facturas.php', { 
            id, 
            estado: 'Pagada',
            metodo_pago 
        }),
    
    eliminar: (id) => api.delete('/facturas.php', { data: { id } })
};

// ============================================
// FUNCIONES DE PRODUCTOS
// ============================================

export const productosService = {
    obtener: (categoria = null) => {
        const endpoint = categoria 
            ? `/productos.php?categoria=${categoria}` 
            : '/productos.php';
        return api.get(endpoint);
    },
    
    crear: (producto) => api.post('/productos.php', producto),
    
    actualizar: (id, producto) => 
        api.put('/productos.php', { id, ...producto }),
    
    eliminar: (id) => api.delete('/productos.php', { data: { id } })
};

// ============================================
// FUNCIONES DE VENTAS
// ============================================

export const ventasService = {
    obtener: (estadia_id = null) => {
        const endpoint = estadia_id 
            ? `/ventas.php?estadia_id=${estadia_id}` 
            : '/ventas.php';
        return api.get(endpoint);
    },
    
    registrar: (venta) => api.post('/ventas.php', venta)
};

// ============================================
// FUNCIONES DE ESTADÍAS
// ============================================

export const stadasService = {
    obtener: (estado = null) => {
        const endpoint = estado 
            ? `/estadias.php?estado=${estado}` 
            : '/estadias.php';
        return api.get(endpoint);
    },
    
    crear: (estadia) => api.post('/estadias.php', estadia),
    
    actualizar: (id, estadia) => 
        api.put('/estadias.php', { id, ...estadia }),
    
    completar: (id, precio_total = 0) =>
        api.put('/estadias.php', { 
            id, 
            estado: 'completada',
            precio_total 
        })
};

// ============================================
// FUNCIONES DE REPORTES
// ============================================

export const reportesService = {
    getDashboard: () => api.get('/reportes.php?tipo=dashboard'),
    
    getIngresos: () => api.get('/reportes.php?tipo=ingresos'),
    
    getOcupacion: () => api.get('/reportes.php?tipo=ocupacion'),
    
    getProductos: () => api.get('/reportes.php?tipo=productos'),
    
    getClientes: () => api.get('/reportes.php?tipo=clientes'),
    
    getGeneral: () => api.get('/reportes.php')
};

// ============================================
// EXPORTAR INSTANCIA PRINCIPAL
// ============================================

export default api;

// ============================================
// MANEJO DE ERRORES CENTRALIZADO
// ============================================

export const handleError = (error) => {
    let mensaje = 'Error desconocido';
    
    if (error.response) {
        // Error del servidor
        mensaje = error.response.data?.mensaje || 
                  `Error ${error.response.status}`;
    } else if (error.request) {
        // No hay respuesta
        mensaje = 'No hay conexión con el servidor';
    } else {
        // Error en la solicitud
        mensaje = error.message;
    }
    
    console.error('Error:', mensaje);
    return mensaje;
};
