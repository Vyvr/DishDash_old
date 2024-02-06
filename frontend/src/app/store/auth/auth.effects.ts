import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AppState } from '..';
import { Injectable } from '@angular/core';
import { Router } from "@angular/router";

import * as actions from './auth.actions';
import { catchError, map, of, switchMap, tap } from 'rxjs';
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
      switchMap(({ email, password }) =>
        this.authApiService.login(email, password).pipe(
          map((response) => {
            return actions.loginSuccess(response);
          }),
          tap(() => this.router.navigate(['/dashboard'])),
          catchError((error) => of(actions.loginFailure(error)))
        )
      )
    )
  );

  registerEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.register),
      switchMap(({ name, surname, email, password }) =>
        this.authApiService.register(name, surname, email, password).pipe(
          map((response) => actions.registerSuccess(response)),
          catchError((error) => of(actions.registerFailure(error)))
        )
      )
    )
  );
}
