import Joi from 'joi';
import Hapi from '@hapi/hapi';
import { AppAuthCredentials, Profile } from '../../../../lib/auth/app-credentials';
import { CONFIG } from '../../../../config';
import { AuthCookie } from '../../../../lib/auth/auth-cookie';
import { DatabaseService } from '../../../../lib/db/database.service';

const handler: Hapi.Lifecycle.Method = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {

    /**
     * For the session user, let's update using their supplied profile.
     */
    let creds: AppAuthCredentials = <AppAuthCredentials><unknown>request.auth.credentials;
    let incoming: Profile = <Profile>request.payload;

    if (incoming.name && incoming.name != creds.profile.name) {
        creds.profile.name = incoming.name;
        DatabaseService.update(creds.profile.username, creds.profile);
        AuthCookie.setAuthProfileCache(request, creds);
    }
    return creds.profile;
};

const validate = {
    payload: Joi.object({
        name: Joi.string().required()
    }),
    failAction: async (request, h, err) => {
        throw err;
    }
};

const options: Hapi.RouteOptions = {
    description: "Update session user profile.",
    cors: true,
    payload: {
        output: 'data',
        parse: true
    },
    auth: {
        mode: 'required',
        strategy: CONFIG.APP_AUTH_STRATEGY_NAME
    },
    validate: validate,
    handler: handler
}

export default options;