import models from '../models';

const Parser = require('rss-parser');
const parser = new Parser();

export default class {
    constructor(page) {
        this.page = page;
        this.source = 'cts';
        this.restrictedTags = ['#video_container', '.news-src', '#div-gpt-ad-scroll_320x480-0'];
        this.contentQuery = 'div.artical-content';
    }

    async getSites(type) {
        const latest = await models.Article.findOne({ source: this.source, type }).sort({ date: -1 }).select('date');
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
        const feed = await parser.parseURL(`https://news.cts.com.tw/rss/${type}.xml`);
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