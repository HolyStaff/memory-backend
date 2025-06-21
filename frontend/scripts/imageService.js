export class ImageService {
    static APIs = {
        CATS: 'cats',
        PICSUM: 'picsum',
        DOGS: 'dogs'
    };

    static async fetchImages(count, apiType = this.APIs.CATS) {
        try {
            const images = [];
            
            switch (apiType) {
                case this.APIs.CATS:
                    return this.fetchCatImages(count);
                case this.APIs.PICSUM:
                    return this.fetchPicsumImages(count);
                case this.APIs.DOGS:
                    return this.fetchDogImages(count);
                default:
                    return this.fetchCatImages(count);
            }
        } catch (error) {
            console.error('Error fetching images:', error);
            return this.getFallbackImages(count);
        }
    }

    static async fetchCatImages(count) {
        const images = [];
        for (let i = 0; i < count; i++) {
            const timestamp = new Date().getTime() + i;
            images.push(`https://cataas.com/cat?type=square&t=${timestamp}`);
        }
        return images;
    }

    static async fetchPicsumImages(count) {
        const images = [];
        for (let i = 0; i < count; i++) {
            // Use random seed to get different images
            const seed = Math.floor(Math.random() * 1000);
            images.push(`https://picsum.photos/seed/${seed}/200/200`);
        }
        return images;
    }

    static async fetchDogImages(count) {
        try {
            const images = [];
            const usedBreeds = new Set();
            
            for (let i = 0; i < count; i++) {
                // Get a random dog image
                const response = await fetch('https://dog.ceo/api/breeds/image/random');
                const data = await response.json();
                
                if (data.status === 'success') {
                    images.push(data.message);
                } else {
                    // Fallback to a specific breed if random fails
                    images.push('https://images.dog.ceo/breeds/retriever-golden/n02099601_1024.jpg');
                }
            }
            return images;
        } catch (error) {
            console.error('Error fetching dog images:', error);
            // Fallback to a specific dog image
            const fallbackImages = [];
            for (let i = 0; i < count; i++) {
                fallbackImages.push('https://images.dog.ceo/breeds/retriever-golden/n02099601_1024.jpg');
            }
            return fallbackImages;
        }
    }

    static getFallbackImages(count) {
        const fallbackImages = [];
        for (let i = 0; i < count; i++) {
            fallbackImages.push(`https://placekitten.com/${200 + i}/${200 + i}`);
        }
        return fallbackImages;
    }

    static getApiDisplayNames() {
        return {
            [this.APIs.CATS]: 'Cats',
            [this.APIs.PICSUM]: 'Random Photos',
            [this.APIs.DOGS]: 'Dogs'
        };
    }
} 