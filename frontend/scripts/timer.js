export class GameTimer {
    constructor() {
        this.startTime = null;
        this.isRunning = false;
        this.interval = null;
        
        this.timeDisplay = document.getElementById('game-timer-display');
    }

    start() {
        if (this.isRunning) return;
        
        this.startTime = Date.now();
        this.isRunning = true;
        
        this.interval = setInterval(() => {
            this.updateDisplay();
        }, 1000);
        
        this.updateDisplay();
    }

    stop() {
        this.isRunning = false;
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    reset() {
        this.stop();
        this.startTime = null;
        this.updateDisplay();
    }

    getElapsedTime() {
        if (!this.startTime) return 0;
        return Date.now() - this.startTime;
    }

    updateDisplay() {
        // Re-find the element in case it wasn't available during construction
        if (!this.timeDisplay) {
            this.timeDisplay = document.getElementById('game-timer-display');
        }
        
        if (this.timeDisplay) {
            const elapsed = this.getElapsedTime();
            const minutes = Math.floor(elapsed / 60000);
            const seconds = Math.floor((elapsed % 60000) / 1000);
            this.timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }
}

export class FlipTimer {
    constructor(duration = 3000) {
        this.duration = duration;
        this.timeLeft = duration;
        this.isRunning = false;
        this.interval = null;
        this.onComplete = null;
        
        this.progressBar = document.getElementById('flip-timer-progress');
        this.timeDisplay = document.getElementById('flip-timer-display');
        this.container = document.getElementById('flip-timer-container');
        
        // Always show the timer container
        if (this.container) {
            this.container.style.display = 'flex';
        }
    }

    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.timeLeft = this.duration;
        
        this.interval = setInterval(() => {
            this.timeLeft -= 100;
            
            if (this.timeLeft <= 0) {
                this.stop();
                if (this.onComplete) {
                    this.onComplete();
                }
            } else {
                this.updateDisplay();
            }
        }, 100);
        
        this.updateDisplay();
    }

    stop() {
        this.isRunning = false;
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    reset() {
        this.stop();
        this.timeLeft = this.duration;
        this.updateDisplay();
    }

    updateDisplay() {
        // Re-find elements in case they weren't available during construction
        if (!this.progressBar) {
            this.progressBar = document.getElementById('flip-timer-progress');
        }
        if (!this.timeDisplay) {
            this.timeDisplay = document.getElementById('flip-timer-display');
        }
        if (!this.container) {
            this.container = document.getElementById('flip-timer-container');
        }
        
        if (this.progressBar) {
            const progress = (this.timeLeft / this.duration) * 100;
            this.progressBar.style.width = `${progress}%`;
            
            // Change color based on time left
            if (progress > 60) {
                this.progressBar.style.backgroundColor = '#4CAF50'; // Green
            } else if (progress > 30) {
                this.progressBar.style.backgroundColor = '#FF9800'; // Orange
            } else {
                this.progressBar.style.backgroundColor = '#F44336'; // Red
            }
        }
        
        if (this.timeDisplay) {
            const seconds = Math.ceil(this.timeLeft / 1000);
            this.timeDisplay.textContent = `${seconds}s`;
        }
    }
} 