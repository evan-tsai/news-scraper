const puppeteer = require('puppeteer');
import { puppeteerConfigs } from '../configs/puppeteer';
import list from '../configs/list';
import scrapers from '../scrapers';

export default async () => {
    const browser = await puppeteer.launch(puppeteerConfigs.settings);
    const page = await browser.newPage();
    await page.setViewport(puppeteerConfigs.resolution);
    await runScrapers(page);
    await browser.close();
}

const runScrapers = async (page) => {
    for (let i = 0; i < list.length; i++) {
        const name = list[i].scraper;
        const categories = list[i].categories;
        for (let j = 0; j < categories.length; j++) {
            await scrapers[name](page, categories[j]);
        }
    }
}