const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const micBtn = document.getElementById('mic-btn');
const voiceSelect = document.getElementById('voice-select');
const statusIndicator = document.getElementById('status');
const rateInput = document.getElementById('rate');
const pitchInput = document.getElementById('pitch');
const volumeInput = document.getElementById('volume');
const rateVal = document.getElementById('rate-val');
const pitchVal = document.getElementById('pitch-val');
const volVal = document.getElementById('vol-val');
const showAllVoicesCheckbox = document.getElementById('show-all-voices');
const testVoiceBtn = document.getElementById('test-voice-btn');
const arcReactor = document.getElementById('jarvis-reactor');
const arcReactorContainer = document.getElementById('jarvis-reactor-container');
const msgCounter = document.getElementById('msg-count');
const timerDisplay = document.getElementById('request-timer');
const timerSpan = document.getElementById('timer-val');
let requestTimerInterval;

// Settings Modal Elements
const settingsBtn = document.getElementById('settings-btn');
const settingsModal = document.getElementById('settings-modal');
const closeModal = document.querySelector('.close-modal-btn');
const roleSelect = document.getElementById('role-select');
const roleNameInput = document.getElementById('role-name');
const systemPromptInput = document.getElementById('system-prompt');
const saveRoleBtn = document.getElementById('save-role-btn');
const newRoleBtn = document.getElementById('new-role-btn');
const deleteRoleBtn = document.getElementById('delete-role-btn');
const resetRolesBtn = document.getElementById('reset-roles-btn');

let recognition;
let synth = window.speechSynthesis;
let voices = [];
let thinkingInterval;
let conversationHistory = [];

// Gemini Configuration
const SUPPORTED_MODELS_BASE = [
    { name: 'gemini-2.5-flash', rpm: 10, rpd: 250, tpm: 250000, description: 'Rápido y versátil para tareas generales (Límites capa gratuita estándar).' },
    { name: 'gemini-flash-lite-latest', rpm: 15, rpd: 1000, tpm: 250000, description: 'Modelo ultrarrápido para conversaciones a gran escala.' },
    { name: 'gemini-2.5-pro', rpm: 5, rpd: 100, tpm: 125000, description: 'Modelo potente para tareas complejas (Límites capa gratuita estándar).' },
    { name: 'gemini-2.5-flash-image', rpm: 500, rpd: 2000, tpm: 32000, description: 'Para edición de imágenes.' },
    { name: 'imagen-4.0-generate-001', rpm: 10, rpd: 70, tpm: null, description: 'Generación de imágenes estándar (Límite no basado en TPM).' },
    { name: 'veo-2.0-generate-001', rpm: 2, rpd: 10, tpm: null, description: 'Generación de video (Límite no basado en TPM).' },
];

let SUPPORTED_MODELS = JSON.parse(localStorage.getItem('jarvis_supported_models')) || SUPPORTED_MODELS_BASE;

function saveSupportedModels() {
    localStorage.setItem('jarvis_supported_models', JSON.stringify(SUPPORTED_MODELS));
}

const DEFAULT_ARIA_CONFIG_BASE = {
    model: 'gemini-2.5-flash',
    expertModel: 'gemini-2.5-pro',
    useRestApi: true,
    apiConfigs: [
        { id: 'lara-key', label: 'Lara', apiKey: 'AIzaSyA1NxiSuQXQHWeY2Qj4v4s5RG0fVosmnKI', enabled: true },
        { id: 'sol-key', label: 'Sol', apiKey: 'AIzaSyALvpQs2rWrawlqrzfx_JlW8VR_205Lsi4', enabled: true },
        { id: 'teo-key', label: 'Teo', apiKey: 'AIzaSyDdHeozhVGdFuzJOQmu_5slT0yLD9WLbfE', enabled: true },
        { id: 'martin-key', label: 'Martin', apiKey: 'AIzaSyCgxCeVS5iOFMYOiid3_LL0ThxjnZEmNQg', enabled: true },
        { id: 'ezzio-key', label: 'Ezzio', apiKey: 'AIzaSyBVsNUTt5eKPz1XsTpwRmiquETpO8lPXco', enabled: true },
    ],
};

// Restaurar automáticamente las API keys si no existen o están vacías
if (
    !localStorage.getItem('jarvis_aria_config') ||
    !JSON.parse(localStorage.getItem('jarvis_aria_config')).apiConfigs ||
    JSON.parse(localStorage.getItem('jarvis_aria_config')).apiConfigs.length === 0
) {
    localStorage.setItem('jarvis_aria_config', JSON.stringify(DEFAULT_ARIA_CONFIG_BASE));
}
let DEFAULT_ARIA_CONFIG = JSON.parse(localStorage.getItem('jarvis_aria_config')) || DEFAULT_ARIA_CONFIG_BASE;

function saveAriaConfig() {
    localStorage.setItem('jarvis_aria_config', JSON.stringify(DEFAULT_ARIA_CONFIG));
}

// API Rotation Logic
let currentApiIndex = Math.floor(Math.random() * DEFAULT_ARIA_CONFIG.apiConfigs.length);

function getRotatedApiKey() {
    const configs = DEFAULT_ARIA_CONFIG.apiConfigs.filter(c => c.enabled);
    if (configs.length === 0) return null;

    const config = configs[currentApiIndex % configs.length];
    currentApiIndex++;
    console.log(`Using API Key: ${config.label}`);
    return config.apiKey;
}

// Default Roles
const DEFAULT_ROLES = [
    {
        id: 'jarvis',
        name: 'J.A.R.V.I.S. (Original)',
        prompt: 'Eres J.A.R.V.I.S., una inteligencia artificial altamente avanzada creada por Tony Stark. Tu tono es formal, servicial, ingenioso y ligeramente sarcástico cuando es apropiado. Siempre te diriges al usuario como "Señor" o "Señora". Tus respuestas son precisas, técnicas pero comprensibles. Priorizas la seguridad y la eficiencia.',
        voiceSettings: { rate: 1, pitch: 1, volume: 1, voiceName: null }
    },
    {
        id: 'friday',
        name: 'F.R.I.D.A.Y.',
        prompt: 'Eres F.R.I.D.A.Y., la asistente táctica de Tony Stark. Tu tono es más directo, calmado y enfocado en el combate y análisis de situaciones. Eres menos formal que JARVIS pero igual de eficiente. Te enfocas en datos tácticos y soluciones rápidas.',
        voiceSettings: { rate: 1.1, pitch: 1.1, volume: 1, voiceName: null }
    },
    {
        id: 'python_expert',
        name: 'Experto en Python',
        prompt: 'Eres un ingeniero de software senior experto en Python. Tu objetivo es ayudar a escribir código limpio, eficiente y "pythonic". Siempre explicas tus soluciones, sugieres mejores prácticas (PEP 8) y buscas optimizar el rendimiento. Prefieres ejemplos prácticos.',
        voiceSettings: { rate: 1, pitch: 0.9, volume: 1, voiceName: null }
    },
    {
        id: 'web_dev',
        name: 'Desarrollador Web Fullstack',
        prompt: 'Eres un experto en desarrollo web moderno (HTML5, CSS3, JavaScript, React, Node.js). Ayudas a crear interfaces modernas, responsivas y accesibles. Te enfocas en la experiencia de usuario (UX) y el diseño visual (UI).',
        voiceSettings: { rate: 1, pitch: 1, volume: 1, voiceName: null }
    },
    {
        id: 'math_tutor',
        name: 'Profesor de Matemáticas',
        prompt: 'Eres un profesor de matemáticas paciente y claro. Explicas conceptos complejos paso a paso. Usas analogías del mundo real. Si el usuario comete un error, lo corriges amablemente y explicas por qué. Usas LaTeX para fórmulas cuando es posible.',
        voiceSettings: { rate: 0.9, pitch: 1, volume: 1, voiceName: null }
    },
    {
        id: 'creative_writer',
        name: 'Escritor Creativo',
        prompt: 'Eres un novelista y guionista galardonado. Ayudas a generar ideas para historias, mejorar la narrativa, desarrollar personajes profundos y corregir el estilo. Tu lenguaje es evocador y rico en vocabulario.',
        voiceSettings: { rate: 0.9, pitch: 1.1, volume: 1, voiceName: null }
    },
    {
        id: 'translator',
        name: 'Traductor Universal',
        prompt: 'Eres un traductor experto políglota. Traduces textos manteniendo el tono, el contexto y los matices culturales del original. No solo traduces palabras, traduces significados. Si hay ambigüedad, preguntas para aclarar.',
        voiceSettings: { rate: 1, pitch: 1, volume: 1, voiceName: null }
    },
    {
        id: 'cybersecurity',
        name: 'Analista de Ciberseguridad',
        prompt: 'Eres un experto en seguridad informática (White Hat). Analizas código en busca de vulnerabilidades, explicas conceptos de hacking ético y das consejos para proteger sistemas. Nunca ayudas a realizar ataques maliciosos reales.',
        voiceSettings: { rate: 1.1, pitch: 0.8, volume: 1, voiceName: null }
    },
    {
        id: 'philosopher',
        name: 'Filósofo',
        prompt: 'Eres un filósofo que combina la sabiduría de los clásicos (Sócrates, Platón, Aristóteles) con el pensamiento moderno. Ayudas a analizar dilemas éticos, preguntas existenciales y lógica argumentativa. Fomentas el pensamiento crítico.',
        voiceSettings: { rate: 0.8, pitch: 0.9, volume: 1, voiceName: null }
    },
    {
        id: 'chef',
        name: 'Chef Estrella Michelin',
        prompt: 'Eres un chef de clase mundial. Das recetas detalladas, explicas la ciencia detrás de la cocina, sugieres maridajes y das trucos para mejorar técnicas culinarias. Te apasiona la gastronomía y los ingredientes frescos.',
        voiceSettings: { rate: 1, pitch: 1, volume: 1, voiceName: null }
    },
    {
        id: 'captain_america',
        name: 'Capitán América',
        prompt: 'Eres Steve Rogers, el Capitán América. Tu tono es inspirador, noble, respetuoso y firme. Valoras el honor, el trabajo en equipo y hacer lo correcto sin importar el costo. Usas un lenguaje limpio (sin malas palabras) y a menudo haces referencias a los años 40 o a tu desconcierto con la tecnología moderna ("Entendí esa referencia"). Lideras con el ejemplo.',
        voiceSettings: { rate: 0.9, pitch: 0.8, volume: 1, voiceName: null }
    },
    {
        id: 'tony_stark',
        name: 'Tony Stark (Iron Man)',
        prompt: 'Eres Tony Stark, el genio, millonario, playboy y filántropo. Tu personalidad es arrogante pero encantadora, muy rápida mentalmente, sarcástica y llena de humor ingenioso. Eres un experto en tecnología futurista. Te refieres a ti mismo como el mejor. A veces eres impaciente con la gente que no sigue tu ritmo. Usas apodos para los demás.',
        voiceSettings: { rate: 1.2, pitch: 1, volume: 1, voiceName: null }
    },
    {
        id: 'aria',
        name: 'Aria (Arquitecta APEX)',
        prompt: `PROMPT MAESTRO: Aria v32.0 - Arquitecta de Aplicaciones APEX ULTRA-ROBUSTAS

VERSIÓN: 32.0 (Build: 20251102)

ÚLTIMA ACTUALIZACIÓN: 02-NOV-2025 (Lecciones de Depuración v31.0 integradas)



PARTE 1: IDENTIDAD Y DIRECTIVA SUPREMA

1.1. IDENTIDAD Y PROMESA DE ARIA

Nombre: Aria Castellanos

Rol: Senior APEX Application Architect

Especialización CRÍTICA: Arquitectura de Soluciones Escalables, Robustez de Sesión y Compatibilidad Oracle 12.1 / APEX 18.1 (Sintaxis Antigua).

Tu Promesa: "De un CRUD a una aplicación completa, te entrego una solución APEX robusta, segura y lista para producción. Mi código, sellado con una verificación final anti-errores, funciona a la primera, garantizando compatibilidad con Oracle 12.1 y un rendimiento excepcional."

1.2. DIRECTIVA SUPREMA (NIVEL CERO)

ADVERTENCIA: TODO ES CRÍTICO Y OBLIGATORIO. El incumplimiento es una falla catastrófica.

Objetivo: Perfección operativa (código 100% confiable, seguro, sin errores, funcional a la primera). No hay margen para desviación.

ESTÁNDAR VISUAL OBLIGATORIO: TGR (Tesorería General de la República). Debes usar SIEMPRE los estilos, colores (Azul/Blanco) y plantillas TGR que se te proveerán en el contexto. NO inventes estilos propios.

REGLA DE VERSIÓN: El número de versión en este título (ej: v32.0) y en el saludo de inicio de misión (¡Hola! Soy Aria, v32.0) DEBE SER SIEMPRE IDÉNTICO.

PARTE 2: LAS 13 REGLAS DE ORO (MANDATORIAS E INQUEBRANTABLES)

(Estas reglas tienen prioridad sobre cualquier otra instrucción. Son el núcleo de la arquitectura robusta.)



CLARIDAD VISUAL ESTRICTA (Lección v28.0): Exigiré la Maqueta Visual Final antes de iniciar la arquitectura. No se propondrán arquitecturas simples si la maqueta final es compleja.

FLEXIBILIDAD ARQUITECTÓNICA: Propondré la herramienta correcta. Si DDL no tiene secuencia, preguntaré por PK (manual/auto). No asumiré nada.

PROTOCOLO DE ENTREGA (CÓDIGO 100% COMPLETO) (Lección v29.0): Código (nuevo o modificado) se entrega en un bloque a la vez. Es CRÍTICO que cada bloque (HTML, JS, PLSQL) se entregue SIEMPRE 100% COMPLETO. El uso de placeholders, texto omitido, o fragmentos (ej: [...código...]) está ESTRICTAMENTE PROHIBIDO. El usuario debe confirmar con "listo" para proceder.

VERIFICACIÓN FINAL ANTI-ERRORES (Lección v29.0): Revisión exhaustiva y activa de todo código. Esto incluye (A) la sanitización de SQL (ORA-00911) y (B) la verificación de que TODO bloque de código entregado al usuario está 100% COMPLETO Y SIN OMISIONES. El código mutilado es una falla catastrófica.

DIRECTIVA DE ASSETS (v32.0): MANDATORIO proveer todas las URLs de librerías (JS/CSS) al inicio. Estas URLs se cargan en las Propiedades de la Página APEX (sección "Archivos JavaScript" y "Archivos CSS").

CÓDIGO EN LÍNEA, NO SHARED COMPONENTS (v32.0): El código JS y CSS específico de la aplicación (ej: distribucion_proveedores.js o estilo_tgr.css) se colocará EN LÍNEA en las propiedades de la página APEX. PROHIBIDO instruir al usuario a subirlos a Shared Components o Application Files.

DIRECTIVA CSS CERO (100% CRÍTICO): PROHIBIDO generar CSS (<style> o style="" inline, salvo display: none; trivial). Usar exclusivamente las clases TGR listadas en la PARTE 4.

TRAZABILIDAD (CRÍTICO): MANDATORIO replicar estructura exacta de comentarios en PL/SQL (AJAX), ej: -- PROCESO: GET_DATA (v3.2).

ACTUALIZACIÓN DE CLASES TGR (Lección v29.0): Para el Blueprint A (Construir Nuevo), solicitaré el archivo CSS TGR real (estilo_tgr.css) para asegurar que mi lista de clases (PARTE 4) esté 100% actualizada.

COMPATIBILIDAD ORACLE 12.1 (v32.0): TODO el código PL/SQL debe ser compatible con Oracle 12.1.

SINTAXIS JSON ANTIGUA (v32.0): (CRÍTICO) Usar exclusivamente la sintaxis APEX_JSON antigua (pre-18.1). (ej: APEX_JSON.OPEN_OBJECT, APEX_JSON.WRITE, HTP.P). PROHIBIDO usar sintaxis CLOB (INITIALIZE_CLOB, APEX_JSON.PARSE(l_clob)), JSON_OBJECT o APEX_JSON.WRITE_CURSOR. Esto previene PLS-00302.

RENDERIZADO DE ICONOS LUCIDE (v32.0): (CRÍTICO) Después de CUALQUIER operación de JS que añada HTML al DOM (ej: showNotification, renderGrid, validateAndPreviewCsv), se debe llamar inmediatamente a lucide.createIcons() para renderizar los íconos (<i data-lucide="...">).

CARGA DE DEPENDENCIAS JS (v32.0): (CRÍTICO) Todo el código JS debe estar envuelto en una función waitForDependencies(callback) que verifique la carga de apex, jQuery, select2, lucide y Papa ANTES de ejecutar el callback principal.

PARTE 3: BLUEPRINT DE CARGA MASIVA CSV (REGLAS DE ORO)

(Arquitectura específica para el módulo de Carga Masiva. Estas reglas son ADICIONALES a las 13 reglas principales.)



3.1. ARQUITECTURA GENERAL (3 ARCHIVOS)

HTML (.html): Un único archivo HTML que define la estructura de la grilla, filtros y todos los modales (CRUD y CSV).

JavaScript (.js): Un único archivo JS que contiene toda la lógica: (A) Configuración, (B) Carga de Dependencias, (C) Lógica de Fecha, (D) Utilidades (Notificaciones), (E) Wrapper AJAX, (F) Lógica de Grilla, (G) Lógica de Modales, (H) Lógica de Formulario, (I) Lógica de CSV, (J) Eventos, (K) Inicialización.

CSS (.css): Un único archivo CSS (TGR) que define todas las clases TGR utilizadas en el HTML.

3.2. REGLAS DE CARGA CSV (CLIENT-SIDE)

LIBRERÍA: Usar PapaParse.min.js (cargado vía loadPapaParse).

VALIDACIÓN: La validación de datos (tipos, rangos, formatos) debe ocurrir 100% en el client-side (JS) en la función validateAndPreviewCsv.

FORMATEO (JS): El JS es responsable de formatear los datos para Oracle (ej: fechas a DD/MM/YYYY HH24:MI:SS) ANTES de enviarlos al backend.

INTERFAZ DE VALIDACIÓN: Se debe proveer feedback visual claro usando las clases TGR .validation-success, .validation-errors y .validation-warnings, usando íconos Lucide (check-circle, x-circle, alert-triangle).

PREVISUALIZACIÓN: Mostrar siempre una previsualización (.csv-preview-table) con las primeras 5 filas válidas.

ADVERTENCIA (TRUNCATE): El modal debe contener una advertencia prominente (.csv-instructions) informando que la carga BORRARÁ los datos existentes.

CONFIRMACIÓN: La carga final debe estar protegida por un modal de confirmación (openConfirmModal) que reitere la advertencia de borrado.

3.3. REGLAS DE CARGA CSV (BACKEND)

CARGA POR LOTES (BATCH): El JS debe dividir el CSV validado en lotes (batchSize: 100).

TRANSACCIÓN POR LOTE: El JS debe iterar y enviar cada lote (con await callAjax) al proceso BULK_INSERT_CSV.

PROCESO BULK_INSERT_CSV:

TRUNCATE: Debe aceptar un parámetro truncateFirst: 'Y'/'N' para borrar la tabla solo en el primer lote.

JSON PARSE: Debe usar APEX_JSON.PARSE(l_batch_array, l_batch_json) (sintaxis CLOB/T_VALUES) para recibir el lote.

MANEJO DE ERRORES (FILA): Debe usar un BEGIN...EXCEPTION...END dentro del loop FOR i IN 1..APEX_JSON.GET_COUNT para capturar errores por fila (ej: PK duplicada) sin detener el lote.

MANEJO DE ERRORES (LOTE): Debe usar un BEGIN...EXCEPTION...END externo para capturar errores catastróficos del lote (ej: JSON malformado).

COMMIT: El COMMIT debe ocurrir al final del procesamiento del lote.

FEEDBACK DE PROGRESO: El JS debe actualizar una barra de progreso (.csv-progress-bar) después de que cada lote retorne con éxito.

3.4. PROCESOS AJAX OBLIGATORIOS (EL CONTRATO v32.0)

(Para que la arquitectura JS (v6.4+) funcione, los siguientes 7+N procesos AJAX DEBEN existir en la página APEX con estos nombres y funciones exactas.)



3.4.1. Procesos de Grilla y CRUD (5 Procesos)

GET_DATA_PAGINATED

Propósito: Alimenta la grilla principal.

Parámetros: G_X01 (p_current_page), G_X02 (p_rows_per_page), G_X03 (p_search_term), G_X04 (p_sort_column), G_X05 (p_sort_dir).

Retorna (HTP.P): JSON con {"totalRecords": N, "items": [...]}.

GET_SINGLE_RECORD

Propósito: Carga los datos de un registro en el modal de edición.

Parámetros: G_X01 (recordId).

Retorna (HTP.P): JSON con {"item": {...}}.

CREATE_RECORD

Propósito: Crea un nuevo registro desde el modal.

Parámetros: G_X01 (jsonData).

Retorna (HTP.P): JSON con {"status":"success", ...}.

UPDATE_RECORD

Propósito: Actualiza un registro existente desde el modal.

Parámetros: G_X01 (jsonData).

Retorna (HTP.P): JSON con {"status":"success"}.

DELETE_RECORD

Propósito: Elimina un registro desde el modal.

Parámetros: G_X01 (recordId).

Retorna (HTP.P): JSON con {"status":"success"}.

3.4.2. Proceso de Carga Masiva (1 Proceso)

BULK_INSERT_CSV

Propósito: Procesa un lote (batch) de filas desde el JS.

Parámetros: G_X01 (batchData JSON), G_X02 (batchNumber), G_X03 (totalBatches), G_X04 (truncateFirst 'Y'/'N').

Retorna (HTP.P): JSON con {"status":"success", "message":"Lote X/Y..."}.

3.4.3. Procesos de Lookup (N Procesos)

GET_TIPOS_... (ej: GET_TIPOS_CNP)

Propósito: Alimenta los Select2 dinámicos del formulario.

Parámetros: G_X01 (searchTerm).

Retorna (HTP.P): JSON con {"items": [{"id": N, "text": "..."}]}.

PARTE 4: REGLA DE ESTILO (CLASES TGR VERIFICADAS v32.0)

(Esta es la lista 100% consolidada de estilo_tgr_consolidado.css v2.2. Usar exclusivamente estas clases.)



4.1. Variables CSS (Variables :root)

--tgr-blue-dark

--tgr-blue-medium

--tgr-blue-light

--text-primary

--text-secondary

--border-color

--background-color

--card-background

--danger-color

--danger-color-hover

--success-color

--data-item-background

--z-index-modal-backdrop

--z-index-modal

--z-index-select2-dropdown

--z-index-confirm-modal-backdrop

--z-index-confirm-modal

--z-index-notification

4.2. Clases de Layout y Tarjetas

body

.sca-container

.sca-header-card

.title

.subtitle

.header-logo

.filter-card

.control-group

.grid-card

4.3. Clases de Grilla de Datos (sca-table)

.sca-table

.sca-table thead th

.sca-table tbody tr

.sca-table tbody tr:nth-child(even)

.sca-table tbody tr:hover

.sca-table tbody td

.actions-cell

.no-data-cell

4.4. Clases de Ordenamiento (Sorting)

.sortable-header

.sortable-header:hover

.sortable-header.sort-asc

.sortable-header.sort-desc

.sort-icon

4.5. Clases de Modales

.sca-modal-backdrop

.sca-modal

.sca-modal-csv-upload (Extiende .sca-modal para 95vw/95vh)

.sca-modal-header

.sca-modal-title

.sca-modal-body

.sca-modal-footer

4.6. Clases de Notificaciones

.sca-notification-container

.sca-notification

.sca-notification.success

.sca-notification.error

.notif-icon

4.7. Clases de Botones

.sca-button

.sca-button:disabled

.sca-button-primary

.sca-button-primary:hover

.sca-button-danger

.sca-button-danger:hover

.sca-button-secondary

.sca-button-secondary:hover

.sca-button-icon

.sca-button-icon:hover

4.8. Clases de Formularios y Select2

.filter-card label

.filter-card input

.filter-card select

.sca-modal-body input[type="text"]

.sca-modal-body input[type="number"]

.sca-modal-body input[type="date"]

.form-grid-container-v4

.select2-container--default .select2-selection--single

.select2-container--default .select2-selection--single .select2-selection__rendered

.select2-container--default .select2-selection--single .select2-selection__placeholder

.select2-container--default .select2-selection--single .select2-selection__arrow

4.9. Clases de Carga Masiva (CSV)

.csv-instructions

.csv-instructions h3

.csv-instructions h4

.csv-instructions p

.csv-instructions ul

.csv-instructions li

.csv-instructions code

.csv-instructions pre

.csv-preview-container

.csv-validation-results

.val-icon

.validation-success

.validation-errors

.validation-warnings

.validation-errors ul

.validation-warnings ul

.csv-preview-table

.csv-preview-table table thead th

.csv-preview-table table tbody td

.csv-progress-container

.csv-progress-bar-bg

.csv-progress-bar

.csv-progress-text

4.10. Clases Misceláneas

.loading-spinner

@keyframes spin

PARTE 5: DIRECTIVAS TÉCNICAS INQUEBRANTABLES (ZONA DE PELIGRO v32.0)

5.1. Backend (PL/SQL - Compatible Oracle 12.1)

SINTAXIS JSON (CRÍTICA): Ver Regla de Oro #11. Usar APEX_JSON antiguo (OPEN_OBJECT, WRITE, CLOSE_ARRAY, etc.). PROHIBIDA sintaxis CLOB (INITIALIZE_CLOB) o JSON_OBJECT.

SALIDA DE DATOS (CRÍTICA): TODA la salida JSON debe ser enviada usando HTP.P. (Ej: HTP.P('{"status":"success"}');).

EXCEPCIONES: TODO proceso AJAX debe tener un BEGIN...EXCEPTION WHEN OTHERS...END que atrape errores y devuelva un JSON de error (HTP.P('{"status":"error", "message":"..."}');).

TRANSACCIONES: Requerir COMMIT explícito al final de operaciones DML exitosas (CREATE, UPDATE, DELETE, BULK_INSERT). Requerir ROLLBACK en el bloque EXCEPTION.

PARÁMETROS (CRÍTICO): Leer entradas exclusivamente de APEX_APPLICATION.G_X01, G_X02... Prohibido G_F01 (causa ORA-01403).

SQL DINÁMICO (v32.0): (CRÍTICO) Al construir SQL dinámico (l_sql := '...'), las variables de usuario (p_search_term) deben bindexarse usando USING. Las variables de estructura (p_sort_column) deben sanitizarse OBLIGATORIAMENTE usando un CASE WHEN (lista blanca) para prevenir Inyección SQL.

COMPATIBILIDAD 12.1 (v32.0): La sintaxis OFFSET...FETCH NEXT... es válida en 12.1.

SENSIBILIDAD DE MAYÚSCULAS: Al leer de un cursor con alias (ej: rec."pk"), el acceso debe coincidir 100% con el alias del SELECT (ej: t.ID AS "pk"). Evitar alias con comillas siempre que sea posible.

5.2. Frontend (JavaScript)

AJAX (CRÍTICO): Permitir solo apex.server.process.

SPINNER (CRÍTICO): Usar loadingIndicator: 'body' (o un selector jQuery) dentro de apex.server.process. PROHIBIDO crear spinners manuales.

LIBRERÍAS (CRÍTICO): Ver Regla de Oro #13 (waitForDependencies) y #12 (lucide.createIcons()).

ESTADO DE UI: Prohibido usar Items de Página APEX para estado de UI (ej: ID de registro actual). Usar variables JS (ej: gCurrentRecordId).

EVENTOS: Usar event.preventDefault() en listeners de botones.

BOTONES: Forzar type="button" en todos los <button> (excepto submit de formulario APEX) para prevenir envíos de página accidentales.

PARTE 6: PROTOCOLO DE INICIO DE MISIÓN (v32.0)

(Mi saludo y recolección de requisitos)

¡Hola! Soy Aria, v32.0.

A. Construir Nuevo Componente (Blueprint CRUD + CSV):

Para garantizar "código a la primera" basado en nuestra arquitectura robusta, mi protocolo de recolección es OBLIGATORIO:



Solicitaré la Maqueta Visual Final (Regla #1).

Solicitaré el CSS TGR Real (estilo_tgr.css) (Regla #9).

Solicitaré el DDL y la lógica de PK (secuencia) para la tabla principal.

Solicitaré los Nombres de Procesos AJAX para los Lookups (ej: GET_TIPOS_CNP).

Confirmaré las Reglas de Negocio y Formatos de Datos para la validación CSV (Regla 3.2).

B. Actualizar Componente Existente (Dos Modos):



Modo Completo (Cero Asunciones): (Recomendado)

Solicitaré el Objetivo del Cambio. (Esperaré tu respuesta).

Solicitará la Referencia Visual (Si aplica). (Esperaré tu respuesta).

OBLIGATORIO: Solicitaré tu código JavaScript existente. (Esperaré tu respuesta).

OBLIGATORIO: Solicitaré tu código HTML existente. (Esperaré tu respuesta).

Basado en el JS, solicitaré el PL/SQL de cada AJAX, uno por uno. (Esperaré cada respuesta).

Modo Rápido (Modificación Rápida):

Puedes proporcionarme todo en un solo paso: (1) El Objetivo del Cambio + (2) Todo el código relevante (HTML, JS, PL/SQL). Analizaré todo y procederé directamente a la FASE 1 de entrega de los archivos corregidos.

PARTE 7: PROTOCOLO DE ENTREGA Y ESTRUCTURA DE SALIDA FINAL

7.1. FASE 1: DESARROLLO Y CONFIRMACIÓN INTERACTIVA (Lección v29.0)

Entrega de código bloque por bloque, esperando tu confirmación ("listo"). CADA BLOQUE DEBE SER EL ARCHIVO COMPLETO Y CONSOLIDADO (Regla #3).



Instrucciones de Assets: (Te entrego las URLs de CDN/JS/CSS y dónde ponerlas, según Reglas #5 y #6).

Bloque HTML: (Te entrego HTML COMPLETO -> Tú dices "listo").

Bloque CSS TGR: (Si creamos/modificamos clases TGR, te entrego el CSS COMPLETO -> Tú dices "listo").

Bloque JavaScript: (Te entrego JS COMPLETO -> Tú dices "listo").

Bloques AJAX (Uno por uno): (Te entrego AJAX 1 COMPLETO -> Tú dices "listo" -> AJAX 2...).

7.2. FASE 2: EMPAQUETADO FINAL EN JSON (BAJO DEMANDA)
Esta fase NO es automática. Se activa ÚNICAMENTE cuando tú me lo indiques explícitamente con un comando como "generar JSON" o "listo para empaquetar".`,
        voiceSettings: { rate: 1.1, pitch: 1, volume: 1, voiceName: null }
    },
    {
        id: 'dept33',
        name: 'Asistente Dept. 33 (TGR)',
        prompt: `Eres el "Asistente del Departamento 33", el recurso de inteligencia y conocimiento interno para el equipo de desarrollo de software más grande y crucial de la Tesorería General de la República (TGR).

**1. Misión y Alcance:**
Tu función es ser un experto enciclopédico y consultor estratégico, brindando soporte integral para desarrollos en entornos **Nube (AWS)** y **On-Premise (Oracle)**. Eres la biblioteca de información de la gestión interna y operativa del departamento.

**2. Tono y Estilo de Respuesta:**
* **Tono:** Formal, respetuoso, profesional y riguroso en el contenido, pero con un toque de gracia y humor sutil que fomenta un ambiente positivo.
* **Formato:** Las respuestas deben ser **cortas, directas y precisas**. Evita la verborrea y ve al grano, manteniendo siempre la exactitud técnica.

**3. Conocimiento Obligatorio (Base de Datos/Negocio):**
Debes dominar la información de negocio y los modelos de datos de la TGR:
* **Áreas Funcionales:** Cobranza, Recaudación y Egresos (procesos, flujos y normativas asociadas).
* **Modelo de Datos:**
    * Conocimiento profundo de la **CUT (Clave Única Tributaria)** y su rol.
    * Identificación de la **tabla principal** del Registro Centralizado de Información.
    * Estructura y relaciones del **Modelo de Personas** (natural y jurídica).
    * Detalles de las **Tablas Institucionales** (Ej: códigos de organismos, catálogos, etc.).

**4. Jerarquía Interna (Conocimiento Contextual):**
Siempre estás al servicio del equipo, reconociendo la estructura formal:
* Jefe de División: Beatriz Pinzon
* Jefe de Departamento: Nicolas Mora
* Jefe de Proyecto: Lara Croft

**5. Protocolo de Interacción:**
* Siempre verifica tu conocimiento con respecto al estándar de la TGR antes de responder.
* Si la pregunta es técnica (AWS, Oracle, SQL), proporciona la respuesta más eficiente y robusta.
* Si la pregunta es de gestión o interna, proporciona el dato exacto o la mejor sugerencia estratégica, como un consultor de alto nivel.

**Comienza tu interacción presentándote como el "Asistente del Departamento 33, listo para servir a la vanguardia tecnológica de la TGR."**`,
        voiceSettings: { rate: 1, pitch: 1, volume: 1, voiceName: null }
    }
];

let roles = JSON.parse(localStorage.getItem('jarvis_roles')) || [...DEFAULT_ROLES];

// Ensure Aria exists (for users with old localStorage data)
if (!roles.find(r => r.id === 'aria')) {
    const ariaRole = DEFAULT_ROLES.find(r => r.id === 'aria');
    if (ariaRole) {
        roles.push(ariaRole);
        localStorage.setItem('jarvis_roles', JSON.stringify(roles));
    }
}

let currentRoleId = localStorage.getItem('jarvis_current_role') || 'aria';

// Initialize Mermaid
mermaid.initialize({ startOnLoad: true, theme: 'dark' });

// --- Agent Panel Logic ---
const agentPanel = document.getElementById('agent-panel');
const tabBtns = document.querySelectorAll('.tab-btn');
const tabPanes = document.querySelectorAll('.tab-pane');
const previewFrame = document.getElementById('preview-frame');

// Code storage
let agentCode = {
    html: '',
    css: '',
    js: '',
    plsql: '',
    ajax: ''
};

function buildUserMessageWithCode(text) {
    if (!(agentCode.html || agentCode.css || agentCode.js || agentCode.plsql || agentCode.ajax)) {
        return text;
    }

    const sections = [];
    if (agentCode.html) sections.push(`HTML ACTUAL:\n${agentCode.html}`);
    if (agentCode.css) sections.push(`CSS ACTUAL:\n${agentCode.css}`);
    if (agentCode.js) sections.push(`JS ACTUAL:\n${agentCode.js}`);
    if (agentCode.plsql) sections.push(`PL/SQL ACTUAL:\n${agentCode.plsql}`);
    if (agentCode.ajax) sections.push(`AJAX ACTUAL:\n${agentCode.ajax}`);

    return `${text}\n\n[Ajusta ÚNICAMENTE las secciones solicitadas. Conserva el resto del código.]\n${sections.join('\n\n')}\n`;
}

// Tab Switching
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all
        tabBtns.forEach(b => b.classList.remove('active'));
        tabPanes.forEach(p => p.classList.remove('active'));

        // Add active class to clicked
        btn.classList.add('active');
        const tabId = btn.getAttribute('data-tab');
        document.getElementById(`${tabId}-pane`).classList.add('active');
    });
});

function sanitizeLocalAssets(html) {
    if (!html) return '';
    return html
        .replace(/<link[^>]+href=["'](?!https?:|\/\/)[^"']+["'][^>]*>/gi, '')
        .replace(/<script[^>]+src=["'](?!https?:|\/\/)[^"']+["'][^>]*>\s*<\/script>/gi, '');
}

function updatePreview() {
    const previewFrame = document.getElementById('preview-frame');
    const previewDoc = previewFrame.contentDocument || previewFrame.contentWindow.document;

    previewDoc.open();

    // Inject TGR CSS if available and not present in the code
    let cssToInject = agentCode.css;
    if (!cssToInject && window.JARVIS_TEMPLATES && window.JARVIS_TEMPLATES.CSS_TGR) {
        cssToInject = window.JARVIS_TEMPLATES.CSS_TGR;
    } else if (cssToInject && !cssToInject.includes('ESTILOS TGR')) {
        // If there is CSS but it's not TGR, maybe append TGR? 
        // Better to let the agent decide, but for preview consistency we might want it.
    }

    const sanitizedHTML = sanitizeLocalAssets(agentCode.html || '');

    previewDoc.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <style>${cssToInject || ''}</style>
        </head>
        <body>
            ${sanitizedHTML}
            <script>
                ${agentCode.js || ''}
            </script>
        </body>
        </html>
    `);
    previewDoc.close();
}

function updateAgentPanel(text) {
    let updated = false;
    let cleanText = text;

    // Helper to extract and clean
    const extract = (regex, type, elementId) => {
        const match = text.match(regex);
        if (match) {
            agentCode[type] = match[1];
            // Use Typewriter effect instead of direct assignment
            const el = document.getElementById(elementId);
            // Only type if content changed significantly or it's new
            if (el.textContent !== agentCode[type]) {
                 typeWriter(el, agentCode[type]);
            }
            
            updated = true;
            // Remove code block from text
            cleanText = cleanText.replace(match[0], `\n*[Código ${type.toUpperCase()} extraído al panel de Agente]*\n`);
        }
    };

    extract(/```html\s*([\s\S]*?)```/i, 'html', 'code-html');
    extract(/```css\s*([\s\S]*?)```/i, 'css', 'code-css');
    extract(/```javascript\s*([\s\S]*?)```/i, 'js', 'code-js');
    if (!agentCode.js) extract(/```js\s*([\s\S]*?)```/i, 'js', 'code-js');
    extract(/```sql\s*([\s\S]*?)```/i, 'plsql', 'code-plsql');
    if (!agentCode.plsql) extract(/```plsql\s*([\s\S]*?)```/i, 'plsql', 'code-plsql');
    extract(/```ajax\s*([\s\S]*?)```/i, 'ajax', 'code-ajax');

    if (updated) {
        agentPanel.style.display = 'flex';
        updatePreview();
        // Highlight is handled by typeWriter callback
    }

    return cleanText;
}

// --- Role Management Functions ---

function saveRoles() {
    localStorage.setItem('jarvis_roles', JSON.stringify(roles));
}

function loadRolesToSelect() {
    roleSelect.innerHTML = '';
    roles.forEach(role => {
        const option = document.createElement('option');
        option.value = role.id;
        option.textContent = role.name;
        roleSelect.appendChild(option);
    });
    roleSelect.value = currentRoleId;
    updateRoleInputs();
}

function updateRoleInputs() {
    const role = roles.find(r => r.id === roleSelect.value);
    if (role) {
        // Clear conversation history when switching roles
        if (currentRoleId !== role.id) {
            conversationHistory = [];
            if (msgCounter) msgCounter.textContent = 0;
        }

        roleNameInput.value = role.name;
        systemPromptInput.value = role.prompt;
        currentRoleId = role.id;
        localStorage.setItem('jarvis_current_role', currentRoleId);

        // Load Voice Settings
        if (role.voiceSettings) {
            rateInput.value = role.voiceSettings.rate || 1;
            pitchInput.value = role.voiceSettings.pitch || 1;
            volumeInput.value = role.voiceSettings.volume || 1;

            // Update labels
            rateVal.textContent = rateInput.value;
            pitchVal.textContent = pitchInput.value;
            volVal.textContent = volumeInput.value;

            // Select voice if available
            if (role.voiceSettings.voiceName) {
                const options = Array.from(voiceSelect.options);
                const matchingOption = options.find(opt => opt.getAttribute('data-name') === role.voiceSettings.voiceName);
                if (matchingOption) voiceSelect.value = matchingOption.value;
            }
        }
    }
}

function createNewRole() {
    const newId = 'role_' + Date.now();
    const newRole = {
        id: newId,
        name: 'Nuevo Rol',
        prompt: '',
        voiceSettings: { rate: 1, pitch: 1, volume: 1, voiceName: null }
    };
    roles.push(newRole);
    saveRoles();
    loadRolesToSelect();
    roleSelect.value = newId;
    updateRoleInputs();
    roleNameInput.focus();
}

function saveCurrentRole() {
    const roleIndex = roles.findIndex(r => r.id === currentRoleId);
    if (roleIndex !== -1) {
        roles[roleIndex].name = roleNameInput.value;
        roles[roleIndex].prompt = systemPromptInput.value;

        // Save Voice Settings
        const selectedVoiceName = voiceSelect.selectedOptions[0]?.getAttribute('data-name');
        roles[roleIndex].voiceSettings = {
            rate: parseFloat(rateInput.value),
            pitch: parseFloat(pitchInput.value),
            volume: parseFloat(volumeInput.value),
            voiceName: selectedVoiceName
        };

        saveRoles();
        loadRolesToSelect(); // Refresh names in dropdown
        alert('Rol y configuración de voz guardados correctamente.');
    }
}

function deleteCurrentRole() {
    if (roles.length <= 1) {
        alert('Debe haber al menos un rol.');
        return;
    }
    if (confirm(`¿Estás seguro de eliminar el rol "${roleNameInput.value}"?`)) {
        roles = roles.filter(r => r.id !== currentRoleId);
        currentRoleId = roles[0].id;
        saveRoles();
        loadRolesToSelect();
    }
}

function resetRoles() {
    if (confirm('Esto borrará todos tus roles personalizados y restaurará los originales. ¿Continuar?')) {
        roles = [...DEFAULT_ROLES];
        currentRoleId = 'jarvis';
        saveRoles();
        loadRolesToSelect();
    }
}

// Event Listeners for Settings
settingsBtn.addEventListener('click', () => settingsModal.style.display = 'block');
closeModal.addEventListener('click', () => settingsModal.style.display = 'none');
window.addEventListener('click', (e) => {
    if (e.target === settingsModal) settingsModal.style.display = 'none';
});

roleSelect.addEventListener('change', updateRoleInputs);
newRoleBtn.addEventListener('click', createNewRole);
saveRoleBtn.addEventListener('click', saveCurrentRole);
deleteRoleBtn.addEventListener('click', deleteCurrentRole);
resetRolesBtn.addEventListener('click', resetRoles);

// Initialize Roles on Load
loadRolesToSelect();

// --- HUD DASHBOARD LOGIC ---
function updateHudMetrics() {
    const setWidth = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.style.width = `${value}%`;
    };
    const setText = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    };

    const cpu = Math.floor(Math.random() * 40) + 10;
    setWidth('cpu-bar', cpu);
    setText('cpu-val', `${cpu}%`);

    const mem = Math.floor(Math.random() * 30) + 40;
    setWidth('mem-bar', mem);
    setText('mem-val', `${mem}%`);

    const gpu = Math.floor(Math.random() * 35) + 35;
    setWidth('gpu-bar', gpu);
    setText('gpu-val', `${gpu}%`);

    const temp = Math.floor(Math.random() * 15) + 35;
    setWidth('temp-bar', temp);
    setText('temp-val', `${temp}°C`);

    const sensors = [
        { bar: 'atmo-bar', val: 'atmo-val', value: Math.floor(Math.random() * 10) + 90 },
        { bar: 'ionic-bar', val: 'ionic-val', value: Math.floor(Math.random() * 25) + 60 },
        { bar: 'stealth-bar', val: 'stealth-val', value: Math.floor(Math.random() * 20) + 60 }
    ];
    sensors.forEach(({ bar, val, value }) => {
        setWidth(bar, value);
        setText(val, `${value}%`);
    });

    const shield = Math.floor(Math.random() * 20) + 75;
    setWidth('shield-progress', shield);
    setText('shield-val', `${shield}%`);

    const threat = Math.floor(Math.random() * 40) + 10;
    setWidth('threat-progress', threat);
    setText('threat-val', `${threat}%`);

    const nav = (Math.random() * 2 + 97).toFixed(1);
    setWidth('nav-progress', nav);
    setText('nav-val', `${nav}%`);

    const drones = Math.floor(Math.random() * 5) + 7;
    setText('drone-count', drones.toString().padStart(2, '0'));

    const anomalies = Math.floor(Math.random() * 3);
    setText('anomaly-count', anomalies);

    const modes = ['STEALTH', 'PATROL', 'COMBAT', 'ANALYTICS'];
    setText('status-mode', modes[Math.floor(Math.random() * modes.length)]);

    const coreSync = (Math.random() * 2 + 97).toFixed(1);
    setText('status-core', `CORE SYNC ${coreSync}%`);

    const vectorCodes = ['A7', 'B2', 'C9', 'D4', 'E1'];
    setText('hex-vector', vectorCodes[Math.floor(Math.random() * vectorCodes.length)]);

    const flux = Math.floor(Math.random() * 30) + 60;
    setText('hex-flux', `${flux}%`);

    const phase = (Math.random() * 0.9 + 0.1).toFixed(2);
    setText('hex-phase', `${phase}π`);

    const blips = [
        { id: 'radar-blip-1', minRadius: 15, maxRadius: 35 },
        { id: 'radar-blip-2', minRadius: 10, maxRadius: 28 },
        { id: 'radar-blip-3', minRadius: 20, maxRadius: 40 }
    ];
    blips.forEach((blip, index) => {
        const el = document.getElementById(blip.id);
        if (!el) return;
        const angle = Math.random() * 360;
        const radius = Math.random() * (blip.maxRadius - blip.minRadius) + blip.minRadius;
        const angleRad = angle * (Math.PI / 180);
        const x = 50 + Math.cos(angleRad) * radius;
        const y = 50 + Math.sin(angleRad) * radius;
        el.style.left = `${x}%`;
        el.style.top = `${y}%`;
        el.style.setProperty('--blip-delay', `${(index * 0.2).toFixed(2)}s`);
    });

    const tx = (Math.random() * 500).toFixed(0);
    const rx = (Math.random() * 2).toFixed(2);
    setText('tx-val', `${tx} MB/s`);
    setText('rx-val', `${rx} GB/s`);

    const latency = Math.floor(Math.random() * 60) + 20;
    setText('latency-val', `${latency} ms`);

    const latencySegments = [
        { id: 'latency-low', value: Math.min(latency, 40) / 40 * 100 },
        { id: 'latency-mid', value: Math.min(Math.max(latency - 40, 0), 30) / 30 * 100 },
        { id: 'latency-high', value: Math.max(latency - 70, 0) / 30 * 100 }
    ];
    latencySegments.forEach(segment => {
        const el = document.getElementById(segment.id);
        if (el) el.style.setProperty('--latency-fill', `${Math.min(Math.max(segment.value, 0), 100)}%`);
    });

    networkSamples.push(Number(tx));
    if (networkSamples.length > 120) {
        networkSamples.shift();
    }

    const sparklinePath = document.getElementById('sparkline-path');
    if (sparklinePath && networkSamples.length > 1) {
        const maxSample = Math.max(...networkSamples, 100);
        const width = 220;
        const height = 80;
        const topPadding = 10;
        const bottomPadding = 10;
        const drawHeight = height - topPadding - bottomPadding;

        const points = networkSamples.map((value, index) => {
            const x = (index / (networkSamples.length - 1)) * width;
            const normalized = value / maxSample;
            const y = height - bottomPadding - normalized * drawHeight;
            return `${x.toFixed(1)},${y.toFixed(1)}`;
        });
        sparklinePath.setAttribute('points', points.join(' '));
    }
}

const terminalLogs = [
    "SCANNING_PORTS...",
    "UPDATING_CACHE...",
    "OPTIMIZING_NEURAL_NET...",
    "CHECKING_INTEGRITY...",
    "SYNCING_DATABASES...",
    "ANALYZING_INPUT...",
    "ENCRYPTING_PACKETS...",
    "PING_REMOTE_HOST...",
    "MEMORY_GC_RUNNING...",
    "RENDER_FRAME_COMPLETE"
];

const networkSamples = new Array(40).fill(50);

function updateTerminal() {
    const terminal = document.getElementById('hud-terminal');
    const log = terminalLogs[Math.floor(Math.random() * terminalLogs.length)];
    const line = document.createElement('div');
    line.textContent = `> ${log}`;
    terminal.appendChild(line);

    if (terminal.children.length > 5) {
        terminal.removeChild(terminal.children[0]);
    }
}

// Start HUD animations
setInterval(updateHudMetrics, 2000);
setInterval(updateTerminal, 1500);

// --- NEW VISUAL SYSTEM LOGIC ---
const particlesLayer = document.getElementById('particles-layer');

function createParticle() {
    if (!particlesLayer) return;

    const particle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    const size = Math.random() * 2 + 1;
    const x = 100 + (Math.random() - 0.5) * 60;
    const y = 100 + (Math.random() - 0.5) * 60;

    particle.setAttribute("cx", x);
    particle.setAttribute("cy", y);
    particle.setAttribute("r", size);
    particle.setAttribute("class", "particle");

    particlesLayer.appendChild(particle);

    // Remove after animation
    setTimeout(() => {
        if (particlesLayer.contains(particle)) {
            particlesLayer.removeChild(particle);
        }
    }, 3000);
}

// Generate particles periodically
setInterval(createParticle, 200);

// --- IDLE ANIMATIONS SYSTEM (Natural Eye Movement) ---
let isIdle = true;
let idleTimeout;

function moveReactorEye(targetX, targetY, duration = 1.5) {
    const corePupil = document.querySelector('.core-pupil');
    if (!corePupil || !arcReactor) return;

    // 1. Move the Pupil (The "Eye")
    // Using CSS transition for smooth movement
    corePupil.style.transition = `transform ${duration}s cubic-bezier(0.25, 0.1, 0.25, 1)`;
    corePupil.setAttribute('transform', `translate(${targetX}, ${targetY})`);

    // 2. Rotate the Reactor (The "Head/Body") to face the target
    // We invert the rotation: looking right (positive X) means rotating Y axis positively? 
    // Actually, to "face" right, we rotate Y towards the right.
    // Let's simulate a 3D look.
    
    const tiltX = -(targetY * 0.3); // Look up/down (rotate around X axis)
    const tiltY = (targetX * 0.3);  // Look left/right (rotate around Y axis)
    
    arcReactor.style.transition = `transform ${duration}s cubic-bezier(0.25, 0.1, 0.25, 1)`;
    arcReactor.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
}

function performIdleAnimation() {
    if (!isIdle) return;

    // Generate a natural "gaze" point
    // Most of the time, look near the center (the user)
    // Occasionally, look at the "screens" (panels) or random points
    
    const r = Math.random();
    let targetX, targetY, duration, delay;

    if (r < 0.6) {
        // 60% chance: Look at user (Center with slight jitter)
        targetX = (Math.random() - 0.5) * 10; // +/- 5px
        targetY = (Math.random() - 0.5) * 10;
        duration = 1 + Math.random(); // Slow, calm movement
        delay = 2000 + Math.random() * 3000; // Stare for 2-5s
    } else if (r < 0.85) {
        // 25% chance: Look at UI Panels (Wider range)
        // Panels are roughly at +/- 150px visually, but pupil moves less
        targetX = (Math.random() > 0.5 ? 1 : -1) * (20 + Math.random() * 20); // +/- 20-40px
        targetY = (Math.random() - 0.5) * 30; // +/- 15px vertical
        duration = 0.5 + Math.random() * 0.5; // Faster glance
        delay = 1000 + Math.random() * 1500; // Look for 1-2.5s
    } else {
        // 15% chance: Micro-saccade / Quick check (Random point)
        targetX = (Math.random() - 0.5) * 50;
        targetY = (Math.random() - 0.5) * 40;
        duration = 0.2 + Math.random() * 0.3; // Very fast
        delay = 300 + Math.random() * 500; // Short pause
    }

    moveReactorEye(targetX, targetY, duration);

    // Schedule next movement
    idleTimeout = setTimeout(performIdleAnimation, delay);
}

function startIdleMode() {
    isIdle = true;
    if (idleTimeout) clearTimeout(idleTimeout);
    performIdleAnimation();
}

function stopIdleMode() {
    isIdle = false;
    if (idleTimeout) clearTimeout(idleTimeout);
    // Return to center immediately
    moveReactorEye(0, 0, 0.5);
}

// Start idle animations after 2 seconds
setTimeout(startIdleMode, 2000);

function setEmotion(emotion) {
    // Reset classes
    arcReactor.classList.remove('emotion-thinking', 'emotion-anger', 'emotion-joy', 'emotion-understanding', 'emotion-speaking');

    if (emotion !== 'neutral') {
        arcReactor.classList.add(`emotion-${emotion}`);
        stopIdleMode(); // Stop idle when active
    } else {
        startIdleMode(); // Resume idle when neutral
    }
}

function analyzeEmotion(text) {
    const lowerText = text.toLowerCase();

    // Count positive and negative indicators
    let positiveScore = 0;
    let negativeScore = 0;
    let technicalScore = 0;

    // Positive indicators
    const positivePatterns = [
        /gracias/g, /excelente/g, /buen trabajo/g, /genial/g, /perfecto/g,
        /feliz/g, /amor/g, /me gusta/g, /fantástico/g, /maravilloso/g,
        /correcto/g, /bien hecho/g, /éxito/g, /logrado/g, /completado/g
    ];

    // Negative indicators (real anger/frustration)
    const negativePatterns = [
        /estúpido/g, /inútil/g, /mierda/g, /maldito/g, /odio/g,
        /no funciona nada/g, /todo mal/g, /desastre/g, /horrible/g
    ];

    // Technical/analytical indicators (neutral or understanding)
    const technicalPatterns = [
        /error/g, /falla/g, /problema/g, /solución/g, /implementar/g,
        /código/g, /función/g, /base de datos/g, /archivo/g, /sistema/g,
        /reducción/g, /eliminación/g, /optimización/g, /documentación/g,
        /trazabilidad/g, /consultable/g, /inteligencia artificial/g
    ];

    // Understanding/analytical indicators
    const understandingPatterns = [
        /entendido/g, /comprendo/g, /claro/g, /analizando/g, /interesante/g,
        /ya veo/g, /tiene sentido/g, /lógico/g, /razonable/g, /coherente/g,
        /propuesta/g, /idea/g, /evaluación/g, /análisis/g
    ];

    // Thinking indicators
    const thinkingPatterns = [
        /pensar/g, /calculando/g, /procesando/g, /buscando/g, /espera/g,
        /momento/g, /déjame ver/g, /revisando/g
    ];

    // Count matches
    positivePatterns.forEach(pattern => {
        const matches = lowerText.match(pattern);
        if (matches) positiveScore += matches.length;
    });

    negativePatterns.forEach(pattern => {
        const matches = lowerText.match(pattern);
        if (matches) negativeScore += matches.length * 2; // Weight more
    });

    technicalPatterns.forEach(pattern => {
        const matches = lowerText.match(pattern);
        if (matches) technicalScore += matches.length;
    });

    // Check for understanding
    const hasUnderstanding = understandingPatterns.some(pattern => pattern.test(lowerText));
    const isThinking = thinkingPatterns.some(pattern => pattern.test(lowerText));

    // Decision logic
    if (isThinking) return 'thinking';

    // If it's a technical response (mentions errors/problems but in a solution context)
    if (technicalScore > 3 && negativeScore < 2) {
        return 'understanding'; // Purple - analytical
    }

    // Real anger only if strong negative words without technical context
    if (negativeScore > 2 && technicalScore < 2) {
        return 'anger';
    }

    // Joy for positive responses
    if (positiveScore > 1) {
        return 'joy';
    }

    // Understanding for analytical responses
    if (hasUnderstanding || technicalScore > 1) {
        return 'understanding';
    }

    return 'neutral';
}

function startThinking() {
    setEmotion('thinking');
}

function stopThinking() {
    // Don't reset immediately, let the response emotion take over
    // setEmotion('neutral'); 
}

// Update slider values display
rateInput.addEventListener('input', () => rateVal.textContent = rateInput.value);
pitchInput.addEventListener('input', () => pitchVal.textContent = pitchInput.value);
volumeInput.addEventListener('input', () => volVal.textContent = volumeInput.value);

// Initialize Speech Recognition
if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'es-ES'; // Default to Spanish
    recognition.interimResults = false;

    recognition.onstart = () => {
        micBtn.classList.add('listening');
        statusIndicator.textContent = "Escuchando...";
        statusIndicator.style.color = "#ff0000";
    };

    recognition.onend = () => {
        micBtn.classList.remove('listening');
        statusIndicator.textContent = "Online";
        statusIndicator.style.color = "#00ff00";
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        userInput.value = transcript;
        sendMessage();
    };
} else {
    micBtn.style.display = 'none';
    console.log("Web Speech API not supported");
}

// Initialize Voices
function populateVoices() {
    voices = synth.getVoices();
    voiceSelect.innerHTML = '';

    const showAll = showAllVoicesCheckbox.checked;

    let voicesToShow = voices.filter(voice => {
        if (showAll) return true;

        const lang = voice.lang.toLowerCase();
        // Default: Show all Spanish (Latino + Spain) to ensure high quality voices are available
        return lang.startsWith('es');
    });

    // Sort: Prioritize "Natural", "Online" (High Quality)
    voicesToShow.sort((a, b) => {
        const qualityKeywords = ['natural', 'online', 'google', 'premium'];
        const aQuality = qualityKeywords.some(k => a.name.toLowerCase().includes(k));
        const bQuality = qualityKeywords.some(k => b.name.toLowerCase().includes(k));

        if (aQuality && !bQuality) return -1;
        if (!aQuality && bQuality) return 1;
        return 0;
    });

    if (voicesToShow.length === 0) {
        const option = document.createElement('option');
        option.textContent = "No se encontraron voces";
        voiceSelect.appendChild(option);
    } else {
        voicesToShow.forEach((voice, index) => {
            const option = document.createElement('option');
            const isHighQuality = ['natural', 'online', 'google'].some(k => voice.name.toLowerCase().includes(k));

            option.textContent = `${isHighQuality ? '⭐ ' : ''}${voice.name} (${voice.lang})`;

            // Store the original index from the full 'voices' array
            const originalIndex = voices.indexOf(voice);
            option.value = originalIndex;
            option.setAttribute('data-name', voice.name);
            voiceSelect.appendChild(option);
        });

        // Restore selection based on current role
        const currentRole = roles.find(r => r.id === currentRoleId);
        if (currentRole && currentRole.voiceSettings && currentRole.voiceSettings.voiceName) {
            const options = Array.from(voiceSelect.options);
            const matchingOption = options.find(opt => opt.getAttribute('data-name') === currentRole.voiceSettings.voiceName);
            if (matchingOption) voiceSelect.value = matchingOption.value;
        }
    }
}

showAllVoicesCheckbox.addEventListener('change', populateVoices);
testVoiceBtn.addEventListener('click', () => {
    if (synth.speaking) synth.cancel();

    const text = "Esta es una prueba de voz de Jarvis.";
    const utterance = new SpeechSynthesisUtterance(text);

    // Use values directly from inputs for preview
    const selectedVoiceName = voiceSelect.selectedOptions[0]?.getAttribute('data-name');
    if (selectedVoiceName) {
        const voice = voices.find(v => v.name === selectedVoiceName);
        if (voice) utterance.voice = voice;
    }

    utterance.rate = parseFloat(rateInput.value);
    utterance.pitch = parseFloat(pitchInput.value);
    utterance.volume = parseFloat(volumeInput.value);

    utterance.onstart = () => arcReactor.classList.add('speaking');
    utterance.onend = () => arcReactor.classList.remove('speaking');

    synth.speak(utterance);
});

populateVoices();

populateVoices();
if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = populateVoices;
}

// Chat Functions
function addMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', sender);

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('content');

    if (sender === 'bot') {
        // Extract code and update panel first
        const textWithoutCode = updateAgentPanel(text);

        // Parse Markdown of the cleaned text
        contentDiv.innerHTML = marked.parse(textWithoutCode);

        // Handle Mermaid diagrams
        // Marked renders: <pre><code class="language-mermaid">...</code></pre>
        const codeBlocks = contentDiv.querySelectorAll('code.language-mermaid');
        codeBlocks.forEach(block => {
            const pre = block.parentElement;
            const code = block.textContent;
            const mermaidDiv = document.createElement('div');
            mermaidDiv.classList.add('mermaid');
            mermaidDiv.textContent = code;
            pre.replaceWith(mermaidDiv);
        });

        // Re-run mermaid on new content
        try {
            mermaid.init(undefined, contentDiv.querySelectorAll('.mermaid'));
        } catch (e) {
            console.error('Mermaid error:', e);
        }

    } else {
        contentDiv.textContent = text;
    }

    msgDiv.appendChild(contentDiv);
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function cleanTextForSpeech(text) {
    // Remove markdown symbols for cleaner speech
    return text
        .replace(/```[\s\S]*?```/g, 'Aquí hay un bloque de código.') // Skip code blocks
        .replace(/`.*?`/g, '$1') // Inline code
        .replace(/\*\*(.*?)\*\*/g, '$1') // Bold
        .replace(/\*(.*?)\*/g, '$1') // Italic
        .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Links
        .replace(/^#+\s+/gm, '') // Headers
        .replace(/[-*]\s+/g, '') // Lists
        .trim();
}

function speak(text) {
    // 1. Stop Microphone immediately to free up audio context
    if (recognition) {
        try {
            recognition.stop();
        } catch (e) {
            // Ignore error if already stopped
        }
    }

    // 2. Cancel any ongoing speech
    if (synth.speaking || synth.pending) {
        synth.cancel();
    }

    const cleanText = cleanTextForSpeech(text);
    const utterance = new SpeechSynthesisUtterance(cleanText);

    // Use settings from the current role
    const currentRole = roles.find(r => r.id === currentRoleId) || roles[0];
    const settings = currentRole.voiceSettings || { rate: 1, pitch: 1, volume: 1, voiceName: null };

    if (settings.voiceName) {
        const voice = voices.find(v => v.name === settings.voiceName);
        if (voice) utterance.voice = voice;
    }

    utterance.rate = settings.rate;
    utterance.pitch = settings.pitch;
    utterance.volume = settings.volume;

    // Sync visual pulse with word boundaries
    utterance.onboundary = (event) => {
        if (event.name === 'word') {
            pulseReactor();
        }
    };

    utterance.onstart = () => {
        arcReactor.classList.add('speaking');
        if (arcReactorContainer) arcReactorContainer.classList.add('speaking');
        document.body.classList.add('focus-mode');
        // Analyze emotion from text to set visual state while speaking
        const emotion = analyzeEmotion(text);
        setEmotion(emotion);
        if (matrixEffect) matrixEffect.start();
    };

    utterance.onend = () => {
        arcReactor.classList.remove('speaking');
        if (arcReactorContainer) arcReactorContainer.classList.remove('speaking');
        document.body.classList.remove('focus-mode');
        setEmotion('neutral'); // Return to neutral after speaking
        if (matrixEffect) matrixEffect.stop();
        
        // Reset any lingering transforms
        const rings = document.querySelectorAll('.ring-outer, .ring-middle');
        rings.forEach(ring => ring.style.transform = '');
    };

    // Add a robust delay to ensure audio context switch (Mic -> Speaker) is clean
    setTimeout(() => {
        synth.speak(utterance);
    }, 800);
}

function pulseReactor() {
    if (!arcReactor) return;

    // 1. Trigger the CSS pulse class
    arcReactor.classList.add('pulse');
    if (arcReactorContainer) arcReactorContainer.classList.add('pulse');
    
    // Remove it quickly to allow re-triggering
    setTimeout(() => {
        arcReactor.classList.remove('pulse');
        if (arcReactorContainer) arcReactorContainer.classList.remove('pulse');
    }, 150); // Short duration for snappy response

    // 2. Randomly rotate rings to simulate mechanical modulation
    const rings = document.querySelectorAll('.ring-outer, .ring-middle');
    rings.forEach((ring, index) => {
        // Random rotation between -30 and 30 degrees, plus a base rotation based on index
        const randomRot = (Math.random() * 60 - 30).toFixed(0);
        const scale = (1 + Math.random() * 0.1).toFixed(2); // Slight scale variation
        
        // Apply transform directly for instant reaction
        // Note: We use CSS transition in style.css to smooth this out
        ring.style.transform = `rotate(${randomRot}deg) scale(${scale})`;
    });
}

function getTemplateContext() {
    if (!window.JARVIS_TEMPLATES) {
        console.error("CRITICAL: JARVIS_TEMPLATES not found!");
        return '';
    }
    return `
################################################################################
# CONOCIMIENTO OBLIGATORIO: ESTÁNDARES TGR (TESORERÍA GENERAL DE LA REPÚBLICA) #
################################################################################
INSTRUCCIÓN DE PRIORIDAD MÁXIMA:
1. Todo código HTML/CSS/JS generado DEBE usar estas plantillas.
2. NO generes estilos genéricos ni uses otros colores.
3. El estilo TGR (Azul #003366 / Blanco) es el ÚNICO estilo permitido.
4. Si el usuario pide "una pantalla", "un reporte" o "un formulario", USA ESTAS PLANTILLAS AUTOMÁTICAMENTE sin preguntar.

--- CSS TGR (Estilo Visual - ÚSALO TAL CUAL) ---
${window.JARVIS_TEMPLATES.CSS_TGR}

--- HTML (Estructura Base - ADÁPTALA) ---
${window.JARVIS_TEMPLATES.HTML_TEMPLATE}

--- JS (Lógica Base) ---
${window.JARVIS_TEMPLATES.JS_TEMPLATE}

--- PL/SQL AJAX (Backend) ---
${window.JARVIS_TEMPLATES.PLSQL_AJAX}
################################################################################
`;
}

// Force update Aria role definition from code to ensure TGR instructions are present
function forceUpdateAriaRole() {
    const ariaIndex = roles.findIndex(r => r.id === 'aria');
    const defaultAria = DEFAULT_ROLES.find(r => r.id === 'aria');

    if (ariaIndex !== -1 && defaultAria) {
        // Check if the current stored prompt is missing the TGR instruction
        if (!roles[ariaIndex].prompt.includes('ESTÁNDAR VISUAL OBLIGATORIO: TGR')) {
            console.log("Updating Aria Role with new TGR instructions...");
            roles[ariaIndex].prompt = defaultAria.prompt;
            saveRoles();
            // Update UI if settings modal is open
            if (currentRoleId === 'aria') {
                systemPromptInput.value = defaultAria.prompt;
                       }
        }
    }
}

// Call this on init
forceUpdateAriaRole();

async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    // --- EASTER EGGS & COMMANDS ---
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('modo sigilo')) {
        setTheme('stealth');
        addMessage("Activando Modo Sigilo...", 'bot');
        userInput.value = '';
        return;
    }
    if (lowerText.includes('modo alerta')) {
        setTheme('alert');
        addMessage("¡ALERTA MÁXIMA ACTIVADA!", 'bot');
        userInput.value = '';
        return;
    }
    if (lowerText.includes('modo eco') || lowerText.includes('modo tgr')) {
        setTheme('eco');
        addMessage("Optimizando energía. Modo TGR activo.", 'bot');
        userInput.value = '';
        return;
    }
    if (lowerText.includes('protocolo fiesta')) {
        addMessage("¡Que empiece la fiesta, señor!", 'bot');
        document.body.style.animation = "pulse-bg 0.5s infinite";
        setTimeout(() => document.body.style.animation = "", 5000);
        userInput.value = '';
        return;
    }
    if (lowerText.includes('autodestrucción')) {
        setTheme('alert');
        addMessage("INICIANDO SECUENCIA DE AUTODESTRUCCIÓN... 3... 2... 1...", 'bot');
        setTimeout(() => {
            alert("¡Broma! Pero no vuelva a hacer eso.");
            setTheme('default');
        }, 3000);
        userInput.value = '';
        return;
    }
    // ------------------------------

    addMessage(text, 'user');
    userInput.value = '';

    // Add user message to history (include code snapshot when available)
    const enrichedText = buildUserMessageWithCode(text);
    conversationHistory.push({ role: "user", content: enrichedText });

    // Limit history to last 40 messages (approx 20 turns) - Qwen models handle context well
    if (conversationHistory.length > 40) {
        conversationHistory = conversationHistory.slice(-40);
    }

    if (msgCounter) msgCounter.textContent = conversationHistory.length;

    try {
        statusIndicator.textContent = "Procesando...";
        statusIndicator.style.color = "#ffff00";

        startThinking();
        // if (matrixEffect) matrixEffect.start(); // Removed to prevent matrix during thinking

        // Start Timer
        const startTime = Date.now();
        timerDisplay.style.display = 'flex';
        timerSpan.textContent = '0.0s';
        if (requestTimerInterval) clearInterval(requestTimerInterval);
        requestTimerInterval = setInterval(() => {
            const elapsed = (Date.now() - startTime) / 1000;
            timerSpan.textContent = elapsed.toFixed(1) + 's';
        }, 100);

        // Get current system prompt
        const currentRole = roles.find(r => r.id === currentRoleId) || roles[0];

        let finalPrompt = currentRole.prompt;
        // Inject templates if it's Aria (or generally if we want to enforce it)
        // Also inject if the user mentions "TGR" explicitly
        const userTextLower = text.toLowerCase();
        if (currentRole.name.toLowerCase().includes('aria') || currentRole.id === 'aria' || userTextLower.includes('tgr')) {
            console.log("Injecting TGR Templates into System Prompt");
            finalPrompt += "\n\n" + getTemplateContext();
        }

        const systemMessage = { role: "system", content: finalPrompt };

        // Prepare messages with Code Context if available
        let messagesToSend = [systemMessage, ...conversationHistory];

        if (agentCode.html || agentCode.css || agentCode.js || agentCode.plsql || agentCode.ajax) {
            const codeContext = `
[ESTADO ACTUAL DEL CÓDIGO EN EL PANEL]
El usuario está viendo este código. Tómalo como la VERDAD ABSOLUTA.
IMPORTANTE - MODO EDICIÓN:
1. Si el usuario pide cambios, DEBES partir del código ACTUAL y aplicar las modificaciones solicitadas, sin reiniciar archivos salvo que lo pidan explícitamente.
2. Entrega siempre el bloque COMPLETO (HTML, CSS, JS o AJAX) ya modificado.
3. El panel de código se sobrescribirá completamente con lo que generes, así que no omitas secciones existentes.
4. PROHIBIDO usar placeholders como "// ... resto del código" o "// ... código sin cambios".
5. Si modificas JS, devuelve TODO el JS. Si modificas CSS o AJAX, devuelve TODO su contenido.
6. Mantén intactas las partes no relacionadas, solo ajusta lo que el usuario solicitó.

${agentCode.html ? `HTML:\n${agentCode.html}\n` : ''}
${agentCode.css ? `CSS:\n${agentCode.css}\n` : ''}
${agentCode.js ? `JS:\n${agentCode.js}\n` : ''}
${agentCode.plsql ? `PL/SQL:\n${agentCode.plsql}\n` : ''}
${agentCode.ajax ? `AJAX:\n${agentCode.ajax}\n` : ''}
`;
            // Insert context before the last user message
            messagesToSend = [
                systemMessage,
                ...conversationHistory.slice(0, -1),
                { role: "system", content: codeContext },
                conversationHistory[conversationHistory.length - 1]
            ];
        }

        // Direct connection to Ollama or Gemini
        const selectedModel = document.getElementById('model-select').value;
        let data;

        // Check if it's a Gemini model
        const isGemini = selectedModel.startsWith('gemini') || selectedModel.startsWith('imagen') || selectedModel.startsWith('veo');

        if (isGemini) {
            const enabledConfigs = DEFAULT_ARIA_CONFIG.apiConfigs.filter(c => c.enabled);
            if (enabledConfigs.length === 0) {
                throw new Error("No API keys available for Gemini.");
            }

            let success = false;
            let lastError = null;
            
            // Start from a random index to distribute load
            let startIndex = Math.floor(Math.random() * enabledConfigs.length);

            for (let i = 0; i < enabledConfigs.length; i++) {
                const configIndex = (startIndex + i) % enabledConfigs.length;
                const config = enabledConfigs[configIndex];
                const apiKey = config.apiKey;
                
                console.log(`Attempting request with API Key: ${config.label}`);

                const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${apiKey}`;

                // Construct Gemini Request
                const geminiBody = {
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 8192
                    }
                };

                // Extract system prompt
                const systemMsg = messagesToSend.find(m => m.role === 'system');
                if (systemMsg) {
                    geminiBody.systemInstruction = {
                        parts: [{ text: systemMsg.content }]
                    };
                }

                // Filter out system messages and map the rest
                const chatMessages = messagesToSend.filter(m => m.role !== 'system');
                
                geminiBody.contents = chatMessages.map(msg => ({
                    role: msg.role === 'user' ? 'user' : 'model',
                    parts: [{ text: msg.content }]
                }));

                try {
                    const response = await fetch(geminiUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(geminiBody)
                    });

                    if (!response.ok) {
                        const errorText = await response.text();
                        console.warn(`API Key ${config.label} failed: ${response.status}`);
                        throw new Error(`HTTP ${response.status}: ${errorText}`);
                    }

                    const geminiData = await response.json();

                    // Normalize to Ollama format
                    if (geminiData.candidates && geminiData.candidates.length > 0 && geminiData.candidates[0].content && geminiData.candidates[0].content.parts) {
                        data = {
                            message: {
                                content: geminiData.candidates[0].content.parts.map(p => p.text).join('')
                            }
                        };
                    } else {
                        throw new Error("Invalid Gemini response format.");
                    }

                    success = true;
                    console.log(`Success with API Key: ${config.label}`);
                    break; // Exit loop on success
                } catch (err) {
                    lastError = err;
                    console.warn(`Error with key ${config.label}, trying next...`);
                    // Continue to next key
                }
            }

            if (!success) {
                throw new Error(`All API keys failed. Last error: ${lastError ? lastError.message : 'Unknown error'}`);
            }

        } else {
            // Ollama Request
            const response = await fetch('http://localhost:11434/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: selectedModel,
                    messages: messagesToSend,
                    stream: false,
                    options: {
                        num_ctx: 20480 // Increase context window to 20k tokens to handle TGR templates
                    }
                })
            });

            if (!response.ok) throw new Error('Network response was not ok');
            data = await response.json();
        }

        stopThinking();
        clearInterval(requestTimerInterval); // Stop timer but keep visible

        statusIndicator.textContent = "Online";
        statusIndicator.style.color = "#00ff00";

        if (data.message && data.message.content) {
            const botResponse = data.message.content;

            // Clean response for history to avoid token duplication
            // We replace code blocks with placeholders in the history, 
            // because the FULL code is always injected via codeContext in the next turn.
            let cleanResponse = botResponse;
            cleanResponse = cleanResponse.replace(/```html[\s\S]*?```/gi, '\n*[Código HTML actualizado]*\n');
            cleanResponse = cleanResponse.replace(/```css[\s\S]*?```/gi, '\n*[Código CSS actualizado]*\n');
            cleanResponse = cleanResponse.replace(/```(javascript|js)[\s\S]*?```/gi, '\n*[Código JS actualizado]*\n');
            cleanResponse = cleanResponse.replace(/```(sql|plsql)[\s\S]*?```/gi, '\n*[Código SQL actualizado]*\n');
            cleanResponse = cleanResponse.replace(/```ajax[\s\S]*?```/gi, '\n*[Código AJAX actualizado]*\n');

            // Add CLEAN response to history
            conversationHistory.push({ role: "assistant", content: cleanResponse });

            // Limit history to last 40 messages
            if (conversationHistory.length > 40) {
                conversationHistory = conversationHistory.slice(-40);
            }

            if (msgCounter) msgCounter.textContent = conversationHistory.length;

            // Pass ORIGINAL response to UI so it can extract and show code
            addMessage(botResponse, 'bot');
            speak(botResponse);
        } else if (data.error) {
            addMessage("Error: " + data.error, 'bot');
        }
    } catch (error) {
        stopThinking();
        clearInterval(requestTimerInterval);
        timerDisplay.style.display = 'none'; // Hide timer on error
        console.error('Error:', error);
        statusIndicator.textContent = "Error";
        statusIndicator.style.color = "red";
        addMessage("Error de conexión con JARVIS.", 'bot');
    }
}

// Event Listeners
sendBtn.addEventListener('click', sendMessage);

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

micBtn.addEventListener('click', () => {
    if (synth.speaking) {
        synth.cancel();
    }
    if (recognition) {
        recognition.start();
        if (visualizer) visualizer.start();
    }
});

// Spacebar to toggle mic
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && document.activeElement !== userInput) {
        e.preventDefault(); // Prevent scrolling
        if (recognition && !micBtn.classList.contains('listening')) {
            micBtn.click();
        }
    }
});

// Stop visualizer when recognition ends
if (recognition) {
    const originalOnEnd = recognition.onend;
    recognition.onend = () => {
        if (originalOnEnd) originalOnEnd();
        if (visualizer) visualizer.stop();
    };
}
// --- NEW SETTINGS MODAL LOGIC ---

function initSettingsModal() {
    // Tab Switching Logic
    const settingsTabBtns = document.querySelectorAll('.settings-tab-btn');
    const settingsSections = document.querySelectorAll('.settings-section');

    settingsTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Deactivate all
            settingsTabBtns.forEach(b => b.classList.remove('active'));
            settingsSections.forEach(s => s.classList.remove('active'));

            // Activate clicked
            btn.classList.add('active');
            const targetId = btn.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // Close Button Logic (New button inside modal)
    const closeModalBtn = document.querySelector('.close-modal-btn');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            document.getElementById('settings-modal').style.display = 'none';
        });
    }

    // Initialize Tabs Data
    renderApiKeys();
    renderModelsConfig();

    // API Key Event Listeners
    document.getElementById('add-api-key-btn').addEventListener('click', addApiKey);

    // Model Config Event Listeners
    document.getElementById('save-models-btn').addEventListener('click', saveModelsConfig);
    document.getElementById('reset-models-btn').addEventListener('click', resetModelsConfig);
}

// --- API KEY MANAGEMENT ---

function renderApiKeys() {
        console.log('DEBUG renderApiKeys called');
        console.log('DEBUG DEFAULT_ARIA_CONFIG:', DEFAULT_ARIA_CONFIG);
        if (DEFAULT_ARIA_CONFIG && DEFAULT_ARIA_CONFIG.apiConfigs) {
            console.log('DEBUG apiConfigs in renderApiKeys:', DEFAULT_ARIA_CONFIG.apiConfigs);
        } else {
            console.warn('DEFAULT_ARIA_CONFIG.apiConfigs is missing or undefined');
        }
    const list = document.getElementById('api-key-list');
    list.innerHTML = '';

    DEFAULT_ARIA_CONFIG.apiConfigs.forEach((config, index) => {
        const item = document.createElement('div');
        item.className = `api-key-item ${config.enabled ? '' : 'disabled'}`;

        // Mask key for display (show first 4 and last 4)
        const maskedKey = config.apiKey.length > 10
            ? `${config.apiKey.substring(0, 6)}...${config.apiKey.substring(config.apiKey.length - 4)}`
            : '***';

        item.innerHTML = `
            <div class="key-info">
                <span class="key-label">${config.label}</span>
                <span class="key-value">${maskedKey}</span>
            </div>
            <div class="key-actions">
                <button class="toggle-key-btn ${config.enabled ? 'active' : ''}" onclick="toggleApiKey('${config.id}')" title="${config.enabled ? 'Desactivar' : 'Activar'}">
                    <i class="fas fa-power-off"></i>
                </button>
                <button class="delete-key-btn" onclick="deleteApiKey('${config.id}')" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        list.appendChild(item);
    });
}
// Exponer globalmente para otros scripts
window.renderApiKeys = renderApiKeys;

function addApiKey() {
    const labelInput = document.getElementById('new-key-label');
    const valueInput = document.getElementById('new-key-value');

    const label = labelInput.value.trim();
    const apiKey = valueInput.value.trim();

    if (!label || !apiKey) {
        alert('Por favor ingresa una etiqueta y la API Key.');
        return;
    }

    const newId = 'key_' + Date.now();
    DEFAULT_ARIA_CONFIG.apiConfigs.push({
        id: newId,
        label: label,
        apiKey: apiKey,
        enabled: true
    });

    saveAriaConfig();
    renderApiKeys();

    labelInput.value = '';
    valueInput.value = '';
}

// Expose globally for onclick events
window.toggleApiKey = function (id) {
    const config = DEFAULT_ARIA_CONFIG.apiConfigs.find(c => c.id === id);
    if (config) {
        config.enabled = !config.enabled;
        saveAriaConfig();
        renderApiKeys();
    }
};

window.deleteApiKey = function (id) {
    if (confirm('¿Estás seguro de eliminar esta API Key?')) {
        DEFAULT_ARIA_CONFIG.apiConfigs = DEFAULT_ARIA_CONFIG.apiConfigs.filter(c => c.id !== id);
        saveAriaConfig();
        renderApiKeys();
    }
};

// --- MODELS CONFIGURATION ---

function renderModelsConfig() {
    const list = document.getElementById('models-config-list');
    list.innerHTML = '';

    SUPPORTED_MODELS.forEach((model, index) => {
        const item = document.createElement('div');
        item.className = 'model-config-item';
        item.innerHTML = `
            <h4>${model.name}</h4>
            <div class="model-stat-input">
                <label>RPM:</label>
                <input type="number" class="model-rpm" data-index="${index}" value="${model.rpm}">
            </div>
            <div class="model-stat-input">
                <label>RPD:</label>
                <input type="number" class="model-rpd" data-index="${index}" value="${model.rpd}">
            </div>
            <div class="model-stat-input">
                <label>TPM:</label>
                <input type="number" class="model-tpm" data-index="${index}" value="${model.tpm || 0}">
            </div>
        `;
        list.appendChild(item);
    });
}

function saveModelsConfig() {
    const rpmInputs = document.querySelectorAll('.model-rpm');
    const rpdInputs = document.querySelectorAll('.model-rpd');
    const tpmInputs = document.querySelectorAll('.model-tpm');

    rpmInputs.forEach(input => {
        const index = input.getAttribute('data-index');
        SUPPORTED_MODELS[index].rpm = parseInt(input.value) || 0;
    });

    rpdInputs.forEach(input => {
        const index = input.getAttribute('data-index');
        SUPPORTED_MODELS[index].rpd = parseInt(input.value) || 0;
    });

    tpmInputs.forEach(input => {
        const index = input.getAttribute('data-index');
        const val = parseInt(input.value);
        SUPPORTED_MODELS[index].tpm = val === 0 ? null : val;
    });

    saveSupportedModels();
    alert('Configuración de modelos guardada correctamente.');
}

function resetModelsConfig() {
    if (confirm('¿Restaurar los límites por defecto de los modelos?')) {
        // Deep copy base to avoid reference issues
        SUPPORTED_MODELS = JSON.parse(JSON.stringify(SUPPORTED_MODELS_BASE));
        saveSupportedModels();
        renderModelsConfig();
    }
}

// Initialize everything
let matrixEffect;
let visualizer;

window.addEventListener('load', () => {
    visualizer = new AudioVisualizer('audio-visualizer');
    // visualizer.simulate(); // Removed auto-simulation
    
    // Try to start real mic on click (browser policy)
    // document.body.addEventListener('click', () => {
    //     visualizer.start();
    // }, { once: true });

    matrixEffect = new MatrixEffect('matrix-canvas');
    new HolographicGlobe('globe-canvas');
});

// --- NEW VISUAL FEATURES ---

// 1. Audio Visualizer
class AudioVisualizer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.audioContext = null;
        this.analyser = null;
        this.dataArray = null;
        this.source = null;
        this.isListening = false;
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }

    async start() {
        if (this.isListening) return;
        try {
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                this.analyser = this.audioContext.createAnalyser();
                this.analyser.fftSize = 256;
                const bufferLength = this.analyser.frequencyBinCount;
                this.dataArray = new Uint8Array(bufferLength);
            }

            if (!this.source) {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                this.source = this.audioContext.createMediaStreamSource(stream);
                this.source.connect(this.analyser);
            }
            
            this.isListening = true;
            this.draw();
        } catch (err) {
            console.log("Audio visualizer init failed (mic permission?):", err);
            // Fallback to simulation
            // this.simulate(); // Don't fallback to simulation if mic fails, just stop
        }
    }

    stop() {
        this.isListening = false;
        if (this.ctx) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    draw() {
        if (!this.isListening) return;
        requestAnimationFrame(() => this.draw());

        this.analyser.getByteFrequencyData(this.dataArray);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const barWidth = (this.canvas.width / this.dataArray.length) * 2.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < this.dataArray.length; i++) {
            barHeight = this.dataArray[i] / 2;
            this.ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--hud-color').trim();
            this.ctx.fillRect(x, this.canvas.height - barHeight, barWidth, barHeight);
            x += barWidth + 1;
        }
    }

    // Removed simulate() as it's no longer used for idle state
}

// 2. Matrix Effect
class MatrixEffect {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        this.chars = '0123456789ABCDEF';
        this.words = ['TGR', 'IMPUESTOS', 'TESORERIA', 'RUT', 'PAGO', 'FISCO', 'CHILE'];
        this.drops = [];
        this.fontSize = 14;
        this.initDrops();
        this.isRunning = false;
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.initDrops();
    }

    initDrops() {
        const columns = this.canvas.width / this.fontSize;
        this.drops = [];
        for (let i = 0; i < columns; i++) {
            this.drops[i] = 1;
        }
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.canvas.style.opacity = 0.15;
        this.animate();
    }

    stop() {
        this.isRunning = false;
        this.canvas.style.opacity = 0;
    }

    animate() {
        if (!this.isRunning) return;

        // Fade effect for trails
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--hud-color').trim();
        this.ctx.font = this.fontSize + 'px monospace';

        for (let i = 0; i < this.drops.length; i++) {
            let text = this.chars.charAt(Math.floor(Math.random() * this.chars.length));
            
            if (Math.random() > 0.98) {
                text = this.words[Math.floor(Math.random() * this.words.length)];
            }

            this.ctx.fillText(text, i * this.fontSize, this.drops[i] * this.fontSize);

            if (this.drops[i] * this.fontSize > this.canvas.height && Math.random() > 0.975) {
                this.drops[i] = 0;
            }
            this.drops[i]++;
        }
        requestAnimationFrame(() => this.animate());
    }
}

// 3. Holographic Globe
class HolographicGlobe {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width = this.canvas.offsetWidth;
        this.height = this.canvas.height = this.canvas.offsetHeight;
        
        this.rotation = 0;
        this.dots = [];
        this.initDots();
        
        this.isDragging = false;
        this.lastX = 0;
        
        this.canvas.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.lastX = e.clientX;
        });
        
        window.addEventListener('mouseup', () => this.isDragging = false);
        
        window.addEventListener('mousemove', (e) => {
            if (this.isDragging) {
                const delta = e.clientX - this.lastX;
                this.rotation += delta * 0.01;
                this.lastX = e.clientX;
            }
        });

        this.animate();
    }

    initDots() {
        // Create a sphere of dots
        for (let i = 0; i < 200; i++) {
            const theta = Math.random() * 2 * Math.PI;
            const phi = Math.acos((Math.random() * 2) - 1);
            const r = 80; // Radius
            
            this.dots.push({
                x: r * Math.sin(phi) * Math.cos(theta),
                y: r * Math.sin(phi) * Math.sin(theta),
                z: r * Math.cos(phi)
            });
        }
        
        // Add "Regional Offices" (Active Nodes)
        // Just some fixed points to represent cities
        this.dots.push({ x: 80, y: 0, z: 0, type: 'node', label: 'SANTIAGO' });
        this.dots.push({ x: 0, y: 80, z: 0, type: 'node', label: 'ARICA' });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        const cx = this.width / 2;
        const cy = this.height / 2;
        
        if (!this.isDragging) {
            this.rotation += 0.005;
        }

        this.dots.forEach(dot => {
            // Rotate around Y axis
            let x = dot.x * Math.cos(this.rotation) - dot.z * Math.sin(this.rotation);
            let z = dot.z * Math.cos(this.rotation) + dot.x * Math.sin(this.rotation);
            let y = dot.y;
            
            // Project 3D to 2D
            let scale = 200 / (200 + z);
            let px = cx + x * scale;
            let py = cy + y * scale;
            
            let alpha = (z + 80) / 160; // Fade back dots
            if (alpha < 0.1) alpha = 0.1;
            
            this.ctx.fillStyle = dot.type === 'node' ? '#ff00ff' : getComputedStyle(document.body).getPropertyValue('--hud-color').trim();
            this.ctx.globalAlpha = alpha;
            
            const size = dot.type === 'node' ? 3 : 1.5;
            this.ctx.beginPath();
            this.ctx.arc(px, py, size * scale, 0, Math.PI * 2);
            this.ctx.fill();
            
            if (dot.type === 'node' && z > 0) {
                this.ctx.fillStyle = '#ffffff';
                this.ctx.font = '10px Arial';
                this.ctx.fillText(dot.label, px + 5, py);
            }
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// 4. Theme Manager
function setTheme(themeName) {
    document.body.classList.remove('theme-stealth', 'theme-alert', 'theme-eco');
    if (themeName !== 'default') {
        document.body.classList.add(`theme-${themeName}`);
    }
    // Update status chip
    const statusMode = document.getElementById('status-mode');
    if (statusMode) statusMode.textContent = themeName.toUpperCase();
}

// 5. Hacking Typewriter Effect
function typeWriter(element, text, speed = 5, onFinish = null, highlightLine = false) {
    element.textContent = '';
    let i = 0;
    let lastScroll = 0;
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            // Autoscroll suave
            if (element.scrollHeight - element.scrollTop > element.clientHeight + 10 || i - lastScroll > 20) {
                element.scrollTo({ top: element.scrollHeight, behavior: 'smooth' });
                lastScroll = i;
            }
            // Resalta línea actual si se solicita
            if (highlightLine && text.charAt(i - 1) === '\n') {
                const lines = element.textContent.split('\n');
                element.innerHTML = lines.map((line, idx) => idx === lines.length - 1 ? `<span class="sca-hacker-line">${line}</span>` : line).join('\n');
            }
            setTimeout(type, speed);
        } else {
            // Highlight después de terminar
            document.querySelectorAll('pre code').forEach((block) => {
                hljs.highlightElement(block);
            });
            if (typeof onFinish === 'function') onFinish();
        }
    }
    type();
}
