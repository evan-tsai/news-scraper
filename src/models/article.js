import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  content: {
    type: String,
  },
});

articleSchema.plugin(mongoosePaginate);
const Article = mongoose.model('Article', articleSchema);

export default Article;