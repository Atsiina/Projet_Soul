// src/services/duelService.js

const API_URL = 'http://localhost:8080/api';

class DuelService {
  static async createDuel() {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Non authentifié');
    }

    try {
      const response = await fetch(`${API_URL}/games/chisoulmi/duels`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors',
        credentials: 'omit'
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Erreur serveur');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur service duel:', error);
      throw error;
    }
  }

  static async joinDuel(inviteCode) {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Non authentifié');
    }

    try {
      const response = await fetch(`${API_URL}/games/chisoulmi/duels/join`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors',
        credentials: 'omit',
        body: JSON.stringify({ inviteCode })
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Erreur serveur');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur service duel:', error);
      throw error;
    }
  }
}

export default DuelService;
