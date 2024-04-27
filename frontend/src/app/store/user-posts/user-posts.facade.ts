import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '..';

import * as actions from './user-posts.actions';
import * as selectors from './user-posts.selectors';
import {
  GetImageStreamRequest,
  GetPostsRequest,
  GetCommentsRequest,
  CommentPostRequest,
  EditCommentRequest,
  DeleteCommentRequest,
  DeletePostRequest,
  EditPostRequest,
} from 'src/app/pb/post_pb';

@Injectable()
export class UserPostsFacade {
  userPostsState$ = this.store.select(selectors.selectUserPostsState);
  stopLoading$ = this.store.select(selectors.selectStopLoading);

  constructor(private store: Store<AppState>) {}

  getPosts(payload: GetPostsRequest.AsObject): void {
    this.store.dispatch(actions.getUserPosts(payload));
  }

  deleteUserPost(payload: DeletePostRequest.AsObject): void {
    this.store.dispatch(actions.deleteUserPost(payload));
  }

  editUserPost(payload: EditPostRequest.AsObject): void {
    this.store.dispatch(actions.editPost(payload));
  }

  getImageStream(payload: GetImageStreamRequest.AsObject): void {
    this.store.dispatch(actions.getImageStream(payload));
  }

  getComments(payload: GetCommentsRequest.AsObject): void {
    this.store.dispatch(actions.getComments(payload));
  }

  commentPost(payload: CommentPostRequest.AsObject): void {
    this.store.dispatch(actions.commentPost(payload));
  }

  editComment(payload: EditCommentRequest.AsObject): void {
    this.store.dispatch(actions.editComment(payload));
  }

  deleteComment(payload: DeleteCommentRequest.AsObject): void {
    this.store.dispatch(actions.deleteComment(payload));
  }
}
