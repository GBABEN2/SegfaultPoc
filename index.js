import { createPool } from './dbUtils.js';
import SegfaultHandler from 'segfault-handler';
import { app } from './api.js'

const PORT = 3000;
let pool;

SegfaultHandler.registerHandler(`crashlogs/policies-api-crash-${new Date().getTime()}.log`);

const main = async () => {
    pool = await createPool();

    const server = app.listen(
        PORT,
        () => {
            console.log(PORT, 'API ready to accept connections');

            console.log(`Express request timeout set to ${60 - 10} seconds`);
        },
    );

    server.timeout = 0;
};

main().catch(
    (err) => {
        console.error({ err }, 'Shutting down');

        if (pool) {
            pool.close()
                .then(() => process.exit(1))
                .catch(
                    (poolErr) => {
                        console.error({ err: poolErr }, 'Failed to close pool');
                        process.exit(1);
                    },
                );
        } else {
            process.exit(1);
        }
    },
);

process.on('unhandledRejection', (reason, promise) => {
    console.error({ reason, promise }, 'Unhandled promise rejection.');
});
