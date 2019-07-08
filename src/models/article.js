import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  source: {
    type: String,
  },
  type: {
    type: String,
  },
  date: {
      type: Date,
  },
  content: {
    type: String,
  },
});

const Article = mongoose.model('Article', articleSchema);

export default Article;