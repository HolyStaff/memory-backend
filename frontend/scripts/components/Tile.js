import { GAME_CONFIG } from '../types.js';

/**
 * Tile Component - Represents a single memory game tile
 */
export class Tile {
    /**
     * @param {number} id - Unique identifier for the tile
     * @param {string} imageUrl - URL of the tile's image
     * @param {HTMLElement} container - Container element for the tile
     * @param {function} onClick - Click handler function
     */
    constructor(id, imageUrl, container, onClick) {
        this.id = id;
        this.imageUrl = imageUrl;
        this.isFlipped = false;
        this.isMatched = false;
        this.container = container;
        this.onClick = onClick;
        
        this.element = this.createTileElement();
        this.bindEvents();
    }

    /**
     * Creates the tile DOM element
     * @returns {HTMLElement} The created tile element
     */
    createTileElement() {
        const tile = document.createElement('div');
        tile.className = 'tile';
        tile.dataset.tileId = this.id;
        
        // Property binding for tile state
        this.updateTileClasses();
        
        // Create tile content
        const front = document.createElement('div');
        front.className = 'tile-front';
        
        const back = document.createElement('div');
        back.className = 'tile-back';
        
        const img = document.createElement('img');
        img.src = this.imageUrl;
        img.alt = 'Tile image';
        img.loading = 'lazy';
        
        back.appendChild(img);
        tile.appendChild(front);
        tile.appendChild(back);
        
        return tile;
    }

    /**
     * Binds event listeners to the tile
     */
    bindEvents() {
        this.element.addEventListener('click', () => {
            if (!this.isMatched && !this.isFlipped) {
                this.onClick(this);
            }
        });
    }

    /**
     * Updates tile CSS classes based on current state
     */
    updateTileClasses() {
        // Directive: conditional class binding
        this.element.classList.toggle('flipped', this.isFlipped);
        this.element.classList.toggle('matched', this.isMatched);
        
        // Property binding: data attributes
        this.element.dataset.flipped = this.isFlipped.toString();
        this.element.dataset.matched = this.isMatched.toString();
    }

    /**
     * Flips the tile to show its image
     */
    flip() {
        if (this.isMatched) return;
        
        this.isFlipped = true;
        this.updateTileClasses();
        
        // Directive: animation
        this.element.style.transform = 'rotateY(180deg)';
    }

    /**
     * Hides the tile (flips it back)
     */
    hide() {
        if (this.isMatched) return;
        
        this.isFlipped = false;
        this.updateTileClasses();
        
        // Directive: animation
        this.element.style.transform = 'rotateY(0deg)';
    }

    /**
     * Marks the tile as matched
     */
    match() {
        this.isMatched = true;
        this.isFlipped = true;
        this.updateTileClasses();
        
        // Directive: matched state styling
        this.element.style.transform = 'rotateY(180deg)';
        this.element.style.opacity = '0.7';
    }

    /**
     * Updates the tile's color
     * @param {string} color - CSS color value
     */
    updateColor(color) {
        // Property binding: style binding
        this.element.style.setProperty('--tile-color', color);
    }

    /**
     * Removes the tile from the DOM
     */
    destroy() {
        if (this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }

    /**
     * Gets the current state of the tile
     * @returns {Object} Tile state object
     */
    getState() {
        return {
            id: this.id,
            imageUrl: this.imageUrl,
            isFlipped: this.isFlipped,
            isMatched: this.isMatched
        };
    }
} 