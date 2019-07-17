import 'dotenv/config';
import express from 'express';
import models, { connectDb } from './models';
import scrape from './services/scrape';
import logger from './helpers/logger';
const app = express();

app.get('/', async (req, res) => {
  // const article = new models.Article({
  //   title: 'Test',
  //   source: 'yahoo',
  //   type: 'sports',
  //   date: new Date(),
  //   content: 'testabc'
  // });

  // await article.save();
  const articles = await models.Article.find();
  return res.send(articles);
  res.send('Hello World!');
});

connectDb().then(async () => {
  app.listen(process.env.PORT, () => {
    logger.info(`Example app listening on port ${process.env.PORT}!`);
    scrape();
  });
});