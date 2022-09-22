import express, { Router } from 'express';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import cors from 'cors';
import callDatabase from './callDb.js';
import { Context } from './context.js';
import { getPooledConnection, dbConfig, closeConnection } from './dbUtils.js';

export const app = express();

const router = Router();

app.use(helmet(), cors());
app.use(bodyParser.json());

// Tell express the app is behind a proxy and to use the X-Forwarded-For header to find client
// IPs rather than using the IP of the proxy server (http://expressjs.com/en/guide/behind-proxies.html)
app.set('trust proxy', true);

router.get('/api', async (_req, res) => {
    try {
        const ctx = new Context();
        const connection = await getPooledConnection(ctx, dbConfig.pool.alias);
        const response = await callDatabase(ctx, connection);
        await closeConnection(ctx, connection);
        res.status(200).send(response);
    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
});

app.use(router);

// loadRouters(router);
// app.use(errorHandler);
// app.use(resourceNotFound);

