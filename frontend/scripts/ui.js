export class GameUI {
    constructor() {
        this.startButton = document.getElementById('start-button');
        this.resetButton = document.getElementById('reset-button');

        this.setStartButtonEnabled(true);
        this.setResetButtonEnabled(false);

        this.colorPicker = document.getElementById('card-color');
        this.boardSizeSelect = document.getElementById('board-size');
        this.apiSelect = document.getElementById('api-select');

        this.initializeApiSelect();
    }

    initializeApiSelect() {
        if (this.apiSelect) {
            // Clear existing options
            this.apiSelect.innerHTML = '';
            
            // Add options for each API
            const apis = {
                'cats': 'Cats',
                'picsum': 'Random Photos',
                'dogs': 'Dogs'
            };
            
            Object.entries(apis).forEach(([value, label]) => {
                const option = document.createElement('option');
                option.value = value;
                option.textContent = label;
                this.apiSelect.appendChild(option);
            });
        }
    }

    getBoardSize() {
        return parseInt(this.boardSizeSelect.value);
    }

    getSelectedApi() {
        return this.apiSelect ? this.apiSelect.value : 'cats';
    }

    setStartButtonEnabled(enabled) {
        this.startButton.disabled = !enabled;
    }

    setResetButtonEnabled(enabled) {
        this.resetButton.disabled = !enabled;
    }

    showGameTimer() {
        const gameTimerContainer = document.getElementById('game-timer-container');
        if (gameTimerContainer) {
            gameTimerContainer.style.display = 'flex';
        }
    }

    hideGameTimer() {
        const gameTimerContainer = document.getElementById('game-timer-container');
        if (gameTimerContainer) {
            gameTimerContainer.style.display = 'none';
        }
    }

    showFlipTimer() {
        const flipTimerContainer = document.getElementById('flip-timer-container');
        if (flipTimerContainer) {
            flipTimerContainer.style.display = 'flex';
        }
    }

    hideFlipTimer() {
        // Don't hide the timer anymore - just reset it
        const flipTimer = document.getElementById('flip-timer');
        if (flipTimer) {
            flipTimer.reset();
        }
    }

    showGameControls() {
        const gameControls = document.getElementById('game-controls');
        if (gameControls) {
            gameControls.style.display = 'flex';
        }
    }

    hideStartButton() {
        const startButton = document.getElementById('start-button');
        if (startButton) {
            startButton.style.display = 'none';
        }
    }

    showStartButton() {
        const startButton = document.getElementById('start-button');
        if (startButton) {
            startButton.style.display = '';
        }
    }

    updateCardColor(color) {
        document.documentElement.style.setProperty('--card-back-color', color);
    }

    onStartButtonClick(callback) {
        this.startButton?.addEventListener('click', callback);
    }

    onResetButtonClick(callback) {
        this.resetButton?.addEventListener('click', callback);
    }

    onColorChange(callback) {
        this.colorPicker?.addEventListener('input', (event) => callback(event.target.value));
    }

    onBoardSizeChange(callback) {
        this.boardSizeSelect?.addEventListener('change', () => callback(this.getBoardSize()));
    }

    onApiChange(callback) {
        this.apiSelect?.addEventListener('change', () => callback(this.getSelectedApi()));
    }
} 