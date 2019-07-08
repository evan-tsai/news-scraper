import mongoose from 'mongoose';

import Article from './article';

const connectDb = () => {
  return mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
};

const models = { Article };

export { connectDb };

export default models;