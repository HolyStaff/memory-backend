export class Leaderboard {
    constructor() {
        this.entries = {
            4: [], // 4x4
            6: []  // 6x6
        };
        this.setupTabs();
        this.loadTopScores();
    }

    setupTabs() {
        const tabs = document.querySelectorAll('.tab-button');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                const size = tab.dataset.size;
                document.querySelectorAll('.leaderboard-list').forEach(list => {
                    list.style.display = 'none';
                });
                document.getElementById(`leaderboard-${size}x${size}`).style.display = 'block';
            });
        });
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
        // Process backend scores and display them
        // For now, we'll show the top 5 scores from the backend
        const topScores = scores.slice(0, 5);
        
        // Update both 4x4 and 6x6 leaderboards with the same data
        // In a real implementation, you might want separate endpoints for different board sizes
        this.entries[4] = topScores.map((score, index) => ({
            rank: index + 1,
            username: score.username,
            score: score.score,
            moves: Math.floor(score.score / 10), // Convert score to moves (approximation)
            time: (score.score % 10) * 10 // Convert score to time (approximation)
        }));

        this.entries[6] = [...this.entries[4]]; // Use same data for 6x6 for now

        this.updateDisplay(4);
        this.updateDisplay(6);
    }

    showLoadingError() {
        const entriesContainer4 = document.querySelector('#leaderboard-4x4 .leaderboard-entries');
        const entriesContainer6 = document.querySelector('#leaderboard-6x6 .leaderboard-entries');
        
        if (entriesContainer4) {
            entriesContainer4.innerHTML = '<div style="padding: 1rem; text-align: center; color: #666;">Kon top scores niet laden</div>';
        }
        if (entriesContainer6) {
            entriesContainer6.innerHTML = '<div style="padding: 1rem; text-align: center; color: #666;">Kon top scores niet laden</div>';
        }
    }

    async saveGameToBackend(boardSize, moves, time, api, colorFound, colorClosed) {
        const token = localStorage.getItem('jwt_token');
        if (!token) {
            console.log('No token found, skipping game save');
            return;
        }

        try {
            // Decode token to get user ID
            const decoded = this.decodeToken(token);
            if (!decoded || !decoded.sub) {
                console.error('Invalid token, cannot save game');
                return;
            }

            const gameData = {
                id: decoded.sub,
                score: moves * 10 + (time / 10), // Combine moves and time into a single score
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
                // Reload top scores after saving
                await this.loadTopScores();
            } else {
                console.error('Failed to save game');
            }
        } catch (error) {
            console.error('Error saving game:', error);
        }
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

    addEntry(boardSize, moves, time, api = 'cats', colorFound = '#2ecc71', colorClosed = '#3498db') {
        // Save game to backend
        this.saveGameToBackend(boardSize, moves, time, api, colorFound, colorClosed);
        
        // Also keep local entry for immediate display
        const entry = { moves, time, date: new Date() };
        this.entries[boardSize].push(entry);
        this.entries[boardSize].sort((a, b) => a.moves - b.moves);
        this.entries[boardSize] = this.entries[boardSize].slice(0, 5); // Keep top 5
        this.updateDisplay(boardSize);
    }

    updateDisplay(boardSize) {
        const entriesContainer = document.querySelector(`#leaderboard-${boardSize}x${boardSize} .leaderboard-entries`);
        if (!entriesContainer) return;

        entriesContainer.innerHTML = '';

        if (this.entries[boardSize].length === 0) {
            entriesContainer.innerHTML = '<div style="padding: 1rem; text-align: center; color: #666;">Geen scores beschikbaar</div>';
            return;
        }

        this.entries[boardSize].forEach((entry, index) => {
            const entryElement = document.createElement('div');
            entryElement.className = 'leaderboard-entry';
            
            if (entry.username) {
                // Backend score format
                entryElement.innerHTML = `
                    <span>#${entry.rank}</span>
                    <span>${entry.username}</span>
                    <span>${entry.score.toFixed(1)}</span>
                `;
            } else {
                // Local score format
                entryElement.innerHTML = `
                    <span>#${index + 1}</span>
                    <span>${entry.moves}</span>
                    <span>${entry.time.toFixed(1)}s</span>
                `;
            }
            
            entriesContainer.appendChild(entryElement);
        });
    }

    getTopScore(boardSize) {
        return this.entries[boardSize][0] || null;
    }
} 