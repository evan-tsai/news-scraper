const Parser = require('rss-parser');
const parser = new Parser();
import models from '../models';

export default async (page, type) => {
    const feed = await parser.parseURL(`https://news.ltn.com.tw/rss/${type}.xml`);
    let items = feed.items.map(item => {
        return {
            link: item.link,
            pubDate: new Date(item.pubDate),
        }
    });
    
    for (let i = 0; i < items.length; i++) {
        const url = items[i].link;
        const pubDate = items[i].pubDate;
        await page.goto(url, {
            waitUntil: 'networkidle0',
            timeout: 0,
        });

        const title = await Promise.race([
            page.waitForSelector('div.articlebody > h1'),
            page.waitForSelector('div.news_content > h1'),
        ]).innerText;

        const content = await page.$eval('div[itemprop=articleBody]', div => {
            let removeChild = false;
            div.childNodes.forEach(node => {
                if (node.innerText !== undefined && (node.innerText.includes('相關新聞') || node.innerText.includes('想看更多新聞嗎'))) {
                    removeChild = true;
                }
                if (node.tagName === 'SCRIPT' || removeChild) {
                    div.removeChild(node);
                }
            });
            return div.innerHTML;
        });

        let article = new models.Article({
            title,
            source: 'ltn',
            content,
            type,
            date: new Date(pubDate),
        });

        await article.save();
    }
}

