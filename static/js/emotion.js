let thinkingInterval;

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
