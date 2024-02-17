import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  UrlTree,
} from '@angular/router';
import { Observable, map } from 'rxjs';
import { AuthFacade } from '../store/auth';
import { isNil } from 'lodash-es';

@Injectable({
  providedIn: 'root',
})
export class CanActivateDashboard implements CanActivate {
  authState$ = this.authFacade.authState$;

  constructor(private authFacade: AuthFacade, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.authState$.pipe(
      map(({ data }) => {
        if (isNil(data?.token)) {
          return this.router.createUrlTree(['/', 'auth']);
        }

        return true;
      })
    );
  }
}
