import models from '../../models';

const get = async (req, res) => {
    const { source, type, page, limit } = req.query;
    let articles;
    let query = {};

    if (source) query.source = { $in: source.split(',') };
    if (type) query.type = { $in: type.split(',') };
    
    if (page) {
        articles = await models.Article.paginate(query, {
            sort: { date: -1 },
            page,
            limit: parseInt(limit) || 10,
        });
    } else {
        articles = await models.Article.find(query).sort({ date: -1 }).limit(parseInt(limit) || 0);
    }
	res.json(articles);
};

const find = async (req, res) => {
    try {
        const article = await models.Article.findById(req.params.id);
        res.json(article);
    } catch (err) {
        res.status(404).send('Article not found');
    }
}

export default { get, find }