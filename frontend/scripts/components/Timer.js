/**
 * Timer Component - Manages game timers with property binding and directives
 */
export class Timer {
    /**
     * @param {string} type - Timer type ('game' or 'flip')
     * @param {number} duration - Timer duration in milliseconds
     * @param {Object} options - Timer options
     */
    constructor(type, duration = 0, options = {}) {
        this.type = type;
        this.duration = duration;
        this.timeLeft = duration;
        this.isRunning = false;
        this.interval = null;
        this.onComplete = options.onComplete || null;
        this.onUpdate = options.onUpdate || null;
        
        this.element = this.createTimerElement();
        this.bindEvents();
    }

    /**
     * Creates the timer DOM element
     * @returns {HTMLElement} The created timer element
     */
    createTimerElement() {
        const container = document.createElement('div');
        container.className = `timer-container ${this.type}-timer`;
        container.dataset.timerType = this.type;
        
        if (this.type === 'game') {
            this.createGameTimer(container);
        } else if (this.type === 'flip') {
            this.createFlipTimer(container);
        }
        
        return container;
    }

    /**
     * Creates game timer elements
     * @param {HTMLElement} container - Container element
     */
    createGameTimer(container) {
        const label = document.createElement('span');
        label.textContent = 'Game Time: ';
        
        const display = document.createElement('span');
        display.id = 'game-timer-display';
        display.className = 'timer-display';
        display.textContent = '00:00';
        
        container.appendChild(label);
        container.appendChild(display);
    }

    /**
     * Creates flip timer elements
     * @param {HTMLElement} container - Container element
     */
    createFlipTimer(container) {
        const labelContainer = document.createElement('div');
        labelContainer.className = 'flip-timer-label';
        
        const label = document.createElement('span');
        label.textContent = 'Tile Flip Timer: ';
        
        const display = document.createElement('span');
        display.id = 'flip-timer-display';
        display.className = 'timer-display';
        display.textContent = '3s';
        
        labelContainer.appendChild(label);
        labelContainer.appendChild(display);
        
        const progressContainer = document.createElement('div');
        progressContainer.className = 'progress-bar-container';
        
        const progressBar = document.createElement('div');
        progressBar.id = 'flip-timer-progress';
        progressBar.className = 'progress-bar';
        progressBar.style.width = '100%';
        
        progressContainer.appendChild(progressBar);
        container.appendChild(labelContainer);
        container.appendChild(progressContainer);
    }

    /**
     * Binds event listeners
     */
    bindEvents() {
        // Directive: timer state binding
        this.element.addEventListener('timer-start', () => {
            this.element.classList.add('running');
        });
        
        this.element.addEventListener('timer-stop', () => {
            this.element.classList.remove('running');
        });
    }

    /**
     * Starts the timer
     */
    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.timeLeft = this.duration;
        
        // Property binding: timer state
        this.element.dataset.running = 'true';
        this.element.classList.add('running');
        
        if (this.type === 'game') {
            this.startGameTimer();
        } else {
            this.startFlipTimer();
        }
        
        // Directive: emit start event
        this.element.dispatchEvent(new CustomEvent('timer-start'));
    }

    /**
     * Starts the game timer
     */
    startGameTimer() {
        this.startTime = Date.now();
        
        this.interval = setInterval(() => {
            this.updateGameDisplay();
        }, 1000);
        
        this.updateGameDisplay();
    }

    /**
     * Starts the flip timer
     */
    startFlipTimer() {
        this.interval = setInterval(() => {
            this.timeLeft -= 100;
            
            if (this.timeLeft <= 0) {
                this.stop();
                if (this.onComplete) {
                    this.onComplete();
                }
            } else {
                this.updateFlipDisplay();
            }
        }, 100);
        
        this.updateFlipDisplay();
    }

    /**
     * Stops the timer
     */
    stop() {
        this.isRunning = false;
        
        // Property binding: timer state
        this.element.dataset.running = 'false';
        this.element.classList.remove('running');
        
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        
        // Directive: emit stop event
        this.element.dispatchEvent(new CustomEvent('timer-stop'));
    }

    /**
     * Resets the timer
     */
    reset() {
        this.stop();
        this.timeLeft = this.duration;
        
        if (this.type === 'game') {
            this.updateGameDisplay();
        } else {
            this.updateFlipDisplay();
        }
    }

    /**
     * Updates the game timer display
     */
    updateGameDisplay() {
        const display = this.element.querySelector('#game-timer-display');
        if (display) {
            const elapsed = this.getElapsedTime();
            const minutes = Math.floor(elapsed / 60000);
            const seconds = Math.floor((elapsed % 60000) / 1000);
            
            // Property binding: time display
            display.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }

    /**
     * Updates the flip timer display
     */
    updateFlipDisplay() {
        const display = this.element.querySelector('#flip-timer-display');
        const progressBar = this.element.querySelector('#flip-timer-progress');
        
        if (display) {
            const seconds = Math.ceil(this.timeLeft / 1000);
            display.textContent = `${seconds}s`;
        }
        
        if (progressBar) {
            const progress = (this.timeLeft / this.duration) * 100;
            
            // Property binding: progress bar width
            progressBar.style.width = `${progress}%`;
            
            // Directive: color binding based on progress
            this.updateProgressColor(progressBar, progress);
        }
    }

    /**
     * Updates progress bar color based on time remaining
     * @param {HTMLElement} progressBar - Progress bar element
     * @param {number} progress - Progress percentage
     */
    updateProgressColor(progressBar, progress) {
        // Directive: conditional color binding
        if (progress > 60) {
            progressBar.style.backgroundColor = '#4CAF50'; // Green
        } else if (progress > 30) {
            progressBar.style.backgroundColor = '#FF9800'; // Orange
        } else {
            progressBar.style.backgroundColor = '#F44336'; // Red
        }
    }

    /**
     * Gets elapsed time for game timer
     * @returns {number} Elapsed time in milliseconds
     */
    getElapsedTime() {
        if (!this.startTime) return 0;
        return Date.now() - this.startTime;
    }

    /**
     * Gets the current timer state
     * @returns {Object} Timer state object
     */
    getState() {
        return {
            type: this.type,
            isRunning: this.isRunning,
            timeLeft: this.timeLeft,
            duration: this.duration
        };
    }

    /**
     * Shows the timer
     */
    show() {
        this.element.style.display = 'flex';
    }

    /**
     * Hides the timer
     */
    hide() {
        this.element.style.display = 'none';
    }

    /**
     * Destroys the timer
     */
    destroy() {
        this.stop();
        if (this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }
} 