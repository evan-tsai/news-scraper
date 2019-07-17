const isDev = process.env.NODE_ENV === 'development';

export const puppeteerConfigs = {
    settings: {
        headless: !isDev,
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
    destination: {
        waitUntil: 'networkidle0',
        timeout: 20000,
    },
};