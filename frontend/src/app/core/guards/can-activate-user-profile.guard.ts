import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { isNil } from 'lodash-es';
import { Observable, map, take } from 'rxjs';
import { AuthFacade } from 'src/app/store/auth';
import { bindTokenToPayload } from '../api/utils';
import { GetPostsRequest } from 'src/app/pb/post_pb';
import { UserPostsFacade } from 'src/app/store/user-posts';

//@TODO Adjust this guard

export const canActivateUserProfile: CanActivateFn = (): Observable<
  boolean | UrlTree
> => {
  const authFacade = inject(AuthFacade);
  const userPostsFacade = inject(UserPostsFacade);
  const router = inject(Router);

  const errorPageUrlTree = router.createUrlTree(['/', 'generic-error']);

  return authFacade.authState$.pipe(
    take(1),
    map((authState) => {
      if (isNil(authState.data) || isNil(authState.data.token)) {
        return errorPageUrlTree;
      }

      const payload = bindTokenToPayload<GetPostsRequest.AsObject>(
        { page: 0, pageSize: 10 },
        authState
      );

      if (isNil(payload)) {
        return errorPageUrlTree;
      }

      userPostsFacade.getPosts(payload);

      return true;
    })
  );
};
