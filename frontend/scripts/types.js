// Game Types and Classes

/**
 * @typedef {Object} Tile
 * @property {number} id - Unique identifier for the tile
 * @property {string} imageUrl - URL of the tile's image
 * @property {boolean} isFlipped - Whether the tile is currently flipped
 * @property {boolean} isMatched - Whether the tile has been matched
 * @property {HTMLElement} element - DOM element of the tile
 * @property {function} flip - Function to flip the tile
 * @property {function} hide - Function to hide the tile
 * @property {function} match - Function to mark tile as matched
 * @property {function} updateColor - Function to update tile color
 */

/**
 * @typedef {Object} GameState
 * @property {number} boardSize - Size of the game board
 * @property {boolean} isStarted - Whether the game has started
 * @property {boolean} isProcessing - Whether the game is processing a move
 * @property {number} moveCount - Number of moves made
 * @property {number} matchCount - Number of matches found
 * @property {string} selectedApi - Selected image API
 * @property {Tile[]} flippedTiles - Currently flipped tiles
 */

/**
 * @typedef {Object} TimerState
 * @property {boolean} isRunning - Whether the timer is running
 * @property {number} timeLeft - Time remaining in milliseconds
 * @property {number} duration - Total duration in milliseconds
 */

/**
 * @typedef {Object} UserPreferences
 * @property {string} api - Preferred image API
 * @property {string} color_closed - Color for closed cards
 * @property {string} color_found - Color for matched cards
 * @property {number} board_size - Preferred board size
 */

/**
 * @typedef {Object} LeaderboardEntry
 * @property {number} [id] - Entry ID
 * @property {string} player_name - Player name
 * @property {number} board_size - Board size used
 * @property {number} time - Time taken in seconds
 * @property {number} moves - Number of moves made
 * @property {number} score - Calculated score
 * @property {string} [created_at] - Creation timestamp
 */

/**
 * @typedef {Object} ImageApiResponse
 * @property {string} url - Image URL
 * @property {string} [id] - Image ID
 * @property {string} [message] - API message
 */

/**
 * @typedef {'cats' | 'picsum' | 'dogs'} ImageApiType
 */

/**
 * @typedef {4 | 6} BoardSize
 */

/**
 * @typedef {Object} GameConfig
 * @property {BoardSize} boardSize - Board size
 * @property {number} flipDuration - Duration for tile flip in ms
 * @property {number} matchDelay - Delay before hiding matched tiles in ms
 * @property {ImageApiType} defaultApi - Default image API
 */

// Game Configuration
export const GAME_CONFIG = {
    boardSize: 4,
    flipDuration: 3000,
    matchDelay: 500,
    defaultApi: 'cats'
};

// Board Size Options
export const BOARD_SIZES = [4, 6];

// Image API Options
export const IMAGE_APIS = {
    cats: 'Cats',
    picsum: 'Random Photos', 
    dogs: 'Dogs'
}; 