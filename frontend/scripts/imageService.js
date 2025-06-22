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
        try {
            const images = [];
            for (let i = 0; i < count; i++) {
                const timestamp = new Date().getTime() + i;
                images.push(`https://cataas.com/cat?type=square&t=${timestamp}`);
            }
            return images;
        } catch (error) {
            console.error('Error fetching cat images:', error);
            return this.getFallbackImages(count);
        }
    }

    static async fetchPicsumImages(count) {
        try {
            const images = [];
            for (let i = 0; i < count; i++) {
                const seed = Math.floor(Math.random() * 1000);
                images.push(`https://picsum.photos/seed/${seed}/200/200`);
            }
            return images;
        } catch (error) {
            console.error('Error fetching picsum images:', error);
            return this.getFallbackImages(count);
        }
    }

    static async fetchDogImages(count) {
        try {
            const images = [];
            for (let i = 0; i < count; i++) {
                const response = await fetch('https://dog.ceo/api/breeds/image/random');
                const data = await response.json();
                if (data.status === 'success') {
                    images.push(data.message);
                } else {
                    images.push('https://images.dog.ceo/breeds/retriever-golden/n02099601_1024.jpg');
                }
            }
            return images;
        } catch (error) {
            console.error('Error fetching dog images:', error);
            return this.getFallbackImages(count);
        }
    }

    static getFallbackImages(count) {

        const emojis = [
            '🐱', '🐶', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷',
            '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🦆', '🦉', '🦄', '🐝',
            '🐛', '🦋', '🐌', '🐞', '🐢', '🐍', '🦖', '🦕', '🐙', '🦑',
            '🦞', '🦀', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐊', '🐅',
            '🐆', '🦓', '🦍', '🦧', '🐘', '🦛', '🦏', '🐪', '🐫', '🦒',
            '🦘', '🦬', '🐃', '🐂', '🐄', '🐎', '🐖', '🐏', '🐑', '🦙',
            '🐐', '🦌', '🐕', '🐩', '🦮', '🐕‍🦺', '🐈', '🐓', '🦃', '🦚',
            '🦜', '🦢', '🦩', '🕊', '🐇', '🦝', '🦨', '🦡', '🦦', '🦥',
            '🐁', '🐀', '🐿', '🦔'
        ];
        const fallbackEmojis = [];
        for (let i = 0; i < count; i++) {
            const randomIndex = Math.floor(Math.random() * emojis.length);
            fallbackEmojis.push(emojis[randomIndex]);
        }
        return fallbackEmojis;
    }

    static getApiDisplayNames() {
        return {
            [this.APIs.CATS]: 'Cats',
            [this.APIs.PICSUM]: 'Random Photos',
            [this.APIs.DOGS]: 'Dogs'
        };
    }
} 