import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { AppState } from '..';
import { LoginRequest, LoginResponse } from 'src/app/proto/auth_pb';

import * as actions from './auth.actions';
import * as selectors from './auth.selectors';

@Injectable()
export class AuthFacade {
  authState$ = this.store.select(selectors.selectAuthState);

  constructor(private store: Store<AppState>) {}

  login(payload: LoginRequest.AsObject): void {
    this.store.dispatch(actions.login(payload));
  }

  loginSuccess(payload: LoginResponse.AsObject): void {
    this.store.dispatch(actions.loginSuccess(payload));
  }

  loginFailure(payload: { message: string }): void {
    this.store.dispatch(actions.loginFailure(payload));
  }
}
