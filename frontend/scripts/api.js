const originalFetch = window.fetch;
window.fetch = async (url, options = {}) => {
    const token = localStorage.getItem('jwt_token');
    options.headers = options.headers || {};
    if (token) {
        options.headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await originalFetch(url, options);
    if (response.status === 401) {
        localStorage.removeItem('jwt_token');
        alert('Je sessie is verlopen. Log opnieuw in.');
        window.location.href = 'login.html';
        throw new Error('Session expired');
    }
    return response;
}; 