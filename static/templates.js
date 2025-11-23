window.JARVIS_TEMPLATES = {
    CSS_TGR: `/* -- ESTILOS TGR (Estilos) | v2.2 | CSS | 2025-11-01
-- ARQUITECTA: Aria Castellanos (v31.0)
-- LOG: v2.2 - Fusionadas todas las clases del módulo de Carga CSV (v1.9)
--           - Fusionadas clases de Sorting y corrección de hover (v2.2)
--           - Fusionadas clases de centrado de tablas (v2.1)
--           - Fusionadas clases de iconos lucide (v2.0)
*/
:root {
  --tgr-blue-dark: #003366;
  --tgr-blue-medium: #0072CE;
  --tgr-blue-light: #E6F1F9;
  --text-primary: #1a202c;
  --text-secondary: #4a5568;
  --border-color: #e2e8f0;
  --background-color: #f4f7fa;
  --card-background: #ffffff;
  --danger-color: #e53e3e;
  --danger-color-hover: #c53030;
  --success-color: #28a745;
  --data-item-background: #f8fafc; /* (Añadido v2.0) */
  --z-index-modal-backdrop: 2000;
  --z-index-modal: 2001;
  --z-index-select2-dropdown: 2150;
  --z-index-confirm-modal-backdrop: 2200;
  --z-index-confirm-modal: 2201;
  --z-index-notification: 9999;
}
body {
  font-family: 'Inter', sans-serif;
  background-color: var(--background-color);
  color: var(--text-primary);
  margin: 0;
}
.sca-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}
.sca-header-card {
  background-color: var(--card-background);
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  padding: 20px;
  border: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-left: 5px solid var(--tgr-blue-medium);
  margin-bottom: 2rem;
}
.title {
  font-size: 24px;
  font-weight: 600;
  color: var(--tgr-blue-dark);
  margin: 0 0 5px 0;
}
.subtitle {
  font-size: 16px;
  color: var(--text-secondary);
  margin: 0;
}
.header-logo {
  height: 40px;
}
.filter-card {
  background-color: var(--card-background);
  padding: 1.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  margin-bottom: 2rem;
  display: flex;
  align-items: flex-end;
  gap: 1rem;
  flex-wrap: wrap;
}
.control-group {
  flex: 1 1 200px;
}
.filter-card label {
  display: block;
  font-weight: 500;
  margin-bottom: .5rem;
  font-size: 0.875rem;
  color: var(--text-primary);
}
.filter-card input, .filter-card select {
  width: 100%;
  height: 42px;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  padding: 0 12px;
  background-color: #f8fafc;
  color: var(--text-secondary);
}
.grid-card {
  background-color: var(--card-background);
  border-radius: .75rem;
  box-shadow: 0 1px 3px rgba(0,0,0,.05);
  overflow: hidden;
  border: 1px solid var(--border-color);
}
.sca-table {
  width: 100%;
  border-collapse: collapse;
}
.sca-table thead th {
  background-color: var(--tgr-blue-dark);
  color: white;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  padding: 12px 16px;
  text-align: center; /* (Corregido v2.1) */
  vertical-align: middle;
}
/* Centrar cabecera de Acciones */
.sca-table thead th.actions-cell {
  text-align: center;
}
.sca-table tbody tr {
  border-bottom: 1px solid var(--border-color);
}
.sca-table tbody tr:nth-child(even) {
  background-color: #f8fafc;
}
.sca-table tbody tr:hover {
  background-color: var(--tgr-blue-light);
}
/* Centrar contenido de celdas de la grilla principal */
.sca-table tbody td {
  padding: 12px 16px;
  color: var(--text-secondary);
  font-size: 14px;
  text-align: center; /* (Añadido v2.0) */
  vertical-align: middle;
}
.actions-cell {
  text-align: right;
}
/* Centrar celda de acciones (botones) */
.sca-table tbody td.actions-cell {
  text-align: center;
}

/* Celda de 'No hay datos' o 'Cargando' (Añadido v2.0) */
.no-data-cell {
  text-align: center; 
  padding: 2rem;
  color: var(--text-secondary);
}

.expandable-card-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.expandable-card {
  background-color: var(--card-background);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow: hidden;
}
.card-header {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  cursor: pointer;
  align-items: center;
  list-style: none;
}
.card-header::-webkit-details-marker {
  display: none;
}
.card-header-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.5rem 1rem;
  flex-grow: 1;
}
.card-header-field {
  font-size: 14px;
}
.card-header-field label {
  opacity: 0.7;
}
.card-header-field span {
  font-weight: 600;
}
.card-actions {
  display: flex;
  gap: 0.5rem;
}
.card-details {
  padding: 1rem;
  border-top: 1px solid var(--border-color);
  background-color: #f8fafc;
}
.card-toggler {
  margin-left: auto;
  transition: transform 0.2s;
  content: ">";
}
.expandable-card[open] .card-toggler {
  transform: rotate(90deg);
}

/* --- MODALES --- */
.sca-modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
  opacity: 1;
  visibility: visible;
  transition: opacity 0.3s, visibility 0.3s;
  z-index: var(--z-index-modal-backdrop);
}
.sca-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--card-background);
  border-radius: .75rem;
  width: 90%;
  max-width: 800px;
  z-index: var(--z-index-modal);
  display: flex; /* (Añadido v2.0) */
  flex-direction: column; /* (Añadido v2.0) */
}

/* Modal CSV Grande (Añadido v2.0) */
.sca-modal-csv-upload {
    width: 95vw;
    height: 95vh;
    max-width: 95vw;
}

.sca-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
  flex-shrink: 0; /* (Añadido v2.0) */
}
.sca-modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--tgr-blue-dark);
  margin: 0;
}
.sca-modal-body {
  padding: 1.5rem;
  max-height: 70vh;
  overflow-y: auto;
  flex-grow: 1; /* (Añadido v2.0) */
}
.sca-modal-footer {
  padding: 1rem 1.5rem;
  background-color: #f8fafc;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: flex-end;
  gap: .75rem;
  border-bottom-left-radius: .75rem;
  border-bottom-right-radius: .75rem;
  flex-shrink: 0; /* (Añadido v2.0) */
}

/* --- NOTIFICACIONES --- */
.sca-notification-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: var(--z-index-notification);
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.sca-notification {
  padding: 1rem 1.5rem;
  border-radius: 8px;
  color: white;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  font-weight: 500; /* (Modificado v2.0) */
}
.sca-notification.success {
  background-color: var(--success-color);
  border-left: 4px solid #1a742f; /* (Modificado v2.0) */
}
.sca-notification.error {
  background-color: var(--danger-color);
  border-left: 4px solid #b32b2b; /* (Modificado v2.0) */
}
/* Iconos Lucide en Notificaciones (Añadido v2.0) */
.notif-icon {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
}
.sca-notification span {
    flex-grow: 1;
}

/* --- BOTONES --- */
.sca-button {
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background-color 0.2s;
  text-decoration: none;
  padding: 10px 18px;
  font-size: 14px;
}
.sca-button:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}
.sca-button-primary {
  background-color: var(--tgr-blue-medium);
  color: white;
}
.sca-button-primary:hover {
  background-color: var(--tgr-blue-dark);
}
.sca-button-danger {
  background-color: var(--danger-color);
  color: white;
}
.sca-button-danger:hover {
  background-color: var(--danger-color-hover);
}
.sca-button-secondary {
  background-color: #6c757d;
  color: white;
}
.sca-button-secondary:hover {
  background-color: #5a6268;
}
.sca-button-icon {
  background-color: transparent;
  padding: 8px;
  border-radius: 50%;
  color: var(--text-secondary);
}
.sca-button-icon:hover {
  background-color: rgba(0,0,0,0.05);
  color: var(--text-primary);
}

/* --- SELECT2 Y FORMULARIOS (Base) --- */
.select2-container--default .select2-selection--single {
  height: 42px;
  border-color: var(--border-color);
  border-radius: 0.5rem;
}
.select2-container--default .select2-selection--single .select2-selection__rendered {
  line-height: 40px;
  padding-left: 12px;
  font-size: 14px;
  color: var(--text-primary);
}
.select2-container--default .select2-selection--single .select2-selection__placeholder {
  font-size: 14px;
  color: #999;
}
.select2-container--default .select2-selection--single .select2-selection__arrow {
  height: 40px;
}

/* --- CLASES DE COMPONENTES (Añadidos v2.0) --- */

.welcome-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  background-color: var(--background-color);
  padding: 20px;
  font-family: "Poppins", Arial, sans-serif;
}
.welcome-card {
  background: var(--card-background);
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  text-align: center;
  padding: 40px 50px;
  max-width: 600px;
  width: 100%;
  border-top: 5px solid var(--tgr-blue-medium);
}
.welcome-icon {
  margin-bottom: 25px;
}
.welcome-icon img {
  max-width: 250px;
  height: auto;
}
.welcome-card h1 {
  color: var(--text-primary);
  font-weight: 600;
  font-size: 2em;
  margin: 0 0 15px 0;
}
.welcome-card p {
  color: var(--text-secondary);
  font-size: 1.1em;
  line-height: 1.6;
  margin: 0;
}
.sca-report-container-full-width {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}
.report-header-card {
  background-color: var(--card-background);
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  padding: 20px;
  border: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-left: 5px solid var(--tgr-blue-medium);
  margin-bottom: 2rem;
}
.report-header-card .title {
  font-size: 24px;
  font-weight: 600;
  color: var(--tgr-blue-dark);
  margin: 0 0 5px 0;
}
.report-header-card .subtitle {
  font-size: 16px;
  color: var(--text-secondary);
  margin: 0;
}
.report-tabs {
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 2rem;
}
.report-tabs .tab-link {
  cursor: pointer;
  display: inline-block;
  padding: 0.75rem 0.25rem;
  margin-right: 2rem;
  text-decoration: none;
  color: var(--text-secondary);
  font-weight: 600;
  border-bottom: 3px solid transparent;
  transition: all 0.2s ease-in-out;
}
.report-tabs .tab-link.active {
  color: var(--tgr-blue-medium);
  border-bottom-color: var(--tgr-blue-medium);
}
.tab-pane {
  display: none;
}
.tab-pane.active {
  display: block;
}
.filter-container-rut {
  margin-bottom: 1.5rem;
}
.sub-report-tabs {
  border-bottom: 1px solid var(--border-color);
  margin: 0 0 1rem 0;
  padding: 0;
}
.sub-report-tabs .sub-tab-link {
  background: none;
  border: none;
  cursor: pointer;
  display: inline-block;
  padding: 0.75rem 1.5rem;
  margin-right: 0.5rem;
  margin-bottom: -1px;
  text-decoration: none;
  color: var(--text-secondary);
  font-weight: 500;
  border-bottom: 2px solid transparent;
  font-size: 1rem;
}
.sub-report-tabs .sub-tab-link.active {
  color: var(--tgr-blue-dark);
  border-bottom-color: var(--tgr-blue-dark);
  font-weight: 600;
}
.sub-tab-pane {
  display: none;
}
.sub-tab-pane.active {
  display: block;
}
.data-grid-item {
  background-color: var(--card-background);
  border-radius: 0.75rem;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  border: 1px solid var(--border-color);
  margin-bottom: 1rem;
}
.data-grid-item.expanded {
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  border-color: #90cdf4;
}
.item-header {
  background-color: var(--tgr-blue-dark);
  color: white;
  padding: 1rem 1.5rem;
  border-top-left-radius: 0.75rem;
  border-top-right-radius: 0.75rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}
.item-header-title {
  font-size: 1.2rem;
  font-weight: 600;
}
.item-header-subtitle {
  font-size: 0.9rem;
  opacity: 0.8;
}
.item-toggle-icon {
  transition: transform 0.3s ease-in-out;
}
.data-grid-item.expanded .item-toggle-icon {
  transform: rotate(180deg);
}
.item-body-grid-container {
  display: none;
  padding: 1.5rem;
  background-color: #fcfdff;
}
.body-section-title {
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--tgr-blue-dark);
  border-bottom: 2px solid var(--tgr-blue-light);
  padding-bottom: 0.5rem;
  margin-bottom: 1.5rem;
  margin-top: 2.5rem;
}
.body-section-title:first-child {
  margin-top: 0;
}
.mini-card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
}
.data-item {
  background-color: var(--data-item-background);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  transition: all 0.2s ease-in-out;
}
.data-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.06);
}
.data-item-label {
  display: block;
  font-size: 0.88rem;
  font-weight: 500;
  color: var(--text-secondary);
  text-transform: capitalize;
  margin-bottom: 0.25rem;
}
.data-item-value {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
}
.loading-spinner-pane {
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--card-background);
  border-radius: 0.5rem;
}
.loading-spinner-pane::after {
  content: '';
  height: 2.5rem;
  width: 2.5rem;
  border-radius: 9999px;
  border-width: 4px;
  border-color: rgba(0, 114, 206, 0.2);
  border-top-color: var(--tgr-blue-medium);
  animation: spin 0.8s linear infinite;
}
/* (Añadido v2.0) */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.no-data-message-alt {
  padding: 1.5rem;
  text-align: center;
  color: var(--text-secondary);
  background-color: var(--card-background);
  border-radius: 0.5rem;
  border: 1px solid var(--border-color);
}
.disabled-tab {
  opacity: 0.5;
  pointer-events: none;
}
.card-selection-btn {
  white-space: nowrap;
}

/* --- SECCIÓN DE FORMULARIOS Y CSV (Añadido v2.0) --- */

.sca-modal-body input[type="text"],
.sca-modal-body input[type="number"],
.sca-modal-body input[type="date"] {
    width: 100%;
    height: 42px;
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    padding: 0 12px;
    background-color: #f8fafc;
    color: var(--text-secondary);
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    box-sizing: border-box; 
}
.form-grid-container-v4 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem 1.5rem;
}

/* --- ESTILOS DE ORDENAMIENTO (Añadido v2.0, Corregido v2.2) --- */
.sortable-header {
    cursor: pointer;
    transition: background-color 0.2s;
    user-select: none;
}
/* (v2.2) CORREGIDO: Fondo blanco reemplazado por azul más claro */
.sortable-header:hover {
    background-color: #004a8a; /* Lighter blue for hover */
}
/* (v2.2) NUEVO: Estilo para cabecera activa (ordenada) */
.sortable-header.sort-asc,
.sortable-header.sort-desc {
    background-color: #005aa0; /* Azul medio para activa */
}
.sort-icon {
    width: 14px;
    height: 14px;
    margin-left: 8px;
    opacity: 0.4;
    vertical-align: -2px;
}
.sortable-header.sort-asc .sort-icon,
.sortable-header.sort-desc .sort-icon {
    opacity: 1.0;
}

/* --- ESTILOS DE CARGA CSV (Añadido v2.0, Compactado v1.9) --- */
.csv-instructions {
    background: #fdeeee; 
    padding: 0.5rem 1rem; 
    border-radius: 6px;
    border-left: 4px solid var(--danger-color, #dc3545);
    margin: 0 auto 0.75rem auto; 
    width: 100%; 
    box-sizing: border-box; 
}
.csv-instructions h3 {
    margin-top: 0.25rem; 
    margin-bottom: 0.25rem; 
    font-size: 1rem; 
}
.csv-instructions h4 {
    margin: 0.25rem 0; 
    font-size: 0.8rem; 
}
.csv-instructions p {
    font-size: 0.8rem; 
    margin: 0.25rem 0; 
}
.csv-instructions ul {
    margin: 0.25rem 0 0.25rem 1rem; 
    padding-left: 0.5rem; 
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.25rem; 
    font-size: 0.75rem; 
    list-style: none; 
}
.csv-instructions li {
    background: #fffafb; 
    border: 1px solid #fdd; 
    border-radius: 4px; 
    padding: 0.25rem 0.5rem; 
}
.csv-instructions code {
    background: var(--surface-primary, #ffffff);
    padding: 2px 6px;
    border-radius: 3px;
    font-family: 'Courier New', monospace;
    font-size: 0.9em;
}
.csv-instructions pre {
    background: #f4f4f4; 
    padding: 0.25rem; 
    border-radius: 4px; 
    font-size: 0.75em; 
    margin: 0.25rem 0 0 0; 
    white-space: pre-wrap; 
    word-break: break-all; 
}

.csv-preview-container {
    margin-top: 1rem; 
    max-height: 400px;
    overflow-y: auto;
}
.csv-validation-results {
    font-size: 0.95em;
}
/* Iconos Lucide en Validación CSV (Añadido v2.0) */
.val-icon {
    width: 1em;
    height: 1em;
    margin-right: 0.5rem;
    vertical-align: -0.15em;
}
.validation-success {
    background: #d4edda;
    border: 1px solid #c3e6cb;
    color: #155724;
    padding: 1rem;
    border-radius: 6px;
    margin-bottom: 1rem;
}
.validation-errors {
    background: #f8d7da;
    border: 1px solid #f5c6cb;
    color: #721c24;
    padding: 1rem;
    border-radius: 6px;
    margin-bottom: 1rem;
}
.validation-warnings {
    background: #fff3cd;
    border: 1px solid #ffeaa7;
    color: #856404;
    padding: 1rem;
    border-radius: 6px;
    margin-bottom: 1rem;
}
.validation-errors ul,
.validation-warnings ul {
    margin: 0.5rem 0 0 1.5rem;
}
.csv-preview-table {
    margin-top: 1rem;
    overflow-x: auto;
}
/* Centrado en tabla CSV (Añadido v2.0) */
.csv-preview-table table {
    font-size: 0.85em;
    width: 100%; 
    border-collapse: collapse; 
}
.csv-preview-table table thead th {
    text-align: center; 
    padding: 8px; 
    background-color: var(--tgr-blue-dark); 
    color: white; 
}
.csv-preview-table table tbody td {
    text-align: center; 
    padding: 8px; 
    border: 1px solid var(--border-color); 
}

/* Progress Bar (Añadido v2.0) */
.csv-progress-container {
    margin-top: 1.5rem;
    text-align: center;
}
.csv-progress-bar-bg {
    width: 100%;
    height: 24px;
    background: var(--surface-secondary, #e9ecef);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);
}
.csv-progress-bar {
    height: 100%;
    background: linear-gradient(90deg, var(--primary-color, #007bff) 0%, #0056b3 100%);
    transition: width 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 600;
}
.csv-progress-text {
    display: block;
    margin-top: 0.5rem;
    font-weight: 600;
    color: var(--text-primary, #212529);
}

/* Loading Spinner (Añadido v2.0) */
.loading-spinner {
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 3px solid rgba(0,0,0,0.1);
    border-top-color: var(--primary-color, #007bff);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}
/* Keyframes movido desde .loading-spinner-pane::after (v2.0) */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}`,
    PLSQL_AJAX: `-- [NOMBRE_MODULO] (Plantillas AJAX) | v7.0 (Arquitectura Definitiva Corregida) | PLSQL | 2025-10-23
-- LOG: Versión final perfeccionada (v6.0) y corregida para Prompt Maestro v29.0.
--      1. Se estandarizan todas las claves JSON a minúsculas para un contrato de datos robusto con el JS.
--      2. Extracción de datos desde JSON robusta (manejo de nulos, trim).
--      3. TODOS los procesos tienen manejo de excepciones.
--      4. (NUEVO) Se añaden comillas dobles a todos los alias de SELECT para cumplir la Directiva de Sensibilidad de Mayúsculas. (Corrección Inconsistencia #2)

-- ==================================================================
-- PROCESO: CREATE_RECORD
-- ==================================================================
DECLARE
    l_json_str VARCHAR2(32767) := APEX_APPLICATION.G_X01;
    l_new_pk   NUMBER;
    -- Declarar una variable por cada campo del JSON (usar tipos de dato correctos)
    p_columna_1     VARCHAR2(4000);
    p_columna_fk_id NUMBER;
    p_fecha_1       DATE;
BEGIN
    -- Parsear el JSON enviado desde el frontend
    APEX_JSON.PARSE(l_json_str);
    
    -- Extraer y limpiar cada valor del JSON
    -- Usar las claves 'name' en minúsculas definidas en el JS
    p_columna_1     := TRIM(APEX_JSON.GET_VARCHAR2(p_path => 'columna_1'));
    p_columna_fk_id := APEX_JSON.GET_NUMBER(p_path => 'columna_fk_id');
    p_fecha_1       := TO_DATE(APEX_JSON.GET_VARCHAR2(p_path => 'fecha_1'), 'YYYY-MM-DD');

    -- Obtener la nueva clave primaria de la secuencia
    SELECT [NOMBRE_SECUENCIA].NEXTVAL INTO l_new_pk FROM DUAL;

    -- Insertar el nuevo registro en la tabla
    INSERT INTO [NOMBRE_TABLA] (
        [COLUMNA_PK], 
        [COLUMNA_1],
        [COLUMNA_FK],
        [COLUMNA_FECHA_1]
    ) VALUES (
        l_new_pk, 
        p_columna_1,
        p_columna_fk_id,
        p_fecha_1
    );

    COMMIT;
    
    -- Devolver una respuesta JSON exitosa
    APEX_JSON.OPEN_OBJECT;
    APEX_JSON.WRITE('status', 'success');
    APEX_JSON.WRITE('newId', l_new_pk);
    APEX_JSON.WRITE('newText', p_columna_1 || ' (ID: ' || l_new_pk || ')'); 
    APEX_JSON.CLOSE_OBJECT;
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        APEX_JSON.OPEN_OBJECT;
        APEX_JSON.WRITE('status', 'error');
        APEX_JSON.WRITE('message', 'Error al crear el registro: ' || SQLERRM);
        APEX_JSON.CLOSE_OBJECT;
END;


-- ==================================================================
-- PROCESO: UPDATE_RECORD
-- ==================================================================
DECLARE
    l_json_str VARCHAR2(32767) := APEX_APPLICATION.G_X01;
    -- Declarar una variable por cada campo del JSON
    p_pk            NUMBER;
    p_columna_1     VARCHAR2(4000);
    p_columna_fk_id NUMBER;
    p_fecha_1       DATE;
BEGIN
    APEX_JSON.PARSE(l_json_str);
    
    -- Extraer la PK y los demás valores del JSON
    p_pk            := APEX_JSON.GET_NUMBER(p_path => 'pk');
    p_columna_1     := TRIM(APEX_JSON.GET_VARCHAR2(p_path => 'columna_1'));
    p_columna_fk_id := APEX_JSON.GET_NUMBER(p_path => 'columna_fk_id');
    p_fecha_1       := TO_DATE(APEX_JSON.GET_VARCHAR2(p_path => 'fecha_1'), 'YYYY-MM-DD');

    IF p_pk IS NULL THEN
        RAISE_APPLICATION_ERROR(-20002, 'No se puede actualizar un registro sin ID.');
    END IF;

    -- Actualizar el registro
    UPDATE [NOMBRE_TABLA] SET
        [COLUMNA_1] = p_columna_1,
        [COLUMNA_FK] = p_columna_fk_id,
        [COLUMNA_FECHA_1] = p_fecha_1
    WHERE [COLUMNA_PK] = p_pk;

    COMMIT;

    APEX_JSON.OPEN_OBJECT;
    APEX_JSON.WRITE('status', 'success');
    APEX_JSON.CLOSE_OBJECT;
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        APEX_JSON.OPEN_OBJECT;
        APEX_JSON.WRITE('status', 'error');
        APEX_JSON.WRITE('message', 'Error al actualizar: ' || SQLERRM);
        APEX_JSON.CLOSE_OBJECT;
END;


-- ==================================================================
-- PROCESO: DELETE_RECORD
-- ==================================================================
DECLARE
    p_id NUMBER := TO_NUMBER(APEX_APPLICATION.G_X01);
BEGIN
    DELETE FROM [NOMBRE_TABLA] WHERE [COLUMNA_PK] = p_id;
    COMMIT;
    APEX_JSON.OPEN_OBJECT;
    APEX_JSON.WRITE('status', 'success');
    APEX_JSON.CLOSE_OBJECT;
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        APEX_JSON.OPEN_OBJECT;
        APEX_JSON.WRITE('status', 'error');
        APEX_JSON.WRITE('message', 'Error al eliminar: ' || SQLERRM);
        APEX_JSON.CLOSE_OBJECT;
END;


-- ==================================================================
-- PROCESO: GET_DATA
-- ==================================================================
DECLARE
    p_filter_id VARCHAR2(100) := APEX_APPLICATION.G_X01;
BEGIN
    APEX_JSON.OPEN_OBJECT;
    APEX_JSON.OPEN_ARRAY('items');
    FOR rec IN (
        SELECT
            t.[COLUMNA_PK] AS "pk",
            t.[COLUMNA_1]  AS "columna_1",
            t.[COLUMNA_FECHA_1] AS "fecha_1",
            ref.NOMBRE AS "nombre_referencia"
        FROM [NOMBRE_TABLA] t
        LEFT JOIN [TABLA_REFERENCIA] ref ON t.[COLUMNA_FK] = ref.[ID_REF]
        WHERE (p_filter_id IS NULL OR p_filter_id = 'ALL' OR t.[COLUMNA_PK] = TO_NUMBER(p_filter_id))
        ORDER BY t.[COLUMNA_PK] DESC
    ) LOOP
        APEX_JSON.OPEN_OBJECT;
        APEX_JSON.WRITE('pk', rec.pk);
        APEX_JSON.WRITE('columna_1', rec.columna_1);
        APEX_JSON.WRITE('fecha_1', TO_CHAR(rec.fecha_1, 'DD/MM/YYYY'));
        APEX_JSON.WRITE('nombre_referencia', rec.nombre_referencia);
        APEX_JSON.CLOSE_OBJECT;
    END LOOP;
    APEX_JSON.CLOSE_ARRAY;
    APEX_JSON.CLOSE_OBJECT;
EXCEPTION
    WHEN OTHERS THEN
        APEX_JSON.OPEN_OBJECT;
        APEX_JSON.WRITE('status', 'error');
        APEX_JSON.WRITE('message', 'Error al cargar los datos del reporte: ' || SQLERRM);
        APEX_JSON.CLOSE_OBJECT;
END;


-- ==================================================================
-- PROCESO: GET_SINGLE_RECORD
-- ==================================================================
DECLARE
    p_id NUMBER := TO_NUMBER(APEX_APPLICATION.G_X01);
    l_count NUMBER := 0;
BEGIN
    APEX_JSON.OPEN_OBJECT;
    FOR rec IN (
        SELECT
            t.[COLUMNA_PK] AS "pk",
            t.[COLUMNA_1] AS "columna_1",
            t.[COLUMNA_FECHA_1] AS "fecha_1",
            t.[COLUMNA_FK] AS "columna_fk_id",
            ref.NOMBRE AS "columna_fk_id_text" -- El sufijo _text es reconocido por el JS
        FROM [NOMBRE_TABLA] t
        LEFT JOIN [TABLA_REFERENCIA] ref ON t.[COLUMNA_FK] = ref.[ID_REF]
        WHERE t.[COLUMNA_PK] = p_id
    ) LOOP
        APEX_JSON.OPEN_OBJECT('item');
        APEX_JSON.WRITE('pk', rec.pk);
        APEX_JSON.WRITE('columna_1', rec.columna_1);
        APEX_JSON.WRITE('fecha_1', TO_CHAR(rec.fecha_1, 'YYYY-MM-DD'));
        APEX_JSON.WRITE('columna_fk_id', rec.columna_fk_id);
        APEX_JSON.WRITE('columna_fk_id_text', rec.columna_fk_id_text);
        APEX_JSON.CLOSE_OBJECT;
        l_count := 1;
    END LOOP;
    
    IF l_count > 0 THEN 
        APEX_JSON.WRITE('status', 'success');
    ELSE 
        APEX_JSON.WRITE('status', 'error'); 
        APEX_JSON.WRITE('message', 'Registro no encontrado.'); 
    END IF;
    
    APEX_JSON.CLOSE_OBJECT;
EXCEPTION
    WHEN OTHERS THEN
        APEX_JSON.OPEN_OBJECT;
        APEX_JSON.WRITE('status', 'error');
        APEX_JSON.WRITE('message', 'Error al obtener el registro: ' || SQLERRM);
        APEX_JSON.CLOSE_OBJECT;
END;


-- ==================================================================
-- PROCESO: GET_FILTRO
-- ==================================================================
DECLARE
    l_search_term VARCHAR2(100) := APEX_APPLICATION.G_X01;
BEGIN
    APEX_JSON.OPEN_OBJECT;
    APEX_JSON.OPEN_ARRAY('items');
    
    IF l_search_term IS NULL THEN
        APEX_JSON.OPEN_OBJECT;
        APEX_JSON.WRITE('id', 'ALL');
        APEX_JSON.WRITE('text', '--- Todos los Registros ---');
        APEX_JSON.CLOSE_OBJECT;
    END IF;

    FOR rec IN (
        SELECT 
            [COLUMNA_PK] as "id",
            [COLUMNA_TEXTO] || ' (ID: ' || [COLUMNA_PK] || ')' as "text"
        FROM [NOMBRE_TABLA]
        WHERE (l_search_term IS NULL OR UPPER([COLUMNA_TEXTO]) LIKE '%' || UPPER(l_search_term) || '%')
        ORDER BY [COLUMNA_PK] DESC
        FETCH FIRST 50 ROWS ONLY
    ) LOOP
        APEX_JSON.OPEN_OBJECT;
        APEX_JSON.WRITE('id', rec.id);
        APEX_JSON.WRITE('text', rec.text);
        APEX_JSON.CLOSE_OBJECT;
    END LOOP;
    
    APEX_JSON.CLOSE_ARRAY;
    APEX_JSON.CLOSE_OBJECT;
EXCEPTION
    WHEN OTHERS THEN
        APEX_JSON.OPEN_OBJECT;
        APEX_JSON.WRITE('status', 'error');
        APEX_JSON.WRITE('message', 'Error al buscar en el filtro: ' || SQLERRM);
        APEX_JSON.CLOSE_OBJECT;
END;


-- ==================================================================
-- PROCESO GENÉRICO PARA SELECTORES (Ej: GET_TIPOS_CLIENTE)
-- ==================================================================
DECLARE
    l_search_term VARCHAR2(100) := APEX_APPLICATION.G_X01;
BEGIN
    APEX_JSON.OPEN_OBJECT;
    APEX_JSON.OPEN_ARRAY('items');
    FOR rec IN (
        SELECT 
            [COLUMNA_ID_SELECTOR] as "id",
            [COLUMNA_TEXTO_SELECTOR] as "text"
        FROM [TABLA_SELECTOR]
        WHERE (l_search_term IS NULL OR UPPER([COLUMNA_TEXTO_SELECTOR]) LIKE '%' || UPPER(l_search_term) || '%')
        ORDER BY 2
        FETCH FIRST 50 ROWS ONLY
    ) LOOP
        APEX_JSON.OPEN_OBJECT;
        APEX_JSON.WRITE('id', rec.id);
        APEX_JSON.WRITE('text', rec.text);
        APEX_JSON.CLOSE_OBJECT;
    END LOOP;
    APEX_JSON.CLOSE_ARRAY;
    APEX_JSON.CLOSE_OBJECT;
EXCEPTION
    WHEN OTHERS THEN
        APEX_JSON.OPEN_OBJECT;
        APEX_JSON.WRITE('status', 'error');
        APEX_JSON.WRITE('message', 'Error al cargar datos del selector: ' || SQLERRM);
        APEX_JSON.CLOSE_OBJECT;
END;`,
    HTML_TEMPLATE: `<!-- TEMPLATE LAYOUT (Página Única con Modal) | v20.1 (Directiva CSS Cero - Verificado) -->
<!-- LOG: Verificado como 100% compatible con el Prompt Maestro v29.0 (Observación #3). Sin cambios de código. -->
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>[TÍTULO_PAGINA]</title>
    <!-- Las librerías CSS (Google Fonts, Select2) y JS (jQuery, Select2, Lucide) DEBEN cargarse en las Propiedades de la Página de APEX -->
</head>
<body>
    <div class="sca-container">
        <header class="sca-header-card">
            <div>
                <h1 class="title">[TÍTULO_REPORTE]</h1>
                <p class="subtitle">[SUBTÍTULO_REPORTE]</p>
            </div>
            <img src="https://www.tgr.cl/wp-content/uploads/2020/02/tgr-logo-horizontal.svg" alt="Logo TGR" class="header-logo">
        </header>
        
        <section class="filter-card">
            <div class="control-group">
                <label for="p_filtro">[ETIQUETA_FILTRO]</label>
                <!-- Se elimina style="width: 100%;" asumiendo que la clase TGR lo maneja -->
                <select id="p_filtro"></select>
            </div>
            <button type="button" id="create-btn-header" class="sca-button sca-button-primary">
                <i data-lucide="plus-circle"></i><span>Crear Nuevo</span>
            </button>
        </section>
        
        <!-- Se reemplaza la clase 'hidden' por el estilo inline permitido por la Regla #6 -->
        <div id="details-container" style="display: none;"></div>
    </div>

    <!-- Modal Principal del Formulario -->
    <div id="form-modal" class="sca-modal-backdrop">
        <div class="sca-modal">
            <header class="sca-modal-header">
                <h2 id="modal-title" class="sca-modal-title"></h2>
                <!-- Se eliminan estilos inline del botón. La clase 'sca-button-icon' debe ser suficiente -->
                <button type="button" id="close-modal-btn" class="sca-button-icon"><i data-lucide="x"></i></button>
            </header>
            <div class="sca-modal-body">
                <!-- El JS poblará este grid. El CSS TGR debe definir el estilo para este ID si se desea un grid. -->
                <div id="form-fields-grid"></div>
            </div>
            <footer class="sca-modal-footer">
                <!-- Se reemplaza la clase 'hidden' por el estilo inline permitido -->
                <button type="button" id="delete-btn" class="sca-button sca-button-danger" style="display: none;"><i data-lucide="trash-2"></i><span>Eliminar</span></button>
                <button type="button" id="save-btn" class="sca-button sca-button-primary" disabled><i data-lucide="check-circle"></i><span>Guardar Cambios</span></button>
            </footer>
        </div>
    </div>

    <!-- Modal de Confirmación -->
    <div id="confirm-modal" class="sca-modal-backdrop">
        <div class="sca-modal">
            <header class="sca-modal-header">
                 <h3 id="confirm-title" class="sca-modal-title">Confirmación Requerida</h3>
            </header>
            <div class="sca-modal-body">
                <p id="confirm-message"></p>
            </div>
            <footer class="sca-modal-footer">
                <button type="button" id="confirm-no-btn" class="sca-button sca-button-secondary">Cancelar</button>
                <button type="button" id="confirm-yes-btn" class="sca-button sca-button-primary">Sí, continuar</button>
            </footer>
        </div>
    </div>

    <!-- Contenedor de Notificaciones -->
    <div id="sca-notification-container"></div>
    
    <!-- Las librerías JS (jQuery, Select2, Lucide) se eliminaron de aquí y DEBEN cargarse en las Propiedades de la Página de APEX -->
</body>
</html>`,
    JS_TEMPLATE: `// [NOMBRE_MODULO] (Lógica de Página Única) | v6.0 (Arquitectura Autónoma Corregida) | JS | 2025-10-23
// LOG: Versión v5.0 corregida para compatibilidad con Prompt Maestro v29.0.
//      1. (NUEVO) La función generateFormFields() ahora construye el formulario dinámicamente.
//      2. (NUEVO) La función renderCards() construye el reporte dinámicamente.
//      3. (NUEVO) Spinner manual reemplazado por 'loadingIndicator' nativo de APEX. (Corrección Inconsistencia #1)
$(function() {
    // =================================================================================
    // --- ZONA DE CONFIGURACIÓN DINÁMICA ---
    // Modifica esta sección para adaptar el CRUD a tu tabla específica.
    // =================================================================================
    const AJAX_PROCESS_NAMES = {
        GET_FILTRO: 'GET_FILTRO',
        GET_DATA: 'GET_DATA',
        GET_SINGLE_RECORD: 'GET_SINGLE_RECORD',
        CREATE: 'CREATE_RECORD',
        UPDATE: 'UPDATE_RECORD',
        DELETE: 'DELETE_RECORD',
        // Añade aquí los procesos AJAX para tus selectores dinámicos
        // Ejemplo: GET_TIPOS_CLIENTE: 'GET_TIPOS_CLIENTE'
    };

    // Define la estructura de tu formulario y reporte.
    // - name: Es la clave del JSON (en minúsculas) que se envía y recibe del backend. DEBE COINCIDIR CON EL ALIAS DEL PL/SQL.
    // - id:   Es el sufijo del ID del elemento HTML (ej: sca-form-COLUMNA_1).
    // - label: El texto que verá el usuario.
    // - type: 'text', 'date', 'number', 'select'.
    // - required: true o false.
    // - ajax (solo para type: 'select'): El nombre del proceso AJAX que carga sus datos.
    const FORM_FIELDS = [
        { name: 'columna_1', id: 'COLUMNA_1', label: 'Nombre Principal', type: 'text', required: true },
        { name: 'columna_fk_id', id: 'COLUMNA_FK_ID', label: 'Tipo de Cliente', type: 'select', required: true, ajax: 'GET_TIPOS_CLIENTE' },
        { name: 'fecha_1', id: 'FECHA_1', label: 'Fecha de Registro', type: 'date', required: false },
    ];
    
    // Define si el reporte debe cargar los datos de "Todos" al iniciar la página.
    const LOAD_DATA_ON_INIT = false;
    // --- FIN ZONA DE CONFIGURACIÓN ---


    // --- Selectores de UI (Cache) ---
    const $body = $('body');
    const $filter = $('#p_filtro');
    const $detailsContainer = $('#details-container');
    const $formModal = $('#form-modal');
    const $modalTitle = $('#modal-title');
    const $formFieldsGrid = $('#form-fields-grid');
    const $saveBtn = $('#save-btn');
    const $deleteBtn = $('#delete-btn');
    const $confirmModal = $('#confirm-modal');
    const $confirmMessage = $('#confirm-message');
    const FORM_ID_PREFIX = 'sca-form-';
    let currentRecordId = null;
    let confirmAction = null;

    // --- LÓGICA DE AJAX (ROBUSTA CON APEX.SERVER.PROCESS Y SPINNER) ---
    // Funciones showLoader/hideLoader eliminadas para cumplir con la Directiva de Spinner.

    function callAjax(processName, params = {}, options = {}) {
        // Spinner manual eliminado.
        console.log(\`DEBUG ARIA: Iniciando llamada AJAX a "\${processName}" con parámetros:\`, params);
        apex.server.process(processName, params, {
            loadingIndicator: $body, // <--- CORRECCIÓN (Inconsistencia #1)
            success: (data) => {
                console.log(\`DEBUG ARIA: Respuesta exitosa de "\${processName}":\`, data);
                if (data.status === 'error') {
                    console.error(\`DEBUG ARIA: Error de lógica en backend para "\${processName}":\`, data.message);
                    showNotification(data.message || 'Ocurrió un error en el servidor.', 'error');
                    if(options.error) options.error(data);
                } else {
                    if(options.success) options.success(data);
                }
            },
            error: (jqXHR, textStatus, errorThrown) => {
                console.error(\`DEBUG ARIA: Error de comunicación en AJAX "\${processName}":\`, { textStatus, errorThrown, response: jqXHR.responseText });
                showNotification('Error de comunicación con el servidor. Verifique la consola.', 'error');
                if(options.error) options.error();
            },
            // 'complete' eliminado, 'loadingIndicator' lo gestiona automáticamente.
            dataType: "json"
        });
    }

    // --- INICIALIZACIÓN ---
    function init() {
        lucide.createIcons();
        generateFormFields();
        initializeModals();
        initializeFilter();
        if (LOAD_DATA_ON_INIT) {
            $filter.append(new Option('--- Todos los Registros ---', 'ALL', true, true)).trigger('change');
            loadReportData('ALL');
        }
    }
    
    // --- LÓGICA DEL REPORTE Y FILTRO ---
    function initializeFilter() {
        $filter.select2({
            placeholder: 'Seleccione para comenzar...',
            language: "es",
            allowClear: !LOAD_DATA_ON_INIT,
            ajax: {
                transport: (params, success, failure) => callAjax(AJAX_PROCESS_NAMES.GET_FILTRO, { x01: params.data.term }, { success, error: failure }),
                processResults: data => ({ results: data.items }),
                cache: true
            }
        }).on('select2:select', e => loadReportData(e.params.data.id))
          .on('select2:unselect', () => $detailsContainer.addClass('hidden').empty());
    }

    function loadReportData(filterId) {
        $detailsContainer.removeClass('hidden');
        callAjax(AJAX_PROCESS_NAMES.GET_DATA, { x01: filterId }, {
            success: data => {
                if (data.items && data.items.length > 0) { renderCards(data.items); } 
                else { renderNoDataMessage(); }
                lucide.createIcons();
            },
            error: () => renderNoDataMessage()
        });
    }

    // --- LÓGICA DE RENDERIZADO DINÁMICO ---
    function renderCards(items) {
        const cardsHtml = items.map(item => \`
            <div class="data-record-card" data-id="\${item.pk}">
                <header class="record-card-header">
                    <div class="record-card-header-info">
                        <div class="data-point">\${item.columna_1 || 'Sin nombre'}</div>
                    </div>
                    <button type="button" class="sca-button-icon sca-button-primary edit-record-btn"><i data-lucide="edit-3"></i></button>
                </header>
                <div class="record-card-body">
                    <div class="data-item"><span class="data-item-label">ID</span><span class="data-item-value">\${item.pk}</span></div>
                    <div class="data-item"><span class="data-item-label">Fecha</span><span class="data-item-value">\${item.fecha_1 || 'N/A'}</span></div>
                    <div class="data-item"><span class="data-item-label">Referencia</span><span class="data-item-value">\${item.nombre_referencia || 'N/A'}</span></div>
                </div>
            </div>
        \`).join('');
        $detailsContainer.html(\`<div class="data-grid-container">\${cardsHtml}</div>\`);
    }

    function renderNoDataMessage() {
        $detailsContainer.html(\`
            <div class="no-data-card">
                <h3>Sin Resultados</h3>
                <p>No se encontraron registros para el filtro seleccionado.</p>
                <button type="button" id="create-from-empty-btn" class="sca-button sca-button-primary">
                    <i data-lucide="plus-circle"></i><span>Crear el Primero</span>
                </button>
            </div>
        \`);
    }

    function generateFormFields() {
        const fieldsHtml = FORM_FIELDS.map(field => {
            const inputId = \`\${FORM_ID_PREFIX}\${field.id}\`;
            const requiredAttr = field.required ? 'required' : '';
            let inputHtml = '';
            if (field.type === 'select') {
                inputHtml = \`<select id="\${inputId}" style="width:100%;" \${requiredAttr}></select>\`;
            } else {
                inputHtml = \`<input type="\${field.type}" id="\${inputId}" \${requiredAttr}>\`;
            }
            return \`<div class="form-input-group"><label for="\${inputId}">\${field.label}</label>\${inputHtml}</div>\`;
        }).join('');
        $formFieldsGrid.html(fieldsHtml);

        FORM_FIELDS.forEach(field => {
            if (field.type === 'select' && field.ajax) {
                $(\`#\${FORM_ID_PREFIX}\${field.id}\`).select2({
                    placeholder: \`Seleccione un \${field.label}...\`,
                    language: 'es',
                    dropdownParent: $formModal,
                    ajax: {
                        transport: (params, success, failure) => callAjax(AJAX_PROCESS_NAMES[field.ajax], { x01: params.data.term }, { success, error: failure }),
                        processResults: data => ({ results: data.items }),
                        cache: true
                    }
                });
            }
        });
    }

    // --- LÓGICA DE MODALES Y FORMULARIO ---
    function initializeModals() {
        $('#close-modal-btn, #form-modal').on('click', function(e) { if (e.target === this) closeFormModal(); });
        $('#confirm-no-btn, #confirm-modal').on('click', function(e) { if (e.target === this) closeConfirmModal(); });
    }
    
    function openFormModal(mode = 'create', recordId = null) {
        resetForm();
        currentRecordId = recordId ? parseInt(recordId, 10) : null;
        $modalTitle.text(mode === 'edit' ? 'Editar Registro' : 'Crear Nuevo Registro');
        $deleteBtn.toggleClass('hidden', mode !== 'edit');
        if (mode === 'edit') {
            loadRecordForEdit(currentRecordId);
        } else {
            validateForm();
        }
        $formModal.addClass('active');
    }
    
    function closeFormModal() { $formModal.removeClass('active'); }

    function loadRecordForEdit(recordId) {
        callAjax(AJAX_PROCESS_NAMES.GET_SINGLE_RECORD, { x01: recordId }, {
            success: data => {
                if (data.item) {
                    FORM_FIELDS.forEach(field => {
                        const $field = $(\`#\${FORM_ID_PREFIX}\${field.id}\`);
                        const value = data.item[field.name];
                        if (field.type === 'select') {
                            const textValue = data.item[field.name + '_text'];
                            if (textValue && value !== null) {
                                $field.append(new Option(textValue, value, true, true)).trigger('change');
                            }
                        } else {
                            $field.val(value);
                        }
                    });
                    validateForm();
                } else { 
                    showNotification('No se pudo cargar el registro para edición.', 'error');
                    closeFormModal(); 
                }
            },
            error: () => closeFormModal()
        });
    }

    function openConfirmModal(message, action) {
        $confirmMessage.text(message);
        confirmAction = action;
        $confirmModal.addClass('active');
    }

    function closeConfirmModal() { $confirmModal.removeClass('active'); confirmAction = null; }

    function resetForm() {
        $formFieldsGrid.find('input, select').val(null).trigger('change');
        currentRecordId = null;
    }
    
    function validateForm() {
        const isValid = FORM_FIELDS.every(field => !field.required || $(\`#\${FORM_ID_PREFIX}\${field.id}\`).val());
        $saveBtn.prop('disabled', !isValid);
    }

    function saveRecord() {
        let formData = {};
        FORM_FIELDS.forEach(field => { formData[field.name] = $(\`#\${FORM_ID_PREFIX}\${field.id}\`).val(); });
        if (currentRecordId) { formData.pk = currentRecordId; }

        const processName = currentRecordId ? AJAX_PROCESS_NAMES.UPDATE : AJAX_PROCESS_NAMES.CREATE;
        callAjax(processName, { x01: JSON.stringify(formData) }, {
            success: data => {
                closeFormModal();
                showNotification(currentRecordId ? '¡Registro actualizado!' : '¡Registro creado con éxito!', 'success');
                if (data.newId) { // CREATE
                    const newOption = new Option(data.newText, data.newId, true, true);
                    $filter.append(newOption).trigger('change');
                    loadReportData(data.newId);
                } else { // UPDATE
                    loadReportData($filter.val());
                }
            }
        });
    }

    function deleteRecord() {
        callAjax(AJAX_PROCESS_NAMES.DELETE, { x01: currentRecordId }, {
            success: () => {
                closeFormModal();
                showNotification('¡Registro eliminado!', 'success');
                if ($filter.val() == currentRecordId) {
                    $filter.val(null).trigger('change');
                    $detailsContainer.addClass('hidden').empty();
                } else {
                    loadReportData($filter.val());
                }
            }
        });
    }

    function showNotification(message, type = 'success') {
        const notifId = \`notif_\${Date.now()}\`;
        const $container = $('#sca-notification-container');
        const $notif = $(\`<div id="\${notifId}" class="sca-notification \${type}" style="display:none;">\${message}</div>\`);
        $container.append($notif);
        $notif.fadeIn(300);
        setTimeout(() => $notif.fadeOut(500, () => $notif.remove()), 5000);
    }

    // --- MANEJADORES DE EVENTOS ---
    $detailsContainer.on('click', '.edit-record-btn', function() { openFormModal('edit', $(this).closest('.data-record-card').data('id')); });
    $detailsContainer.on('click', '#create-from-empty-btn', () => openFormModal('create'));
    $('#create-btn-header').on('click', () => openFormModal('create'));
    $formFieldsGrid.on('change keyup', 'input, select', validateForm);
    $saveBtn.on('click', () => openConfirmModal(currentRecordId ? '¿Desea guardar los cambios?' : '¿Desea crear este nuevo registro?', saveRecord));
    $deleteBtn.on('click', () => openConfirmModal('¿Está seguro de que desea eliminar este registro?', deleteRecord));
    $('#confirm-yes-btn').on('click', () => { if (typeof confirmAction === 'function') { confirmAction(); } closeConfirmModal(); });

    // --- INICIAR LA APLICACIÓN ---
    init();
});`
};
