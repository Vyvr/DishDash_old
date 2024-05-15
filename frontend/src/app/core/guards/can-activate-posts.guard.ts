import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { isNil } from 'lodash-es';
import { Observable, map, take } from 'rxjs';
import { AuthFacade } from 'src/app/store/auth';
import { PostFacade } from 'src/app/store/post/post.facade';
import { bindTokenToPayload } from '../api/utils';
import { GetPostsRequest } from 'src/app/pb/post_pb';

export const canActivatePosts: CanActivateFn = (): Observable<
  boolean | UrlTree
> => {
  const authFacade = inject(AuthFacade);
  const postsFacade = inject(PostFacade);
  const router = inject(Router);

  const errorPageUrlTree = router.createUrlTree(['/', 'generic-error']);

  return authFacade.authState$.pipe(
    take(1),
    map((authState) => {
      if (isNil(authState.data) || isNil(authState.data.token)) {
        return errorPageUrlTree;
      }

      const payload = bindTokenToPayload<GetPostsRequest.AsObject>(
        { page: 1, pageSize: 10 },
        authState
      );

      if (isNil(payload)) {
        return errorPageUrlTree;
      }

      postsFacade.getInitPosts(payload);

      return true;
    })
  );
};
