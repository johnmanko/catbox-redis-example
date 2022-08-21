import { Profile } from "../auth/app-credentials";

/**
 * User model for database
 */
export class UserModel implements Profile {
    username: string;
    name: string;
    password: string;
}

/**
 * A moch database collection of users
 */
const USERS: Map<string, UserModel> = new Map<string, UserModel>();

USERS.set('adam', { username: 'adam', name: 'Adam Bomb', password: '@dam' });
USERS.set('chuck', { username: 'chuck', name: 'Up Chuck', password: 'uPcHuCk' });
USERS.set('scotty', { username: 'scotty', name: 'Potty Scotty', password: 't0il3t' });

/**
 * A service to simulate database reads/writes
 */
export class DatabaseService {

    /**
     * Simulate SQL SELECT
     * @param username The username of user to query
     * @returns Found user or undefined
     */
    static select(username: string): UserModel {
        return USERS.get(username);
    }

    /**
     * Simulate SQL UPDATE
     * @param username The username of user to update
     * @param profile Update details from the client
     */
    static update(username: string, profile: Profile) {
        let user: UserModel = USERS.get(username);
        if (user) {
            user.name = profile.name;
        }
    }


}