import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '..';

import * as actions from './menuBookPost.actions';
import * as selectors from './menuBookPost.selectors';
import { GetPostsFromMenuBookRequest } from 'src/app/pb/menu_book_post_pb';


@Injectable()
export class MenuBookPostFacade {
  menuBookPostState$ = this.store.select(selectors.selectMenuBookPostsState);

  constructor(private store: Store<AppState>) {}

  getPostsFromMenuBook(payload: GetPostsFromMenuBookRequest.AsObject): void {
    this.store.dispatch(actions.getPostsFromMenuBook(payload));
  }

  // addImages(payload: AddPostImagesRequest.AsObject): void {
  //   this.store.dispatch(actions.addImages(payload));
  // }
  // getImageStream(payload: GetImageStreamRequest.AsObject): void {
  //   this.store.dispatch(actions.getImageStream(payload));
  // }
}