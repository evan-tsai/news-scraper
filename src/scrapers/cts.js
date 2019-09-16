export default class {
    constructor(page) {
        this.page = page;
        this.source = 'cts';
        this.restrictedTags = ['#video_container', '.news-src', '#div-gpt-ad-scroll_320x480-0'];
        this.contentQuery = 'div.artical-content';
    }

    getUrl(type) {
        switch (type) {
            case 'lifestyle':
                type = 'life';
                break;
            case 'entertainment':
                type = 'entertain';
                break;
            case 'world':
                type = 'international';
                break;
        }

        return `https://news.cts.com.tw/rss/${type}.xml`;
    }

    async getTitle() {
        return await this.page.$eval('h1.artical-title', item => item.innerText); 
    }

    async getContent() {
        return await this.page.$eval(this.contentQuery, div => {
            let removeElement = false;
            div.querySelectorAll('*').forEach(element => {
                if (element.innerText !== undefined && (element.innerText.includes('相關新聞') || element.innerText.includes('想看更多新聞嗎') || element.dataset.desc === '相關新聞')) {
                    removeElement = true;
                }
                
                if (removeElement) element.remove();
            });
            return div.innerHTML.trim();
        });
    }
}