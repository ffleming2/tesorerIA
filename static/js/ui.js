// Matrix Effect HUD
function showMatrixEffect(active = true) {
    const canvas = document.getElementById('matrix-effect');
    if (!canvas) return;
    if (active) {
        canvas.style.display = 'block';
        canvas.style.opacity = '1';
        startMatrixAnimation(canvas);
    } else {
        canvas.style.opacity = '0';
        setTimeout(() => { canvas.style.display = 'none'; }, 500);
    }
}

var matrixInterval;
function startMatrixAnimation(canvas) {
    const ctx = canvas.getContext('2d');
    const w = canvas.width = canvas.offsetWidth;
    const h = canvas.height = canvas.offsetHeight;
    const fontSize = 18;
    const cols = Math.floor(w / fontSize);
    const chars = 'アカサタナハマヤラワガザダバパイキシチニヒミリヰギジヂビピウクスツヌフムユルグズブプエケセテネヘメレヱゲゼデベペオコソトノホモヨロヲゴゾドボポABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let drops = Array.from({length: cols}, () => Math.floor(Math.random() * canvas.height / fontSize));
    clearInterval(matrixInterval);
    matrixInterval = setInterval(() => {
        ctx.clearRect(0, 0, w, h);
        ctx.globalAlpha = 0.85;
        ctx.fillStyle = '#00ffe7';
        ctx.font = fontSize + 'px monospace';
        for (let i = 0; i < drops.length; i++) {
            // Draw a vertical rain of characters
            const text = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            // Fade effect for tail
            ctx.fillStyle = 'rgba(0,255,231,0.3)';
            for (let j = 1; j < 8; j++) {
                const tailText = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(tailText, i * fontSize, (drops[i] - j) * fontSize);
            }
            ctx.fillStyle = '#00ffe7';
            if (drops[i] * fontSize > h && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }, 50);
}

function stopMatrixEffect() {
    const canvas = document.getElementById('matrix-effect');
    if (canvas) {
        canvas.style.opacity = '0';
        setTimeout(() => { canvas.style.display = 'none'; }, 500);
    }
    clearInterval(matrixInterval);
}

// Ejemplo de activación: cuando JARVIS hable
window.addEventListener('jarvis-speak', function() {
    showMatrixEffect(true);
});

window.addEventListener('jarvis-speak-end', function() {
    stopMatrixEffect();
});
// Animación automática de actividad en el mini mapa HUD
function animateCityDots() {
    const svg = document.getElementById('globe-svg');
    if (!svg) return;
    const dots = svg.querySelectorAll('.city-dot');
    let tick = 0;
    // Generar fase y velocidad aleatoria para cada punto
    const dotParams = Array.from(dots).map(() => ({
        phase: Math.random() * Math.PI * 2,
        speed: 0.7 + Math.random() * 0.7
    }));
    setInterval(() => {
        dots.forEach((dot, i) => {
            const baseR = parseInt(dot.getAttribute('data-base-r')) || parseInt(dot.getAttribute('r'));
            dot.setAttribute('data-base-r', baseR);
            const { phase, speed } = dotParams[i];
            let pulse = 1.5 + Math.sin(tick * speed + phase) * 2;
            let newR = baseR + pulse;
            if (newR > baseR + 3) newR = baseR + 3;
            if (newR < baseR) newR = baseR;
            dot.setAttribute('r', newR);
            dot.setAttribute('fill', pulse > 2.5 ? '#00ffe7' : '#00bfae');
        });
        tick++;
    }, 400);
}

window.addEventListener('DOMContentLoaded', animateCityDots);
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

// Agent Panel
const agentPanel = document.getElementById('agent-panel');
const tabBtns = document.querySelectorAll('.tab-btn');
const tabPanes = document.querySelectorAll('.tab-pane');
const previewFrame = document.getElementById('preview-frame');

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

function setTheme(themeName) {
    document.body.classList.remove('theme-stealth', 'theme-alert', 'theme-eco', 'theme-default');
    document.body.classList.add(`theme-${themeName}`);
}

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
    
        // Interactividad para el mini mapa de Chile
        window.addEventListener('DOMContentLoaded', function() {
            const svg = document.getElementById('globe-svg');
            const tooltip = document.getElementById('city-tooltip');
            if (!svg || !tooltip) return;
            const wrapper = svg.parentElement;
            svg.querySelectorAll('.city-dot').forEach(dot => {
                dot.addEventListener('mouseenter', function(e) {
                    const nombre = dot.getAttribute('data-nombre');
                    tooltip.textContent = nombre;
                    tooltip.style.display = 'block';
                });
                dot.addEventListener('mousemove', function(e) {
                    const rect = wrapper.getBoundingClientRect();
                    tooltip.style.left = (e.clientX - rect.left + 10) + 'px';
                    tooltip.style.top = (e.clientY - rect.top - 10) + 'px';
                });
                dot.addEventListener('mouseleave', function() {
                    tooltip.style.display = 'none';
                });
            });
        });
}
