/**
 * This interface describe the user profile object returned to client.
 */
export interface Profile {
    username: string;
        name: string;
}
/**
 * This interface describes the object stored in application cache (redis) and respesents the user session.
 */
export interface AppAuthCredentials {
    sid: string;
    profile: Profile;
}