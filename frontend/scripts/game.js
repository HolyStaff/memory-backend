import Board from './board.js';
import { GameUI } from './ui.js';
import { FlipTimer } from './timer.js';
import { ImageService } from './imageService.js';
import { Leaderboard } from './leaderboard.js';

class MemoryGame {
    constructor(boardSize = 4) {
        this.boardSize = boardSize;
        this.container = document.getElementById('grid-container');
        this.ui = new GameUI();
        this.timer = new FlipTimer((time) => this.ui.updateFlipTimer(time));
        this.leaderboard = new Leaderboard();
        
        this.flippedTiles = [];
        this.isProcessing = false;
        this.moveCount = 0;
        this.matchCount = 0;
        this.flipDuration = 1000;
        this.gameStarted = false;
        this.selectedApi = 'cats';

        this.board = new Board(this.boardSize, this.container, this.handleTileClick.bind(this));

        this.setupEventListeners();
        this.loadUserPreferences();
        this.checkAuthenticationStatus();
    }

    setupEventListeners() {
        this.ui.onStartButtonClick(() => this.startGame());
        this.ui.onResetButtonClick(() => this.resetGame());
        this.ui.onColorChange((color) => this.changeCardColor(color));
        this.ui.onBoardSizeChange((newSize) => this.handleBoardSizeChange(newSize));
        this.ui.onApiChange((api) => this.handleApiChange(api));
    }

    checkAuthenticationStatus() {
        const token = localStorage.getItem('jwt_token');
        if (token && window.JWTUtils) {
            const expiration = window.JWTUtils.getTokenExpiration(token);
            if (expiration) {
                const timeUntilExpiration = expiration.getTime() - Date.now();
                const minutesUntilExpiration = Math.floor(timeUntilExpiration / (1000 * 60));
                
                // Show warning if token expires in less than 10 minutes
                if (minutesUntilExpiration <= 10 && minutesUntilExpiration > 0) {
                    this.showSessionWarning(minutesUntilExpiration);
                }
            }
        }
    }

    showSessionWarning(minutesLeft) {
        const warning = document.createElement('div');
        warning.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            background-color: #f39c12;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            z-index: 10000;
            font-family: Arial, sans-serif;
            max-width: 300px;
        `;
        warning.textContent = `Je sessie verloopt over ${minutesLeft} minuten. Log opnieuw in om door te spelen.`;
        document.body.appendChild(warning);
        
        // Remove warning after 5 seconds
        setTimeout(() => {
            if (warning.parentNode) {
                warning.parentNode.removeChild(warning);
            }
        }, 5000);
    }

    loadUserPreferences() {
        // Load preferences from localStorage
        const savedPreferences = localStorage.getItem('user_preferences');
        if (savedPreferences) {
            try {
                const preferences = JSON.parse(savedPreferences);
                
                // Apply API preference
                if (preferences.api) {
                    this.selectedApi = preferences.api;
                    if (this.ui.apiSelect) {
                        this.ui.apiSelect.value = preferences.api;
                    }
                }
                
                // Apply color preferences
                if (preferences.color_closed) {
                    this.ui.updateCardColor(preferences.color_closed);
                    if (this.ui.colorPicker) {
                        this.ui.colorPicker.value = preferences.color_closed;
                    }
                }
                
                if (preferences.color_found) {
                    // Store matched color preference for use in board
                    this.matchedColor = preferences.color_found;
                }
            } catch (error) {
                console.error('Error loading preferences:', error);
            }
        }
    }

    async startGame() {
        if (this.gameStarted) return;

        this.gameStarted = true;
        this.ui.setStartButtonEnabled(false);
        this.ui.setResetButtonEnabled(true);

        await this.initialize();
    }

    async resetGame() {
        this.container.innerHTML = '';
        this.flippedTiles = [];
        this.isProcessing = false;
        this.moveCount = 0;
        this.matchCount = 0;
        this.timer.reset();

        this.board = new Board(this.boardSize, this.container, this.handleTileClick.bind(this));

        this.ui.setStartButtonEnabled(true);
        this.ui.setResetButtonEnabled(false);
        this.gameStarted = false;
    }

    changeCardColor(color) {
        this.ui.updateCardColor(color);
        this.board?.updateAllTilesColor(color);
    }

    handleApiChange(api) {
        this.selectedApi = api;
        if (this.gameStarted) {
            this.resetGame();
            this.startGame();
        }
    }

    async handleBoardSizeChange(newSize) {
        this.boardSize = newSize;
        await this.resetGame();
        if (this.gameStarted) {
            await this.initialize();
        }
    }

    async initialize() {
        if (!this.container) {
            console.error('Cannot initialize game: container element not found.');
            return;
        }

        const uniqueImagesNeeded = (this.boardSize * this.boardSize) / 2;
        const imageUrls = await ImageService.fetchImages(uniqueImagesNeeded, this.selectedApi);
        
        this.board.initialize(imageUrls, this.matchedColor);
        
        this.flippedTiles = [];
        this.isProcessing = false;
        this.moveCount = 0;
        this.matchCount = 0;
    }

    handleTileClick(tile) {
        if (this.isProcessing || this.flippedTiles.length >= 2 || !this.gameStarted) {
            return;
        }

        tile.flip();
        this.flippedTiles.push(tile);

        if (this.flippedTiles.length === 1) {
            this.timer.start();
        }

        if (this.flippedTiles.length === 2) {
            this.moveCount++;
            this.isProcessing = true;

            setTimeout(() => {
                const [tile1, tile2] = this.flippedTiles;

                if (tile1.imageUrl === tile2.imageUrl) {
                    tile1.match();
                    tile2.match();
                    this.matchCount++;

                    if (this.board.allTilesMatched()) {
                        this.gameComplete();
                    }
                } else {
                    tile1.hide();
                    tile2.hide();
                }

                this.flippedTiles = [];
                this.isProcessing = false;
                this.timer.reset();
            }, this.flipDuration);
        }
    }

    gameComplete() {
        const time = this.timer.time;
        this.leaderboard.addEntry(this.boardSize, this.moveCount, time);
        
        const topScore = this.leaderboard.getTopScore(this.boardSize);
        let message = `you completed the game in ${this.moveCount} moves`;
        
        if (topScore && topScore.moves === this.moveCount) {
            message += "\nnew high score!";
        }
        
        alert(message);
    }
}

export default MemoryGame;