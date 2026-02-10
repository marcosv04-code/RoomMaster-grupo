import { createContext, useState, useEffect } from 'react'

export const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Cargar preferencia de tema al montar
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark')
    } else {
      // Verificar preferencia del sistema
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setIsDarkMode(prefersDark)
    }
    setIsLoading(false)
  }, [])

  // Aplicar tema al documento cuando cambie
  useEffect(() => {
    if (!isLoading) {
      document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light')
      localStorage.setItem('theme', isDarkMode ? 'dark' : 'light')
    }
  }, [isDarkMode, isLoading])

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, isLoading }}>
      {children}
    </ThemeContext.Provider>
  )
}
