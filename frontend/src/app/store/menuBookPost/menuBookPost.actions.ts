import { createAction, props } from '@ngrx/store';
import { GetPostsFromMenuBookRequest, GetPostsFromMenuBookResponse } from 'src/app/pb/menu_book_post_pb';
import {
  AddPostImagesRequest,
  AddPostImagesResponse,
  GetImageStreamRequest,
  GetImageStreamResponse,

} from 'src/app/pb/post_pb';

const moduleName = 'MenuBookPosts';

//---------------GET POSTS FROM MENU BOOK---------------------

export const getPostsFromMenuBook = createAction(
  `[${moduleName}] Get posts from menu book`,
  props<GetPostsFromMenuBookRequest.AsObject>()
);

export const getPostsFromMenuBookSuccess = createAction(
  `[${moduleName}] Get posts from menu book success`,
  props<GetPostsFromMenuBookResponse.AsObject>()
);

export const getPostsFromMenuBookFailure = createAction(
  `[${moduleName}] Get posts from menu book failure`,
  props<{ message: string }>()
);

//---------------ADD IMAGES---------------------
export const addImages = createAction(
  `[${moduleName}] Add images to post`,
  props<AddPostImagesRequest.AsObject>()
);

export const addImagesSuccess = createAction(
  `[${moduleName}] Add images to post success`,
  props<AddPostImagesResponse.AsObject>()
);

export const addImagesFailure = createAction(
  `[${moduleName}] Add images to post failure`,
  props<{ message: string }>()
);

//---------------GET IMAGE STREAM---------------------
// @TODO to remake. Token contains userId but for owner of the post. Not the holder.
// problem would be fixed after making copy of saved post on backend and creating new method for this.
export const getImageStream = createAction(
  `[${moduleName}] Get image stream posts`,
  props<GetImageStreamRequest.AsObject>()
);

export const getImageStreamSuccess = createAction(
  `[${moduleName}] Get image stream success`,
  props<GetImageStreamResponse.AsObject>()
);

export const getImageStreamFailure = createAction(
  `[${moduleName}] Get image stream failure`,
  props<{ message: string }>()
);