import Lab from '@hapi/lab';
import Code from '@hapi/code';
import { init } from '../src/server';

export const lab = Lab.script();

const API = {
    POST_LOGIN: '/api/1/account/auth/auth',
    POST_PROFILE: '/api/1/account/profile',
    GET_PROFILE: '/api/1/site/profile',
    GET_REVOKE_AUTH: '/api/1/account/auth/revoke'
};

const validatePayload = (res, expectedUsername, expectedName) => {
    let payload = JSON.parse(res.payload);
    Code.expect(payload).to.be.an.object();
    Code.expect(payload.username).to.equal(expectedUsername);
    Code.expect(payload.name).to.equal(expectedName);
};

const parseCookie = (res) => {
    Code.expect(res.headers['set-cookie']).to.be.an.array().and.have.length(1);
    let cookie: string = res.headers['set-cookie'][0];
    Code.expect(cookie).to.startWith('sid=');
    return cookie.split(';')[0];
};

lab.experiment('Test Auth', () => {

    let server;
    let authCookie;

    lab.before(async () => {
        server = await init();
    });

    lab.after(async () => {
        await server.stop();
    });

    lab.test(`No Cookie Getting Session Profile: GET ${API.GET_PROFILE}`, async () => {
        const res = await server.inject({
            method: 'get',
            url: API.GET_PROFILE
        });
        Code.expect(res.statusCode).to.equal(401);
    });

    lab.test(`Bad Login Attempt: POST ${API.POST_LOGIN}`, async () => {
        const res = await server.inject({
            method: 'post',
            url: API.POST_LOGIN,
            payload: {
                username: 'bad',
                password: 'login'
            }
        });
        Code.expect(res.statusCode).to.equal(401);
    });

    lab.test(`Good Login Attempt That Returns Auth Cookie: POST ${API.POST_LOGIN}`, async () => {
        const res = await server.inject({
            method: 'post',
            url: API.POST_LOGIN,
            payload: {
                username: 'adam',
                password: '@dam'
            }
        });
        Code.expect(res.statusCode).to.equal(200);
        validatePayload(res, 'adam', 'Adam Bomb');
        authCookie = parseCookie(res);
    });

    lab.test(`Login Ignored with Previous Valid Cookie: POST ${API.POST_LOGIN}`, async () => {
        const res = await server.inject({
            method: 'post',
            url: API.POST_LOGIN,
            payload: {
                username: 'bad',
                password: 'login'
            },
            headers: {
                'Cookie': authCookie
            }
        });
        Code.expect(res.statusCode).to.equal(200);
        validatePayload(res, 'adam', 'Adam Bomb');
    });

    lab.test(`Get Session Profile Using Previous Cookie: GET ${API.GET_PROFILE}`, async () => {
        const res = await server.inject({
            method: 'get',
            url: API.GET_PROFILE,
            headers: {
                'Cookie': authCookie
            }
        });
        Code.expect(res.statusCode).to.equal(200);
        validatePayload(res, 'adam', 'Adam Bomb')
    });

    lab.test(`Update Session Profile Using Previous Cookie: GET ${API.GET_PROFILE}`, async () => {
        const res = await server.inject({
            method: 'post',
            url: API.POST_PROFILE,
            payload: {
                name: 'Blasted BILLY'
            },
            headers: {
                'Cookie': authCookie
            }
        });
        Code.expect(res.statusCode).to.equal(200);
        validatePayload(res, 'adam', 'Blasted BILLY')
    });


    lab.test(`Get Updated Session Profile Using Previous Cookie: GET ${API.GET_PROFILE}`, async () => {
        const res = await server.inject({
            method: 'get',
            url: API.GET_PROFILE,
            headers: {
                'Cookie': authCookie
            }
        });
        Code.expect(res.statusCode).to.equal(200);
        validatePayload(res, 'adam', 'Blasted BILLY')
    });

    lab.test(`Revoke Auth Using Previous Cookie: GET ${API.GET_PROFILE}`, async () => {
        const res = await server.inject({
            method: 'get',
            url: API.GET_REVOKE_AUTH,
            headers: {
                'Cookie': authCookie
            }
        });
        Code.expect(res.statusCode).to.equal(204);
    });

    lab.test(`Invalid Cookie Getting Session Profile: GET ${API.GET_PROFILE}`, async () => {
        const res = await server.inject({
            method: 'get',
            url: API.GET_PROFILE,
            headers: {
                'Cookie': authCookie
            }
        });
        Code.expect(res.statusCode).to.equal(401);
    });

    lab.test(`No Cookie Getting 'scotty' Profile: GET ${API.GET_PROFILE}`, async () => {
        const res = await server.inject({
            method: 'get',
            url: `${API.GET_PROFILE}/scotty`
        });
        Code.expect(res.statusCode).to.equal(200);
        validatePayload(res, 'scotty', 'Potty Scotty')
    });

    lab.test(`No Cookie Getting updated 'adam' Profile: GET ${API.GET_PROFILE}`, async () => {
        const res = await server.inject({
            method: 'get',
            url: `${API.GET_PROFILE}/adam`
        });
        Code.expect(res.statusCode).to.equal(200);
        validatePayload(res, 'adam', 'Blasted BILLY')
    });

});

