import 'dotenv/config';
import express from 'express';
import { connectDb } from './models';
import scrape from './services/scrape';
import logger from './helpers/logger';
import routes from './routes';
const app = express();

app.use('/', routes);

connectDb().then(async () => {
    app.listen(process.env.PORT, (err) => {
        if (err) {
            return logger.error('Server failed to start');
        }
        scrape();
        logger.info(`Server started on port ${process.env.PORT}!`);
    });
});