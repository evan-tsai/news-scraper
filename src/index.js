import 'dotenv/config';
import express from 'express';
import { connectDb } from './models';
import scrape from './services/scrape';
import logger from './helpers/logger';
import cors from 'cors';
import helmet from 'helmet';
import routes from './routes';
import cron from 'node-cron';
const app = express();

app.use(cors());
app.use(helmet());
app.use('/', routes);

connectDb().then(async () => {
    app.listen(process.env.PORT, (err) => {
        if (err) {
            return logger.error('Server failed to start');
        }
        cron.schedule('0 */2 * * *', () => {
            scrape();
        })
        logger.info(`Server started on port ${process.env.PORT}!`);
    });
});