const router = require('express').Router();
import newsController from '../controllers/api/news.controller';

router.get('/news', newsController.get);
router.get('/news/:id', newsController.find);

// Export API routes
module.exports = router;