import models from '../../models';

const get = async (req, res) => {
    const { source, type, page, limit } = req.query;
    const query = {};
    let articles;
    if (page) {
        articles = await models.Article.paginate(query, {
            sort: { date: -1 },
            page,
            limit: limit || 10,
        });
    } else {
        articles = await models.Article.find();
    }
	res.json(articles);
};

export default {
    get
}