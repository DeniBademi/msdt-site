import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LocalStorageService } from '../_services/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {


  constructor(private localStorage: LocalStorageService, private router: Router) {}

  // This function is called when the user tries to navigate to a route that is protected by this guard
  // The function should return true if the user is allowed to navigate to the route, and false otherwise
  // It checks if the user is an admin, and if not, it redirects the user to the home page
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    let user = this.localStorage.getUser();
    if(user != null){
      if(user.role === "admin"){
        return true;
      }
      else{
        this.router.navigate(['/home']);
        return false;
      }
    }
    else{
      this.router.navigate(['/login']);
      return false;
    }
  }
}
