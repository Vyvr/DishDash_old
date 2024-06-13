import {
  ActivatedRouteSnapshot,
  CanActivateChildFn,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, filter, map } from 'rxjs';
import { AuthFacade } from '../../store/auth';
import { inject } from '@angular/core';
import { isNil } from 'lodash-es';
import { WebSocketService } from '../api/web-socket-api.service';

export const canEnterGuard: CanActivateChildFn = (
  _childRoute: ActivatedRouteSnapshot,
  _state: RouterStateSnapshot
): Observable<boolean | UrlTree> => {
  const authFacade = inject(AuthFacade);
  const router = inject(Router);
  const webSocketService = inject(WebSocketService);

  authFacade.authState$
    .pipe(filter(({ loading }) => !loading))
    .subscribe(({ data, refreshSuccessful }) => {
      if (isNil(data) || refreshSuccessful) {
        return;
      }

      authFacade.refreshToken({ token: data.token });
    });

  // @TODO: doesnt work - fix
  return authFacade.authState$.pipe(
    filter(({ loading }) => !loading),
    map(({ refreshSuccessful, data }) => {
      const result = refreshSuccessful || router.createUrlTree(['/', 'auth']);
      if (result instanceof UrlTree || !result) {
        return result;
      }

      webSocketService.connect(data.id);
      return result;
    })
  );
};
