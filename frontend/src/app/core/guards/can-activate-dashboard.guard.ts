import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AuthFacade } from '../../store/auth';
import { isNil } from 'lodash-es';

export const canActivateDashboard: CanActivateFn = (): Observable<
  boolean | UrlTree
> => {
  const authFacade = inject(AuthFacade);
  const router = inject(Router);

  return authFacade.authState$.pipe(
    map(({ data }) => {
      if (isNil(data?.token)) {
        return router.createUrlTree(['/', 'auth']);
      }

      return true;
    })
  );
};
