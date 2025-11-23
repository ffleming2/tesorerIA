# Copilot Coding Agent Instructions for tesorerIA

## Arquitectura General
- Proyecto web con frontend en HTML/CSS/JS y backend probable en Flask (ver `requirements.txt`).
- El frontend se encuentra en `index.html` y la carpeta `static/` (subcarpetas `js/`, `css/`).
- El sistema simula una interfaz tipo JARVIS, con paneles HUD, animaciones y comandos de voz/texto.
- Los componentes principales JS están en `static/js/`:
  - `main.js`: inicialización global, eventos principales.
  - `chat.js`: lógica de chat, comandos especiales ("modo sigilo", "boot", etc.).
  - `role-manager.js`: gestión de roles y prompts, persistencia en localStorage.
  - `config.js`: configuración de modelos IA y API keys, rotación de endpoints.
  - `bootup.js`: animación y lógica de arranque visual.
  - Otros archivos para UI, animaciones, paneles, emociones, etc.

## Convenciones y Patrones Clave
- **Persistencia local:** Configuraciones y roles se guardan en `localStorage` bajo claves tipo `jarvis_*`.
- **Comandos de usuario:** El chat reconoce comandos por texto (ej: "modo sigilo", "protocolo fiesta") y ejecuta acciones visuales o de sistema.
- **Animaciones y HUD:** El arranque y visualización usan canvas y overlays controlados por JS (`bootup.js`).
- **Gestión de roles:** Los roles definen prompts y textos de bienvenida, seleccionables en la UI y persistentes entre sesiones.
- **Rotación de API keys:** El acceso a modelos IA rota entre varias API keys configuradas en `config.js`.
- **Integración de modelos IA:** Los modelos soportados se definen en `config.js` y pueden cambiarse dinámicamente.

## Flujos de Desarrollo
- **Frontend:** Modificar `index.html` y archivos en `static/` para cambios visuales o de interacción.
- **Backend:** Si se usa Flask, los endpoints y lógica están fuera de la carpeta `static/` (no presentes en este snapshot).
- **Dependencias:** Instalar con `pip install -r requirements.txt`.
- **Animaciones:** Personalizar secuencias en `bootup.js` y estilos en `static/css/`.

## Ejemplos de Patrones
- Para agregar un nuevo comando de chat, editar el bloque de comandos en `chat.js`.
- Para añadir un nuevo modelo IA, actualizar `SUPPORTED_MODELS_BASE` en `config.js` y guardar con `saveSupportedModels()`.
- Para modificar la animación de arranque, editar la clase `BootUpSequence` en `bootup.js`.

## Archivos Clave
- `index.html`: Estructura principal y carga de scripts/estilos.
- `static/js/`: Lógica de frontend modularizada.
- `static/css/`: Estilos visuales y HUD.
- `requirements.txt`: Dependencias Python (Flask, requests, ollama).

## Notas
- No hay tests ni scripts de build detectados; el flujo es directo (modificar y recargar).
- El README es mínimo; toda convención relevante está en los archivos JS principales.

---
Actualiza este documento si se agregan nuevos flujos, convenciones o componentes importantes.
