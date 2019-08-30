import models from '../models';

const Parser = require('rss-parser');
const parser = new Parser();

export default class {
    constructor(page) {
        this.page = page;
        this.source = 'udn';
        this.removeTags = ['script', 'a', 'iframe', 'h1', 'style', '#story_art_title', '#story_bar', '#story_bady_info'];
    }

    async getSites(type) {
        this.type = type;
        const latest = await models.Article.findOne({ source: this.source, type }).sort({ date: -1 }).select('date');
        let url;
        switch (type) {
            case 'world':
                url = 'https://udn.com/rssfeed/news/2/7225?ch=news';
                break;
            case 'sports':
                url = 'https://udn.com/rssfeed/news/2/7227?ch=news';
                break;
            case 'entertainment':
                url = 'https://stars.udn.com/rss/news/1022/10088';
                break;
            case 'lifestyle':
                url = 'https://udn.com/rssfeed/news/2/6649?ch=news';
                break;
        }
        const feed = await parser.parseURL(url);
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
        return await this.page.$eval('h1.story_art_title', item => item.innerText); 
    }

    async getContent() {
        const bodySelector = this.type === 'entertainment' ? 'div#story' : 'div#story_body_content';
        
        return await this.page.$eval(bodySelector, div => {
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