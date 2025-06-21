const API_URL = 'http://localhost:8000/memory';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch(`${API_URL}/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });

                const data = await response.json();
                if (data.token) {
                    localStorage.setItem('jwt_token', data.token);
                    
                    const successMessage = document.createElement('div');
                    successMessage.style.cssText = `
                        position: fixed;
                        top: 20px;
                        right: 20px;
                        background-color: #27ae60;
                        color: white;
                        padding: 15px 20px;
                        border-radius: 5px;
                        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                        z-index: 10000;
                        font-family: Arial, sans-serif;
                        max-width: 300px;
                    `;
                    successMessage.textContent = 'Succesvol ingelogd! Je wordt doorgestuurd naar het spel.';
                    document.body.appendChild(successMessage);
                    
                    setTimeout(() => {
                        if (successMessage.parentNode) {
                            successMessage.parentNode.removeChild(successMessage);
                        }
                        window.location.href = 'index.html';
                    }, 1500);
                } else {
                    alert('Login failed: ' + (data.message || 'No token received'));
                }
            } catch (err) {
                alert('Login failed: ' + err.message);
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch(`${API_URL}/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, email, password })
                });
                if (response.ok) {
                    alert('Registration successful! Please log in.');
                    window.location.href = 'login.html';
                } else {
                    const errorData = await response.json();
                    alert('Registration failed: ' + (errorData.message || 'Unknown error'));
                }
            } catch (err) {
                alert('Registration failed: ' + err.message);
            }
        });
    }
}); 