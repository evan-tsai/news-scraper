import models from '../models';
import { getSelectorFromArray } from '../helpers/common';
import { puppeteerConfigs } from '../configs/puppeteer';
import logger from '../helpers/logger';

const Parser = require('rss-parser');
const parser = new Parser();
const source = 'ltn';

export default async (page, type) => {
    const latest = await models.Article.findOne({ source, type }).sort({ date: -1 }).select('date');
    const feed = await parser.parseURL(`https://news.ltn.com.tw/rss/${type}.xml`);
    let items = feed.items.map(item => {
        return {
            link: item.link,
            pubDate: new Date(item.pubDate),
        }
    });
    if (latest) items = items.filter(item => item.pubDate > latest.date);

    for (let i = 0; i < items.length; i++) {
        try {
            const url = items[i].link;
            const pubDate = items[i].pubDate;
            await page.goto(url, puppeteerConfigs.destination);

            const titleSelectors = [
                'div.articlebody > h1',
                'div.news_content > h1',
                'div.conbox > h1'
            ];

            const getInnerText = item => item.innerText;
            const title = await getSelectorFromArray(page, titleSelectors, getInnerText);

            const content = await page.$eval('div[itemprop=articleBody]', div => {
                let removeChild = false;
                div.childNodes.forEach(node => {
                    if (node.innerText !== undefined && (node.innerText.includes('相關新聞') || node.innerText.includes('想看更多新聞嗎'))) {
                        removeChild = true;
                    }
                    if (node.tagName === 'SCRIPT' ||
                        removeChild ||
                        node.className === 'author' ||
                        node.tagName === 'H1') {
                        div.removeChild(node);
                    }
                });
                return div.innerHTML;
            });

            let article = new models.Article({
                title,
                source,
                content,
                type,
                date: new Date(pubDate),
            });

            await article.save();
        } catch (err) {
            logger.warn(err.toString());
            continue;
        }
    }
}