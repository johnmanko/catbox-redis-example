
import Hapi from '@hapi/hapi';
import randomstring from 'randomstring';
import { CONFIG } from '../../config';
import { AppAuthCredentials, Profile } from './app-credentials';

/**
 * A utility class for managing auth cookie and cache (redis)
 */
export class AuthCookie {

  /**
   * Create a new auth cookie with new session ID and inset into Redis cache.
   * @param request The Hapi.Request
   * @param profile A client-safe Profile object
   */
  static setAuth(request: Hapi.Request, profile: Profile) {
    let sid = randomstring.generate();
    let creds: AppAuthCredentials = {
      sid: sid, 
      profile: profile
    }
    AuthCookie.setAuthProfileCache(request, creds);
    request[CONFIG.REQUEST_COOKIE_AUTH_NAME].set({ sid: sid });
  }

  /**
   * Revoke auth by removing the cookie and cache entry.
   * @param request The Hapi.Request
   */
  static revokeAuth(request: Hapi.Request) {
    if (request.auth.isAuthenticated) {
      let creds: AppAuthCredentials = <AppAuthCredentials><unknown>request.auth.credentials;
      request.server.app[CONFIG.APP_REDIS_CACHE_KEY].drop(creds.sid);
      request[CONFIG.REQUEST_COOKIE_AUTH_NAME].clear();
    }
  }

  /**
   * This method sets/updates Redis cache with AppAuthCredentials object.
   * @param request The Hapi.Request
   * @param cred An AppAuthCredentials object used to update Redis cache.
   */
  static setAuthProfileCache(request: Hapi.Request, cred: AppAuthCredentials) {
    request.server.app[CONFIG.APP_REDIS_CACHE_KEY].set(cred.sid, cred, 0);
  }

  /**
   * This method is used by the Cookie plugin to determine if the supplied cookie sid is valid, and thus verifies the user identity.
   * @param request The Hapi.Request
   * @param creds An AppAuthCredentials-like object used to get Redis cache.
   * @returns Validation status
   */
  static async sessionCacheFunction(request: Hapi.Request, creds: AppAuthCredentials) {

    let profile = await request.server.app[CONFIG.APP_REDIS_CACHE_KEY].get(creds.sid);
    if (!profile) {
      return { valid: false };
    } else {
      return { valid: true, credentials: profile };
    }

  }

}