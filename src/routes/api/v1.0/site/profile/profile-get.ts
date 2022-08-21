import Boom from '@hapi/boom';
import Hapi from '@hapi/hapi';
import Joi from 'joi';
import { CONFIG } from '../../../../../config';
import { DatabaseService, UserModel } from '../../../../../lib/db/database.service';

let handler:Hapi.Lifecycle.Method = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {

  /**
   * The client can request details on a specific user. 
   */
  if(request.params.username) {
    try{
      const user: UserModel = DatabaseService.select(request.params.username);
      return (user) ? { username: user.username, name: user.name }:h.response('User not found.').code(404);
    } catch(err) {
      return Boom.notFound('Could not fetch user details.');
    }
  }

  /**
   * If no username is supplied, assume they want their own profile, else error.
   */
  return (request.auth.isAuthenticated) ? request.auth.credentials.profile:Boom.unauthorized('Not authenticated.');

};

let validate:Hapi.RouteOptionsValidate = {
  params: Joi.object({
    username: Joi.string().optional()
  })
};

let options:Hapi.RouteOptions = {
  description: "Loads profile details of user.",
  cors: true,
  auth: {
      mode: 'try',
      strategy: CONFIG.APP_AUTH_STRATEGY_NAME
  },
  validate: validate,
  handler: handler
};

export default options;