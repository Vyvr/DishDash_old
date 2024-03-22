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
  filter,
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
import {
  DeleteFromMenuBookRequest,
  EditMenuBookPostRequest,
} from 'src/app/pb/menu_book_post_pb';
import { EditedData } from './menu-book.model';

@Component({
  selector: 'app-menu-book',
  templateUrl: './menu-book.component.html',
  styleUrls: ['./menu-book.component.scss'],
})
export class MenuBookComponent extends OnDestroyMixin {
  menuBookPostState$ = this.menuBookPostFacade.menuBookPostState$;
  authState$ = this.authFacade.authState$;

  isEditMode: boolean = false;

  selectedPostId$: BehaviorSubject<string> = new BehaviorSubject('');
  selectedPostData$: Observable<InternalMenuBookPost | undefined> =
    this._selectPostData$();

  images$: Observable<string[]> = this.getPostImages$();

  constructor(
    private authFacade: AuthFacade,
    private menuBookPostFacade: MenuBookPostFacade
  ) {
    super();
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
    this.isEditMode = false;
  }

  onDeleteFromMenuBook(postId: string): void {
    if (isNil(postId)) {
      return;
    }

    this.authState$
      .pipe(
        untilComponentDestroyed(this),
        filter(({ data, loading }) => !isNil(data) && !loading),
        take(1)
      )
      .subscribe((authState) => {
        const payload = bindTokenToPayload<DeleteFromMenuBookRequest.AsObject>(
          { postId },
          authState
        );

        if (isNil(payload)) {
          return;
        }

        this.menuBookPostFacade.deleteFromMenuBook(payload);
      });
  }

  onEditFromMenuBook(editedData: EditedData): void {
    if (isNil(editedData)) {
      return;
    }

    this.authState$
      .pipe(
        untilComponentDestroyed(this),
        filter(({ data, loading }) => !isNil(data) && !loading),
        take(1)
      )
      .subscribe((authState) => {
        const payload = bindTokenToPayload<EditMenuBookPostRequest.AsObject>(
          {
            postId: editedData.postId,
            title: editedData.title,
            ingredients: editedData.ingredients,
            preparation: editedData.preparation,
          },
          authState
        );

        if (isNil(payload)) {
          return;
        }

        this.menuBookPostFacade.editMenuBookPost(payload);
      });
      this.isEditMode = false;
  }

  onToggleEdit(): void {
    this.isEditMode = !this.isEditMode;
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

  private getPostImages$(): Observable<string[]> {
    return this.selectedPostData$.pipe(
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
  }
}
