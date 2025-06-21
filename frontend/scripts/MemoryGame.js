import { Board } from './components/Board.js';
import { Timer } from './components/Timer.js';
import { ImageService } from './services/ImageService.js';
import { GAME_CONFIG, IMAGE_APIS } from './types.js';

/**
 * Memory Game - Main game controller using components and services
 */
export class MemoryGame {
    /**
     * @param {Object} options - Game options
     */
    constructor(options = {}) {
        this.config = { ...GAME_CONFIG, ...options };
        this.state = this.initializeState();
        this.components = {};
        
        this.initializeComponents();
        this.bindEvents();
        this.loadUserPreferences();
    }

    /**
     * Initializes the game state
     * @returns {Object} Initial game state
     */
    initializeState() {
        return {
            boardSize: this.config.boardSize,
            isStarted: false,
            isProcessing: false,
            moveCount: 0,
            matchCount: 0,
            selectedApi: this.config.defaultApi,
            flippedTiles: [],
            matchedColor: '#2ecc71'
        };
    }

    /**
     * Initializes all game components
     */
    initializeComponents() {
        // Initialize board component
        const boardContainer = document.getElementById('grid-container');
        if (!boardContainer) {
            throw new Error('Board container not found');
        }

        this.components.board = new Board(
            this.state.boardSize,
            boardContainer,
            this.handleTileClick.bind(this)
        );

        // Initialize timer components
        this.components.gameTimer = new Timer('game', 0, {
            onUpdate: this.updateGameDisplay.bind(this)
        });

        this.components.flipTimer = new Timer('flip', this.config.flipDuration, {
            onComplete: this.handleFlipTimerComplete.bind(this)
        });

        // Add timers to DOM
        const timersContainer = document.querySelector('.timers-container');
        if (timersContainer) {
            timersContainer.appendChild(this.components.gameTimer.element);
            timersContainer.appendChild(this.components.flipTimer.element);
        }

        // Initialize UI components
        this.initializeUIComponents();
    }

    /**
     * Initializes UI components
     */
    initializeUIComponents() {
        // Property binding: API select options
        const apiSelect = document.getElementById('api-select');
        if (apiSelect) {
            apiSelect.innerHTML = '';
            Object.entries(IMAGE_APIS).forEach(([value, label]) => {
                const option = document.createElement('option');
                option.value = value;
                option.textContent = label;
                apiSelect.appendChild(option);
            });
            apiSelect.value = this.state.selectedApi;
        }

        // Property binding: board size select
        const boardSizeSelect = document.getElementById('board-size');
        if (boardSizeSelect) {
            boardSizeSelect.value = this.state.boardSize.toString();
        }

        // Property binding: color picker
        const colorPicker = document.getElementById('card-color');
        if (colorPicker) {
            colorPicker.value = getComputedStyle(document.documentElement)
                .getPropertyValue('--card-back-color').trim() || '#3498db';
        }
    }

    /**
     * Binds event listeners
     */
    bindEvents() {
        // Start button
        const startButton = document.getElementById('start-button');
        if (startButton) {
            startButton.addEventListener('click', this.startGame.bind(this));
        }

        // Reset button
        const resetButton = document.getElementById('reset-button');
        if (resetButton) {
            resetButton.addEventListener('click', this.resetGame.bind(this));
        }

        // API select
        const apiSelect = document.getElementById('api-select');
        if (apiSelect) {
            apiSelect.addEventListener('change', (event) => {
                this.handleApiChange(event.target.value);
            });
        }

        // Board size select
        const boardSizeSelect = document.getElementById('board-size');
        if (boardSizeSelect) {
            boardSizeSelect.addEventListener('change', (event) => {
                this.handleBoardSizeChange(parseInt(event.target.value));
            });
        }

        // Color picker
        const colorPicker = document.getElementById('card-color');
        if (colorPicker) {
            colorPicker.addEventListener('input', (event) => {
                this.changeCardColor(event.target.value);
            });
        }

        // Global click handler for unflipping tiles
        document.addEventListener('click', (event) => {
            if (!event.target.closest('.tile') && !event.target.closest('.controls')) {
                this.unflipAllTiles();
            }
        });
    }

    /**
     * Handles tile click events
     * @param {Object} tile - Tile component that was clicked
     */
    handleTileClick(tile) {
        if (this.state.isProcessing || !this.state.isStarted) {
            return;
        }

        // Check if tile is already flipped
        const tileIndex = this.state.flippedTiles.findIndex(t => t === tile);
        
        if (tileIndex !== -1) {
            // Unflip tile
            tile.hide();
            this.state.flippedTiles.splice(tileIndex, 1);
            
            if (this.state.flippedTiles.length === 1) {
                this.components.flipTimer.stop();
                this.state.isProcessing = false;
            }
            
            if (this.state.flippedTiles.length === 0) {
                this.components.flipTimer.reset();
            }
            
            return;
        }

        // Don't allow flipping more than 2 tiles
        if (this.state.flippedTiles.length >= 2) {
            return;
        }

        tile.flip();
        this.state.flippedTiles.push(tile);

        if (this.state.flippedTiles.length === 1) {
            this.components.flipTimer.show();
            this.components.flipTimer.reset();
        }

        if (this.state.flippedTiles.length === 2) {
            this.state.moveCount++;
            this.state.isProcessing = true;

            const [tile1, tile2] = this.state.flippedTiles;

            if (tile1.imageUrl === tile2.imageUrl) {
                // Match found
                setTimeout(() => {
                    tile1.match();
                    tile2.match();
                    this.state.matchCount++;

                    if (this.components.board.allTilesMatched()) {
                        this.gameComplete();
                    }

                    this.state.flippedTiles = [];
                    this.state.isProcessing = false;
                    this.components.flipTimer.reset();
                }, this.config.matchDelay);
            } else {
                // No match - start flip timer
                this.components.flipTimer.start();
            }
        }
    }

    /**
     * Handles flip timer completion
     */
    handleFlipTimerComplete() {
        if (this.state.flippedTiles.length === 2) {
            const [tile1, tile2] = this.state.flippedTiles;
            tile1.hide();
            tile2.hide();
            
            this.state.flippedTiles = [];
            this.state.isProcessing = false;
            this.components.flipTimer.reset();
        }
    }

    /**
     * Unflips all tiles
     */
    unflipAllTiles() {
        if (this.state.flippedTiles.length > 0 && !this.state.isProcessing) {
            this.state.flippedTiles.forEach(tile => {
                tile.hide();
            });
            this.state.flippedTiles = [];
            this.components.flipTimer.stop();
            this.components.flipTimer.reset();
        }
    }

    /**
     * Starts the game
     */
    async startGame() {
        if (this.state.isStarted) return;

        this.state.isStarted = true;
        this.components.gameTimer.start();
        this.components.gameTimer.show();
        
        // Property binding: button states
        this.setStartButtonEnabled(false);
        this.setResetButtonEnabled(true);

        await this.initialize();
    }

    /**
     * Initializes the game board
     */
    async initialize() {
        const uniqueImagesNeeded = (this.state.boardSize * this.state.boardSize) / 2;
        
        // Use ImageService to fetch images
        const imageUrls = await ImageService.fetchImages(uniqueImagesNeeded, this.state.selectedApi);
        
        // Preload images for better performance
        await ImageService.preloadImages(imageUrls);
        
        this.components.board.initialize(imageUrls, this.state.matchedColor);
        
        this.state.flippedTiles = [];
        this.state.isProcessing = false;
        this.state.moveCount = 0;
        this.state.matchCount = 0;
    }

    /**
     * Resets the game
     */
    async resetGame() {
        this.components.board.destroyTiles();
        this.state.flippedTiles = [];
        this.state.isProcessing = false;
        this.state.moveCount = 0;
        this.state.matchCount = 0;
        
        this.components.gameTimer.reset();
        this.components.flipTimer.reset();
        
        this.components.board = new Board(
            this.state.boardSize,
            document.getElementById('grid-container'),
            this.handleTileClick.bind(this)
        );

        this.setStartButtonEnabled(true);
        this.setResetButtonEnabled(false);
        this.state.isStarted = false;
    }

    /**
     * Handles API change
     * @param {string} api - New API type
     */
    handleApiChange(api) {
        this.state.selectedApi = api;
        if (this.state.isStarted) {
            this.resetGame();
            this.startGame();
        }
    }

    /**
     * Handles board size change
     * @param {number} newSize - New board size
     */
    async handleBoardSizeChange(newSize) {
        this.state.boardSize = newSize;
        await this.resetGame();
        if (this.state.isStarted) {
            await this.initialize();
        }
    }

    /**
     * Changes card color
     * @param {string} color - New color
     */
    changeCardColor(color) {
        document.documentElement.style.setProperty('--card-back-color', color);
        this.components.board.updateAllTilesColor(color);
    }

    /**
     * Sets start button enabled state
     * @param {boolean} enabled - Whether button should be enabled
     */
    setStartButtonEnabled(enabled) {
        const startButton = document.getElementById('start-button');
        if (startButton) {
            startButton.disabled = !enabled;
            startButton.style.display = enabled ? '' : 'none';
        }
    }

    /**
     * Sets reset button enabled state
     * @param {boolean} enabled - Whether button should be enabled
     */
    setResetButtonEnabled(enabled) {
        const resetButton = document.getElementById('reset-button');
        if (resetButton) {
            resetButton.disabled = !enabled;
        }
    }

    /**
     * Loads user preferences
     */
    loadUserPreferences() {
        const savedPreferences = localStorage.getItem('user_preferences');
        if (savedPreferences) {
            try {
                const preferences = JSON.parse(savedPreferences);
                
                if (preferences.api) {
                    this.state.selectedApi = preferences.api;
                    const apiSelect = document.getElementById('api-select');
                    if (apiSelect) {
                        apiSelect.value = preferences.api;
                    }
                }
                
                if (preferences.color_closed) {
                    this.changeCardColor(preferences.color_closed);
                    const colorPicker = document.getElementById('card-color');
                    if (colorPicker) {
                        colorPicker.value = preferences.color_closed;
                    }
                }
                
                if (preferences.color_found) {
                    this.state.matchedColor = preferences.color_found;
                }
            } catch (error) {
                console.error('Error loading preferences:', error);
            }
        }
    }

    /**
     * Handles game completion
     */
    gameComplete() {
        this.components.gameTimer.stop();
        const time = this.components.gameTimer.getElapsedTime();
        
        // Save to leaderboard
        this.saveToLeaderboard(time);
        
        // Show completion message
        this.showCompletionMessage(time);
    }

    /**
     * Saves game result to leaderboard
     * @param {number} time - Game completion time
     */
    saveToLeaderboard(time) {
        const entry = {
            player_name: 'Player',
            board_size: this.state.boardSize,
            time: Math.floor(time / 1000),
            moves: this.state.moveCount,
            score: this.calculateScore(time, this.state.moveCount)
        };

        // Save to localStorage for now
        const leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '[]');
        leaderboard.push(entry);
        leaderboard.sort((a, b) => b.score - a.score);
        localStorage.setItem('leaderboard', JSON.stringify(leaderboard.slice(0, 10)));
    }

    /**
     * Calculates game score
     * @param {number} time - Game time in milliseconds
     * @param {number} moves - Number of moves
     * @returns {number} Calculated score
     */
    calculateScore(time, moves) {
        const timeBonus = Math.max(0, 10000 - Math.floor(time / 1000) * 10);
        const moveBonus = Math.max(0, 5000 - moves * 5);
        return timeBonus + moveBonus;
    }

    /**
     * Shows completion message
     * @param {number} time - Game completion time
     */
    showCompletionMessage(time) {
        const minutes = Math.floor(time / 60000);
        const seconds = Math.floor((time % 60000) / 1000);
        
        alert(`Congratulations! You completed the game in ${minutes}:${seconds.toString().padStart(2, '0')} with ${this.state.moveCount} moves!`);
    }

    /**
     * Gets the current game state
     * @returns {Object} Current game state
     */
    getState() {
        return {
            ...this.state,
            boardState: this.components.board.getState(),
            gameTimerState: this.components.gameTimer.getState(),
            flipTimerState: this.components.flipTimer.getState()
        };
    }
} 