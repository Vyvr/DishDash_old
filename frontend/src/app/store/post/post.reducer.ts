import { createReducer, on } from '@ngrx/store';
import { initialState } from './post.model';

import * as actions from './post.actions';
import { errorState, loadedState, loadingState } from '../utils';
import { isNil } from 'lodash-es';
import { Post } from 'src/app/pb/post_pb';
import { environment } from 'src/app/environments/environment';

export const postReducer = createReducer(
  initialState,
  //---------------CREATE---------------------
  on(actions.createPost, (state) => ({ ...state, ...loadingState })),
  // on(actions.createPostSuccess, (state, { type: _, ...post }) => {
  on(actions.createPostSuccess, (state) => {
    return {
      ...state,
      ...loadedState,
      data: [
        ...(state.data ?? []),
        // {
        //   ...post,
        //   likesCount: 0,
        //   commentsCount: 0,
        //   commentsList: [],
        //   picturePathList: [],
        //   liked: false,
        //   isInMenuBook: false,
        // },
      ],
    };
  }),
  on(actions.createPostFailure, (state, { message }) => {
    return {
      ...state,
      ...errorState(message),
    };
  }),
  //---------------ADD TO MENU BOOK---------------------
  on(actions.addToMenuBook, (state) => ({ ...state })),
  on(actions.addToMenuBookSuccess, (state, { postId }) => {
    const defaultReturn = { ...state };
    const postIndex = state.data?.findIndex((p) => p.id === postId);

    if (!isNil(postIndex) && !isNil(state.data)) {
      const updatedPost = {
        ...state.data[postIndex],
        isInMenuBook: true,
      };

      const updatedData = [
        ...state.data.slice(0, postIndex),
        updatedPost,
        ...state.data.slice(postIndex + 1),
      ];

      return {
        ...state,
        ...loadedState,
        data: updatedData,
      };
    }

    return defaultReturn;
  }),
  on(actions.addToMenuBookFailure, (state, { message }) => {
    return {
      ...state,
      ...errorState(message),
    };
  }),
  //---------------ADD IMAGES---------------------
  on(actions.addImages, (state) => ({ ...state, ...loadingState })),
  on(actions.addImagesSuccess, (state) => ({ ...state, ...loadedState })),
  on(actions.addImagesFailure, (state, { message }) => ({
    ...state,
    ...errorState(message),
  })),
  //---------------GET FRIENDS POSTS---------------------
  on(actions.getFriendsPosts, (state) => ({ ...state, ...loadingState })),
  on(actions.getFriendsPostsSuccess, (state, { postsList }) => {
    if (postsList.length === 1 && postsList[0].id === '') {
      return {
        ...state,
        ...loadedState,
        stopLoading: true,
      };
    }

    const existingPostsMap = new Map(
      state.data?.map((post) => [post.id, post]) ?? []
    );

    const newUniquePosts = postsList.filter(
      (post) => !existingPostsMap.has(post.id)
    );

    const updatedPathsPosts: Post.AsObject[] = newUniquePosts.map((post) => {
      const updatedPaths = post.picturePathList.map(
        (path) => environment.picturesServer + path
      );
      const updatedPost: Post.AsObject = {
        ...post,
        picturePathList: updatedPaths,
      };

      return updatedPost;
    });

    console.log('aa')

    const combinedPosts = [...(state.data ?? []), ...updatedPathsPosts];

    combinedPosts.sort((a: Post.AsObject, b: Post.AsObject) => {
      if (isNil(a.creationDate) || isNil(b.creationDate)) {
        return 0;
      }
      const timeA = a.creationDate
        ? a.creationDate.seconds * 1000 + a.creationDate.nanos / 1000000
        : Number.MAX_SAFE_INTEGER;
      const timeB = b.creationDate
        ? b.creationDate.seconds * 1000 + b.creationDate.nanos / 1000000
        : Number.MAX_SAFE_INTEGER;

      return timeB - timeA;
    });

    return {
      ...state,
      ...loadedState,
      data: combinedPosts,
    };
  }),
  on(actions.getFriendsPostsFailure, (state, { message }) => ({
    ...state,
    ...errorState(message),
  })),
  //---------------GET INIT POSTS---------------------
  on(actions.getInitPosts, (state) => ({ ...state, ...loadingState })),
  on(actions.getInitPostsSuccess, (state, { postsList }) => {
    if (postsList.length === 1 && postsList[0].id === '') {
      return {
        ...state,
        ...loadedState,
        stopLoading: true,
      };
    }

    const updatedPathsPosts: Post.AsObject[] = postsList.map((post) => {
      const updatedPaths = post.picturePathList.map(
        (path) => environment.picturesServer + path
      );
      const updatedPost: Post.AsObject = {
        ...post,
        picturePathList: updatedPaths,
      };

      return updatedPost;
    });

    return {
      ...state,
      ...loadedState,
      data: [...updatedPathsPosts],
    };
  }),
  on(actions.getInitPostsFailure, (state, { message }) => ({
    ...state,
    ...errorState(message),
  })),
  //---------------LIKE POST---------------------
  on(actions.likePost, (state) => ({ ...state })),
  on(actions.likePostSuccess, (state, { type: _, postId }) => {
    const defaultReturn = { ...state };
    const postIndex = state.data?.findIndex((p) => p.id === postId);

    if (!isNil(postIndex) && !isNil(state.data)) {
      const updatedPost = {
        ...state.data[postIndex],
        likesCount: state.data[postIndex].likesCount + 1,
        liked: true,
      };

      const updatedData = [
        ...state.data.slice(0, postIndex),
        updatedPost,
        ...state.data.slice(postIndex + 1),
      ];

      return {
        ...state,
        ...loadedState,
        data: updatedData,
      };
    }

    return defaultReturn;
  }),
  on(actions.likePostFailure, (state, { message }) => ({
    ...state,
    ...errorState(message),
  })),
  //---------------UNLIKE POST---------------------
  on(actions.unlikePost, (state) => ({ ...state })),
  on(actions.unlikePostSuccess, (state, { type: _, postId }) => {
    const defaultReturn = { ...state };
    const postIndex = state.data?.findIndex((p) => p.id === postId);

    if (!isNil(postIndex) && !isNil(state.data)) {
      const updatedPost = {
        ...state.data[postIndex],
        likesCount: state.data[postIndex].likesCount - 1,
        liked: false,
      };

      const updatedData = [
        ...state.data.slice(0, postIndex),
        updatedPost,
        ...state.data.slice(postIndex + 1),
      ];

      return {
        ...state,
        ...loadedState,
        data: updatedData,
      };
    }

    return defaultReturn;
  }),
  on(actions.unlikePostFailure, (state, { message }) => ({
    ...state,
    ...errorState(message),
  })),
  //---------------GET COMMENTS---------------------
  on(actions.getComments, (state) => ({ ...state })),
  on(actions.getCommentsSuccess, (state, { type: _, postId, commentsList }) => {
    const defaultReturn = { ...state };
    const postIndex = state.data?.findIndex((p) => p.id === postId);

    if (!isNil(postIndex) && !isNil(state.data) && !isNil(commentsList)) {
      const updatedPost = {
        ...state.data[postIndex],
        commentsList: commentsList,
      };

      const updatedData = [
        ...state.data.slice(0, postIndex),
        updatedPost,
        ...state.data.slice(postIndex + 1),
      ];

      return {
        ...state,
        ...loadedState,
        data: updatedData,
      };
    }

    return defaultReturn;
  }),
  on(actions.getCommentsFailure, (state, { message }) => ({
    ...state,
    ...errorState(message),
  })),
  //---------------CLEAR COMMENTS---------------------
  on(actions.clearCommentsSuccess, (state, { type: _, postId }) => {
    const defaultReturn = { ...state };
    const postIndex = state.data?.findIndex((p) => p.id === postId);

    if (!isNil(postIndex) && !isNil(state.data)) {
      const updatedPost = {
        ...state.data[postIndex],
        commentsList: [],
      };

      const updatedData = [
        ...state.data.slice(0, postIndex),
        updatedPost,
        ...state.data.slice(postIndex + 1),
      ];

      return {
        ...state,
        ...loadedState,
        data: updatedData,
      };
    }

    return defaultReturn;
  }),
  //---------------COMMENT POST---------------------
  on(actions.commentPost, (state) => ({ ...state })),
  on(actions.commentPostSuccess, (state, { type: _, postId, comment }) => {
    const defaultReturn = { ...state };
    const postIndex = state.data?.findIndex((p) => p.id === postId);

    if (!isNil(postIndex) && !isNil(state.data) && !isNil(comment)) {
      const updatedPost = {
        ...state.data[postIndex],
        commentsList: [comment, ...state.data[postIndex].commentsList],
        commentsCount: state.data[postIndex].commentsCount + 1,
      };

      const updatedData = [
        ...state.data.slice(0, postIndex),
        updatedPost,
        ...state.data.slice(postIndex + 1),
      ];

      return {
        ...state,
        ...loadedState,
        data: updatedData,
      };
    }

    return defaultReturn;
  }),
  on(actions.commentPostFailure, (state, { message }) => ({
    ...state,
    ...errorState(message),
  })),
  //---------------EDIT COMMENT---------------------
  on(actions.editComment, (state) => ({ ...state })),
  on(
    actions.editCommentSuccess,
    (state, { type: _, postId, commentId, commentText }) => {
      const defaultReturn = { ...state };
      const postIndex = state.data?.findIndex((p) => p.id === postId);

      if (isNil(postIndex) || isNil(state.data)) {
        return defaultReturn;
      }

      const commentIndex = state.data[postIndex].commentsList.findIndex(
        (comment) => comment.id === commentId
      );

      if (!isNil(commentIndex)) {
        const updatedComment = {
          ...state.data[postIndex].commentsList[commentIndex],
        };
        updatedComment.commentText = commentText;

        const updatedPost = {
          ...state.data[postIndex],
          commentsList: [
            ...state.data[postIndex].commentsList.slice(0, commentIndex),
            updatedComment,
            ...state.data[postIndex].commentsList.slice(commentIndex + 1),
          ],
        };

        const updatedData = [
          ...state.data.slice(0, postIndex),
          updatedPost,
          ...state.data.slice(postIndex + 1),
        ];

        return {
          ...state,
          ...loadedState,
          data: updatedData,
        };
      }

      return defaultReturn;
    }
  ),
  on(actions.editCommentFailure, (state, { message }) => ({
    ...state,
    ...errorState(message),
  })),
  //---------------DELETE COMMENT---------------------
  on(actions.deleteComment, (state) => ({ ...state })),
  on(actions.deleteCommentSuccess, (state, { type: _, postId, commentId }) => {
    const defaultReturn = { ...state };
    const postIndex = state.data?.findIndex((p) => p.id === postId);

    if (!isNil(postIndex) && !isNil(state.data)) {
      const deletedCommentIndex = state.data[postIndex].commentsList.findIndex(
        (comment) => comment.id === commentId
      );
      const updatedCommentsList = [
        ...state.data[postIndex].commentsList.slice(0, deletedCommentIndex),
        ...state.data[postIndex].commentsList.slice(deletedCommentIndex + 1),
      ];
      const updatedPost = {
        ...state.data[postIndex],
        commentsCount: state.data[postIndex].commentsCount - 1,
        commentsList: updatedCommentsList,
      };

      const updatedData = [
        ...state.data.slice(0, postIndex),
        updatedPost,
        ...state.data.slice(postIndex + 1),
      ];

      return {
        ...state,
        ...loadedState,
        data: updatedData,
      };
    }

    return defaultReturn;
  }),
  on(actions.deleteCommentFailure, (state, { message }) => ({
    ...state,
    ...errorState(message),
  }))
);
