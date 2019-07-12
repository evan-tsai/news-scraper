export const puppeteerConfigs = {
    settings: {
        headless: false,
        args: [
            '--ignore-certificate-errors',
            '--disable-infobars',
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--lang=zh-TW,en-US,en,ja'
        ],
    },
    resolution: {
        width: 1024,
        height: 800
    },
};