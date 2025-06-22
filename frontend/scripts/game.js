import Board from './board.js';
import { GameUI } from './ui.js';
import { GameTimer, FlipTimer } from './timer.js';
import { ImageService } from './imageService.js';
import { Leaderboard } from './leaderboard.js';

class MemoryGame {
    constructor(boardSize = 4) {
        this.boardSize = boardSize;
        this.container = document.getElementById('grid-container');
        this.ui = new GameUI();
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
        this.initializeTimers();
    }

    initializeTimers() {
        this.gameTimer = new GameTimer();
        this.flipTimer = new FlipTimer(3000); // 3 seconds for tile flip
        this.flipTimer.onComplete = () => this.handleFlipTimerComplete();
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

        setTimeout(() => {
            if (warning.parentNode) {
                warning.parentNode.removeChild(warning);
            }
        }, 5000);
    }

    loadUserPreferences() {
        const savedPreferences = localStorage.getItem('user_preferences');
        if (savedPreferences) {
            try {
                const preferences = JSON.parse(savedPreferences);

                if (preferences.api) {
                    this.selectedApi = preferences.api;
                    if (this.ui.apiSelect) {
                        this.ui.apiSelect.value = preferences.api;
                    }
                }

                if (preferences.color_closed) {
                    this.ui.updateCardColor(preferences.color_closed);
                    if (this.ui.colorPicker) {
                        this.ui.colorPicker.value = preferences.color_closed;
                    }
                }
                
                if (preferences.color_found) {
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
        this.gameTimer.start();
        this.ui.showGameTimer();
        this.ui.hideStartButton();
        this.ui.showGameControls();
        this.ui.setResetButtonEnabled(true);

        await this.initialize();
    }

    async resetGame() {
        this.container.innerHTML = '';
        this.flippedTiles = [];
        this.isProcessing = false;
        this.moveCount = 0;
        this.matchCount = 0;
        
        // Reset timers
        this.gameTimer.reset();
        this.flipTimer.reset();

        this.gameTimer.updateDisplay();
        this.flipTimer.updateDisplay();

        this.board = new Board(this.boardSize, this.container, this.handleTileClick.bind(this));

        this.ui.setStartButtonEnabled(true);
        this.ui.setResetButtonEnabled(false);
        this.ui.showStartButton();
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
            this.ui.showFlipTimer();
            this.flipTimer.reset();
        }

        if (this.flippedTiles.length === 2) {
            this.moveCount++;
            this.isProcessing = true;

            const [tile1, tile2] = this.flippedTiles;

            if (tile1.imageUrl === tile2.imageUrl) {
                setTimeout(() => {
                    tile1.match();
                    tile2.match();
                    this.matchCount++;

                    if (this.board.allTilesMatched()) {
                        this.gameComplete();
                    }

                    this.flippedTiles = [];
                    this.isProcessing = false;
                    this.flipTimer.reset();
                }, 500);
            } else {
                this.flipTimer.start();
            }
        }
    }

    handleFlipTimerComplete() {
        if (this.flippedTiles.length === 2) {
            const [tile1, tile2] = this.flippedTiles;
            tile1.hide();
            tile2.hide();
            
            this.flippedTiles = [];
            this.isProcessing = false;
            this.flipTimer.reset();
        }
    }

    gameComplete() {
        this.gameTimer.stop();
        const time = this.gameTimer.getTime();

        const colorFound = this.matchedColor || '#2ecc71';
        const colorClosed = getComputedStyle(document.documentElement)
            .getPropertyValue('--card-back-color').trim() || '#3498db';

        this.leaderboard.addEntry(
            this.boardSize, 
            this.moveCount, 
            time, 
            this.selectedApi, 
            colorFound, 
            colorClosed
        );
        
        const topScore = this.leaderboard.getTopScore(this.boardSize);
        let message = `Je hebt het spel voltooid in ${this.moveCount} zetten in ${this.gameTimer.formatTime(time)}`;
        
        if (topScore && topScore.moves === this.moveCount) {
            message += "\nNieuwe high score!";
        }
        
        alert(message);
    }
}

export default MemoryGame;