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
  CommentPostRequest,
  GetCommentsRequest,
  GetCommentsResponse,
  EditCommentRequest,
  DeleteCommentRequest,
  CommentOperationMessageResponse,
  CommentPostResponse,
} from 'src/app/pb/post_pb';
import { CreatePostPayload } from './post.model';

const moduleName = 'Posts';

//---------------CREATE POST---------------------
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

//---------------GET FRIENDS POSTS---------------------

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

//---------------GET IMAGE STREAM---------------------

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

//---------------LIKE POST---------------------

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

//---------------UNLIKE POST---------------------

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

//---------------GET COMMENTS---------------------

export const getComments = createAction(
  `[${moduleName}] Get comments`,
  props<GetCommentsRequest.AsObject>()
);

export const getCommentsSuccess = createAction(
  `[${moduleName}] Get comments success`,
  props<GetCommentsResponse.AsObject>()
);

export const getCommentsFailure = createAction(
  `[${moduleName}] Get comments failure`,
  props<{ message: string }>()
);
//---------------CLEAR COMMENTS---------------------

export const clearComments = createAction(
  `[${moduleName}] Clear comments`,
  props<{ postId: string }>()
);

export const clearCommentsSuccess = createAction(
  `[${moduleName}] Clear comments success`,
  props<{ postId: string }>()
);

export const clearCommentsFailure = createAction(
  `[${moduleName}] Clear comments failure`,
  props<{ message: string }>()
);

//---------------COMMENT POST---------------------

export const commentPost = createAction(
  `[${moduleName}] Comment post`,
  props<CommentPostRequest.AsObject>()
);

export const commentPostSuccess = createAction(
  `[${moduleName}] Comment post success`,
  props<CommentPostResponse.AsObject>()
);

export const commentPostFailure = createAction(
  `[${moduleName}] Comment post failure`,
  props<{ message: string }>()
);

//---------------EDIT COMMENT---------------------

export const editComment = createAction(
  `[${moduleName}] Edit comment`,
  props<EditCommentRequest.AsObject>()
);

export const editCommentSuccess = createAction(
  `[${moduleName}] Edit comment success`,
  props<CommentOperationMessageResponse.AsObject>()
);

export const editCommentFailure = createAction(
  `[${moduleName}] Edit comment failure`,
  props<{ message: string }>()
);

//---------------DELETE COMMENT---------------------

export const deleteComment = createAction(
  `[${moduleName}] Delete comment`,
  props<DeleteCommentRequest.AsObject>()
);

export const deleteCommentSuccess = createAction(
  `[${moduleName}] Delete comment success`,
  props<CommentOperationMessageResponse.AsObject>()
);

export const deleteCommentFailure = createAction(
  `[${moduleName}] Delete comment failure`,
  props<{ message: string }>()
);
