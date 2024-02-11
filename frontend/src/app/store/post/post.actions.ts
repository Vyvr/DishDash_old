import { createAction, props } from '@ngrx/store';
import { CreatePostRequest, CreatePostResponse } from 'src/app/pb/post_pb';

const moduleName = 'Posts';

export const createPost = createAction(
  `[${moduleName}] Create post`,
  props<CreatePostRequest.AsObject>()
);

export const createPostSuccess = createAction(
  `[${moduleName}] Create post success`,
  props<CreatePostResponse.AsObject>()
);

export const createPostFailure = createAction(
  `[${moduleName}] Create post failure`,
  props<{ message: string }>()
);
