import models from '../models';

const Parser = require('rss-parser');
const parser = new Parser();

export default class {
    constructor(page) {
        this.page = page;
        this.source = 'yahoo';
        this.removeTags = ['script', 'style', 'a', 'iframe', 'h1'];
    }

    async getSites(type) {
        const latest = await models.Article.findOne({ source: this.source, type }).sort({ date: -1 }).select('date');
        const feed = await parser.parseURL(`https://tw.news.yahoo.com/rss/${type}`);
        let sites = feed.items.map(item => {
            return {
                link: item.link,
                pubDate: new Date(item.pubDate),
            }
        });
        if (latest) sites = sites.filter(item => item.pubDate > latest.date);
    
        return sites;
    }

    async getTitle() {
        return this.page.$eval('header.canvas-header > h1', item => item.innerText);
    }

    async getContent() {
        return await this.page.$eval('div.canvas-body', div => {
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