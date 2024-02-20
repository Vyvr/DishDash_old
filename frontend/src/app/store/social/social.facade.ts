import { Injectable } from '@angular/core';
import { AppState } from '..';
import { Store } from '@ngrx/store';
import {
  AddToFriendsRequest,
  DeleteFromFriendsRequest,
  GetFriendsRequest,
} from 'src/app/pb/user_pb';

import * as actions from './social.actions';
import * as selectors from './social.selectors';

@Injectable()
export class SocialFacade {
  socialState$ = this.store.select(selectors.selectSocialState);

  constructor(private store: Store<AppState>) {}

  addToFriends(payload: AddToFriendsRequest.AsObject): void {
    this.store.dispatch(actions.addToFriends(payload));
  }

  deleteFromFriends(payload: DeleteFromFriendsRequest.AsObject): void {
    this.store.dispatch(actions.deleteFromFriends(payload));
  }

  getFriends(payload: GetFriendsRequest.AsObject): void {
    this.store.dispatch(actions.getFriends(payload));
  }
}
