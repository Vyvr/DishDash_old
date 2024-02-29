import { createReducer, on } from '@ngrx/store';
import { initialState } from './post.model';

import * as actions from './post.actions';
import { errorState, loadedState, loadingState } from '../utils';
// import { Post } from 'src/app/pb/post_pb';
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
        { ...post, picturesList: [], picturesDataList: [] },
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

      // const post: Post.AsObject = state.data[postIndex];

      // post.picturesDataList.push(imageData);

      // const newData = state.data;
      // newData[postIndex] = post;

      // return {
      //   ...state,
      //   ...loadedState,
      //   data: newData,
      // };
    }

    return defaultReturn;
  }),
  on(actions.getImageStreamFailure, (state, { message }) => ({
    ...state,
    ...errorState(message),
  }))
);
