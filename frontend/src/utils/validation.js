/**
 * Funciones de validación PURAS - devuelven valores filtrados
 * NO modifican eventos, solo procesan strings
 */

// ===== FILTROS DE ENTRADA (para onChange handlers) =====

/**
 * Filtra solo números
 * Uso: const filtered = filterOnlyNumbers("abc123def") // "123"
 */
export const filterOnlyNumbers = (value) => {
  return value ? value.replace(/[^0-9]/g, '') : ''
}

/**
 * Filtra números con decimales (máx 2 decimales)
 * Uso: const filtered = filterNumbersDecimal("12.456") // "12.45"
 */
export const filterNumbersDecimal = (value) => {
  if (!value) return ''
  
  // Quitar todo excepto números y punto
  let filtered = value.replace(/[^0-9.]/g, '')
  
  // Prevenir múltiples puntos
  const parts = filtered.split('.')
  if (parts.length > 2) {
    filtered = parts[0] + '.' + parts[1]
  }
  
  // Máximo 2 decimales (pero no limitar cantidad de dígitos enteros)
  if (parts[1] && parts[1].length > 2) {
    filtered = parts[0] + '.' + parts[1].substring(0, 2)
  }
  
  return filtered
}

/**
 * Filtra teléfono (solo números, máx 15 dígitos)
 * Uso: const filtered = filterPhone("+34-600-000-000") // "34600000000"
 */
export const filterPhone = (value) => {
  if (!value) return ''
  
  let filtered = value.replace(/[^0-9]/g, '')
  
  // Limitar a 15 dígitos
  if (filtered.length > 15) {
    filtered = filtered.substring(0, 15)
  }
  
  return filtered
}

/**
 * Filtra documento de identidad (SOLO NÚMEROS, máx 20 caracteres)
 * Uso: const filtered = filterDocumentId("ABC-123-DEF") // "123"
 */
export const filterDocumentId = (value) => {
  if (!value) return ''
  
  // Solo números, sin letras ni caracteres especiales
  let filtered = value.replace(/[^0-9]/g, '')
  
  // Máximo 20 caracteres
  if (filtered.length > 20) {
    filtered = filtered.substring(0, 20)
  }
  
  return filtered
}

/**
 * Filtra número de habitación (SOLO NÚMEROS, máx 4 caracteres)
 * Uso: const filtered = filterRoomNumber("AB101CD") // "101"
 */
export const filterRoomNumber = (value) => {
  if (!value) return ''
  
  // Solo números
  let filtered = value.replace(/[^0-9]/g, '')
  
  // Máximo 4 caracteres para número de habitación
  if (filtered.length > 4) {
    filtered = filtered.substring(0, 4)
  }
  
  return filtered
}

/**
 * Filtra campo alfanumérico (letras y números, sin caracteres especiales)
 * Uso: const filtered = filterAlphanumeric("AB@CD#12") // "ABCD12"
 */
export const filterAlphanumeric = (value) => {
  if (!value) return ''
  
  return value.replace(/[^a-zA-Z0-9]/g, '')
}

/**
 * Filtra nombres (SOLO LETRAS Y ESPACIOS, sin números ni caracteres especiales)
 * Uso: const filtered = filterName("Juan123 Pérez@") // "Juan Pérez"
 */
export const filterName = (value) => {
  if (!value) return ''
  
  // Solo letras (a-z, A-Z), espacios y acentos/caracteres latinos
  return value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '')
}

// ===== VALIDADORES (para verificar, no filtrar) =====

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const notEmpty = (value) => {
  return value && value.trim() !== ''
}

export const minLength = (value, min) => {
  return value && value.length >= min
}

export const validPrice = (value) => {
  const price = parseFloat(value)
  return !isNaN(price) && price > 0
}

export const validQuantity = (value) => {
  const qty = parseInt(value)
  return !isNaN(qty) && qty > 0 && Number.isInteger(qty)
}

export const validDate = (dateString) => {
  const regex = /^\d{4}-\d{2}-\d{2}$/
  if (!regex.test(dateString)) return false
  const date = new Date(dateString)
  return date instanceof Date && !isNaN(date)
}

export const validDateRange = (startDate, endDate) => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  return end > start
}

// ===== FUNCIONES ÚTILES =====

/**
 * Capitaliza la primera letra de un texto
 * Uso: const capitalized = capitalizeFirstLetter("recepcion") // "Recepcion"
 * Uso: const capitalized = capitalizeFirstLetter("gerente") // "Gerente"
 */
export const capitalizeFirstLetter = (text) => {
  if (!text) return ''
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

// ===== HANDLERS LEGADOS (por compatibilidad, pueden eliminarse) =====

// Estos handlers modifican e.target.value directamente (para onInput)
export const onlyNumbers = (e) => {
  e.target.value = filterOnlyNumbers(e.target.value)
}

export const onlyNumbersDecimal = (e) => {
  e.target.value = filterNumbersDecimal(e.target.value)
}

export const onlyPhoneNumbers = (e) => {
  e.target.value = filterPhone(e.target.value)
}

export const onlyDocumentId = (e) => {
  e.target.value = filterDocumentId(e.target.value)
}
