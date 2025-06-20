export class ImageService {
    static async fetchImages(count) {
        try {
            const images = [];
            for (let i = 0; i < count; i++) {
                const timestamp = new Date().getTime() + i;
                images.push(`https://cataas.com/cat?type=square&t=${timestamp}`);
            }
            return images;
        } catch (error) {
            console.error('Error fetching images:', error);
            return this.getFallbackImages(count);
        }
    }

    static getFallbackImages(count) {
        const fallbackImages = [];
        for (let i = 0; i < count; i++) {
            fallbackImages.push(`https://placekitten.com/${200 + i}/${200 + i}`);
        }
        return fallbackImages;
    }
} 