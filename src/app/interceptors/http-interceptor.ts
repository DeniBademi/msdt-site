import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { LocalStorageService } from '../_services/local-storage.service';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const httpInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const localStorage = inject(LocalStorageService);
  const router = inject(Router);


  // const token = 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiJuaG9nZW5rYW1wIiwicm9sZSI6ImFkbWluIiwibmJmIjoxNzM0MDMzNTQ1LCJleHAiOjE3MzQ2MzgzNDUsImlhdCI6MTczNDAzMzU0NX0.csejgTV1IFoHvPGNBm1AiXq-hhpJ5TLsot2kE3D3khKOVPDFG9XBpZ13J8fThMEFxkr9GvBt5NTN4-wILNXsIg';

  // Only add the Authorization header if we have a token
  let clonedRequest = req;

  try {
    const token = localStorage.getToken();
    clonedRequest = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + token),
    });
  } catch (error) {
    console.log('error', error);
  }


  return next(clonedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 || error.status === 403) {
        // Clear any existing auth data and redirect to login
        localStorage.removeAuthData();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};