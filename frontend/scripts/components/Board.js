import { Tile } from './Tile.js';
import { BOARD_SIZES } from '../types.js';

/**
 * Board Component - Manages the game board and tiles
 */
export class Board {
    /**
     * @param {number} size - Board size (4 or 6)
     * @param {HTMLElement} container - Container element for the board
     * @param {function} onTileClick - Tile click handler
     */
    constructor(size, container, onTileClick) {
        this.size = size;
        this.container = container;
        this.onTileClick = onTileClick;
        this.tiles = [];
        
        this.validateSize();
        this.createBoardElement();
    }

    /**
     * Validates the board size
     */
    validateSize() {
        if (!BOARD_SIZES.includes(this.size)) {
            throw new Error(`Invalid board size: ${this.size}. Must be one of: ${BOARD_SIZES.join(', ')}`);
        }
    }

    /**
     * Creates the board DOM element
     */
    createBoardElement() {
        // Clear existing content
        this.container.innerHTML = '';
        
        // Create board element
        this.boardElement = document.createElement('div');
        this.boardElement.className = 'board';
        
        // Property binding: grid layout
        this.boardElement.style.gridTemplateColumns = `repeat(${this.size}, 1fr)`;
        this.boardElement.style.gridTemplateRows = `repeat(${this.size}, 1fr)`;
        
        // Directive: responsive grid
        this.boardElement.dataset.size = this.size.toString();
        
        this.container.appendChild(this.boardElement);
    }

    /**
     * Initializes the board with images
     * @param {string[]} imageUrls - Array of image URLs
     * @param {string} matchedColor - Color for matched tiles
     */
    initialize(imageUrls, matchedColor = '#2ecc71') {
        this.destroyTiles();
        
        // Create pairs of tiles
        const tilePairs = [];
        for (let i = 0; i < imageUrls.length; i++) {
            tilePairs.push(imageUrls[i], imageUrls[i]); // Each image appears twice
        }
        
        // Shuffle the tiles
        this.shuffleArray(tilePairs);
        
        // Create tile components
        this.tiles = tilePairs.map((imageUrl, index) => {
            const tile = new Tile(index, imageUrl, this.boardElement, this.onTileClick);
            this.boardElement.appendChild(tile.element);
            return tile;
        });
        
        // Property binding: matched color
        this.matchedColor = matchedColor;
        this.updateMatchedColor();
    }

    /**
     * Shuffles an array using Fisher-Yates algorithm
     * @param {Array} array - Array to shuffle
     */
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    /**
     * Updates the color for all matched tiles
     */
    updateMatchedColor() {
        this.tiles.forEach(tile => {
            if (tile.isMatched) {
                tile.updateColor(this.matchedColor);
            }
        });
    }

    /**
     * Updates the color for all tiles
     * @param {string} color - New color
     */
    updateAllTilesColor(color) {
        this.tiles.forEach(tile => {
            tile.updateColor(color);
        });
    }

    /**
     * Checks if all tiles are matched
     * @returns {boolean} True if all tiles are matched
     */
    allTilesMatched() {
        return this.tiles.every(tile => tile.isMatched);
    }

    /**
     * Gets the number of matched tiles
     * @returns {number} Number of matched tiles
     */
    getMatchedCount() {
        return this.tiles.filter(tile => tile.isMatched).length;
    }

    /**
     * Gets the number of flipped tiles
     * @returns {number} Number of flipped tiles
     */
    getFlippedCount() {
        return this.tiles.filter(tile => tile.isFlipped && !tile.isMatched).length;
    }

    /**
     * Resets all tiles to their initial state
     */
    reset() {
        this.tiles.forEach(tile => {
            tile.isFlipped = false;
            tile.isMatched = false;
            tile.updateTileClasses();
            tile.element.style.transform = 'rotateY(0deg)';
            tile.element.style.opacity = '1';
        });
    }

    /**
     * Destroys all tile components
     */
    destroyTiles() {
        this.tiles.forEach(tile => tile.destroy());
        this.tiles = [];
    }

    /**
     * Gets the current board state
     * @returns {Object} Board state object
     */
    getState() {
        return {
            size: this.size,
            tiles: this.tiles.map(tile => tile.getState()),
            matchedCount: this.getMatchedCount(),
            flippedCount: this.getFlippedCount()
        };
    }

    /**
     * Gets a tile by its ID
     * @param {number} id - Tile ID
     * @returns {Tile|null} Tile component or null if not found
     */
    getTileById(id) {
        return this.tiles.find(tile => tile.id === id) || null;
    }

    /**
     * Gets all flipped tiles
     * @returns {Tile[]} Array of flipped tiles
     */
    getFlippedTiles() {
        return this.tiles.filter(tile => tile.isFlipped && !tile.isMatched);
    }

    /**
     * Gets all matched tiles
     * @returns {Tile[]} Array of matched tiles
     */
    getMatchedTiles() {
        return this.tiles.filter(tile => tile.isMatched);
    }
} 