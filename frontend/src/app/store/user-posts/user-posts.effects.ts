import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AppState } from '..';
import { Injectable } from '@angular/core';

import * as actions from './user-posts.actions';
import { catchError, concatMap, map, of } from 'rxjs';
import { PostApiService } from 'src/app/core/api/post-api.service';
import { UserPostsFacade } from './user-posts.facade';

@Injectable()
export class UserPostsEffects {
  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private postApiService: PostApiService,
    private userPostsFacade: UserPostsFacade
  ) {}

  getUserPostsEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.getUserPosts),
      concatMap(({ type: _, ...payload }) =>
        this.postApiService.getUserPosts(payload).pipe(
          map((response) => {
            return actions.getUserPostsSuccess(response);
          }),
          catchError((error) => of(actions.getUserPostsFailure(error)))
        )
      )
    )
  );

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

  getCommentsEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.getComments),
      concatMap(({ type: _, ...payload }) =>
        this.postApiService.getComments(payload).pipe(
          map((response) => {
            return actions.getCommentsSuccess(response);
          }),
          catchError((error) => of(actions.getCommentsFailure(error)))
        )
      )
    )
  );

  commentPostEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.commentPost),
      concatMap(({ type: _, ...payload }) =>
        this.postApiService.commentPost(payload).pipe(
          map((response) => {
            return actions.commentPostSuccess(response);
          }),
          catchError((error) => of(actions.commentPostFailure(error)))
        )
      )
    )
  );

  editCommentEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.editComment),
      concatMap(({ type: _, ...payload }) =>
        this.postApiService.editComment(payload).pipe(
          map((response) => {
            return actions.editCommentSuccess(response);
          }),
          catchError((error) => of(actions.editCommentFailure(error)))
        )
      )
    )
  );

  deleteCommentEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.deleteComment),
      concatMap(({ type: _, ...payload }) =>
        this.postApiService.deleteComment(payload).pipe(
          map((response) => {
            return actions.deleteCommentSuccess(response);
          }),
          catchError((error) => of(actions.deleteCommentFailure(error)))
        )
      )
    )
  );
}
