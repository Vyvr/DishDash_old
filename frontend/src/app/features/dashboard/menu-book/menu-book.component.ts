import { Component } from '@angular/core';
import {
  OnDestroyMixin,
  untilComponentDestroyed,
} from '@w11k/ngx-componentdestroyed';
import { isNil } from 'lodash-es';
import {
  BehaviorSubject,
  Observable,
  combineLatest,
  map,
  take,
  withLatestFrom,
} from 'rxjs';
import { GetImageStreamRequest } from 'src/app/pb/post_pb';
import { AuthFacade } from 'src/app/store/auth';
import {
  InternalMenuBookPost,
  MenuBookPostFacade,
} from 'src/app/store/menuBookPost';
import { base64ToBlob } from '../../utils';
import { bindTokenToPayload } from 'src/app/core/api/utils';

@Component({
  selector: 'app-menu-book',
  templateUrl: './menu-book.component.html',
  styleUrls: ['./menu-book.component.scss'],
})
export class MenuBookComponent extends OnDestroyMixin {
  menuBookPostState$ = this.menuBookPostFacade.menuBookPostState$;

  selectedPostId$: BehaviorSubject<string> = new BehaviorSubject('');
  selectedPostData$: Observable<InternalMenuBookPost | undefined> =
    this._selectPostData$();

  images$: Observable<string[]> = this.selectedPostData$.pipe(
    untilComponentDestroyed(this),
    map((selectedPostData) => {
      return (
        selectedPostData?.pictures.map((picture) => {
          if (isNil(picture.data)) {
            return '';
          }

          const contentType = 'image/png';
          const base64String: string = picture.data?.toString();
          const imageBlob = base64ToBlob(base64String, contentType);
          const imageUrl = URL.createObjectURL(imageBlob);

          return imageUrl;
        }) ?? []
      );
    })
  );

  constructor(
    private authFacade: AuthFacade,
    private menuBookPostFacade: MenuBookPostFacade
  ) {
    super();
  }

  private _selectPostData$(): Observable<InternalMenuBookPost | undefined> {
    return combineLatest([
      this.menuBookPostFacade.menuBookPostState$,
      this.selectedPostId$,
    ]).pipe(
      untilComponentDestroyed(this),
      map(([menuBookPostState, postId]) => {
        const selectedPostData = menuBookPostState.data?.find(
          ({ id }) => id === postId
        );

        return selectedPostData;
      })
    );
  }

  onPostSelected(postId: string): void {
    this.selectedPostId$.next(postId);

    this.selectedPostData$
      .pipe(
        untilComponentDestroyed(this),
        take(1),
        withLatestFrom(this.authFacade.authState$)
      )
      .subscribe(([selectedPostData, authState]) => {
        selectedPostData?.pictures.forEach(({ path }) => {
          const payload = bindTokenToPayload<GetImageStreamRequest.AsObject>(
            {
              picturePath: path,
            },
            authState
          );

          if (isNil(payload)) {
            return;
          }

          this.menuBookPostFacade.getImageStream(payload);
        });
      });
  }
}
