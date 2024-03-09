import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '..';

import * as actions from './post.actions';
import * as selectors from './post.selectors';
import { CreatePostPayload } from './post.model';
import {
  AddPostImagesRequest,
  CommentPostRequest,
  DeleteCommentRequest,
  EditCommentRequest,
  GetCommentsRequest,
  GetImageStreamRequest,
  GetPostsRequest,
  ToggleLikeRequest,
} from 'src/app/pb/post_pb';

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

  getImageStream(payload: GetImageStreamRequest.AsObject): void {
    this.store.dispatch(actions.getImageStream(payload));
  }

  likePost(payload: ToggleLikeRequest.AsObject): void {
    this.store.dispatch(actions.likePost(payload));
  }

  unlikePost(payload: ToggleLikeRequest.AsObject): void {
    this.store.dispatch(actions.unlikePost(payload));
  }

  getComments(payload: GetCommentsRequest.AsObject): void {
    this.store.dispatch(actions.getComments(payload));
  }

  clearComments(payload: { postId: string }): void {
    this.store.dispatch(actions.clearCommentsSuccess(payload));
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
