
import Hapi from '@hapi/hapi';
import { CONFIG } from '../../../../../config';
import { AuthCookie } from '../../../../../lib/auth/auth-cookie';

const handler:Hapi.Lifecycle.Method = async (request: Hapi.Request, h:  Hapi.ResponseToolkit) => {
  /**
   * User requested a logout!
   */
  AuthCookie.revokeAuth(request);
  return h.continue;
};

const options:Hapi.RouteOptions = {
  description: "User logout.",
  cors: true,
  auth: {
      mode: 'required',
      strategy: CONFIG.APP_AUTH_STRATEGY_NAME
  },
  handler: handler
}

export default options;