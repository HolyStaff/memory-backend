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

        this.board = new Board(this.boardSize, this.container, this.handleTileClick.bind(this));

        this.setupEventListeners();
    }

    setupEventListeners() {
        this.ui.onStartButtonClick(() => this.startGame());
        this.ui.onResetButtonClick(() => this.resetGame());
        this.ui.onColorChange((color) => this.changeCardColor(color));
        this.ui.onBoardSizeChange((newSize) => this.handleBoardSizeChange(newSize));
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
        const imageUrls = await ImageService.fetchImages(uniqueImagesNeeded);
        
        this.board.initialize(imageUrls);
        
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