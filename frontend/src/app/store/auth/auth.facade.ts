import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { AppState } from '..';
import {
  AddUserPictureRequest,
  GetUserPictureRequest,
  LoginRequest,
  RegisterRequest,
} from 'src/app/pb/auth_pb';

import * as actions from './auth.actions';
import * as selectors from './auth.selectors';
import { UpdateRequest } from 'src/app/pb/user_pb';

@Injectable()
export class AuthFacade {
  authState$ = this.store.select(selectors.selectAuthState);

  constructor(private store: Store<AppState>) {}

  //---------------LOGIN---------------------

  login(payload: LoginRequest.AsObject): void {
    this.store.dispatch(actions.login(payload));
  }

  //---------------LOGOUT---------------------
  logout(): void {
    this.store.dispatch(actions.logout());
  }

  //---------------REGISTER---------------------

  register(payload: RegisterRequest.AsObject): void {
    this.store.dispatch(actions.register(payload));
  }

  //---------------REFRESH--------------------
  refreshToken(payload: { token: string }): void {
    this.store.dispatch(actions.refreshToken(payload));
  }

  //---------------GER USER PICTURE--------------------
  getUserPicture(payload: GetUserPictureRequest.AsObject): void {
    this.store.dispatch(actions.getUserPicture(payload));
  }

  //---------------ADD USER PICTURE--------------------
  addUserPicture(payload: AddUserPictureRequest.AsObject): void {
    this.store.dispatch(actions.addUserPicture(payload));
  }

  //---------------ADD USER PICTURE--------------------
  updateUserData(payload: UpdateRequest.AsObject): void {
    this.store.dispatch(actions.updateUserData(payload));
  }
}
