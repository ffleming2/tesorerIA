// Inserta y anima brillos de estrellas detrás de JARVIS, solo tras el chat
function createHudChipLights() {
    let hudBg = document.querySelector('.hud-bg-lights');
    if (!hudBg) {
        hudBg = document.createElement('div');
        hudBg.className = 'hud-bg-lights';
        const hudContainer = document.querySelector('.hud-container');
        if (hudContainer) {
            hudContainer.appendChild(hudBg);
        } else {
            document.body.appendChild(hudBg);
        }
    }
    // Genera 24-36 estrellas separadas detrás de JARVIS
    for (let i = 0; i < 36; i++) {
        const chip = document.createElement('div');
        chip.className = 'chip-glow';
        // Distribución por todo el cielo, hasta el borde de la grilla
        const left = 2 + Math.random() * 96; // 2vw a 98vw (todo el ancho)
        const top = 2 + Math.random() * 38;  // 2vh a 40vh (todo el cielo sobre la grilla)
        chip.style.left = left + 'vw';
        chip.style.top = top + 'vh';
        chip.style.width = (1.2 + Math.random() * 2.8) + 'vw';
        chip.style.height = chip.style.width;
        // Brillo y frecuencia variable
        const freq = 2.5 + Math.random() * 6.5; // 2.5s a 9s
        const baseOpacity = 0.09 + Math.random() * 0.18;
        chip.style.opacity = baseOpacity;
        chip.style.animation = `chip-blink ${freq}s infinite`;
        // Pulsos: desaparecer y aparecer con delay aleatorio
        setTimeout(() => {
            hudBg.appendChild(chip);
            // Pulsos extra: ocultar y mostrar en intervalos largos
            setInterval(() => {
                chip.style.opacity = '0';
                setTimeout(() => {
                    chip.style.opacity = baseOpacity;
                }, 600 + Math.random() * 1200);
            }, 4000 + Math.random() * 7000);
        }, Math.random() * 6000);
    }
}
// Initialize Mermaid
document.addEventListener('DOMContentLoaded', function () {
        // Efecto de encendido progresivo para el logo principal IA
        setTimeout(() => {
            const iaLogo = document.getElementById('ia-header-flash');
            if (iaLogo) {
                iaLogo.style.transition = 'filter 0.18s, color 0.18s, text-shadow 0.18s';
                iaLogo.style.color = '#111';
                iaLogo.style.filter = 'brightness(0.2)';
                iaLogo.style.textShadow = 'none';
                let flashes = 0;
                const flashSteps = [
                    { color: '#111', filter: 'brightness(0.2)', shadow: 'none' }, // Apagado
                    { color: '#ff2222', filter: 'brightness(1.2)', shadow: '0 0 8px #ff2222' }, // Primer destello rojo
                    { color: '#ff5555', filter: 'brightness(4.5)', shadow: '0 0 32px #ff2222, 0 0 48px #ff5555' }, // Brillante
                    { color: '#ff2222', filter: 'brightness(2.2)', shadow: '0 0 24px #ff2222' }, // Medio encendido
                    { color: '#ff5555', filter: 'brightness(5.5)', shadow: '0 0 48px #ff5555, 0 0 64px #ff2222' }, // Máximo brillo
                    { color: '#ff2222', filter: 'brightness(3.5)', shadow: '0 0 48px #ff2222, 0 0 32px #ff5555, 0 0 24px #ff2222' } // Encendido final
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
    // Initialize mermaid only if it's loaded
    if (typeof mermaid !== 'undefined') {
        mermaid.initialize({ startOnLoad: true, theme: 'dark' });
    }
    // Cargar roles automáticamente desde localStorage al abrir el modal
    loadRolesToSelect();
    const settingsBtn = document.getElementById('settings-btn');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', function() {
            setTimeout(loadRolesToSelect, 100); // Refresca roles al abrir modal
        });
    }
    setInterval(updateHudMetrics, 2000);
    setInterval(updateTerminal, 1500);
    setInterval(createParticle, 200);
    setTimeout(startIdleMode, 2000);
    const sendBtn = document.getElementById('send-btn');
    const userInput = document.getElementById('user-input');
    if (sendBtn) sendBtn.addEventListener('click', sendMessage);
    if (userInput) userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
    populateVoices();
    if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = populateVoices;
    }
    initSettingsModal();
    forceUpdateAriaRole();
    // Solo mostrar estrellas tras inicializar el chat
    window.addEventListener('jarvis-boot-complete', () => {
        setTimeout(createHudChipLights, 800);
    });
});
