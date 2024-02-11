import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '..';

import * as actions from './post.actions';
import * as selectors from './post.selectors';
import { CreatePostRequest, CreatePostResponse } from 'src/app/pb/post_pb';

@Injectable()
export class PostFacade {
  postState$ = this.store.select(selectors.selectPostsState);

  constructor(private store: Store<AppState>) {}

  //---------------CREATE---------------------
  createPost(payload: CreatePostRequest.AsObject): void {
    this.store.dispatch(actions.createPost(payload));
  }

  createPostSuccess(payload: CreatePostResponse.AsObject): void {
    this.store.dispatch(actions.createPostSuccess(payload));
  }

  createPostFailure(payload: { message: string }): void {
    this.store.dispatch(actions.createPostFailure(payload));
  }
}
