import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AppState } from '..';
import { Injectable } from '@angular/core';

import * as actions from './auth.actions';
import { catchError, map, of, switchMap } from 'rxjs';
import { AuthApiService } from 'src/app/core/api/auth-api.service';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private authApiService: AuthApiService
  ) {}

  loginEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.login),
      switchMap(({ email, password }) =>
        this.authApiService.login(email, password).pipe(
          map((response) => actions.loginSuccess(response)),
          catchError((error) => of(actions.loginFailure(error)))
        )
      )
    )
  );
}
