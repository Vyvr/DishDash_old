import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AppState } from '..';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import * as actions from './auth.actions';
import { catchError, exhaustMap, map, of, switchMap, tap } from 'rxjs';
import { AuthApiService } from 'src/app/core/api/auth-api.service';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private authApiService: AuthApiService,
    private router: Router
  ) {}

  loginEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.login),
      switchMap((payload) =>
        this.authApiService.login(payload).pipe(
          map((response) => {
            return actions.loginSuccess(response);
          }),
          tap(() => this.router.navigate(['/dashboard/posts'])),
          catchError((error) => of(actions.loginFailure(error)))
        )
      )
    )
  );

  refreshTokenEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.refreshToken),
      switchMap((payload) =>
        this.authApiService.refreshToken(payload).pipe(
          map((response) => {
            return actions.refreshTokenSuccess(response);
          }),
          catchError((error) => of(actions.refreshTokenFailure(error)))
        )
      )
    )
  );

  registerEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.register),
      switchMap((payload) =>
        this.authApiService.register(payload).pipe(
          map((response) => actions.registerSuccess(response)),
          catchError((error) => of(actions.registerFailure(error)))
        )
      )
    )
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.logout),
      exhaustMap(() => {
        localStorage.removeItem('auth');
        return of(actions.logoutSuccess());
      }),
      tap(() => this.router.navigate(['/auth'])),
      catchError((error) => of(actions.logoutFailure(error)))
    )
  );
}
