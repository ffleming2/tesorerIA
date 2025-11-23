// Event Listeners for Settings
document.addEventListener('DOMContentLoaded', function() {
        // Forzar restauración de API keys antes de inicializar la UI
        if (
            !localStorage.getItem('jarvis_aria_config') ||
            !JSON.parse(localStorage.getItem('jarvis_aria_config')).apiConfigs ||
            JSON.parse(localStorage.getItem('jarvis_aria_config')).apiConfigs.length === 0
        ) {
            localStorage.setItem('jarvis_aria_config', JSON.stringify({
                model: 'gemini-2.5-flash',
                expertModel: 'gemini-2.5-pro',
                useRestApi: true,
                apiConfigs: [
                    { id: 'lara-key', label: 'Lara', apiKey: 'AIzaSyA1NxiSuQXQHWeY2Qj4v4s5RG0fVosmnKI', enabled: true },
                    { id: 'sol-key', label: 'Sol', apiKey: 'AIzaSyALvpQs2rWrawlqrzfx_JlW8VR_205Lsi4', enabled: true },
                    { id: 'teo-key', label: 'Teo', apiKey: 'AIzaSyDdHeozhVGdFuzJOQmu_5slT0yLD9WLbfE', enabled: true },
                    { id: 'martin-key', label: 'Martin', apiKey: 'AIzaSyCgxCeVS5iOFMYOiid3_LL0ThxjnZEmNQg', enabled: true },
                    { id: 'ezzio-key', label: 'Ezzio', apiKey: 'AIzaSyBVsNUTt5eKPz1XsTpwRmiquETpO8lPXco', enabled: true },
                ],
            }));
        }
        // Log para depuración
        console.log('DEBUG jarvis_aria_config:', localStorage.getItem('jarvis_aria_config'));
        try {
            const parsed = JSON.parse(localStorage.getItem('jarvis_aria_config'));
            console.log('DEBUG apiConfigs:', parsed.apiConfigs);
        } catch (e) {
            console.error('Error parsing jarvis_aria_config:', e);
        }
    const settingsBtn = document.getElementById('settings-btn');
    const settingsModal = document.getElementById('settings-modal');
    const closeModal = document.querySelector('.close-modal-btn');
    const roleSelect = document.getElementById('role-select');
    const newRoleBtn = document.getElementById('new-role-btn');
    const saveRoleBtn = document.getElementById('save-role-btn');
    const deleteRoleBtn = document.getElementById('delete-role-btn');
    const rateInput = document.getElementById('rate');
    const pitchInput = document.getElementById('pitch');
    const volumeInput = document.getElementById('volume');
    const rateVal = document.getElementById('rate-val');
    const pitchVal = document.getElementById('pitch-val');
    const volVal = document.getElementById('vol-val');

    if (settingsBtn && settingsModal) {
        settingsBtn.addEventListener('click', () => {
            settingsModal.style.display = 'block';
            if (typeof renderApiKeys === 'function') {
                renderApiKeys();
            } else {
                console.warn('renderApiKeys no está definida');
            }
        });
        closeModal.addEventListener('click', () => settingsModal.style.display = 'none');
        window.addEventListener('click', (e) => {
            if (e.target === settingsModal) settingsModal.style.display = 'none';
        });
    }

    if (roleSelect) {
        roleSelect.addEventListener('change', updateRoleInputs);
        newRoleBtn.addEventListener('click', createNewRole);
        saveRoleBtn.addEventListener('click', saveCurrentRole);
        deleteRoleBtn.addEventListener('click', deleteCurrentRole);
    }

    // Update slider values display
    if (rateInput && rateVal) rateInput.addEventListener('input', () => rateVal.textContent = rateInput.value);
    if (pitchInput && pitchVal) pitchInput.addEventListener('input', () => pitchVal.textContent = pitchInput.value);
    if (volumeInput && volVal) volumeInput.addEventListener('input', () => volVal.textContent = volumeInput.value);
});
