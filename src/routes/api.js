const router = require('express').Router();
import newsController from '../controllers/api/newsController';

router.get('/news', newsController.get);
// Export API routes
module.exports = router;