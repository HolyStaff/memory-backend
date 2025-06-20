export class Leaderboard {
    constructor() {
        this.entries = {
            4: [], // 4x4
            6: []  // 6x6
        };
        this.setupTabs();
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

    addEntry(boardSize, moves, time) {
        const entry = { moves, time, date: new Date() };
        this.entries[boardSize].push(entry);
        this.entries[boardSize].sort((a, b) => a.moves - b.moves);
        this.entries[boardSize] = this.entries[boardSize].slice(0, 10); // top 10 in leaderboard houden
        this.updateDisplay(boardSize);
    }

    updateDisplay(boardSize) {
        const entriesContainer = document.querySelector(`#leaderboard-${boardSize}x${boardSize} .leaderboard-entries`);
        entriesContainer.innerHTML = '';

        this.entries[boardSize].forEach((entry, index) => {
            const entryElement = document.createElement('div');
            entryElement.className = 'leaderboard-entry';
            entryElement.innerHTML = `
                <span>#${index + 1 }</span>
                <span>${ entry.moves }</span>
                <span>${ entry.time.toFixed(1) }s</span>
            `;
            entriesContainer.appendChild(entryElement);
        });
    }

    getTopScore(boardSize) {
        return this.entries[boardSize][0] || null;
    }
} 