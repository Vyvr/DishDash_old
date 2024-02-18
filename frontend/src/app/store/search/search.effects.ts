import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AppState } from '..';
import { SearchApiService } from 'src/app/core/api/search-api.service';
import { Injectable } from '@angular/core';

import * as actions from './search.actions';
import { catchError, map, of, switchMap } from 'rxjs';

@Injectable()
export class SearchEffects {
  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private searchApiService: SearchApiService
  ) {}

  searchByQueryEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.searchByQuery),
      switchMap(({ type: _, ...payload }) =>
        this.searchApiService.searchUsersByQuery(payload).pipe(
          map((response) => {
            return actions.searchByQuerySuccess(response);
          }),
          catchError((error) => of(actions.searchByQueryFailure(error)))
        )
      )
    )
  );
}
