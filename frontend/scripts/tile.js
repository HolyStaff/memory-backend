class Tile {
    constructor(id, imageUrl, onClickCallback) {
        this.id = id;
        this.imageUrl = imageUrl;
        this.state = 'hidden'; // hidden, flipped, matched
        this.element = null;
        this.onClickCallback = onClickCallback;
        this.backFace = null; // Store reference to back face
    }

    createElement() {

        const tile = document.createElement('div');
        tile.classList.add('tile');
        tile.dataset.id = this.id;

        // Create front face (the image)
        const frontFace = document.createElement('div');
        frontFace.classList.add('tile-front');
        const img = document.createElement('img');
        img.src = this.imageUrl;
        img.alt = 'Tile image';
        frontFace.appendChild(img);

        // Create back face (the cover)
        const backFace = document.createElement('div');
        backFace.classList.add('tile-back');
        this.backFace = backFace; // Store reference to back face

        // Add faces to tile
        tile.appendChild(frontFace);
        tile.appendChild(backFace);

        // Add click event
        tile.addEventListener('click', () => {
            if (this.state === 'hidden') {
                this.onClickCallback(this);
            }
        });

        this.element = tile;
        return tile;
    }

    // Add method to update back color
    updateBackColor(color) {
        if (this.backFace) {
            this.backFace.style.backgroundColor = color;
            this.backFace.style.backgroundImage = `linear-gradient(135deg, ${color}, color-mix(in srgb, ${color} 80%, black))`;
        }
    }

    flip() {
        if (this.state === 'hidden') {
            this.state = 'flipped';
            this.element.classList.add('flipped');
        }
    }

    hide() {
        if (this.state === 'flipped') {
            this.state = 'hidden';
            this.element.classList.remove('flipped');
        }
    }

    match() {
        this.state = 'matched';
        this.element.classList.add('matched');
    }
}

export default Tile;
