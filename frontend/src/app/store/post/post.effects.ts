import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AppState } from '..';
import { Injectable } from '@angular/core';

import * as actions from './post.actions';
import { catchError, concatMap, map, of } from 'rxjs';
import { PostApiService } from 'src/app/core/api/post-api.service';
import { PostFacade } from './post.facade';

@Injectable()
export class PostEffects {
  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private postApiService: PostApiService,
    private postFacade: PostFacade
  ) {}

  createPostEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.createPost),
      concatMap(({ type: _, picturesBuckets, ...payload }) =>
        this.postApiService.createPost(payload).pipe(
          map((response) => {
            picturesBuckets.forEach((images) => {
              this.postFacade.addImages({
                ownerId: payload.ownerId,
                id: response.id,
                token: payload.token,
                imagesList: images,
              });
            });

            return actions.createPostSuccess(response);
          }),
          catchError((error) => of(actions.createPostFailure(error)))
        )
      )
    )
  );

  addImagesEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.addImages),
      concatMap(({ type: _, ...payload }) =>
        this.postApiService.addImages(payload).pipe(
          map((response) => {
            return actions.addImagesSuccess(response);
          }),
          catchError((error) => of(actions.addImagesFailure(error)))
        )
      )
    )
  );

  getFriendsPostsEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.getFriendsPosts),
      concatMap(({ type: _, ...payload }) =>
        this.postApiService.getFriendsPosts(payload).pipe(
          map((response) => {
            return actions.getFriendsPostsSuccess(response);
          }),
          catchError((error) => of(actions.getFriendsPostsFailure(error)))
        )
      )
    )
  );
}
