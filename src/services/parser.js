import models from '../models';
const Parser = require('rss-parser');
const parser = new Parser();

export default class {
    constructor(config) {
        this.source = config.source;
        this.type = config.type;
        this.rssUrl = config.rssUrl;
    }

    // Get latest sites from RSS url
    async getSites() {
        const latest = await models.Article.findOne({ source: this.source, type: this.type }).sort({ date: -1 }).select('date');
        const feed = await parser.parseURL(this.rssUrl);
        let sites = feed.items.map(item => ({
                link: item.link,
                pubDate: new Date(item.pubDate),
            })
        );
        if (latest) sites = sites.filter(item => item.pubDate > latest.date);
    
        return sites;
    }
}
