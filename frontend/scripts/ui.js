export class GameUI {
    constructor() {
        this.startButton = document.getElementById('start-button');
        this.resetButton = document.getElementById('reset-button');

        this.setStartButtonEnabled(true);
        this.setResetButtonEnabled(false);

        this.colorPicker = document.getElementById('card-color');
        this.boardSizeSelect = document.getElementById('board-size');
        this.apiSelect = document.getElementById('api-select');
        this.gameTimerElement = document.getElementById('game-timer');
        this.flipTimerContainer = document.getElementById('flip-timer-container');
        this.flipTimerText = document.getElementById('flip-timer-text');
        this.flipProgressBar = document.getElementById('flip-progress-bar');

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

    updateGameTimer(seconds) {
        if (this.gameTimerElement) {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = Math.floor(seconds % 60);
            this.gameTimerElement.textContent = `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
        }
    }

    showFlipTimer() {
        if (this.flipTimerContainer) {
            this.flipTimerContainer.style.display = 'block';
        }
    }

    hideFlipTimer() {
        if (this.flipTimerContainer) {
            this.flipTimerContainer.style.display = 'none';
        }
    }

    updateFlipTimer(progress) {
        if (this.flipProgressBar) {
            const percentage = progress * 100;
            this.flipProgressBar.style.width = `${percentage}%`;
            
            // Update color based on progress
            this.flipProgressBar.classList.remove('warning', 'danger');
            if (progress > 0.7) {
                this.flipProgressBar.classList.add('danger');
            } else if (progress > 0.5) {
                this.flipProgressBar.classList.add('warning');
            }
        }
        
        if (this.flipTimerText) {
            const remainingTime = Math.max(0, 2.0 - (progress * 2.0));
            this.flipTimerText.textContent = `${remainingTime.toFixed(1)}s`;
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