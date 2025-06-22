export class GameTimer {
    constructor(onUpdate) {
        this.time = 0;
        this.interval = null;
        this.onUpdate = onUpdate;
        this.isRunning = false;
    }

    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.interval = setInterval(() => {
            this.time += 0.1;
            this.onUpdate(this.time);
        }, 100);
    }

    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        this.isRunning = false;
    }

    reset() {
        this.stop();
        this.time = 0;
        this.onUpdate(this.time);
    }

    getTime() {
        return this.time;
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
}

export class FlipTimer {
    constructor(onUpdate, onComplete) {
        this.duration = 2.0; // 2 seconds for tile flip
        this.time = 0;
        this.interval = null;
        this.onUpdate = onUpdate;
        this.onComplete = onComplete;
        this.isRunning = false;
    }

    start() {
        this.reset();
        this.isRunning = true;
        this.interval = setInterval(() => {
            this.time += 0.1;
            const progress = Math.min(this.time / this.duration, 1.0);
            this.onUpdate(progress);
            
            if (this.time >= this.duration) {
                this.stop();
                if (this.onComplete) {
                    this.onComplete();
                }
            }
        }, 100);
    }

    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        this.isRunning = false;
    }

    reset() {
        this.stop();
        this.time = 0;
        this.onUpdate(0);
    }

    isActive() {
        return this.isRunning;
    }
} 