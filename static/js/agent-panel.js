function buildUserMessageWithCode(text) {
    if (!(agentCode.html || agentCode.css || agentCode.js || agentCode.plsql || agentCode.ajax)) {
        return text;
    }

    const sections = [];
    if (agentCode.html) sections.push(`HTML ACTUAL:
${agentCode.html}`);
    if (agentCode.css) sections.push(`CSS ACTUAL:
${agentCode.css}`);
    if (agentCode.js) sections.push(`JS ACTUAL:
${agentCode.js}`);
    if (agentCode.plsql) sections.push(`PL/SQL ACTUAL:
${agentCode.plsql}`);
    if (agentCode.ajax) sections.push(`AJAX ACTUAL:
${agentCode.ajax}`);

    return `${text}\n\n[Ajusta ÚNICAMENTE las secciones solicitadas. Conserva el resto del código.]\n${sections.join('\n\n')}\n`;
}

// Tab Switching
document.addEventListener('DOMContentLoaded', function() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            const tabId = btn.getAttribute('data-tab');
            document.getElementById(`${tabId}-pane`).classList.add('active');
        });
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

    previewDoc.write(
        `
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
