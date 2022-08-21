# catbox-redis-error

Demonstrate how to use `@hapi/catbox-redis` and `@hapi/cookie`.  Simulated user data is located in `src/lib/db/database.service.ts`.

## Prerequisite

You need to install node.js v18 or greater, and access to a redis instance.

To install redis locally on Docker:

```
docker run --name my-redis -d redis
```

## Configuration

You can update `.env` in the root directory, but generally you can leave this alone.

```
SERVER_LISTEN_HOST=localhost
SERVER_LISTEN_PORT=3000
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=1
```

Additional changes can be made in `src/config.ts`.

## Running & Testing

Install packages.

```
npm install
```

Run test script.

```
npm run test
```

You should see output similar to

```
> catbox-redis-example@1.0.0 test
> ./node_modules/@hapi/lab/bin/lab -C -v --typescript

Test Auth
  ✔ 1) No Cookie Getting Session Profile: GET /api/1/site/profile (18 ms)
  ✔ 2) Bad Login Attempt: POST /api/1/account/auth/auth (5 ms)
  ✔ 3) Good Login Attempt That Returns Auth Cookie: POST /api/1/account/auth/auth (6 ms)
  ✔ 4) Login Ignored with Previous Valid Cookie: POST /api/1/account/auth/auth (5 ms)
  ✔ 5) Get Session Profile Using Previous Cookie: GET /api/1/site/profile (3 ms)
  ✔ 6) Update Session Profile Using Previous Cookie: POST /api/1/account/profile (3 ms)
  ✔ 7) Get Updated Session Profile Using Previous Cookie: GET /api/1/site/profile (4 ms)
  ✔ 8) Revoke Auth Using Previous Cookie: GET /api/1/account/auth/revoke (4 ms)
  ✔ 9) Invalid Cookie Getting Session Profile: GET /api/1/site/profile (3 ms)
  ✔ 10) No Cookie Getting 'scotty' Profile: GET /api/1/site/profile/scotty (3 ms)
  ✔ 11) No Cookie Getting updated 'adam' Profile: GET /api/1/site/profile/adam (1 ms)


11 tests complete
Test duration: 74 ms
Leaks: No issues
```

Build and run application server.

```
npm run start
```

You should output similar to 

```
> catbox-redis-example@1.0.0 start
> npm run build && NODE_ENV=development node --experimental-specifier-resolution=node -r source-map-support/register ./dist/index.js


> catbox-redis-example@1.0.0 build
> npm run clean && ./node_modules/typescript/bin/tsc


> catbox-redis-example@1.0.0 clean
> rimraf ./dist/*

Debugger listening on ws://127.0.0.1:56796/ef648d92-d6a9-45c4-a615-e80a9aeae3fd
For help, see: https://nodejs.org/en/docs/inspector
Debugger attached.
(node:40090) ExperimentalWarning: The Node.js specifier resolution flag is experimental. It could change or be removed at any time.
(Use `node --trace-warnings ...` to show where the warning was created)
http://localhost:3000
method  path                             description                   
------  -------------------------------  ------------------------------
POST    /api/1/account/auth/auth         User auth.                    
GET     /api/1/account/auth/revoke       User logout.                  
POST    /api/1/account/profile           Update session user profile.  
GET     /api/1/site/profile/{username?}  Loads profile details of user.

Server running at: http://localhost:3000
process.cwd = : /Some/path/to/catbox-redis-example
```
