import { createAction, props } from '@ngrx/store';
import {
  AddPostImagesRequest,
  CreatePostResponse,
  AddPostImagesResponse,
} from 'src/app/pb/post_pb';
import { CreatePostPayload } from './post.model';

const moduleName = 'Posts';

export const createPost = createAction(
  `[${moduleName}] Create post`,
  props<CreatePostPayload>()
);

export const createPostSuccess = createAction(
  `[${moduleName}] Create post success`,
  props<CreatePostResponse.AsObject>()
);

export const createPostFailure = createAction(
  `[${moduleName}] Create post failure`,
  props<{ message: string }>()
);

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
