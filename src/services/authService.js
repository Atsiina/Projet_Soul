// src/services/authService.js
class AuthService {
    static isAuthenticated() {
        const token = localStorage.getItem('token');
        console.log('Token actuel:', token);
        return !!token;
    }

    static getToken() {
        return localStorage.getItem('token');
    }

    static async validateToken() {
        const token = this.getToken();
        console.log('Validation du token:', token);
        
        if (!token) {
            throw new Error('Pas de token trouvé');
        }

        try {
            const response = await fetch('http://localhost:8080/api/auth/validate', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.ok;
        } catch (error) {
            console.error('Erreur de validation:', error);
            return false;
        }
    }

    static parseToken(token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch (e) {
            console.error('Erreur de parsing du token:', e);
            return null;
        }
    }
}

export default AuthService;
