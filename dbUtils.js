import * as dotenv from 'dotenv';
import oracledb from 'oracledb';
import swaggerStats from 'swagger-stats';
// import { Gauge } from 'prom-client';
// import {
//     // Pool,
//     // Lob,
//     // ExecuteOptions,
//     // Result,
//     // BindParameters,
//     // Connection as BaseConnection,
//     POOL_STATUS_CLOSED,
//     // BaseDBObject,
// } from 'oracledb';
// import { logger, CustomError, defaultError, DBError, errorWhitelist } from '../utils';

dotenv.config();
console.log(process.env);

const { BIND_OUT, BIND_IN, BIND_INOUT, Connection: BaseConnection, POOL_STATUS_CLOSED } = oracledb;
const { getPromClient } = swaggerStats;

oracledb.extendedMetaData = true;


export const dbConfig = {
    connection: {
        string: process.env.DB_CONNECTION_STRING,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        timezone: process.env.ORA_SDTZ,
    },
    pool: {
        alias: process.env.DB_POOL_ALIAS || 'policies-connect-pool',
        min:process.env.DB_POOL_MIN ? parseInt(process.env.DB_POOL_MIN) : 3,
        max: process.env.DB_POOL_MAX ? parseInt(process.env.DB_POOL_MAX) : 5,
        increment: process.env.DB_POOL_INCREMENT ? parseInt(process.env.DB_POOL_INCREMENT) : 1,
        dbPoolDropThreshold: process.env.DB_POOL_PAYLOAD_THRESHOLD ? parseInt(process.env.DB_POOL_PAYLOAD_THRESHOLD) : 1000,
    },
    logging: {
        logQueries: process.env.LOG_SQL === 'true',
    },
    maxOutbindSize: 800,
};

const appConfig = { metrics: { prefix: 'api_'}, timeout: 120, expressTimeoutBuffer: 10, formattingTimeoutBuffer: 10 };

const promClient = getPromClient();

// const customMetrics = {
//     maxQueueLength: new promClient.Gauge({
//         name: `${appConfig.metrics.prefix}db_max_queue_length`,

//         help: `${
//             appConfig.metrics.prefix
//         }db_max_queue_length Maximum number of getConnection() requests that were ever waiting at one time.`,
//     }),

//     minTimeInQueue: new promClient.Gauge({
//         name: `${appConfig.metrics.prefix}db_min_time_in_queue`,

//         help: `${
//             appConfig.metrics.prefix
//         }db_min_time_in_queue Minimum time (milliseconds) that any dequeued request spent in the queue.`,
//     }),

//     maxTimeInQueue: new promClient.Gauge({
//         name: `${appConfig.metrics.prefix}db_max_time_in_queue`,

//         help: `${
//             appConfig.metrics.prefix
//         }db_max_time_in_queue Maximum time (milliseconds) that any dequeued request spent in the queue.`,
//     }),

//     averageTimeInQueue: new promClient.Gauge({
//         name: `${appConfig.metrics.prefix}db_average_time_in_queue`,

//         help: `${
//             appConfig.metrics.prefix
//         }db_average_time_in_queue Average time (milliseconds) that dequeued requests spent in the queue.`,
//     }),

//     connectionsInUse: new promClient.Gauge({
//         name: `${appConfig.metrics.prefix}db_connections_in_use`,

//         help: `${
//             appConfig.metrics.prefix
//         }db_connections_in_use Number of connections from this pool that getConnection() returned successfully to the application and have not yet been released back to the pool.`,
//     }),

//     connectionsOpen: new promClient.Gauge({
//         name: `${appConfig.metrics.prefix}db_connections_open`,

//         help: `${
//             appConfig.metrics.prefix
//         }db_connections_open Number of connections in this pool that have been established to the database.`,
//     }),

//     upTime: new promClient.Gauge({
//         name: `${appConfig.metrics.prefix}db_up_time`,

//         help: `${appConfig.metrics.prefix}db_up_time Number of milliseconds this pool has been running.`,
//     }),

//     connectionRequests: new promClient.Gauge({
//         name: `${appConfig.metrics.prefix}db_connection_requests`,

//         help: `${
//             appConfig.metrics.prefix
//         }db_connection_requests Number of getConnection() requests made by the application to this pool.`,
//     }),

//     requestsEnqueued: new promClient.Gauge({
//         name: `${appConfig.metrics.prefix}db_requests_enqueued`,

//         help: `${
//             appConfig.metrics.prefix
//         }db_requests_enqueued Number of getConnection() Requests that could not be immediately satisfied because every connection in this pool was already being used, and so they had to be queued waiting for the application to return an in-use connection to the pool.`,
//     }),

//     requestsDequeued: new promClient.Gauge({
//         name: `${appConfig.metrics.prefix}db_requests_dequeued`,

//         help: `${
//             appConfig.metrics.prefix
//         }db_requests_dequeued Number of getConnection() requests that were dequeued when a connection in this pool became available for use.`,
//     }),

//     failedRequests: new promClient.Gauge({
//         name: `${appConfig.metrics.prefix}db_failed_requests`,

//         help: `${
//             appConfig.metrics.prefix
//         }db_failed_requests Number of getConnection() requests that invoked the underlying C API getConnection() callback with an error state. Does not include queue request timeout errors.`,
//     }),

//     requestTimeouts: new promClient.Gauge({
//         name: `${appConfig.metrics.prefix}db_request_timeouts`,

//         help: `${
//             appConfig.metrics.prefix
//         }db_request_timeouts Number of queued getConnection() requests that were timed out after they had spent queueTimeout or longer in this pool’s queue.`,
//     }),

//     timeInQueue: new promClient.Gauge({
//         name: `${appConfig.metrics.prefix}db_time_in_queue`,

//         help: `${
//             appConfig.metrics.prefix
//         }db_time_in_queue Sum of the time (milliseconds) that dequeued requests spent in the queue.`,
//     }),

//     status: new promClient.Gauge({
//         name: `${appConfig.metrics.prefix}db_status`,

//         help: `${
//             appConfig.metrics.prefix
//         }db_status One of the oracledb contants indicating whether the pool is open, being drained of in-use connections, or has been closed.`,
//     }),

//     queueTimeout: new promClient.Gauge({
//         name: `${appConfig.metrics.prefix}db_queue_timeout`,

//         help: `${
//             appConfig.metrics.prefix
//         }db_queue_timeout Number of milliseconds after which connection requests waiting in the connection request queue are terminated. If 0, queued connection requests are never terminated.`,
//     }),

//     minConnections: new promClient.Gauge({
//         name: `${appConfig.metrics.prefix}db_min_connections`,

//         help: `${
//             appConfig.metrics.prefix
//         }db_min_connections Minimum number of connections a connection pool maintains, even when there is no activity to the target database.`,
//     }),

//     maxConnections: new promClient.Gauge({
//         name: `${appConfig.metrics.prefix}db_max_connections`,

//         help: `${
//             appConfig.metrics.prefix
//         }db_max_connections Maximum number of connections to which a connection pool can grow.`,
//     }),

//     increment: new promClient.Gauge({
//         name: `${appConfig.metrics.prefix}db_increment`,

//         help: `${
//             appConfig.metrics.prefix
//         }db_increment Number of connections that are opened whenever a connection request exceeds the number of currently open connections.`,
//     }),

//     timeout: new promClient.Gauge({
//         name: `${appConfig.metrics.prefix}db_timeout`,

//         help: `${
//             appConfig.metrics.prefix
//         }db_timeout Number of seconds after which idle connections may be terminated. Idle connections are terminated only when the pool is accessed.`,
//     }),

//     pingInterval: new promClient.Gauge({
//         name: `${appConfig.metrics.prefix}db_ping_interval`,

//         help: `${
//             appConfig.metrics.prefix
//         }db_ping_interval When a pool getConnection() is called and the connection has been idle in the pool for at least poolPingInterval seconds, an internal “ping” will be performed first to check the aliveness of the connection.`,
//     }),

//     stmtCacheSize: new promClient.Gauge({
//         name: `${appConfig.metrics.prefix}db_stmt_cache_size`,

//         help: `${
//             appConfig.metrics.prefix
//         }db_stmt_cache_size Nmber of statements to be cached in the statement cache of each connection in the pool.`,
//     }),

//     threadpoolSize: new promClient.Gauge({
//         name: `${appConfig.metrics.prefix}db_threadpool_size`,

//         help: `${appConfig.metrics.prefix}db_threadpool_size Number of worker threads available.`,
//     }),
// };

export const collectPoolMetrics = async (poolAlias) => {
    // Some of the metrics are private, hence the need to cast to any.

    const pool = oracledb.getPool(poolAlias);

    if (!pool) {
        throw new Error(`No pool exists with alias ${poolAlias}`);
    }

    if (pool.status === POOL_STATUS_CLOSED) {
        throw new Error('Unable to get statistics from a closed connection pool');
    }

    if (pool.enableStatistics !== true) {
        throw new Error('Pool statistics disabled');
    }

    let averageTimeInQueue = 0;

    if (pool._totalRequestsEnqueued !== 0) {
        averageTimeInQueue = Math.round(pool._totalTimeInQueue / pool._totalRequestsEnqueued);
    }

    let sessionCallback = pool.sessionCallback;

    switch (typeof pool.sessionCallback) {
        case 'function':
            sessionCallback = pool.sessionCallback.name;
            break;
        case 'string':
            sessionCallback = '"' + pool.sessionCallback + '"';
            break;
    }

    const dbStats = {
        maxQueueLength: pool._maximumQueueLength,
        minTimeInQueue: pool._minTimeInQueue,
        maxTimeInQueue: pool._maxTimeInQueue,
        averageTimeInQueue,
        connectionsInUse: pool.connectionsInUse,
        connectionsOpen: pool.connectionsOpen,
        upTime: Date.now() - pool._createdDate,
        connectionRequests: pool._totalConnectionRequests,
        requestsEnqueued: pool._totalRequestsEnqueued,
        requestsDequeued: pool._totalRequestsDequeued,
        failedRequests: pool._totalFailedRequests,
        requestTimeouts: pool._totalRequestTimeouts,
        timeInQueue: pool._totalTimeInQueue,
        alias: pool.poolAlias,
        status: pool.status,
        queueTimeout: pool.queueTimeout,
        minConnections: pool.poolMin,
        maxConnections: pool.poolMax,
        increment: pool.poolIncrement,
        timeout: pool.poolTimeout,
        pingInterval: pool.poolPingInterval,
        sessionCallback,
        stmtCacheSize: pool.stmtCacheSize,
        threadpoolSize: parseInt(process.env.UV_THREADPOOL_SIZE || '-1'),
    };

    // for (const key in dbStats) {
    //     if (customMetrics[key]) {
    //         customMetrics[key].set(dbStats[key]);
    //     }
    // }
};

export const createPool = async () => {
    console.log({ poolAlias: dbConfig.pool.alias }, 'Creating connection pool');

    const pool = await oracledb.createPool({
        connectionString: dbConfig.connection.string,
        password: dbConfig.connection.password,
        user: dbConfig.connection.user,
        poolAlias: dbConfig.pool.alias,
        poolMax: dbConfig.pool.max,
        poolMin: dbConfig.pool.min,
        poolIncrement: dbConfig.pool.increment,
        enableStatistics: true,
        queueTimeout: 60000,
        stmtCacheSize: 0,
    });

    console.log(`Connection pool statistics will be collected every ${appConfig.metrics.collectInterval} seconds.`);

    setInterval(() => {
        collectPoolMetrics(dbConfig.pool.alias).catch(
            (err) => console.error({ err }, 'Unable to determine pool statistics'),
        );

        if (pool.connectionsInUse === pool.poolMax) {
            console.log(`All ${pool.connectionsInUse} connections are currently in use.`); // If all connections in use give warning
        } else if (pool.poolMax >= 10 && pool.connectionsInUse >= pool.poolMax * 0.85) {
            console.log(`${pool.connectionsInUse} connections of a possible ${pool.poolMax} are currently in use.`); // For pools with 10 or more connections and more than 85% connection utilisation give warning about high usage
        }
    }, appConfig.metrics.collectInterval * 1000);

    console.log(
        {
            poolAlias: dbConfig.pool.alias,
        },
        'Successfully created connection pool',
    );

    return pool;
};

export const getConnectionsInUseCount = async (context) => {
    try {
        const pool = oracledb.getPool(dbConfig.pool.alias);
        return pool.connectionsInUse;
    } catch (err) {
        console.log({ err }, 'Error getting connections in use count');
        return undefined;
    }
};

export const closeConnection = async (context, connection)  => {
    if (!connection) {
        console.log('Connection was null so already closed.');
        return;
    }

    try {
        await connection.close();
        const connectionsInUse = await getConnectionsInUseCount(context);
        console.log({ connectionsInUse }, 'Connection successfully closed');
    } catch (err) {
        if (!err.message.includes('NJS-003')) {
            const connectionsInUse = await getConnectionsInUseCount(context);
            console.log({ connectionsInUse }, 'Failed to close connection');
        } else {
            console.log(
                'Connection invalid so could not close. Likely cause is attempt to close already closed connection.',
            );
        }
    }

    return;
};

export const getPooledConnection = async (context, moduleName)=> {
    console.log(`Obtaining connection from pool.`);

    try {
        const connection = (await oracledb.getConnection(dbConfig.pool.alias));
        const remainingTime =
            (appConfig.timeout - appConfig.expressTimeoutBuffer - appConfig.formattingTimeoutBuffer) * 1000 -
            (Date.now() - context.startTime.getTime());
        if (remainingTime <= 0) {
            // If remaining time is less than zero close connection and throw error
            await closeConnection(context, connection);
            throw new CustomError('System busy. Please try again later.', 503, 4002);
        }

        console.log(remainingTime);
        
        connection.clientId = context.username;
        connection.module = moduleName;
        connection.action = context.trackingId;
        connection.callTimeout = remainingTime;

        const connectionsInUse = await getConnectionsInUseCount(context);
        console.log({ connectionsInUse }, `Successfully obtained connection from pool.`);

        return Object.defineProperty(connection, 'username', {
            value: context.username,
            writable: false,
        });
    } catch (err) {
        console.log({ err }, 'Failed to obtain a connection from pool.');
        throw err;
    }
};


export const handleLargePayloadConnection = async (
    ctx,
    payload,
    connection,
) => {
    const length = payload.length;

    /* Translating MB to Bytes */
    const thresholdBytes = 1000 * 1024 * 1024;

    if (length > thresholdBytes) {
        console.log(
            `Threshold limit (${thresholdBytes}) exceeded by response size of ${length}, dropping connection from pool.`,
        );

        connection.close({ drop: true });
    }
};

const checkIfConnectionNeedsDropping = async (
    ctx,
    errMessage,
    connection,
) => {
    const oraCodesToDrop = ['04061', '04065', '04068', '06503', '06508'];

    if (!errMessage) {
        return;
    }

    for (const oraCode of oraCodesToDrop) {
        if (errMessage.includes(`ORA-${oraCode}`)) {
            console.log('Dropping connection from pool');

            try {
                await connection.close({ drop: true });
            } catch (err) {
                console.log({ err }, 'Failed to drop connection from pool');
            }

            break;
        }
    }
};

export const errorParams = {
    errorCode: { dir: BIND_OUT },
    errorMessage: { dir: BIND_OUT },
    errorIndicator: { dir: BIND_OUT },
    errorIdentifier: { dir: BIND_OUT, maxSize:800},
    errorLevel: { dir: BIND_OUT },
};

export const execute = async(
    context,
    connection,
    sql,
    bindParams = {},
    options = {},
) => {
    try {
        logSql(context, sql, bindParams);

        const result = await connection.execute(sql, bindParams, options);

        const outBinds = result.outBinds || {};

        if (outBinds && (outBinds.errorCode || (outBinds.errorIndicator && outBinds.errorIndicator === 'Y'))) {
            const { errorCode, errorMessage, errorIndicator, errorIdentifier, errorLevel } = outBinds;

            const errorFields = {
                errorCode,
                errorMessage,
                errorIndicator,
                errorIdentifier,
                errorLevel,
            };

            if (errorWhitelist.includes(errorCode)) {
                console.log(errorFields, errorMessage);
            } else {
                console.log(errorFields, 'An error occurred executing SQL');
            }

            await checkIfConnectionNeedsDropping(context, errorIdentifier, connection);

            throw new DBError(outBinds);
        }

        return result;
    } catch (err) {
        await checkIfConnectionNeedsDropping(context, err.message, connection);

        if (!(options.keepAlive && options.keepAlive === true)) {
            await closeConnection(context, connection);
        }

        throw err;
    }
};

export const getLobData = async (context, data) => {
    let stringData;
    try {
        stringData = (await data.getData());
        const parsedStringData = JSON.parse(stringData);
        if (parsedStringData.data) {
            return parsedStringData.data;
        } else {
            return parsedStringData;
        }
    } catch (err) {
        // If error was thrown parsing stringData then err should be instance of SyntaxError and the stringData variable will be a string with length > 1
        if (err instanceof SyntaxError && stringData) {
            const position = err.message.indexOf('position'); // Does error message detail position of parsing error in the JSON formatted string
            let extract;
            if (typeof position === 'number' && position >= 0) {
                const positionVal = Number(err.message.substring(position + 9).split(' ')[0]); // If position is in error message try and extract number
                if (!Number.isNaN(positionVal)) {
                    // Check if position number is successfully extracted
                    extract = stringData.substring(positionVal - 100, positionVal + 100); // Extract section of JSON string around error (100 characters either side)
                }
            }
            // Log offending section of the string to aid in debugging what prevented the parsing of the DB result
            console.log(
                { err, errorExtract: extract },
                'Failed to get lob data. Parsing error occurred in this extract of the JSON payload from the DB.',
            );
            throw new CustomError(defaultError, 500, 2001); // Reject due to failed parse
        }
        // Otherwise just throw the caught error
        throw err;
    }
};

export const getDbObjectData = async (context, data) => {
    if (data.isCollection) {
        return JSON.parse(JSON.stringify(data.getValues())) // Need .getValues if collection
    } else {
        return JSON.parse(JSON.stringify(data));
    }
};

export const assertOutBindsExists = (result) => {
    if (!result.outBinds) {
        throw new Error();
    }
    return result;
};

const isBindInParameter = (param) => {
    const bindParam = param;
    return bindParam.dir !== undefined && (bindParam.dir === BIND_IN || bindParam.dir === BIND_INOUT);
}

const formatValue = (value) => {
    if (typeof value === 'string' || value instanceof Buffer) {
        return `'${value}'`;
    }
    if (typeof value === 'number') {
        return value.toString();
    }
    if (value instanceof Date) {
        const formattedDate = value
            .toISOString()
            .slice(0, 10)
            .replace(' ', '-');
        return `TO_DATE('${formattedDate}','yyyy-mm-dd')`;
    }
    if (!value) {
        return 'null';
    }
    if (isBindInParameter(value)) {
        const bindParam = value;
        return formatValue(bindParam.val);
    }

    return undefined;
};

const bindSql = (sql, bindParams) => {
    if (!bindParams || bindParams.length === 0) {
        return sql;
    }
    for (const [key, value] of Object.entries(bindParams)) {
        const formattedValue = formatValue(value);
        if (formattedValue) {
            sql = sql.replace(':' + key, formattedValue);
        }
    }
    return sql;
};

export const logSql = (_context, sourceSql, bindParams) => {
    if (!dbConfig.logging.logQueries) {
        console.log('Executing SQL');
        return;
    }
    const sql = bindSql(sourceSql, bindParams);
    console.log({ sql }, 'Executing SQL');
};
