// Importar librerías de React
import React from 'react'
import ReactDOM from 'react-dom/client'

// Importar el componente principal de la aplicación
import App from './App.jsx'

// Importar los estilos globales (CSS que se aplica a toda la app)
import './styles/global.css'

// Importar configuración de Sweetalert
import { initSwalTheme } from './services/swalConfig'

// ============================================
// PUNTO DE ENTRADA DE LA APLICACIÓN
// ============================================
// Este archivo inicializa React y monta la aplicación
// en el elemento con id="root" del HTML

// Inicializar los estilos de Sweetalert para dark mode
initSwalTheme()

// Obtener el elemento raíz del DOM (en index.html)
const elemento_raiz = document.getElementById('root')

// Crear la raíz de React
const raiz_react = ReactDOM.createRoot(elemento_raiz)

// Renderizar la aplicación
raiz_react.render(
  // React.StrictMode ayuda a detectar problemas en la aplicación
  // durante el desarrollo
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
