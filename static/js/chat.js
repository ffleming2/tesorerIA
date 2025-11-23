// --- Utilidad para mostrar mensajes en el chat ---
function addMessage(text, sender) {
    const chatBox = document.getElementById('chat-box');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message ' + sender;
        const contentDiv = document.createElement('div');
        contentDiv.className = 'content';
        // Si el mensaje contiene un bloque mermaid, renderizarlo correctamente
        const mermaidMatch = text.match(/```mermaid([\s\S]*?)```/);
        if (mermaidMatch) {
            const mermaidDiv = document.createElement('div');
            mermaidDiv.className = 'mermaid';
            mermaidDiv.textContent = mermaidMatch[1].trim();
            contentDiv.appendChild(mermaidDiv);
            // Renderizar Mermaid tras insertar el contenido
            if (window.mermaid) {
                setTimeout(() => {
                    window.mermaid.init(undefined, mermaidDiv);
                }, 100);
            }
            // Agregar el resto del texto sin el bloque mermaid
            const textoSinMermaid = text.replace(/```mermaid[\s\S]*?```/, '').trim();
            if (textoSinMermaid) {
                const textoDiv = document.createElement('div');
                textoDiv.innerHTML = textoSinMermaid;
                contentDiv.appendChild(textoDiv);
            }
        } else {
            contentDiv.innerHTML = text;
        }
        messageDiv.appendChild(contentDiv);
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    // JARVIS solo habla respuestas cortas tipo bot (no reportes largos)
    if (sender === 'bot') {
        // Si el texto es muy largo (más de 200 caracteres o contiene tablas/código), no leer
        const esLargo = text.length > 200 || /\|.*\|/.test(text) || /```/.test(text);
        if (!esLargo) {
            if (typeof speak === 'function') {
                speak(text);
            } else if (window.speechSynthesis) {
                const utter = new window.SpeechSynthesisUtterance(text);
                utter.lang = 'es-ES';
                window.speechSynthesis.speak(utter);
            }
        }
    }
}
// Botón PEGAR para el chat
document.addEventListener('DOMContentLoaded', function() {
    const pasteBtn = document.getElementById('paste-btn');
    const userInput = document.getElementById('user-input');
    if (pasteBtn && userInput) {
        pasteBtn.addEventListener('click', async function() {
            try {
                const text = await navigator.clipboard.readText();
                if (text) {
                    userInput.value = text;
                    userInput.focus();
                }
            } catch (err) {
                alert('No se pudo acceder al portapapeles.');
            }
        });
    }
});
async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;
    const lowerText = text.toLowerCase();
    // --- DEMO: Ejecuciones del caracterizador ---
    if (lowerText.match(/ultimas? 5 ejecuciones.*caracterizador/)) {
            // Simular listado markdown
            const ejecuciones = [
                { id: 'C-20251121-01', fecha: '2025-11-21 09:12', estado: 'OK', usuario: 'jrojas' },
                { id: 'C-20251120-02', fecha: '2025-11-20 17:44', estado: 'OK', usuario: 'mvalenzuela' },
                { id: 'C-20251120-01', fecha: '2025-11-20 11:03', estado: 'Error', usuario: 'jrojas' },
                { id: 'C-20251119-01', fecha: '2025-11-19 15:22', estado: 'OK', usuario: 'ffleming' },
                { id: 'C-20251118-01', fecha: '2025-11-18 10:55', estado: 'OK', usuario: 'jrojas' }
            ];
            let markdown = '### Últimas 5 ejecuciones del caracterizador\n';
            markdown += '| ID | Fecha | Estado | Usuario |\n|---|---|---|---|\n';
            ejecuciones.forEach(e => {
                markdown += `| ${e.id} | ${e.fecha} | ${e.estado} | ${e.usuario} |\n`;
            });
            markdown += '\n¿Desea una vista descargable?';
            addMessage(markdown, 'bot');
            userInput.value = '';
            // Esperar respuesta del usuario
            window.__jarvisDescargaCaracterizador = true;
            return;
        }

        // Si el usuario acepta la descarga
        if (window.__jarvisDescargaCaracterizador && lowerText.match(/(descargar|sí|si|acepto|ok)/)) {
            // Mostrar modal con botón de descarga simulado
            const modal = document.getElementById('jarvisDemoModal');
            if (modal) {
                // Simular contenido descargable
                modal.querySelector('h2').textContent = 'Descarga de Ejecuciones del Caracterizador';
                modal.querySelector('.mermaid').textContent = '';
                const markdownReporte = '### Últimas 5 ejecuciones del caracterizador\n| ID | Fecha | Estado | Usuario |\n|---|---|---|---|\n| C-20251121-01 | 2025-11-21 09:12 | OK | jrojas |\n| C-20251120-02 | 2025-11-20 17:44 | OK | mvalenzuela |\n| C-20251120-01 | 2025-11-20 11:03 | Error | jrojas |\n| C-20251119-01 | 2025-11-19 15:22 | OK | ffleming |\n| C-20251118-01 | 2025-11-18 10:55 | OK | jrojas |';
                const markdownPre = modal.querySelector('pre');
                if (markdownPre) {
                    markdownPre.textContent = markdownReporte;
                    if (window.marked) {
                        const parent = markdownPre.parentElement;
                        parent.innerHTML = marked.parse(markdownReporte);
                    }
                }
                modal.querySelector('h3').textContent = 'Listado descargable';
                const respuestaDiv = modal.querySelector('em');
                if (respuestaDiv) {
                    respuestaDiv.textContent = 'Presione el botón para descargar el listado.';
                }
                // Agregar botón de descarga si no existe
                let btn = modal.querySelector('#descargarCaracterizadorBtn');
                if (!btn) {
                    btn = document.createElement('button');
                    btn.id = 'descargarCaracterizadorBtn';
                    btn.textContent = 'Descargar';
                    btn.style = 'background:#00ffe7;color:#222;border:none;border-radius:6px;padding:0.5em 1em;cursor:pointer;margin-top:1em;';
                    btn.onclick = function() {
                        // Simular descarga
                        const blob = new Blob([markdownReporte], { type: 'text/markdown' });
                        const link = document.createElement('a');
                        link.href = URL.createObjectURL(blob);
                        link.download = 'ejecuciones_caracterizador.md';
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    };
                    modal.querySelector('div[style*="background:#111"]').appendChild(btn);
                }
                modal.style.display = 'block';
            }
            addMessage('Aquí tienes la vista descargable. Presiona el botón para descargar el listado.', 'bot');
            window.__jarvisDescargaCaracterizador = false;
            userInput.value = '';
            return;
        }
    // --- EASTER EGGS & COMMANDS ---

    // --- DEMO: Mostrar reporte/dashboard como respuesta de JARVIS ---
    function mostrarReporteDemo(pregunta) {
        // Simulación de datos según la pregunta
        let mermaidDiagram = '';
        let markdownReporte = '';
        let respuestaJarvis = '';
        if (pregunta.includes('jira') || pregunta.includes('tareas')) {
            mermaidDiagram = `flowchart LR
    subgraph JIRA
        J1[Backlog] --> J2[En Progreso]
        J2 --> J3[Resuelto]
    end
    JIRA --> DEV[Desarrollo AWS]
    DEV --> TEST[Test Onpremise]
    TEST --> REPORTE[Reporte Automático]
    REPORTE --> DECISION[Decisión Basada en Datos]
    DEV -.-> QA[Revisión QA]
    QA --> PROD[Producción]
    PROD --> REPORTE`;
            markdownReporte = `# Resumen JIRA\n- **Tareas en progreso:** 14\n- **Backlog:** 5\n- **Horas ingresadas hoy:** 28\n- **Componentes desplegados:** 2\n- **Incidentes críticos:** 0\n- **Sugerencia JARVIS:** Priorizar tareas de integración y revisar dependencias AWS.`;
            respuestaJarvis = 'Reporte JIRA generado. El flujo operativo es estable, sin incidentes críticos. ¿Desea ver el detalle de tareas por responsable?';
        } else if (pregunta.includes('dashboard') || pregunta.includes('estado operativo')) {
            mermaidDiagram = `graph TD; DEV[Desarrollo AWS] --> TEST[Test Onpremise]; TEST --> QA[QA]; QA --> PROD[Producción]; PROD --> REPORTE[Reporte Automático];`;
            markdownReporte = `# Estado Operativo\n- **Componentes en desarrollo:** 3\n- **Componentes en test:** 2\n- **Componentes en producción:** 8\n- **Incidentes:** 0\n- **Horas totales hoy:** 41\n- **Sugerencia JARVIS:** Refactorizar módulo de despliegue y automatizar pruebas QA.`;
            respuestaJarvis = 'Dashboard generado. Todo el flujo operativo está sincronizado y sin incidentes. ¿Desea ver el detalle de despliegues recientes?';
        } else {
            mermaidDiagram = `graph TD; PLANIFICACION --> DESARROLLO --> TEST --> REPORTE;`;
            markdownReporte = `# Resumen Diario\n- **Tareas en progreso:** 12\n- **Backlog:** 7\n- **Horas ingresadas hoy:** 34\n- **Componentes desplegados:** 3\n- **Incidentes críticos:** 0\n- **Sugerencia JARVIS:** Refactorizar módulo de autenticación, reutilizar API de notificaciones.`;
            respuestaJarvis = 'Reporte generado. El flujo operativo se mantiene estable, sin incidentes críticos. ¿Desea ver el detalle de horas por colaborador?';
        }
        // Actualizar contenido del modal SOLO con diagrama Mermaid
        const modal = document.getElementById('jarvisDemoModal');
        if (modal) {
            const mermaidDiv = modal.querySelector('.mermaid');
            if (mermaidDiv) {
                // Insertar el diagrama Mermaid como HTML, no como <pre>
                mermaidDiv.innerHTML = `${mermaidDiagram}`;
                // Renderizar Mermaid tras insertar el contenido
                if (window.mermaid) {
                    setTimeout(() => {
                        window.mermaid.init(undefined, mermaidDiv);
                    }, 100);
                }
            }
            // Limpiar markdown y respuesta larga
            const markdownPre = modal.querySelector('pre');
            if (markdownPre) markdownPre.textContent = '';
            const respuestaDiv = modal.querySelector('em');
            if (respuestaDiv) respuestaDiv.textContent = '';
            modal.style.display = 'block';
        }
    }

    // Conversación proactiva para reportes y diagramas
    if (lowerText.match(/reporte|dashboard|estado operativo|jira|tareas/)) {
        addMessage('Entendido, he generado el reporte solicitado. ¿Prefiere visualizar el reporte directamente en pantalla, ver un diagrama interactivo o enviarlo por correo a algún grupo de usuarios? Si necesita orientación, puedo explicarle las opciones disponibles.', 'bot');
        // Forzar síntesis de voz para este mensaje
        if (typeof speak === 'function') {
            speak('Entendido, he generado el reporte solicitado. ¿Prefiere visualizar el reporte directamente en pantalla, ver un diagrama interactivo o enviarlo por correo a algún grupo de usuarios? Si necesita orientación, puedo explicarle las opciones disponibles.');
        } else if (window.speechSynthesis) {
            const utter = new window.SpeechSynthesisUtterance('Entendido, he generado el reporte solicitado. ¿Prefiere visualizar el reporte directamente en pantalla, ver un diagrama interactivo o enviarlo por correo a algún grupo de usuarios? Si necesita orientación, puedo explicarle las opciones disponibles.');
            utter.lang = 'es-ES';
            window.speechSynthesis.speak(utter);
        }
        setTimeout(() => {
            addMessage('Estoy atento a su decisión, ¿cómo desea proceder?', 'bot');
        }, 1200);
        window.__jarvisReportePregunta = { etapa: 'formato', texto: lowerText };
        userInput.value = '';
        return;
    }
    // Manejar respuesta del usuario para reporte/diagrama/correo
    if (window.__jarvisReportePregunta) {
        const etapa = window.__jarvisReportePregunta.etapa;
        const texto = window.__jarvisReportePregunta.texto;
        if (etapa === 'formato') {
            if (lowerText.includes('pantalla')) {
                mostrarReporteDemo(texto);
                addMessage('Mostrando el reporte en pantalla. ¿Desea descargar el reporte, ver un diagrama o enviarlo por correo a algún grupo de usuarios?', 'bot');
                window.__jarvisReportePregunta = { etapa: 'accion', texto };
                return;
            } else if (lowerText.includes('diagrama')) {
                mostrarReporteDemo(texto);
                addMessage('Aquí está el diagrama solicitado. ¿Desea enviarlo por correo o aplicar algún filtro?', 'bot');
                // JARVIS solo muestra el diagrama Mermaid, no lee ni detalla el contenido del reporte
                window.__jarvisReportePregunta = { etapa: 'diagrama', texto };
                return;
            } else if (lowerText.includes('correo')) {
                addMessage('¿A qué usuarios desea enviar el reporte? Puede especificar un grupo o nombre.', 'bot');
                window.__jarvisReportePregunta = { etapa: 'correo', texto };
                return;
            }
        } else if (etapa === 'accion') {
            if (lowerText.includes('descargar')) {
                mostrarReporteDemo(texto);
                addMessage('Aquí tienes la vista descargable. Presiona el botón para descargar el listado.', 'bot');
                window.__jarvisReportePregunta = null;
                return;
            } else if (lowerText.includes('diagrama')) {
                mostrarReporteDemo(texto);
                addMessage('Mostrando el diagrama de flujo. ¿Desea enviar este diagrama por correo o aplicar algún filtro adicional?', 'bot');
                window.__jarvisReportePregunta = { etapa: 'diagrama', texto };
                return;
            } else if (lowerText.includes('correo')) {
                addMessage('¿A qué usuarios desea enviar el reporte? Puede especificar un grupo o nombre.', 'bot');
                window.__jarvisReportePregunta = { etapa: 'correo', texto };
                return;
            }
        } else if (etapa === 'diagrama') {
            if (lowerText.includes('correo')) {
                addMessage('¿A qué usuarios desea enviar el diagrama? Puede especificar un grupo o nombre.', 'bot');
                window.__jarvisReportePregunta = { etapa: 'correo', texto };
                return;
            } else if (lowerText.includes('filtro')) {
                addMessage('¿Qué filtro desea aplicar al diagrama?', 'bot');
                window.__jarvisReportePregunta = { etapa: 'filtro', texto };
                return;
            }
        } else if (etapa === 'correo') {
            // Simular animación de envío
            addMessage('(Animación de envío) El reporte/diagrama ha sido enviado por correo a los usuarios indicados.', 'bot');
            setTimeout(() => {
                addMessage('¿Hay algo más en lo que pueda asistirle hoy? Estoy atento a sus instrucciones.', 'bot');
            }, 1200);
            window.__jarvisReportePregunta = null;
            return;
        } else if (etapa === 'filtro') {
            addMessage('Filtro aplicado. ¿Desea realizar alguna otra acción con el diagrama?', 'bot');
            setTimeout(() => {
                addMessage('¿Le gustaría exportar el diagrama, enviarlo por correo o realizar otra consulta?', 'bot');
            }, 1200);
            window.__jarvisReportePregunta = null;
            return;
        }
    }

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
    if (lowerText.includes('boot') || lowerText.includes('iniciar sistema') ||
        lowerText.includes('arrancar') || lowerText.includes('encender sistema') ||
        lowerText.includes('secuencia de inicio')) {
        addMessage("Iniciando secuencia de arranque...", 'bot');
        userInput.value = '';
        // Trigger boot sequence
        if (window.jarvisBootUp) {
            window.jarvisBootUp.start();
        }
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
        // Comandos de demo para presentación
        function triggerDemoScenario(scenario) {
            switch(scenario) {
                case 'bootup':
                    demoBootupAnimation();
                    break;
                case 'hud':
                    showDemoHUD();
                    break;
                case 'report':
                    showDemoReportPanel();
                    break;
                case 'suggestions':
                    showDemoSuggestionsPanel();
                    break;
                case 'security':
                    showDemoSecurityPanel();
                    break;
                default:
                    break;
            }
        }
        // Activar demo por comando de texto
        function handleDemoCommand(text) {
            if (text.includes('demo bootup')) {
                triggerDemoScenario('bootup');
            } else if (text.includes('demo hud')) {
                triggerDemoScenario('hud');
            } else if (text.includes('demo reporte')) {
                addMessage("Generando reporte inteligente en tiempo real...", 'bot');
                triggerDemoScenario('report');
                setTimeout(() => {
                    addMessage("Aquí tienes el pulso operativo del Departamento 33: tareas completadas, componentes desplegados y horas registradas, todo actualizado al instante. ¿Quieres ver detalles o comparar con periodos anteriores?", 'bot');
                }, 1200);
            } else if (text.includes('demo sugerencias')) {
                triggerDemoScenario('suggestions');
            } else if (text.includes('demo seguridad')) {
                triggerDemoScenario('security');
            }
        }
    // ------------------------------

    addMessage(text, 'user');
    // Mantener la pregunta del usuario visible en pantalla (no limpiar input)
    // userInput.value = '';

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

${agentCode.html ? `HTML:
${agentCode.html}
` : ''}
${agentCode.css ? `CSS:
${agentCode.css}
` : ''}
${agentCode.js ? `JS:
${agentCode.js}
` : ''}
${agentCode.plsql ? `PL/SQL:
${agentCode.plsql}
` : ''}
${agentCode.ajax ? `AJAX:
${agentCode.ajax}
` : ''}
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
            // JARVIS siempre habla todas las respuestas
            if (typeof speak === 'function') {
                speak(botResponse);
            } else if (window.speechSynthesis) {
                const utter = new window.SpeechSynthesisUtterance(botResponse);
                utter.lang = 'es-ES';
                window.speechSynthesis.speak(utter);
            }
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
