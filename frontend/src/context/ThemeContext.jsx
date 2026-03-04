import { createContext, useState, useEffect } from 'react'

// Crear el contexto para el tema
export const ThemeContext = createContext()

/**
 * ThemeProvider: Componente proveedor del contexto de tema
 * 
 * Este componente permite que toda la aplicación
 * acceda a la configuración del tema (claro/oscuro)
 * 
 * @param {Object} props - Props del componente
 * @param {ReactNode} props.children - Componentes hijos
 */
export function ThemeProvider({ children }) {
  // Estado para saber si estamos en modo oscuro
  const [modo_oscuro, setModOscuro] = useState(false)
  
  // Estado para saber si aún está cargando
  const [esta_cargando, setEstaCargando] = useState(true)

  // Efecto: Cargar preferencia de tema al montar el componente
  useEffect(() => {
    // Intentar obtener el tema guardado del localStorage
    const tema_guardado = localStorage.getItem('theme')
    
    if (tema_guardado) {
      // Si hay un tema guardado, usarlo
      const es_modo_oscuro = tema_guardado === 'dark'
      setModOscuro(es_modo_oscuro)
    } else {
      // Si no hay tema guardado, detectar preferencia del sistema
      const prefiere_oscuro = window.matchMedia('(prefers-color-scheme: dark)').matches
      setModOscuro(prefiere_oscuro)
    }
    
    // Indicar que terminó de cargar
    setEstaCargando(false)
  }, [])

  // Efecto: Aplicar el tema al documento cuando cambie
  useEffect(() => {
    if (!esta_cargando) {
      // Determinar el valor del tema
      const valor_tema = modo_oscuro ? 'dark' : 'light'
      
      // Aplicar el tema al elemento raíz del documento
      document.documentElement.setAttribute('data-theme', valor_tema)
      
      // Guardar la preferencia en localStorage
      localStorage.setItem('theme', valor_tema)
    }
  }, [modo_oscuro, esta_cargando])

  // Función para cambiar entre temas
  const cambiar_tema = function () {
    setModOscuro(!modo_oscuro)
  }

  // Retornar el proveedor de contexto
  return (
    <ThemeContext.Provider value={{ isDarkMode: modo_oscuro, toggleTheme: cambiar_tema, isLoading: esta_cargando }}>
      {children}
    </ThemeContext.Provider>
  )
}
