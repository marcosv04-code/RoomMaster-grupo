import { useContext } from 'react'
import { ThemeContext } from '../context/ThemeContext'

/**
 * Hook useTheme: Accede a la configuración del tema de la aplicación
 * 
 * Este es un "custom hook" que simplifica el acceso al contexto del tema.
 * Permite a los componentes acceder a la configuración del tema oscuro/claro
 * y cambiar entre ellos.
 * 
 * Retorna un objeto con:
 * - isDarkMode: booleano que indica si está en modo oscuro
 * - toggleTheme: función para cambiar entre temas
 * - isLoading: indica si se está cargando la configuración
 * 
 * Ejemplo de uso:
 *   const { isDarkMode, toggleTheme } = useTheme()
 * 
 * @throws Error si se usa fuera del ThemeProvider
 */
export function useTheme() {
  // Obtener el contexto del tema
  const ctx_tema = useContext(ThemeContext)
  
  // Validación: verificar que se use dentro del ThemeProvider
  if (!ctx_tema) {
    const error_msg = 'useTheme debe ser usado dentro del ThemeProvider'
    throw new Error(error_msg)
  }
  
  // Retornar el contexto
  return ctx_tema
}
