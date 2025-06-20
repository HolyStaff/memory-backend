import Tile from './tile.js';

class Board {
    constructor(size, container, onTileClick) {
        this.size = size;
        this.container = container;
        this.tiles = [];
        this.onTileClick = onTileClick;
    }

    initialize(imageUrls) {
        if (!this.container) {
            console.error('Board container is null or undefined');
            return;
        }

        this.container.innerHTML = '';
        this.tiles = [];
        console.log('Container cleared');

        const pairs = [];
        for (let i = 0; i < (this.size * this.size) / 2; i++) {
            const imageUrl = imageUrls[i % imageUrls.length];
            pairs.push(imageUrl);
            pairs.push(imageUrl);
        }

        this.shuffleArray(pairs);

        for (let i = 0; i < this.size * this.size; i++) {
            const tile = new Tile(i, pairs[i], this.onTileClick);
            this.tiles.push(tile);
            const tileElement = tile.createElement();
            this.container.appendChild(tileElement);
        }

        this.container.style.display = 'grid';
        this.container.style.gridTemplateColumns = `repeat(${this.size}, 1fr)`;
        this.container.style.gridTemplateRows = `repeat(${this.size}, 1fr)`;

        const initialColor = getComputedStyle(document.documentElement)
            .getPropertyValue('--card-back-color').trim();
        this.updateAllTilesColor(initialColor);
    }


    updateAllTilesColor(color) {
        this.tiles.forEach(tile => tile.updateBackColor(color));
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    getFlippedTiles() {
        return this.tiles.filter(tile => tile.state === 'flipped');
    }

    allTilesMatched() {
        return this.tiles.every(tile => tile.state === 'matched');
    }
}

export default Board;
