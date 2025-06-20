export class FlipTimer {

    constructor(onUpdate) {
        this.time = 0;
        this.interval = null;
        this.onUpdate = onUpdate;
    }

    start() {
        this.reset();
        this.interval = setInterval(() => {
            this.time += 0.1;
            this.onUpdate(this.time);
        }, 100);
    }

    reset() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        this.time = 0;
        this.onUpdate(this.time);
    }
} 