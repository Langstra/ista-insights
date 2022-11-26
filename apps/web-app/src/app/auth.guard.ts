import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { authStore } from './login/auth.store';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const helper = new JwtHelperService();
    const token = authStore.getValue().jwt;

    if (!token || helper.isTokenExpired(token)) {
      return this.router.navigateByUrl('/login');
    }
    return true;
  }
}
