/**
 * JARVIS Boot-Up Sequence Controller
 * Manages the dramatic startup animation sequence
 */

class BootUpSequence {
    constructor() {
        this.isBooting = false;
        this.currentStage = 0;
        this.stages = [
            { name: 'grid', duration: 2000, text: 'INITIALIZING GRID SYSTEMS...' },
            { name: 'reactor', duration: 3000, text: 'POWERING ARC REACTOR...' },
            { name: 'panels', duration: 2500, text: 'DEPLOYING HUD PANELS...' },
            { name: 'interface', duration: 2500, text: 'LOADING INTERFACE SYSTEMS...' }
        ];

        // Música y efectos Starfield/No Man's Sky
        this.music = null;
        this.sfxCtx = null;
        this.musicStyle = 'retro'; // 'retro', 'cyberpunk', 'synthwave'
        this.init();
    }
    
        // Animación de arranque para demo
        demoBootupAnimation() {
            const bootPanel = document.getElementById('bootup-panel');
            if (!bootPanel) return;
            bootPanel.style.display = 'block';
            bootPanel.innerHTML = `
                <div class="bootup-logo">
                    <img src="/static/img/jarvis-logo.png" alt="JARVIS" style="width:120px;animation:spin 2s linear infinite;">
                </div>
                <div class="bootup-welcome">
                    <h2>¡Bienvenido Departamento 33!</h2>
                    <p>Preparando sistemas inteligentes...</p>
                    <div class="bootup-loader"></div>
                    <div class="tesoreria-logo" style="margin-top:2em;text-align:center;">
                        <span style="font-size:2.2em;letter-spacing:0.18em;color:#00ffe7;">T.E.S.O.R.E.R.<span id="ia-logo-flash" style="color:#222;filter:brightness(0.2);text-shadow:none;">IA</span></span>
                    </div>
                </div>
            `;
            // Animación de encendido progresivo para IA
            setTimeout(() => {
                const iaLogo = document.getElementById('ia-logo-flash');
                if (iaLogo) {
                    iaLogo.style.transition = 'filter 0.18s, color 0.18s, text-shadow 0.18s';
                    iaLogo.style.color = '#222';
                    iaLogo.style.filter = 'brightness(0.2)';
                    iaLogo.style.textShadow = 'none';
                    let flashes = 0;
                    const flashSteps = [
                        { color: '#222', filter: 'brightness(0.2)', shadow: 'none' }, // Apagado
                        { color: '#ff3cff', filter: 'brightness(1.2)', shadow: '0 0 8px #ff3cff' }, // Primer destello
                        { color: '#fff6ff', filter: 'brightness(4.5)', shadow: '0 0 32px #fff, 0 0 48px #ff3cff' }, // Brillante
                        { color: '#ff3cff', filter: 'brightness(2.2)', shadow: '0 0 24px #ff3cff' }, // Medio encendido
                        { color: '#fff6ff', filter: 'brightness(5.5)', shadow: '0 0 48px #fff, 0 0 64px #ff3cff' }, // Máximo brillo
                        { color: '#ff3cff', filter: 'brightness(3.5)', shadow: '0 0 48px #ff3cff, 0 0 32px #fff, 0 0 24px #ff3cff' } // Encendido final
                    ];
                    const flashInterval = setInterval(() => {
                        const step = flashSteps[flashes] || flashSteps[flashSteps.length-1];
                        iaLogo.style.color = step.color;
                        iaLogo.style.filter = step.filter;
                        iaLogo.style.textShadow = step.shadow;
                        flashes++;
                        if (flashes >= flashSteps.length) {
                            clearInterval(flashInterval);
                        }
                    }, 260);
                }
            }, 1200);
            setTimeout(() => {
                bootPanel.innerHTML += `<div class='bootup-ready'>JARVIS listo para asistir.</div>`;
                bootPanel.classList.add('bootup-fadeout');
                setTimeout(() => { bootPanel.style.display = 'none'; }, 2000);
            }, 3500);
        }

    init() {
        // Set initial pre-boot state
        if (!document.body.classList.contains('boot-complete')) {
            document.body.classList.add('pre-boot');
        }

        // Create boot-up button
        this.createBootButton();

        // Create overlay
        this.createOverlay();

        // Listen for voice/text commands
        this.setupCommandListeners();

        // Auto-boot on first load (disabled to show button first)
        // if (!localStorage.getItem('jarvis-booted')) {
        //     setTimeout(() => this.start(), 500);
        //     localStorage.setItem('jarvis-booted', 'true');
        // }
    }

    createBootButton() {
        const btn = document.createElement('button');
        btn.className = 'bootup-btn';
        btn.innerHTML = '<i class="fas fa-power-off"></i> BOOT SEQUENCE';
        btn.addEventListener('click', () => this.start());
        document.body.appendChild(btn);
        this.bootButton = btn;
    }

    createOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'bootup-overlay';
        overlay.innerHTML = `
            <div class="bootup-text">SYSTEM INITIALIZING...</div>
            <div class="bootup-progress">
                <div class="bootup-progress-bar"></div>
            </div>
        `;
        document.body.appendChild(overlay);
        this.overlay = overlay;
        this.progressBar = overlay.querySelector('.bootup-progress-bar');
        this.statusText = overlay.querySelector('.bootup-text');
    }

    setupCommandListeners() {
        // Listen for custom events from voice/chat system
        window.addEventListener('jarvis-command', (e) => {
            const command = e.detail.command.toLowerCase();
            if (command.includes('boot') ||
                command.includes('iniciar') ||
                command.includes('arrancar') ||
                command.includes('encender sistema')) {
                this.start();
            }
        });
    }

    async start() {
        if (this.isBooting) return;

        this.isBooting = true;
        this.currentStage = 0;

        // Hide the boot button immediately
        if (this.bootButton) {
            this.bootButton.style.opacity = '0';
            this.bootButton.style.pointerEvents = 'none';
        }

        // Iniciar música Starfield
        this.startMusic();

        // Wait a bit for button fade
        await this.wait(300);

        // Remove pre-boot class and add booting class
        document.body.classList.remove('pre-boot');
        document.body.classList.add('booting');
        document.body.classList.remove('boot-complete');

        // Play boot sound if available
        this.playBootSound();

        // Execute stages sequentially
        for (let i = 0; i < this.stages.length; i++) {
            await this.executeStage(i);
            this.playStageSfx(i); // Efectos No Man's Sky
        }

        // Complete boot sequence
        await this.complete();
    }

    async executeStage(index) {
        const stage = this.stages[index];
        this.currentStage = index + 1;

        // Update overlay text
        this.statusText.textContent = stage.text;

        // Update progress
        const progress = ((index + 1) / this.stages.length) * 100;
        this.progressBar.style.width = progress + '%';

        // Log to terminal if available (but terminal is hidden during overlay)
        this.logToTerminal(`> ${stage.text}`);

        // Wait for stage duration
        await this.wait(stage.duration);
    }

    async complete() {
        // Update text
        this.statusText.textContent = 'SYSTEMS ONLINE';
        this.progressBar.style.width = '100%';

        // Log completion
        this.logToTerminal('> ALL SYSTEMS OPERATIONAL');

        // Wait longer to show completion message
        await this.wait(1500);

        // Fade out overlay
        this.overlay.style.opacity = '0';

        await this.wait(800);

        // Remove booting classes
        document.body.classList.remove('booting');

        // Wait 1 second before starting visual animations
        await this.wait(1000);

        // Now start the visual boot sequence animations
        await this.startVisualSequence();

        // Reset overlay
        this.overlay.style.opacity = '';

        this.isBooting = false;

        // Detener música Starfield
        this.stopMusic();

        // Trigger completion event
        window.dispatchEvent(new CustomEvent('jarvis-boot-complete'));

        // Play completion sound
        this.playCompleteSound();
    }
    // Música Starfield (ambient, sin copyright)
    startMusic() {
        if (!this.music) {
            this.music = document.createElement('audio');
            let src = '';
            if (this.musicStyle === 'retro') {
                src = 'https://cdn.pixabay.com/audio/2022/10/16/audio_12b6b7b7b7.mp3'; // ambient sci-fi
            } else if (this.musicStyle === 'cyberpunk') {
                src = 'https://cdn.pixabay.com/audio/2023/03/16/audio_128b6e7b7b.mp3'; // cyberpunk beat
            } else if (this.musicStyle === 'synthwave') {
                src = 'https://cdn.pixabay.com/audio/2022/10/16/audio_12b6b7b7b8.mp3'; // synthwave
            }
            this.music.src = src;
            this.music.loop = true;
            this.music.volume = 0.35;
            this.music.id = 'starfield-music';
            document.body.appendChild(this.music);
        }
        this.music.play().catch(()=>{});
    }

    stopMusic() {
        if (this.music) {
            this.music.pause();
            this.music.currentTime = 0;
            if (this.music.parentNode) this.music.parentNode.removeChild(this.music);
            this.music = null;
        }
    }

    setMusicStyle(style) {
        if (['retro','cyberpunk','synthwave'].includes(style)) {
            this.musicStyle = style;
        }
    }

    // Sonidos de tecleo tipo hacker durante el boot
    playStageSfx(stageIdx) {
        if (!window.AudioContext) return;
        if (!this.sfxCtx) this.sfxCtx = new window.AudioContext();
        const ctx = this.sfxCtx;
        const now = ctx.currentTime;
        // Genera una secuencia de clicks y blips
        for (let i = 0; i < 24; i++) {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'square';
            osc.frequency.value = 120 + Math.random() * 80;
            gain.gain.value = 0.08 + Math.random() * 0.04;
            osc.connect(gain).connect(ctx.destination);
            const t = now + i * 0.09 + Math.random() * 0.03;
            osc.start(t);
            osc.frequency.linearRampToValueAtTime(osc.frequency.value * 0.7, t + 0.04);
            gain.gain.linearRampToValueAtTime(0, t + 0.06);
            osc.stop(t + 0.06);
        }
        // Blip agudo ocasional
        for (let j = 0; j < 6; j++) {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.value = 800 + Math.random() * 200;
            gain.gain.value = 0.04;
            osc.connect(gain).connect(ctx.destination);
            const t = now + j * 0.35 + Math.random() * 0.1;
            osc.start(t);
            osc.frequency.linearRampToValueAtTime(osc.frequency.value * 0.9, t + 0.09);
            gain.gain.linearRampToValueAtTime(0, t + 0.13);
            osc.stop(t + 0.13);
        }
    }

    async startVisualSequence() {
        // Stage 1: Grid power-up
        document.body.classList.add('booting-stage-1');
        this.logToTerminal('> GRID_SYSTEMS_ACTIVE');
        await this.wait(2000);
        // Sonido aparición JARVIS (whoosh)
        this.playWhoosh();
        this.playGlitch();
        this.flashNeon('jarvis-reactor-container', 3, 120);

        // Stage 2: Reactor initialization
        document.body.classList.add('booting-stage-2');
        this.logToTerminal('> ARC_REACTOR_ONLINE');
        this.logToTerminal('> POWER_LEVELS_NOMINAL');
        this.playSweep();
        await this.wait(3000);

        // Stage 3: Panels deployment
        document.body.classList.add('booting-stage-3');
        this.logToTerminal('> DEPLOYING_HUD_PANELS');
        this.logToTerminal('> LEFT_PANEL_ONLINE');
        await this.wait(800);
        // Sonido paneles (pop digital + beep)
        this.playPanelPop();
        this.playBeep();
        this.flashNeon('hud-panel', 2, 100);
        this.logToTerminal('> RIGHT_PANEL_ONLINE');
        await this.wait(700);

        // Log header initialization
        this.logToTerminal('> INITIALIZING_HEADER_SYSTEMS');
        await this.wait(500);
        this.logToTerminal('> LOADING_INTERFACE_MODULES');
        await this.wait(500);

        // Stage 4: Interface systems (chat, agent panel, input)
        document.body.classList.add('booting-stage-4');
        this.logToTerminal('> AGENT_PANEL_DEPLOYED');
        await this.wait(800);
        // Sonido chat (ping suave + beep)
        this.playChatPing();
        this.playBeep(660, 0.06);
        this.flashNeon('input-area', 2, 90);
        this.logToTerminal('> CHAT_SYSTEM_INITIALIZED');
        await this.wait(1000);
        this.logToTerminal('> INPUT_INTERFACE_READY');
        await this.wait(700);
        this.logToTerminal('> ALL_SYSTEMS_OPERATIONAL');

        // Remove all stage classes
        for (let i = 1; i <= this.stages.length; i++) {
            document.body.classList.remove(`booting-stage-${i}`);
        }

        // Add complete class - now everything is visible and animated
        document.body.classList.add('boot-complete');

        // Remove the boot button from DOM completely
        if (this.bootButton && this.bootButton.parentNode) {
            this.bootButton.parentNode.removeChild(this.bootButton);
        }

        // Speak welcome message after boot complete
        await this.wait(500); // Short delay before speaking
        this.speakWelcomeMessage();
    }
        // Sonido glitch digital
        playGlitch() {
            if (!window.AudioContext) return;
            if (!this.sfxCtx) this.sfxCtx = new window.AudioContext();
            const ctx = this.sfxCtx;
            for (let i = 0; i < 5; i++) {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'square';
                osc.frequency.value = 180 + Math.random() * 1200;
                gain.gain.value = 0.07;
                osc.connect(gain).connect(ctx.destination);
                const t = ctx.currentTime + i * 0.04;
                osc.start(t);
                gain.gain.linearRampToValueAtTime(0, t + 0.05);
                osc.stop(t + 0.05);
            }
        }

        // Sonido sweep ascendente
        playSweep() {
            if (!window.AudioContext) return;
            if (!this.sfxCtx) this.sfxCtx = new window.AudioContext();
            const ctx = this.sfxCtx;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(220, ctx.currentTime);
            osc.frequency.linearRampToValueAtTime(1200, ctx.currentTime + 0.7);
            gain.gain.setValueAtTime(0.09, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.7);
            osc.connect(gain).connect(ctx.destination);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.7);
        }

        // Sonido beep digital
        playBeep(freq = 520, vol = 0.07) {
            if (!window.AudioContext) return;
            if (!this.sfxCtx) this.sfxCtx = new window.AudioContext();
            const ctx = this.sfxCtx;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.value = freq;
            gain.gain.value = vol;
            osc.connect(gain).connect(ctx.destination);
            osc.start(ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.11);
            osc.stop(ctx.currentTime + 0.11);
        }

        // Parpadeo de neón en paneles/chat
        flashNeon(classOrId, times = 2, interval = 100) {
            let elements = [];
            if (classOrId.startsWith('#')) {
                elements = [document.getElementById(classOrId.slice(1))];
            } else {
                elements = Array.from(document.getElementsByClassName(classOrId));
                if (elements.length === 0) {
                    const el = document.getElementById(classOrId);
                    if (el) elements = [el];
                }
            }
            for (let i = 0; i < times; i++) {
                setTimeout(() => {
                    elements.forEach(el => {
                        if (el) {
                            el.classList.add('neon-flash');
                            setTimeout(() => el.classList.remove('neon-flash'), interval);
                        }
                    });
                }, i * interval * 2);
            }
        }
    // Sonido aparición JARVIS (whoosh)
    playWhoosh() {
        if (!window.AudioContext) return;
        if (!this.sfxCtx) this.sfxCtx = new window.AudioContext();
        const ctx = this.sfxCtx;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(180, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(1200, ctx.currentTime + 0.5);
        gain.gain.setValueAtTime(0.13, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
        osc.connect(gain).connect(ctx.destination);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.5);
    }

    // Sonido paneles (pop digital)
    playPanelPop() {
        if (!window.AudioContext) return;
        if (!this.sfxCtx) this.sfxCtx = new window.AudioContext();
        const ctx = this.sfxCtx;
        for (let i = 0; i < 3; i++) {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'square';
            osc.frequency.value = 400 + i * 120;
            gain.gain.value = 0.09;
            osc.connect(gain).connect(ctx.destination);
            const t = ctx.currentTime + i * 0.08;
            osc.start(t);
            gain.gain.linearRampToValueAtTime(0, t + 0.09);
            osc.stop(t + 0.09);
        }
    }

    // Sonido chat (ping suave)
    playChatPing() {
        if (!window.AudioContext) return;
        if (!this.sfxCtx) this.sfxCtx = new window.AudioContext();
        const ctx = this.sfxCtx;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = 880;
        gain.gain.value = 0.07;
        osc.connect(gain).connect(ctx.destination);
        osc.start(ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.18);
        osc.stop(ctx.currentTime + 0.18);
    }

    speakWelcomeMessage() {
        try {
            // Get welcome text from current role
            const welcomeText = typeof getWelcomeText === 'function' ? getWelcomeText() : 'Buenos días, ¿en qué puedo ayudarle hoy?';

            // Use the speak function if available
            if (typeof speak === 'function') {
                speak(welcomeText);
            }
        } catch (e) {
            console.log('Could not speak welcome message:', e);
        }
    }

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    logToTerminal(message) {
        const terminal = document.getElementById('hud-terminal');
        if (terminal) {
            const line = document.createElement('div');
            line.textContent = message;
            line.style.color = 'var(--hud-color)';
            terminal.appendChild(line);

            // Keep only last 10 lines
            while (terminal.children.length > 10) {
                terminal.removeChild(terminal.firstChild);
            }

            // Scroll to bottom
            terminal.scrollTop = terminal.scrollHeight;
        }
    }

    playBootSound() {
        // Create subtle boot-up sound using Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();

            // Create a rising tone
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.5);

            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (e) {
            console.log('Audio not available:', e);
        }
    }

    playCompleteSound() {
        // Create completion beep
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();

            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(600, audioContext.currentTime);

            gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
        } catch (e) {
            console.log('Audio not available:', e);
        }
    }

    // Public method to trigger from console or other scripts
    trigger() {
        this.start();
    }
}

// Initialize boot sequence when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.jarvisBootUp = new BootUpSequence();
    });
} else {
    window.jarvisBootUp = new BootUpSequence();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BootUpSequence;
}
