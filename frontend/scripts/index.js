import { MemoryGame } from './MemoryGame.js';

/**
 * Main application entry point
 * Uses the new MemoryGame class with components and services
 */
class MemoryGameApp {
    constructor() {
        this.game = null;
        this.init();
    }

    /**
     * Initializes the application
     */
    init() {
        try {
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    this.createGame();
                });
            } else {
                this.createGame();
            }
        } catch (error) {
            console.error('Failed to initialize Memory Game:', error);
            this.showError('Failed to initialize the game. Please refresh the page.');
        }
    }

    /**
     * Creates the memory game instance
     */
    createGame() {
        try {
            // Initialize the game with default configuration
            this.game = new MemoryGame({
                boardSize: 4,
                flipDuration: 3000,
                matchDelay: 500,
                defaultApi: 'cats'
            });

            console.log('Memory Game initialized successfully');
            
            // Log initial state
            console.log('Initial game state:', this.game.getState());
            
        } catch (error) {
            console.error('Failed to create Memory Game:', error);
            this.showError('Failed to create the game. Please check the console for details.');
        }
    }

    /**
     * Shows an error message to the user
     * @param {string} message - Error message to display
     */
    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: #e74c3c;
            color: white;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            z-index: 10000;
            font-family: Arial, sans-serif;
            text-align: center;
        `;
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);
        
        // Remove error after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 5000);
    }

    /**
     * Gets the current game instance
     * @returns {MemoryGame|null} Current game instance
     */
    getGame() {
        return this.game;
    }

    /**
     * Destroys the current game instance
     */
    destroy() {
        if (this.game) {
            // Clean up any resources if needed
            this.game = null;
        }
    }
}

// Create global app instance
window.memoryGameApp = new MemoryGameApp();

// Export for module usage
export default window.memoryGameApp; 