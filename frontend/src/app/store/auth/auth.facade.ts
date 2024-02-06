import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { AppState } from '..';
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from 'src/app/proto/auth_pb';

import * as actions from './auth.actions';
import * as selectors from './auth.selectors';

@Injectable()
export class AuthFacade {
  authState$ = this.store.select(selectors.selectAuthState);

  constructor(private store: Store<AppState>) {}

//---------------LOGIN---------------------


  login(payload: LoginRequest.AsObject): void {
    this.store.dispatch(actions.login(payload));
  }

  loginSuccess(payload: LoginResponse.AsObject): void {
    this.store.dispatch(actions.loginSuccess(payload));
  }

  loginFailure(payload: { message: string }): void {
    this.store.dispatch(actions.loginFailure(payload));
  }

  //---------------REGISTER---------------------

  register(payload: RegisterRequest.AsObject): void {
    this.store.dispatch(actions.register(payload));
  }

  registerSuccess(payload: RegisterResponse.AsObject): void {
    this.store.dispatch(actions.registerSuccess(payload));
  }

  registerFailure(payload: { message: string }): void {
    this.store.dispatch(actions.registerFailure(payload));
  }
}
