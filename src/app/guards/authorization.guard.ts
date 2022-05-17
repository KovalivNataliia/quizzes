import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthorizationService } from '@services/authorization.service';

@Injectable()
export class AuthorizationGuard implements CanActivate {

  constructor(private authService: AuthorizationService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authService.isAuth$.value) {
      return true
    } else {
      this.router.navigate(['/authorization']);
      return false
    }
  }
  
}