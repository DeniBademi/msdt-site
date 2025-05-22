import { Token } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { User } from '../_models/User';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  public removeAuthData() {
    localStorage.removeItem('user');
  }

  public setUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  public getToken() : Token {
    let token = JSON.parse(localStorage.getItem('user')!)['token'];

    return token;
  }

  public getUser(): User {
    let user = JSON.parse(localStorage.getItem('user')!);

    // parse the user object from local storage
    return new User(user['username'], user['role'], user['token']);
  }
}
