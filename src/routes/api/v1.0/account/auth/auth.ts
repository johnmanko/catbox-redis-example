import Joi from 'joi';
import Boom from '@hapi/boom';
import Hapi from '@hapi/hapi';
import { AuthCookie } from '../../../../../lib/auth/auth-cookie';
import { CONFIG } from '../../../../../config';
import { DatabaseService, UserModel } from '../../../../../lib/db/database.service';

const handler:Hapi.Lifecycle.Method = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {

  /**
   * Has the Cookie Auth plugin validated our user?  If so, ignore login payload from user and use existing profile.
   */
  if (request.auth.isAuthenticated) {
    return request.auth.credentials.profile;
  }

  let user: UserModel = DatabaseService.select(request.payload['username']);

  if (!user || user.password !== request.payload['password']) {
    return Boom.unauthorized('Could not authenticate.  Username or password is invalid.');
  } 

  let profile = {
    username: user.username,
    name: user.name
  }

  AuthCookie.setAuth(request, profile);

  return profile;

};

const validate = {
  payload: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
  }),
  failAction: async (request, h, err) => {
    throw err;
  }
};

const options:Hapi.RouteOptions = {
  description: "User auth.",
  cors: true,
  payload: {
    output: 'data',
    parse: true
  },
  auth: {
      mode: 'try',
      strategy: CONFIG.APP_AUTH_STRATEGY_NAME
  },
  validate: validate,
  handler: handler
}

export default options;