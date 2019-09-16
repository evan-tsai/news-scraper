import { getSelectorFromArray } from '../helpers/common';

export default class {
    constructor(page) {
        this.page = page;
        this.source = 'ltn';
        this.restrictedTags = ['.author', '.boxTitle.ad'];
        this.contentQuery = 'div[itemprop=articleBody]';
    }

    getUrl(type) {
        type = type === 'lifestyle' ? 'novelty' : type;
        return `https://news.ltn.com.tw/rss/${type}.xml`;
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