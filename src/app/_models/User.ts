import { Token } from "./Token";

/**
 * Represents a user in the application, including authentication token and role.
 */
export class User {
    constructor(username : string, role: string, token: Token){
        this.username=username;
        this.role=role;
        this.token=token;
    }
    username: string;
    role: string;
    token: Token;
}