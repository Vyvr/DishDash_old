import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AppState } from '..';
import { Injectable } from '@angular/core';

import * as actions from './analytics.actions';
import { catchError, concatMap, map, of } from 'rxjs';
import { PostApiService } from 'src/app/core/api/post-api.service';

@Injectable()
export class AnalyticsEffects {
  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private postApiService: PostApiService
  ) {}

  getPostsFromMenuBookEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.GetAllPostLikesAnaliticsLikesData),
      concatMap(({ type: _, ...payload }) =>
        this.postApiService.GetAllPostLikesAnaliticsLikesData(payload).pipe(
          map((response) => {
            return actions.GetAllPostLikesAnaliticsLikesDataSuccess(response);
          }),
          catchError((error) =>
            of(actions.GetAllPostLikesAnaliticsLikesDataFailure(error))
          )
        )
      )
    )
  );
}
