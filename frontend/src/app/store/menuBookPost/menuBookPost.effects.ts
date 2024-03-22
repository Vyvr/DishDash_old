import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AppState } from '..';
import { Injectable } from '@angular/core';

import * as actions from './menuBookPost.actions';
import { catchError, concatMap, map, of } from 'rxjs';
import { MenuBookPostFacade } from './menuBookPost.facade';
import { MenuBookPostApiService } from 'src/app/core/api/menu-book-api.service';
import { PostApiService } from 'src/app/core/api/post-api.service';

@Injectable()
export class MenuBookPostEffects {
  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private menuBookPostApiService: MenuBookPostApiService,
    private postApiService: PostApiService,
    private postFacade: MenuBookPostFacade
  ) {}

  getPostsFromMenuBookEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.getPostsFromMenuBook),
      concatMap(({ type: _, ...payload }) =>
        this.menuBookPostApiService.getPostsFromMenuBook(payload).pipe(
          map((response) => {
            return actions.getPostsFromMenuBookSuccess(response);
          }),
          catchError((error) => of(actions.getPostsFromMenuBookFailure(error)))
        )
      )
    )
  );

  // addImagesEffect$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(actions.addImages),
  //     concatMap(({ type: _, ...payload }) =>
  //       this.postApiService.addImages(payload).pipe(
  //         map((response) => {
  //           return actions.addImagesSuccess(response);
  //         }),
  //         catchError((error) => of(actions.addImagesFailure(error)))
  //       )
  //     )
  //   )
  // );

  getImageStreamEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.getImageStream),
      concatMap(({ type: _, ...payload }) =>
        this.postApiService.getImageStream(payload).pipe(
          map((response) => {
            return actions.getImageStreamSuccess(response);
          }),
          catchError((error) => of(actions.getImageStreamFailure(error)))
        )
      )
    )
  );

  deleteFromMenuBookEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.deleteFromMenuBook),
      concatMap(({ type: _, ...payload }) =>
        this.menuBookPostApiService.deleteFromMenuBook(payload).pipe(
          map((response) => {
            return actions.deleteFromMenuBookSuccess(response);
          }),
          catchError((error) => of(actions.deleteFromMenuBookFailure(error)))
        )
      )
    )
  );

  editMenuBookPostEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.editMenuBookPost),
      concatMap(({ type: _, ...payload }) =>
        this.menuBookPostApiService.editMenuBookPost(payload).pipe(
          map((response) => {
            return actions.editMenuBookPostSuccess(response);
          }),
          catchError((error) => of(actions.deleteFromMenuBookFailure(error)))
        )
      )
    )
  );
}
