import models from '../models';
import { removeTags } from '../helpers/common';
import { puppeteerConfigs } from '../configs/puppeteer';
import logger from '../helpers/logger';

const Parser = require('rss-parser');
const parser = new Parser();
const source = 'yahoo';

export default async (page, type) => {
    const latest = await models.Article.findOne({ source, type }).sort({ date: -1 }).select('date');
    const feed = await parser.parseURL(`https://tw.news.yahoo.com/rss/${type}`);
    let sites = feed.items.map(item => {
        return {
            link: item.link,
            pubDate: new Date(item.pubDate),
        }
    });
    if (latest) sites = sites.filter(item => item.pubDate > latest.date);

    for (let site of sites) {
        try {
            const url = site.link;
            const pubDate = site.pubDate;
            await page.goto(url, puppeteerConfigs.destination);

            const title = await page.$eval('header.canvas-header > h1', item => item.innerText);

            await removeTags(page, ['script', 'a', 'iframe', 'h1']);

            const content = await page.$eval('div.canvas-body', div => {
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