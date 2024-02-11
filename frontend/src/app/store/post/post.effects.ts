import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AppState } from '..';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import * as actions from './post.actions';
import {
  catchError,
  concatMap,
  exhaustMap,
  map,
  mergeMap,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { AuthApiService } from 'src/app/core/api/auth-api.service';
import { Action } from 'rxjs/internal/scheduler/Action';
import { PostApiService } from 'src/app/core/api/post-api.service';

@Injectable()
export class PostEffects {
  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private postApiService: PostApiService
  ) {}

  createPostEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.createPost),
      concatMap(({type: _, ...payload}) =>
        this.postApiService.createPost(payload).pipe(
          map((response) => {
            return actions.createPostSuccess(response);
          }),
          catchError((error) => of(actions.createPostFailure(error)))
        )
      )
    )
  );
}
