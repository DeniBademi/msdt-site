import { Token } from "./Token";


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