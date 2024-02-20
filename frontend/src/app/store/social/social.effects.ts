import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { SocialApiService } from 'src/app/core/api/social-api.service';
import { AppState } from '..';

import * as actions from './social.actions';
import { catchError, map, mergeMap, of } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class SocialEffects {
  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private socialApiService: SocialApiService
  ) {}

  addToFriendsEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.addToFriends),
      mergeMap(({ type: _, ...payload }) => 
        this.socialApiService.addToFriends(payload).pipe(
          map((response) => {
            return actions.addToFriendsSuccess(response);
          }),
          catchError((error) => of(actions.addToFriendsFailure(error)))
        )
      )
    )
  );

  deleteFromFriendsEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.deleteFromFriends),
      mergeMap(({ type: _, ...payload }) => 
        this.socialApiService.deleteFromFriends(payload).pipe(
          map((response) => {
            return actions.deleteFromFriendsSuccess(response);
          }),
          catchError((error) => of(actions.deleteFromFriendsFailure(error)))
        )
      )
    )
  );

  getFriendsEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.getFriends),
      mergeMap(({ type: _, ...payload }) => 
        this.socialApiService.getFriends(payload).pipe(
          map((response) => {
            return actions.getFriendsSuccess(response);
          }),
          catchError((error) => of(actions.getFriendsFailure(error)))
        )
      )
    )
  );
}
