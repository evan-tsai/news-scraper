export default class {
    constructor(page) {
        this.page = page;
        this.source = 'sina';
        this.restrictedTags = [];
        this.contentQuery = 'div.pcont';
    }

    getUrl(type) {
        switch (type) {
            case 'lifestyle':
                type = 'life';
                break;
            case 'entertainment':
                type = 'ents';
                break;
            case 'world':
                type = 'global';
                break;
        }
        return `http://newsimgs.sina.tw/rss/${type}/tw.xml`;
    }

    async getTitle() {
        return await this.page.$eval('#articles h1', item => item.innerText); 
    }

    async getContent() {
        return await this.page.$eval(this.contentQuery, div => {
            let removeElement = false;
            div.querySelectorAll('*').forEach(element => {
                if (element.innerText !== undefined && (element.innerText.includes('原始連結'))) {
                    removeElement = true;
                }
                
                if (removeElement) element.remove();
            });
            return div.innerHTML.trim();
        });
    }
}