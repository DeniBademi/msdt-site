import { Token } from "./Token";

/**
 * Represents the login credentials required for user authentication.
 */
export class LoginCredentials {
    constructor(username : string, password: string){
        this.username=username;
        this.password=password;
    }
    username: string;
    password: string;
}
