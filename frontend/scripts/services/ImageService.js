import { IMAGE_APIS } from '../types.js';

/**
 * Image Service - Handles fetching images from various APIs
 */
export class ImageService {
    /**
     * @type {Object} API configurations
     */
    static API_CONFIGS = {
        cats: {
            baseUrl: 'https://cataas.com/cat',
            params: { width: 200, height: 200 },
            transform: (data) => `https://cataas.com/cat/${data._id}?width=200&height=200`
        },
        picsum: {
            baseUrl: 'https://picsum.photos',
            params: { width: 200, height: 200 },
            transform: (data) => `https://picsum.photos/200/200?random=${data.id}`
        },
        dogs: {
            baseUrl: 'https://dog.ceo/api/breeds/image/random',
            params: {},
            transform: (data) => data.message
        }
    };

    /**
     * Fetches images from the specified API
     * @param {number} count - Number of images to fetch
     * @param {string} apiType - API type ('cats', 'picsum', 'dogs')
     * @returns {Promise<string[]>} Array of image URLs
     */
    static async fetchImages(count, apiType = 'cats') {
        try {
            this.validateApiType(apiType);
            
            const config = this.API_CONFIGS[apiType];
            const imageUrls = [];
            
            // Fetch images in parallel
            const promises = Array.from({ length: count }, () => 
                this.fetchSingleImage(config, apiType)
            );
            
            const results = await Promise.allSettled(promises);
            
            // Filter successful results
            results.forEach(result => {
                if (result.status === 'fulfilled' && result.value) {
                    imageUrls.push(result.value);
                }
            });
            
            // If we don't have enough images, try to fetch more
            if (imageUrls.length < count) {
                const remaining = count - imageUrls.length;
                const additionalPromises = Array.from({ length: remaining }, () => 
                    this.fetchSingleImage(config, apiType)
                );
                
                const additionalResults = await Promise.allSettled(additionalPromises);
                additionalResults.forEach(result => {
                    if (result.status === 'fulfilled' && result.value) {
                        imageUrls.push(result.value);
                    }
                });
            }
            
            return imageUrls.slice(0, count);
            
        } catch (error) {
            console.error(`Error fetching images from ${apiType}:`, error);
            return this.getFallbackImages(count);
        }
    }

    /**
     * Fetches a single image from the API
     * @param {Object} config - API configuration
     * @param {string} apiType - API type
     * @returns {Promise<string>} Image URL
     */
    static async fetchSingleImage(config, apiType) {
        try {
            const response = await fetch(config.baseUrl);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return config.transform(data);
            
        } catch (error) {
            console.error(`Error fetching single image from ${apiType}:`, error);
            return null;
        }
    }

    /**
     * Validates the API type
     * @param {string} apiType - API type to validate
     * @throws {Error} If API type is invalid
     */
    static validateApiType(apiType) {
        if (!Object.keys(IMAGE_APIS).includes(apiType)) {
            throw new Error(`Invalid API type: ${apiType}. Valid types: ${Object.keys(IMAGE_APIS).join(', ')}`);
        }
    }

    /**
     * Gets fallback images when API fails
     * @param {number} count - Number of fallback images needed
     * @returns {string[]} Array of fallback image URLs
     */
    static getFallbackImages(count) {
        const fallbackImages = [
            'https://via.placeholder.com/200x200/3498db/ffffff?text=Cat+1',
            'https://via.placeholder.com/200x200/e74c3c/ffffff?text=Cat+2',
            'https://via.placeholder.com/200x200/2ecc71/ffffff?text=Cat+3',
            'https://via.placeholder.com/200x200/f39c12/ffffff?text=Cat+4',
            'https://via.placeholder.com/200x200/9b59b6/ffffff?text=Cat+5',
            'https://via.placeholder.com/200x200/1abc9c/ffffff?text=Cat+6',
            'https://via.placeholder.com/200x200/34495e/ffffff?text=Cat+7',
            'https://via.placeholder.com/200x200/e67e22/ffffff?text=Cat+8',
            'https://via.placeholder.com/200x200/95a5a6/ffffff?text=Cat+9',
            'https://via.placeholder.com/200x200/16a085/ffffff?text=Cat+10',
            'https://via.placeholder.com/200x200/27ae60/ffffff?text=Cat+11',
            'https://via.placeholder.com/200x200/2980b9/ffffff?text=Cat+12',
            'https://via.placeholder.com/200x200/8e44ad/ffffff?text=Cat+13',
            'https://via.placeholder.com/200x200/f1c40f/ffffff?text=Cat+14',
            'https://via.placeholder.com/200x200/e67e22/ffffff?text=Cat+15',
            'https://via.placeholder.com/200x200/3498db/ffffff?text=Cat+16',
            'https://via.placeholder.com/200x200/e74c3c/ffffff?text=Cat+17',
            'https://via.placeholder.com/200x200/2ecc71/ffffff?text=Cat+18'
        ];
        
        return fallbackImages.slice(0, count);
    }

    /**
     * Gets available API types
     * @returns {string[]} Array of available API types
     */
    static getAvailableApis() {
        return Object.keys(IMAGE_APIS);
    }

    /**
     * Gets API display name
     * @param {string} apiType - API type
     * @returns {string} Display name for the API
     */
    static getApiDisplayName(apiType) {
        return IMAGE_APIS[apiType] || apiType;
    }

    /**
     * Preloads images for better performance
     * @param {string[]} imageUrls - Array of image URLs to preload
     * @returns {Promise<void>}
     */
    static async preloadImages(imageUrls) {
        const promises = imageUrls.map(url => {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => resolve();
                img.onerror = () => resolve(); // Don't fail on error
                img.src = url;
            });
        });
        
        await Promise.all(promises);
    }
} 