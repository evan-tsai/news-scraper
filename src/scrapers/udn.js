export default class {
    constructor(page) {
        this.page = page;
        this.source = 'udn';
        this.restrictedTags = ['#story_art_title', '#story_bar', '#story_bady_info'];
        this.contentQuery = this.type === 'entertainment' ? 'div#story' : 'div#story_body_content';
    }

    getUrl(type) {
        switch (type) {
            case 'world':
                return 'https://udn.com/rssfeed/news/2/7225?ch=news';
            case 'sports':
                return 'https://udn.com/rssfeed/news/2/7227?ch=news';
            case 'entertainment':
                return 'https://stars.udn.com/rss/news/1022/10088';
            case 'lifestyle':
                return 'https://udn.com/rssfeed/news/2/6649?ch=news';
        }
    }

    async getTitle() {
        return await this.page.$eval('h1.story_art_title', item => item.innerText); 
    }

    async getContent() {
        return await this.page.$eval(this.contentQuery, div => {
            let removeElement = false;
            div.querySelectorAll('*').forEach(element => {
                if (element.id === 'story_tags') {
                    removeElement = true;
                }

                if (removeElement) element.remove();
            });
            return div.innerHTML.trim();
        });
    }
}