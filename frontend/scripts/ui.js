export class GameUI {
    constructor() {
        this.startButton = document.getElementById('start-button');
        this.resetButton = document.getElementById('reset-button');

        this.setStartButtonEnabled(true);
        this.setResetButtonEnabled(false);

        this.colorPicker = document.getElementById('card-color');
        this.boardSizeSelect = document.getElementById('board-size');
        this.flipTimerElement = document.getElementById('flip-timer');
    }

    getBoardSize() {
        return parseInt(this.boardSizeSelect.value);
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
} 