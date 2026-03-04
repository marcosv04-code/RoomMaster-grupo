import api from './api'

// ============================================
// SERVICIO DE AUTENTICACIÓN
// ============================================
// Contiene funciones para login, register, logout
export const authService = {
  // Función para hacer login
  login: async function (email, password) {
    const respuesta = await api.post('/auth/login', { email, password })
    const datos = respuesta.data
    return datos
  },

  // Función para registrarse
  register: async function (userData) {
    const respuesta = await api.post('/auth/register', userData)
    const datos = respuesta.data
    return datos
  },

  // Función para logout
  logout: function () {
    // Eliminar el token del almacenamiento
    localStorage.removeItem('token')
    // Eliminar los datos del usuario
    localStorage.removeItem('user')
  },
}

// ============================================
// SERVICIO DE HABITACIONES
// ============================================
// Operaciones CRUD para habitaciones
export const roomService = {
  // Obtener todas las habitaciones
  getAll: async function () {
    const respuesta = await api.get('/habitaciones')
    const datos = respuesta.data
    return datos
  },

  // Obtener una habitación por ID
  getById: async function (id) {
    const url = `/habitaciones/${id}`
    const respuesta = await api.get(url)
    const datos = respuesta.data
    return datos
  },

  // Crear una nueva habitación
  create: async function (data) {
    const respuesta = await api.post('/habitaciones', data)
    const datos = respuesta.data
    return datos
  },

  // Actualizar una habitación
  update: async function (id, data) {
    const url = `/habitaciones/${id}`
    const respuesta = await api.put(url, data)
    const datos = respuesta.data
    return datos
  },

  // Eliminar una habitación
  delete: async function (id) {
    const url = `/habitaciones/${id}`
    const respuesta = await api.delete(url)
    const datos = respuesta.data
    return datos
  },
}

// ============================================
// SERVICIO DE CLIENTES
// ============================================
// Operaciones CRUD para clientes
export const clientService = {
  // Obtener todos los clientes
  getAll: async function () {
    const respuesta = await api.get('/clientes')
    const datos = respuesta.data
    return datos
  },

  // Obtener un cliente por ID
  getById: async function (id) {
    const url = `/clientes/${id}`
    const respuesta = await api.get(url)
    const datos = respuesta.data
    return datos
  },

  create: async (data) => {
    const response = await api.post('/clientes', data)
    return response.data
  },

  update: async (id, data) => {
    const response = await api.put(`/clientes/${id}`, data)
    return response.data
  },

  delete: async (id) => {
    const response = await api.delete(`/clientes/${id}`)
    return response.data
  },
}

// Estadías
export const stayService = {
  getAll: async () => {
    const response = await api.get('/estadias')
    return response.data
  },

  getById: async (id) => {
    const response = await api.get(`/estadias/${id}`)
    return response.data
  },

  create: async (data) => {
    const response = await api.post('/estadias', data)
    return response.data
  },

  update: async (id, data) => {
    const response = await api.put(`/estadias/${id}`, data)
    return response.data
  },

  delete: async (id) => {
    const response = await api.delete(`/estadias/${id}`)
    return response.data
  },
}

// Reportes
export const reportService = {
  getOccupancy: async () => {
    const response = await api.get('/reportes/ocupacion')
    return response.data
  },

  getRevenue: async () => {
    const response = await api.get('/reportes/ingresos')
    return response.data
  },

  getGuests: async () => {
    const response = await api.get('/reportes/huespedes')
    return response.data
  },
}

// Facturación
export const billingService = {
  getInvoices: async () => {
    const response = await api.get('/facturas')
    return response.data
  },

  createInvoice: async (data) => {
    const response = await api.post('/facturas', data)
    return response.data
  },

  getInvoiceById: async (id) => {
    const response = await api.get(`/facturas/${id}`)
    return response.data
  },
}
