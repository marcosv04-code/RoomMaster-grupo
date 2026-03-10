import Swal from 'sweetalert2'

/**
 * Obtiene la configuración de Sweetalert según el tema actual
 * @returns {Object} Configuración base para Sweetalert según el tema
 */
export const getSwalConfig = () => {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark'
  
  if (isDark) {
    return {
      background: 'var(--color-card-background)',
      color: 'var(--color-text)',
      confirmButtonColor: 'var(--brand-primary)',
      cancelButtonColor: 'var(--color-border)',
      focusConfirm: true,
      customClass: {
        popup: 'swal-dark-popup',
        title: 'swal-dark-title',
        htmlContainer: 'swal-dark-html',
        confirmButton: 'swal-dark-confirm',
        cancelButton: 'swal-dark-cancel',
        input: 'swal-dark-input',
        textarea: 'swal-dark-textarea',
        select: 'swal-dark-select'
      }
    }
  }
  
  // Tema claro (por defecto)
  return {
    confirmButtonColor: 'var(--brand-primary)',
    cancelButtonColor: '#d33',
    focusConfirm: true
  }
}

/**
 * Wrapper de Swal.fire() que aplica automáticamente el tema
 * @param {Object} config - Configuración de Sweetalert
 * @returns {Promise} Promesa de Sweetalert
 */
export const fireSwal = (config) => {
  const baseConfig = getSwalConfig()
  return Swal.fire({ ...baseConfig, ...config })
}

/**
 * Configuración global de Sweetalert para todo el proyecto
 */
export const initSwalTheme = () => {
  const style = document.createElement('style')
  style.innerHTML = `
    /* ============================================ */
    /* SWEETALERT2 - DARK MODE STYLING */
    /* ============================================ */
    
    /* Base popup styling */
    [data-theme="dark"] .swal2-popup {
      background: var(--color-card-background) !important;
      color: var(--color-text) !important;
      border: var(--border-width) solid var(--color-border) !important;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3) !important;
    }
    
    /* Title styling */
    [data-theme="dark"] .swal2-title {
      color: var(--color-text) !important;
      font-size: 24px !important;
      font-weight: 700 !important;
    }
    
    /* HTML container (message) */
    [data-theme="dark"] .swal2-html-container {
      color: var(--color-text) !important;
    }
    
    /* Input field */
    [data-theme="dark"] .swal2-input {
      background: var(--color-background-secondary) !important;
      color: var(--color-text) !important;
      border: var(--border-width) solid var(--color-border) !important;
      border-radius: 4px !important;
    }
    
    [data-theme="dark"] .swal2-input::placeholder {
      color: var(--color-text-secondary) !important;
    }
    
    [data-theme="dark"] .swal2-input:focus {
      border-color: var(--brand-primary) !important;
      box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1) !important;
    }
    
    /* Textarea */
    [data-theme="dark"] .swal2-textarea {
      background: var(--color-background-secondary) !important;
      color: var(--color-text) !important;
      border: var(--border-width) solid var(--color-border) !important;
      border-radius: 4px !important;
    }
    
    [data-theme="dark"] .swal2-textarea::placeholder {
      color: var(--color-text-secondary) !important;
    }
    
    [data-theme="dark"] .swal2-textarea:focus {
      border-color: var(--brand-primary) !important;
      box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1) !important;
    }
    
    /* Select dropdown */
    [data-theme="dark"] .swal2-select {
      background: var(--color-background-secondary) !important;
      color: var(--color-text) !important;
      border: var(--border-width) solid var(--color-border) !important;
      border-radius: 4px !important;
    }
    
    [data-theme="dark"] .swal2-select option {
      background: var(--color-card-background) !important;
      color: var(--color-text) !important;
    }
    
    /* Buttons */
    [data-theme="dark"] .swal2-confirm,
    [data-theme="dark"] .swal2-cancel,
    [data-theme="dark"] .swal2-deny {
      border: none !important;
      border-radius: 4px !important;
      font-weight: 600 !important;
      transition: var(--transition) !important;
      padding: 10px 24px !important;
      font-size: 14px !important;
    }
    
    /* Confirm button (primary) */
    [data-theme="dark"] .swal2-confirm {
      background: var(--brand-primary) !important;
      color: white !important;
    }
    
    [data-theme="dark"] .swal2-confirm:hover {
      background: var(--brand-primary-dark) !important;
    }
    
    [data-theme="dark"] .swal2-confirm:focus {
      box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.3) !important;
    }
    
    /* Cancel button (secondary) */
    [data-theme="dark"] .swal2-cancel {
      background: var(--color-border) !important;
      color: var(--color-text) !important;
    }
    
    [data-theme="dark"] .swal2-cancel:hover {
      background: var(--color-background-secondary) !important;
    }
    
    /* Deny button */
    [data-theme="dark"] .swal2-deny {
      background: #f44336 !important;
      color: white !important;
    }
    
    [data-theme="dark"] .swal2-deny:hover {
      background: #d32f2f !important;
    }
    
    /* Icons */
    [data-theme="dark"] .swal2-icon {
      border-color: var(--color-border) !important;
    }
    
    [data-theme="dark"] .swal-icon__content {
      color: var(--color-text) !important;
    }
    
    /* Success icon */
    [data-theme="dark"] .swal2-success .swal2-success-ring {
      border-color: var(--color-success) !important;
    }
    
    [data-theme="dark"] .swal2-success .swal2-success-fix {
      background: var(--color-card-background) !important;
    }
    
    /* Error icon */
    [data-theme="dark"] .swal2-error .swal2-x-mark {
      color: #f44336 !important;
    }
    
    /* Warning icon */
    [data-theme="dark"] .swal2-warning [class*='swal2-animate-x-mark'] {
      color: #FFB74D !important;
    }
    
    /* Steps */
    [data-theme="dark"] .swal2-progress-steps .swal2-progress-step {
      background: var(--brand-primary) !important;
      color: white !important;
    }
    
    [data-theme="dark"] .swal2-progress-steps .swal2-progress-step.active {
      background: var(--brand-primary-dark) !important;
    }
    
    [data-theme="dark"] .swal2-progress-steps .swal2-progress-step-line {
      background: var(--color-border) !important;
    }
    
    /* Radio buttons and checkboxes */
    [data-theme="dark"] .swal2-radio,
    [data-theme="dark"] .swal2-checkbox {
      color: var(--color-text) !important;
    }
    
    [data-theme="dark"] [type="radio"]:checked,
    [data-theme="dark"] [type="checkbox"]:checked {
      background: var(--brand-primary) !important;
      border-color: var(--brand-primary) !important;
    }
  `
  document.head.appendChild(style)
}

