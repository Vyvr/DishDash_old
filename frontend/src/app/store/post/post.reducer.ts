import { createReducer, on } from '@ngrx/store';
import { initialState } from './post.model';

import * as actions from './post.actions';
import { errorState, loadedState, loadingState } from '../utils';
import { isNil } from 'lodash-es';

export const postReducer = createReducer(
  initialState,
  //---------------CREATE---------------------
  on(actions.createPost, (state) => ({ ...state, ...loadingState })),
  on(actions.createPostSuccess, (state, { type: _, ...post }) => {
    return {
      ...state,
      ...loadedState,
      data: [
        ...(state.data ?? []),
        {
          ...post,
          picturesList: [],
          picturesDataList: [],
          likesCount: 0,
          commentsCount: 0,
          liked: false,
        },
      ],
    };
  }),
  on(actions.createPostFailure, (state, { message }) => {
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
  on(actions.getFriendsPostsSuccess, (state, { type: _, postsList }) => {
    return {
      ...state,
      ...loadedState,
      data: [...(state.data ?? []), ...postsList],
    };
  }),
  on(actions.getFriendsPostsFailure, (state, { message }) => ({
    ...state,
    ...errorState(message),
  })),
  //---------------GET IMAGE STREAM---------------------
  /*@TODO Finish this crap,
   * think how bind response (base64 string) to right post.PicturesData[]
   */
  on(actions.getImageStream, (state) => ({ ...state, ...loadingState })),
  on(actions.getImageStreamSuccess, (state, { type: _, imageData, postId }) => {
    const defaultReturn = { ...state, ...loadedState };

    if (isNil(state.data)) {
      return defaultReturn;
    }

    const postIndex = state.data.findIndex((post) => post.id === postId);
    if (!!(postIndex + 1)) {
      const post = { ...state.data[postIndex] };

      // Create a new picturesDataList array with the new imageData
      const picturesDataList = [...post.picturesDataList, imageData];

      // Create a new post object with the updated picturesDataList
      const updatedPost = { ...post, picturesDataList };

      // Create a new data array with the updated post
      const newData = [...state.data];
      newData[postIndex] = updatedPost;

      return {
        ...state,
        ...loadedState,
        data: newData,
      };
    }

    return defaultReturn;
  }),
  on(actions.getImageStreamFailure, (state, { message }) => ({
    ...state,
    ...errorState(message),
  })),
  //---------------LIKE POST---------------------
  on(actions.likePost, (state) => ({ ...state, ...loadingState })),
  on(actions.likePostSuccess, (state, { type: _, postId }) => {
    const defaultReturn = { ...state, ...loadedState };
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
  on(actions.unlikePost, (state) => ({ ...state, ...loadingState })),
  on(actions.unlikePostSuccess, (state, { type: _, postId }) => {
    const defaultReturn = { ...state, ...loadedState };
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
  }))
);
