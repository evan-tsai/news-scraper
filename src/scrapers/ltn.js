import models from '../models';
import { getSelectorFromArray } from '../helpers/common';

const Parser = require('rss-parser');
const parser = new Parser();

export default class {
    constructor(page) {
        this.page = page;
        this.source = 'ltn';
        this.removeTags = ['script', 'style', 'a', 'iframe', '.author', 'h1', '.boxTitle.ad'];
    }

    async getSites(type) {
        const latest = await models.Article.findOne({ source: this.source, type }).sort({ date: -1 }).select('date');
        const feed = await parser.parseURL(`https://news.ltn.com.tw/rss/${type}.xml`);
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
        const titleSelectors = [
            'div.articlebody > h1',
            'div.news_content > h1',
            'div.conbox > h1'
        ];
    
        const getInnerText = item => item.innerText;
        return await getSelectorFromArray(this.page, titleSelectors, getInnerText);
    }

    async getContent() {
        return await this.page.$eval('div[itemprop=articleBody]', div => {
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