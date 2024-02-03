import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as actions from './auth.actions';
import { AppState } from '..';
import { LoginRequest, LoginResponse } from 'src/app/proto/auth_pb';

@Injectable()
export class AuthFacade {
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
