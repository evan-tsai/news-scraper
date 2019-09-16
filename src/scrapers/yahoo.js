export default class {
    constructor(page) {
        this.page = page;
        this.source = 'yahoo';
        this.restrictedTags = [];
        this.contentQuery = 'div.canvas-body';
    }

    getUrl(type) {
        return `https://tw.news.yahoo.com/rss/${type}`;
    }

    async getTitle() {
        return this.page.$eval('header.canvas-header > h1', item => item.innerText);
    }

    async getContent() {
        return await this.page.$eval(this.contentQuery, div => {
            let removeElement = false;
            div.querySelectorAll('*').forEach(element => {
                if (element.innerText !== undefined && ((element.innerText.includes('更多') && element.innerText.includes('新聞') && element.innerText.includes('報導')))) {
                    removeElement = true;
                }

                if (element.getAttribute('content') !== null && element.getAttribute('content').includes('原始連結')) {
                    element.remove();
                }

                if (removeElement) element.remove();
            });
            return div.innerHTML.trim();
        });
    }
}