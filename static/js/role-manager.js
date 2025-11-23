function saveRoles() {
    localStorage.setItem('jarvis_roles', JSON.stringify(roles));
}

function loadRolesToSelect() {
    const roleSelect = document.getElementById('role-select');
    if (!roleSelect) return;
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

        // Load welcome text
        const welcomeTextInput = document.getElementById('welcome-text');
        if (welcomeTextInput) {
            welcomeTextInput.value = role.welcomeText || 'Buenos días, ¿en qué puedo ayudarle hoy?';
        }

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

        // Update welcome message in chat
        updateWelcomeMessage();
    }
}

function createNewRole() {
    const newId = 'role_' + Date.now();
    const newRole = {
        id: newId,
        name: 'Nuevo Rol',
        prompt: '',
        welcomeText: 'Buenos días, ¿en qué puedo ayudarle hoy?',
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
        // Permitir edición directa del bloque de instrucciones
        const systemPromptInputEl = document.getElementById('system-prompt');
        if (systemPromptInputEl) {
            roles[roleIndex].prompt = systemPromptInputEl.value;
        }

        // Save welcome text
        const welcomeTextInput = document.getElementById('welcome-text');
        if (welcomeTextInput) {
            roles[roleIndex].welcomeText = welcomeTextInput.value;
        }

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
        updateWelcomeMessage(); // Update welcome message in chat
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

// Update welcome message in chat
function updateWelcomeMessage() {
    const role = roles.find(r => r.id === currentRoleId);
    if (role) {
        const welcomeMessage = role.welcomeText || 'Buenos días, ¿en qué puedo ayudarle hoy?';
        const welcomeElements = document.querySelectorAll('#welcome-message');
        welcomeElements.forEach(el => {
            el.textContent = welcomeMessage;
        });
    }
}

// Get current role's welcome text
function getWelcomeText() {
    const role = roles.find(r => r.id === currentRoleId);
    return role?.welcomeText || 'Buenos días, ¿en qué puedo ayudarle hoy?';
}
