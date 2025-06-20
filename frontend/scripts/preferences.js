const API_URL = 'http://localhost:8000/api';

document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('preferences-form');
    if (!form) return;

    // Load current preferences
    try {
        const res = await fetch(`${API_URL}/preferences`);
        if (res.ok) {
            const preferences = await res.json();
            document.getElementById('email').value = preferences.email || '';
            document.getElementById('image-api').value = preferences.imageApi || 'cataas';
            document.getElementById('matched-color').value = preferences.matchedColor || '#00ff00';
            document.getElementById('card-back-color').value = preferences.cardBackColor || '#3498db';
        }
    } catch (err) {
        // Ignore or show error
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const preferences = {
            email: document.getElementById('email').value,
            imageApi: document.getElementById('image-api').value,
            matchedColor: document.getElementById('matched-color').value,
            cardBackColor: document.getElementById('card-back-color').value
        };
        try {
            const res = await fetch(`${API_URL}/preferences`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(preferences)
            });
            if (res.ok) {
                alert('Preferences saved!');
            } else {
                alert('Failed to save preferences');
            }
        } catch (err) {
            alert('Failed to save preferences: ' + err.message);
        }
    });
}); 