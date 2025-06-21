export class GameUI {
    constructor() {
        this.startButton = document.getElementById('start-button');
        this.resetButton = document.getElementById('reset-button');

        this.setStartButtonEnabled(true);
        this.setResetButtonEnabled(false);

        this.colorPicker = document.getElementById('card-color');
        this.boardSizeSelect = document.getElementById('board-size');
        this.apiSelect = document.getElementById('api-select');
        this.flipTimerElement = document.getElementById('flip-timer');

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

    updateFlipTimer(seconds) {
        if (this.flipTimerElement) {
            this.flipTimerElement.textContent = seconds.toFixed(1);
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