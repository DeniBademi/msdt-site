/**
 * Represents an authentication token received after login.
 */
export class Token {
    constructor(access_token: string, token_type: string, expires_in: string, username: string) {
        this.access_token = access_token;
        this.token_type = token_type;
        this.expires_in = expires_in;
        this.username = username;
    }
    access_token: string;
    token_type: string;
    expires_in: string;
    username: string;
}