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

  addToMenuBookEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.addToMenuBook),
      concatMap(({ type: _, ...payload }) =>
        this.postApiService.addToMenuBook(payload).pipe(
          map((response) => {
            return actions.addToMenuBookSuccess(response);
          }),
          catchError((error) => of(actions.addToMenuBookFailure(error)))
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

  getInitPostsEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.getInitPosts),
      concatMap(({ type: _, ...payload }) =>
        this.postApiService.getFriendsPosts(payload).pipe(
          map((response) => {
            return actions.getInitPostsSuccess(response);
          }),
          catchError((error) => of(actions.getInitPostsFailure(error)))
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

  likePostEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.likePost),
      concatMap(({ type: _, ...payload }) =>
        this.postApiService.likePost(payload).pipe(
          map((response) => {
            return actions.likePostSuccess(response);
          }),
          catchError((error) => of(actions.likePostFailure(error)))
        )
      )
    )
  );

  unlikePostPostEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.unlikePost),
      concatMap(({ type: _, ...payload }) =>
        this.postApiService.unlikePost(payload).pipe(
          map((response) => {
            return actions.unlikePostSuccess(response);
          }),
          catchError((error) => of(actions.unlikePostFailure(error)))
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
