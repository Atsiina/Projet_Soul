// src/services/api.js

const API_BASE_URL = 'http://localhost:8080/api';

class ApiService {
    // Auth
    static async login(loginId, password) {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ loginId, password }),
        });

        if (!response.ok) {
            throw new Error('Identifiants invalides');
        }

        return response.json();
    }

    // Users
    static async updateUserSouls(userId, souls) {
        return await this.authenticatedRequest(`/users/${userId}/souls`, {
            method: 'PATCH',
            body: JSON.stringify({ souls }),
        });
    }

    static async getUser(userId) {
        return await this.authenticatedRequest(`/users/${userId}`);
    }

    // Chi-Soul-Mi
    static async createDuel() {
        console.log('Création duel...');
        return await this.authenticatedRequest('/games/chisoulmi/duels', {
            method: 'POST'
        });
    }
    
    static async joinDuel(inviteCode) {
        return await this.authenticatedRequest('/games/chisoulmi/duels/join', {
            method: 'POST',
            body: JSON.stringify({ inviteCode })
        });
    }

    static async getDuel(duelId) {
        return await this.authenticatedRequest(`/games/chisoulmi/duels/${duelId}`);
    }

    static async makeChoice(duelId, choice) {
        return await this.authenticatedRequest(`/games/chisoulmi/duels/${duelId}/choice`, {
            method: 'POST',
            body: JSON.stringify({ choice })
        });
    }

    static async endDuelByTimeout(duelId) {
        return await this.authenticatedRequest(`/games/chisoulmi/duels/${duelId}/timeout`, {
            method: 'POST'
        });
    }

    // Helper méthode
    static async authenticatedRequest(endpoint, options = {}) {
        const token = localStorage.getItem('token');
        
        if (!token) {
            throw new Error('Non authentifié');
        }

        console.log('Envoi requête à:', `${API_BASE_URL}${endpoint}`);
        
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                ...options,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    ...options.headers
                },
                mode: 'cors'
            });

            console.log('Status réponse:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Erreur serveur:', errorText);
                throw new Error(errorText || `Erreur HTTP: ${response.status}`);
            }

            const text = await response.text();
            return text ? JSON.parse(text) : null;
        } catch (error) {
            console.error('Erreur requête:', error);
            throw error;
        }
    }
}

export default ApiService;
