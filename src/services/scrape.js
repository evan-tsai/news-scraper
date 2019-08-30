import puppeteer from 'puppeteer';
import { puppeteerConfigs } from '../configs/puppeteer';
import list from '../configs/list';
import models from '../models';
import scrapers from '../scrapers';
import logger from '../helpers/logger';
import { removeTags } from '../helpers/common';

export default async () => {
    logger.info('Scrape started');
    const browser = await puppeteer.launch(puppeteerConfigs.settings);
    const page = await browser.newPage();
    await page.setViewport(puppeteerConfigs.resolution);

    // Abort image requests
    await page.setRequestInterception(true);
    page.on('request', request => {
        if (request.resourceType() === 'image')
            request.abort();
        else
            request.continue();
    });

    await runScrapers(page);
    await browser.close();
    logger.info('Scrape finished');
}

const runScrapers = async (page) => {
    for (let i = 0; i < list.length; i++) {
        const name = list[i].scraper;
        const categories = list[i].categories;
        const scraper = new scrapers[name](page);
        for (let j = 0; j < categories.length; j++) {
            await scrapeCategory(scraper, categories[j]);
        }
    }
}

const scrapeCategory = async (scraper, type) => {
    const sites = await scraper.getSites(type);
    for (let site of sites) {
        try {
            const url = site.link;
            const date = new Date(site.pubDate);
            await scraper.page.goto(url, puppeteerConfigs.destination);
            const title = await scraper.getTitle();
            await removeTags(scraper.page, scraper.restrictedTags);
            const content = await scraper.getContent();

            let article = new models.Article({ title, source: scraper.source, content, type, date });

            await article.save();
        } catch (err) {
            logger.warn(err.toString());
            continue;
        }
    }
}