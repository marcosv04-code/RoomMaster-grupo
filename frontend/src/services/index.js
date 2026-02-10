import api from './api'

// Autenticación
export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password })
    return response.data
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData)
    return response.data
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },
}

// Habitaciones
export const roomService = {
  getAll: async () => {
    const response = await api.get('/habitaciones')
    return response.data
  },

  getById: async (id) => {
    const response = await api.get(`/habitaciones/${id}`)
    return response.data
  },

  create: async (data) => {
    const response = await api.post('/habitaciones', data)
    return response.data
  },

  update: async (id, data) => {
    const response = await api.put(`/habitaciones/${id}`, data)
    return response.data
  },

  delete: async (id) => {
    const response = await api.delete(`/habitaciones/${id}`)
    return response.data
  },
}

// Clientes
export const clientService = {
  getAll: async () => {
    const response = await api.get('/clientes')
    return response.data
  },

  getById: async (id) => {
    const response = await api.get(`/clientes/${id}`)
    return response.data
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
