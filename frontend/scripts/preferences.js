const API_URL = 'http://localhost:8000';

document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('preferences-form');
    if (!form) return;

    // Check if user is logged in
    const token = localStorage.getItem('jwt_token');
    if (!token) {
        alert('Please log in to access preferences');
        window.location.href = 'login.html';
        return;
    }

    // Load current preferences
    try {
        const response = await fetch(`${API_URL}/player/preferences`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const preferences = await response.json();
            document.getElementById('email').value = preferences.email || '';
            document.getElementById('image-api').value = preferences.preferred_api || 'cats';
            document.getElementById('matched-color').value = preferences.color_found || '#2ecc71';
            document.getElementById('card-back-color').value = preferences.color_closed || '#3498db';
        } else if (response.status === 404) {
            // No preferences found, use defaults
            document.getElementById('email').value = '';
            document.getElementById('image-api').value = 'cats';
            document.getElementById('matched-color').value = '#2ecc71';
            document.getElementById('card-back-color').value = '#3498db';
        } else {
            throw new Error('Failed to load preferences');
        }
    } catch (err) {
        console.error('Error loading preferences:', err);
        // Use defaults if loading fails
        document.getElementById('email').value = '';
        document.getElementById('image-api').value = 'cats';
        document.getElementById('matched-color').value = '#2ecc71';
        document.getElementById('card-back-color').value = '#3498db';
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const preferences = {
            api: document.getElementById('image-api').value,
            color_found: document.getElementById('matched-color').value,
            color_closed: document.getElementById('card-back-color').value
        };

        try {
            const response = await fetch(`${API_URL}/player/preferences`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(preferences)
            });

            if (response.ok) {
                alert('Preferences saved successfully!');
                // Also save to localStorage for immediate use
                localStorage.setItem('user_preferences', JSON.stringify(preferences));
            } else {
                alert('Failed to save preferences');
            }
        } catch (err) {
            console.error('Error saving preferences:', err);
            alert('Failed to save preferences: ' + err.message);
        }
    });

    // Handle email update separately
    const emailInput = document.getElementById('email');
    emailInput.addEventListener('change', async (e) => {
        const newEmail = e.target.value;
        if (newEmail) {
            try {
                const response = await fetch(`${API_URL}/player/email`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email: newEmail })
                });

                if (response.ok) {
                    console.log('Email updated successfully');
                } else {
                    alert('Failed to update email');
                }
            } catch (err) {
                console.error('Error updating email:', err);
                alert('Failed to update email: ' + err.message);
            }
        }
    });
}); 