import { createAction, props } from '@ngrx/store';
import {
  AddPostImagesRequest,
  CreatePostResponse,
  AddPostImagesResponse,
  GetPostsRequest,
  GetPostsResponse,
  GetImageStreamRequest,
  GetImageStreamResponse,
  ToggleLikeRequest,
  ToggleLikeResponse,
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

export const getFriendsPosts = createAction(
  `[${moduleName}] Get friends posts`,
  props<GetPostsRequest.AsObject>()
);

export const getFriendsPostsSuccess = createAction(
  `[${moduleName}] Get friends posts success`,
  props<GetPostsResponse.AsObject>()
);

export const getFriendsPostsFailure = createAction(
  `[${moduleName}] Get friends posts failure`,
  props<{ message: string }>()
);

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

export const likePost = createAction(
  `[${moduleName}] Like post`,
  props<ToggleLikeRequest.AsObject>()
);

export const likePostSuccess = createAction(
  `[${moduleName}] Like post success`,
  props<ToggleLikeResponse.AsObject>()
);

export const likePostFailure = createAction(
  `[${moduleName}] Like post failure`,
  props<{ message: string }>()
);

export const unlikePost = createAction(
  `[${moduleName}] Unlike post`,
  props<ToggleLikeRequest.AsObject>()
);

export const unlikePostSuccess = createAction(
  `[${moduleName}] Unlike post success`,
  props<ToggleLikeResponse.AsObject>()
);

export const unlikePostFailure = createAction(
  `[${moduleName}] Unlike post failure`,
  props<{ message: string }>()
);
