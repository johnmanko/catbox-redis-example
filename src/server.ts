import path from 'path';
import Hapi from '@hapi/hapi';
import HapiCookie from '@hapi/cookie';
import HapiInert from '@hapi/inert';
import Blipp from 'blipp';
import CatboxRedis from '@hapi/catbox-redis';
import randomstring from 'randomstring';
import { AuthCookie } from './lib/auth/auth-cookie';
import Routes from './routes/routes';
import { CONFIG } from './config';

const dirname = process.cwd();

let server = Hapi.server({
  app: {},
  host: CONFIG.SERVER_LISTEN_HOST,
  port: CONFIG.SERVER_LISTEN_PORT,
  routes: {
    files: {
      relativeTo: path.join(dirname, 'public')
    },
    cors: {
      origin: ['*']
    }
  },
  cache: [
    {
      name: CONFIG.APP_REDIS_CACHE_NAME,
      provider: {
        constructor: CatboxRedis,
        options: {
          partition: CONFIG.APP_REDIS_CACHE_PARTITION,
          db: CONFIG.REDIS_DB
        }
      }
    }
  ]
});

const internals: any = {};

internals.prepare = async () => {

  const cache = server.cache({ 
    segment: CONFIG.APP_REDIS_CACHE_SEGMENT, 
    expiresIn: CONFIG.APP_REDIS_CACHE_EXPIRES,
    cache: CONFIG.APP_REDIS_CACHE_NAME
  });
  server.app[CONFIG.APP_REDIS_CACHE_KEY] = cache;
  
  await server.register([
    { plugin: HapiCookie },
    { plugin: HapiInert },
    { plugin: Blipp }
  ]);
  
  server.auth.strategy(CONFIG.APP_AUTH_STRATEGY_NAME, 'cookie', {
    cookie: {
      name: 'sid',
      password: randomstring.generate(),
      isSecure: false,
      clearInvalid: true,
      path: '/api/1'
    },
    validateFunc: AuthCookie.sessionCacheFunction
  });
  
  server.route(Routes);
};

export let init = async () => {
  await internals.prepare();
  await server.initialize();
  return server;
};

export let start = async () => {
  await internals.prepare();
  await server.start();
  console.log('Server running at:', server.info.uri);
  console.log('process.cwd = :', process.cwd());
  return server;
};
