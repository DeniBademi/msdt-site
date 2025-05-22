import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LocalStorageService } from '../_services/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private localStorage: LocalStorageService, private router: Router) {}

  // This function is called when the user tries to navigate to a route that is protected by this guard
  // The function should return true if the user is allowed to navigate to the route, and false otherwise
  // It checks if the user is authenticated, and if not, it redirects the user to the login page
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (this.localStorage.getToken() != null) {
        return true;
      } else {
        // Redirect to the login page if the user is not authenticated
        this.router.navigate(['/login']);
        return false;
      }
  }

}
