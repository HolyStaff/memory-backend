export class Leaderboard {
    constructor() {
        this.entries = [];
        this.loadTopScores();
    }

    async loadTopScores() {
        try {
            const response = await fetch('http://localhost:8000/memory/top-scores');
            if (response.ok) {
                const scores = await response.json();
                this.processBackendScores(scores);
            } else {
                console.error('Failed to load top scores from backend');
                this.showLoadingError();
            }
        } catch (error) {
            console.error('Error loading top scores:', error);
            this.showLoadingError();
        }
    }

    processBackendScores(scores) {
        // Show top 5 scores globally
        const topScores = scores
            .sort((a, b) => b.score - a.score)
            .slice(0, 5);
        this.entries = topScores.map((score, index) => ({
            rank: index + 1,
            username: score.username,
            score: score.score,
            moves: score.moves,
            time: score.time,
            boardSize: score.boardSize
        }));
        this.updateDisplay();
    }

    showLoadingError() {
        const entriesContainer = document.querySelector('.leaderboard-entries');
        if (entriesContainer) {
            entriesContainer.innerHTML = '<div style="padding: 1rem; text-align: center; color: #666;">Kon top scores niet laden</div>';
        }
    }

    async saveGameToBackend(boardSize, moves, time, api, colorFound, colorClosed) {
        const token = localStorage.getItem('jwt_token');
        if (!token) {
            console.log('No token found, skipping game save');
            return;
        }
        try {
            const decoded = this.decodeToken(token);
            if (!decoded || !decoded.sub) {
                console.error('Invalid token, cannot save game');
                return;
            }
            const score = this.calculateScore(boardSize, moves, time);
            const gameData = {
                id: decoded.sub,
                score,
                moves,
                time,
                boardSize,
                api: api || 'cats',
                color_found: colorFound || '#2ecc71',
                color_closed: colorClosed || '#3498db'
            };
            const response = await fetch('http://localhost:8000/game/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(gameData)
            });
            if (response.ok) {
                console.log('Game saved successfully');
                await this.loadTopScores();
            } else {
                console.error('Failed to save game');
            }
        } catch (error) {
            console.error('Error saving game:', error);
        }
    }

    calculateScore(boardSize, moves, time) {
        // Lower moves and lower time = higher score
        // Example: score = (10000 / (moves * time)) * multiplier
        // 6x6 gets 1.2x multiplier
        if (moves === 0 || time === 0) return 0;
        let base = 10000 / (moves * time);
        if (boardSize === 6) base *= 1.2;
        return Math.round(base * 100) / 100;
    }

    addEntry(boardSize, moves, time, api = 'cats', colorFound = '#2ecc71', colorClosed = '#3498db') {
        // Save game to backend
        this.saveGameToBackend(boardSize, moves, time, api, colorFound, colorClosed);
        // Local entry for immediate display
        const score = this.calculateScore(boardSize, moves, time);
        const entry = { moves, time, score, boardSize, date: new Date() };
        this.entries.push(entry);
        this.entries.sort((a, b) => b.score - a.score);
        this.entries = this.entries.slice(0, 5);
        this.updateDisplay();
    }

    updateDisplay() {
        const entriesContainer = document.querySelector('.leaderboard-entries');
        if (!entriesContainer) return;
        entriesContainer.innerHTML = '';
        if (this.entries.length === 0) {
            entriesContainer.innerHTML = '<div style="padding: 1rem; text-align: center; color: #666;">Geen scores beschikbaar</div>';
            return;
        }
        this.entries.forEach((entry, index) => {
            const entryElement = document.createElement('div');
            entryElement.className = 'leaderboard-entry';
            entryElement.innerHTML = `
                <span>#${index + 1}</span>
                <span>${entry.username || 'Local'}</span>
                <span>${entry.score}</span>
            `;
            entriesContainer.appendChild(entryElement);
        });
    }

    getTopScore() {
        return this.entries[0] || null;
    }

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
    }
} 