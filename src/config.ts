import DotEnv from 'dotenv';

DotEnv.config();

export const CONFIG = {
    REQUEST_COOKIE_AUTH_NAME: 'cookieAuth',
    APP_REDIS_CACHE_KEY: 'user-sessions-cache',
    APP_REDIS_CACHE_NAME: 'redis-cache',
    APP_REDIS_CACHE_PARTITION: 'cre',
    APP_REDIS_CACHE_EXPIRES: 3 * 24 * 60 * 60 * 1000,
    APP_REDIS_CACHE_SEGMENT: 'user-sessions',
    APP_AUTH_STRATEGY_NAME: 'session',
    SERVER_LISTEN_HOST: process.env.SERVER_LISTEN_HOST || 'localhost',
    SERVER_LISTEN_PORT: process.env.SERVER_LISTEN_PORT || 3000,
    REDIS_HOST: process.env.REDIS_HOST || 'localhost',
    REDIS_PORT: process.env.REDIS_HOST || 6379,
    REDIS_DB: process.env.REDIS_DB || 1
}