import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { isNil } from 'lodash-es';
import { Observable, map, take } from 'rxjs';
import { AuthFacade } from 'src/app/store/auth';

import { bindTokenToPayload } from '../api/utils';
import { GetPostsFromMenuBookRequest } from 'src/app/pb/menu_book_post_pb';
import { MenuBookPostFacade } from 'src/app/store/menuBookPost/menuBookPost.facade';

export const canActivateMenuBook: CanActivateFn = (): Observable<
  boolean | UrlTree
> => {
  const authFacade = inject(AuthFacade);
  const menuBookPostFacade = inject(MenuBookPostFacade);
  const router = inject(Router);

  const errorPageUrlTree = router.createUrlTree(['/', 'generic-error']);

  return authFacade.authState$.pipe(
    take(1),
    map((authState) => {
      if (isNil(authState.data) || isNil(authState.data.token)) {
        return errorPageUrlTree;
      }

      const payload = bindTokenToPayload<GetPostsFromMenuBookRequest.AsObject>(
        { page: 0, pageSize: 10 },
        authState
      );

      if (isNil(payload)) {
        return errorPageUrlTree;
      }

      menuBookPostFacade.getPostsFromMenuBook(payload);

      return true;
    })
  );
};
