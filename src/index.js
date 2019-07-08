import 'dotenv/config';
import express from 'express';
import models, { connectDb } from './models';
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
  app.listen(process.env.PORT, () =>
    console.log(`Example app listening on port ${process.env.PORT}!`),
  );
});