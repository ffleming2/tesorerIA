let recognition;
let synth = window.speechSynthesis;
let voices = [];
let visualizer; // Placeholder for visualizer object

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
        // Disparar evento para Matrix Effect
        window.dispatchEvent(new Event('jarvis-speak'));
    };

    utterance.onend = () => {
        arcReactor.classList.remove('speaking');
        if (arcReactorContainer) arcReactorContainer.classList.remove('speaking');
        document.body.classList.remove('focus-mode');
        setEmotion('neutral'); // Return to neutral after speaking
        window.dispatchEvent(new Event('jarvis-speak-end'));
        // Reset any lingering transforms
        const rings = document.querySelectorAll('.ring-outer, .ring-middle');
        rings.forEach(ring => ring.style.transform = '');
    };

    // Add a robust delay to ensure audio context switch (Mic -> Speaker) is clean
    setTimeout(() => {
        synth.speak(utterance);
    }, 800);
}

if (typeof showAllVoicesCheckbox !== 'undefined' && showAllVoicesCheckbox) {
    showAllVoicesCheckbox.addEventListener('change', populateVoices);
}

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
