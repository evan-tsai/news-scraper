import puppeteer from 'puppeteer';
import { puppeteerConfigs } from '../configs/puppeteer';
import list from '../configs/list';
import scrapers from '../scrapers';

const isDev = process.env.NODE_ENV === 'development';

export default async () => {
    const browser = await puppeteer.launch(puppeteerConfigs.settings);
    const page = await browser.newPage();
    await page.setViewport(puppeteerConfigs.resolution);

    // Abort image requests
    if (isDev) {
        await page.setRequestInterception(true);
        page.on('request', request => {
            if (request.resourceType() === 'image')
                request.abort();
            else
                request.continue();
        });
    }

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