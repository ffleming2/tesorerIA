// Efecto de brillo neón aleatorio en paneles HUD/dashboard
function flashRandomNeonHud() {
    const hudPanels = Array.from(document.getElementsByClassName('hud-panel'));
    const dashboardBoxes = Array.from(document.getElementsByClassName('hud-box'));
    const all = hudPanels.concat(dashboardBoxes);
    if (all.length === 0) return;
    // Selecciona aleatoriamente 1-3 elementos para parpadear
    const count = 1 + Math.floor(Math.random() * 3);
    for (let i = 0; i < count; i++) {
        const el = all[Math.floor(Math.random() * all.length)];
        if (el) {
            el.classList.add('neon-flash');
            setTimeout(() => el.classList.remove('neon-flash'), 180 + Math.random() * 120);
        }
    }
}
const particlesLayer = document.getElementById('particles-layer');
let isIdle = true;
let idleTimeout;
let matrixEffect; // Placeholder

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
    // Efecto de brillo neón aleatorio en HUD/dashboard
    flashRandomNeonHud();
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

function typeWriter(element, text, speed = 10) {
    let i = 0;
    element.innerHTML = ""; // Clear existing content
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            // Optional: highlight the code after typing
            if (typeof hljs !== 'undefined') {
                hljs.highlightElement(element);
            }
        }
    }
    type();
}
