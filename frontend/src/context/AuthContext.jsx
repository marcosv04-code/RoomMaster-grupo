import { createContext, useState, useEffect } from 'react'

// Crear el contexto de autenticación
// Este contexto será utilizado en toda la aplicación para gestionar el estado de autenticación
export const AuthContext = createContext()

/**
 * AuthProvider: Componente proveedor del contexto de autenticación
 * 
 * Este componente envuelve la aplicación y proporciona funciones para:
 * - Conocer si el usuario está autenticado (isAuthenticated)
 * - Acceder a los datos del usuario (user)
 * - Iniciar sesión (login)
 * - Cerrar sesión (logout)
 * - Saber si se está cargando (loading)
 * 
 * Los datos del usuario se guardan en localStorage para persistencia
 */
export function AuthProvider({ children }) {
  // Estados del contexto
  const [user, setUser] = useState(null)              // Datos del usuario actual
  const [loading, setLoading] = useState(true)        // Estado de carga
  const [isAuthenticated, setIsAuthenticated] = useState(false)  // Si está autenticado

  // useEffect: Se ejecuta cuando el componente se monta
  // Verifica si hay un usuario guardado en localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    
    if (storedUser) {
      try {
        // Convertir el JSON guardado en objeto JavaScript
        setUser(JSON.parse(storedUser))
        setIsAuthenticated(true)
      } catch (error) {
        console.error('Error al recuperar usuario:', error)
        // Si hay error, limpiar el localStorage
        localStorage.removeItem('user')
      }
    }
    
    // Finalizar la carga
    setLoading(false)
  }, [])

  /**
   * Función login: Autentica al usuario
   * 
   * @param {Object} userData - Datos del usuario con estructura:
   *   - id: número único del usuario
   *   - name: nombre del usuario
   *   - email: correo electrónico
   *   - role: 'admin' o 'receptionist' (tipo de usuario)
   */
  const login = (userData) => {
    // userData debe contener: name, email, role (admin o receptionist)
    setUser(userData)
    setIsAuthenticated(true)
    // Guardar en localStorage para que persista entre recargas
    localStorage.setItem('user', JSON.stringify(userData))
  }

  /**
   * Función logout: Cierra la sesión del usuario
   * Limpia todos los datos de autenticación
   */
  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    // Limpiar todos los datos guardados
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  // Valor que se compartirá en todo el contexto
  const value = {
    user,            // Datos del usuario actual
    loading,         // Si está cargando
    isAuthenticated, // Si está autenticado
    login,           // Función para iniciar sesión
    logout           // Función para cerrar sesión
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
