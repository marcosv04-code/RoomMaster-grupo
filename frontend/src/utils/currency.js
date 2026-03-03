/**
 * Utilidades para formatear moneda en pesos colombianos (COP)
 */

/**
 * Formatea un número a pesos colombianos
 * @param {number} value - Valor a formatear
 * @param {boolean} showSymbol - Si incluir el símbolo COP (default: true)
 * @returns {string} - Valor formateado (ej: "COP 150.000" o "150.000")
 */
export const formatCOP = (value, showSymbol = true) => {
  const num = parseFloat(value || 0)
  const formatted = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num)
  
  return formatted
}

/**
 * Formatea un número con decimales en pesos colombianos
 * @param {number} value - Valor a formatear
 * @returns {string} - Valor formateado (ej: "COP 150.000,50")
 */
export const formatCOPWithDecimals = (value) => {
  const num = parseFloat(value || 0)
  const formatted = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num)
  
  return formatted
}

/**
 * Formatea un número para mostrar en miles (ej: 15K)
 * @param {number} value - Valor a formatear
 * @returns {string} - Valor formateado en miles
 */
export const formatThousands = (value) => {
  const num = parseFloat(value || 0)
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(0)}K`
  }
  return num.toString()
}

export default {
  formatCOP,
  formatCOPWithDecimals,
  formatThousands
}
