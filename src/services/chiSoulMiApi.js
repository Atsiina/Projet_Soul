
const API_BASE_URL = 'http://localhost:8080/api';

class ChiSoulMiApi {
    static async authenticatedRequest(endpoint, options = {}) {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Non authentifié');
        }

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                ...options,
                headers: {
                    ...options.headers,
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erreur API:', error);
            throw error;
        }
    }

    static async createDuel() {
        return this.authenticatedRequest('/games/chisoulmi/duels', {
            method: 'POST'
        });
    }

    static async joinDuel(inviteCode) {
        return this.authenticatedRequest('/games/chisoulmi/duels/join', {
            method: 'POST',
            body: JSON.stringify({ inviteCode })
        });
    }

    static async makeChoice(duelId, choice) {
        return this.authenticatedRequest(`/games/chisoulmi/duels/${duelId}/choice`, {
            method: 'POST',
            body: JSON.stringify({ choice })
        });
    }

    static async getDuel(duelId) {
        return this.authenticatedRequest(`/games/chisoulmi/duels/${duelId}`);
    }

    static async getStats() {
        return this.authenticatedRequest('/games/chisoulmi/stats');
    }

    static async getVersusStats(player1Id, player2Id) {
        return this.authenticatedRequest(
            `/games/chisoulmi/versus/${player1Id}/${player2Id}`
        );
    }

    static async getLeaderboard() {
        return this.authenticatedRequest('/games/chisoulmi/leaderboard');
    }
}

export default ChiSoulMiApi;
