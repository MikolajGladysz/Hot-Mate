import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { map, Observable, take } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    // if (!!this.authService.user.getValue()) {
    //   return true;
    // }

    // return this.router.createUrlTree(['/']);

    return this.authService.user.pipe(
      take(1),
      map((user) => {
        const isAuth = !!user;
        if (isAuth) {
          if (!user.name) {
            return this.router.createUrlTree(['/create-account']);
          }
          return true;
        }

        return this.router.createUrlTree(['/']);
      })
    );
  }
}
