
const JWTUtils = {
    decodeToken(token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error('Error decoding JWT token:', error);
            return null;
        }
    },

    isTokenExpired(token) {
        if (!token) return true;
        
        const decoded = this.decodeToken(token);
        if (!decoded || !decoded.exp) return true;
        
        const currentTime = Math.floor(Date.now() / 1000);
        return decoded.exp < currentTime;
    },

    getTokenExpiration(token) {
        if (!token) return null;
        
        const decoded = this.decodeToken(token);
        if (!decoded || !decoded.exp) return null;
        
        return new Date(decoded.exp * 1000);
    },

    handleTokenExpiration() {
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('user_preferences');

        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #e74c3c;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            z-index: 10000;
            font-family: Arial, sans-serif;
            max-width: 300px;
        `;
        notification.textContent = 'Je sessie is verlopen. Je wordt doorgestuurd naar de loginpagina.';
        document.body.appendChild(notification);

        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);

        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000);
    }
};

const originalFetch = window.fetch;
window.fetch = async (url, options = {}) => {
    const token = localStorage.getItem('jwt_token');
    options.headers = options.headers || {};

    if (token && JWTUtils.isTokenExpired(token)) {
        JWTUtils.handleTokenExpiration();
        throw new Error('Token expired');
    }
    
    if (token) {
        options.headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await originalFetch(url, options);

    if (response.status === 401) {
        JWTUtils.handleTokenExpiration();
        throw new Error('Session expired');
    }
    
    return response;
};

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('jwt_token');
    if (token && JWTUtils.isTokenExpired(token)) {
        JWTUtils.handleTokenExpiration();
    }
});

setInterval(() => {
    const token = localStorage.getItem('jwt_token');
    if (token && JWTUtils.isTokenExpired(token)) {
        JWTUtils.handleTokenExpiration();
    }
}, 5 * 60 * 1000);

window.JWTUtils = JWTUtils; 