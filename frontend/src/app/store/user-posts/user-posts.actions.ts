import { createAction, props } from '@ngrx/store';
import {
  GetImageStreamRequest,
  GetImageStreamResponse,
  GetPostsRequest,
  GetPostsResponse,
  CommentPostRequest,
  CommentPostResponse,
  GetCommentsRequest,
  GetCommentsResponse,
  DeleteCommentRequest,
  EditCommentRequest,
  CommentOperationMessageResponse,
  DeletePostRequest,
  DeletePostResponse,
} from 'src/app/pb/post_pb';

const moduleName = 'UserPosts';

//---------------GET USER POSTS---------------------

export const getUserPosts = createAction(
  `[${moduleName}] Get user posts`,
  props<GetPostsRequest.AsObject>()
);

export const getUserPostsSuccess = createAction(
  `[${moduleName}] Get user posts success`,
  props<GetPostsResponse.AsObject>()
);

export const getUserPostsFailure = createAction(
  `[${moduleName}] Get user posts failure`,
  props<{ message: string }>()
);

//---------------DELETE POST---------------------
export const deleteUserPost = createAction(
  `[${moduleName}] Delete user post`,
  props<DeletePostRequest.AsObject>()
);

export const deleteUserPostSuccess = createAction(
  `[${moduleName}] Delete user post success`,
  props<DeletePostResponse.AsObject>()
);

export const deleteUserPostFailure = createAction(
  `[${moduleName}] Delete user post failure`,
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
