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
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user)['token'] : '';
  }

  public getUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;

    const user = JSON.parse(userStr);
    return new User(user.username, user.role, user.token);
  }
}
