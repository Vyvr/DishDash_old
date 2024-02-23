import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '..';

import * as actions from './post.actions';
import * as selectors from './post.selectors';
import { CreatePostPayload } from './post.model';
import { AddPostImagesRequest, GetPostsRequest } from 'src/app/pb/post_pb';

@Injectable()
export class PostFacade {
  postState$ = this.store.select(selectors.selectPostsState);

  constructor(private store: Store<AppState>) {}

  createPost(payload: CreatePostPayload): void {
    this.store.dispatch(actions.createPost(payload));
  }

  addImages(payload: AddPostImagesRequest.AsObject): void {
    this.store.dispatch(actions.addImages(payload));
  }

  getPosts(payload: GetPostsRequest.AsObject): void {
    this.store.dispatch(actions.getFriendsPosts(payload));
  }
}
