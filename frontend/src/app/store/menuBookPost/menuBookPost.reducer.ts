import { createReducer, on } from '@ngrx/store';
import { InternalMenuBookPost, initialState } from './menuBookPost.model';

import * as actions from './menuBookPost.actions';
import { errorState, loadedState, loadingState } from '../utils';
import { isNil } from 'lodash-es';
// import { isNil } from 'lodash-es';

export const menubookPostReducer = createReducer(
  initialState,

  //---------------GET POSTS FROM MENU BOOK---------------------
  on(actions.getPostsFromMenuBook, (state) => ({ ...state, ...loadingState })),
  on(actions.getPostsFromMenuBookSuccess, (state, { postsList }) => {
    // Create a map from the existing posts for quick lookup
    const existingPostsMap = new Map(
      state.data?.map((post) => [post.id, post]) ?? []
    );

    // Filter new posts to include only those not already present
    const newUniquePosts = postsList.filter(
      (post) => !existingPostsMap.has(post.id)
    );

    // Transform new posts to match the InternalPost structure
    const transformedNewPosts = newUniquePosts.map<InternalMenuBookPost>(
      ({ picturesList, picturesDataList: _, ...post }) => ({
        ...post,
        pictures: picturesList.map((path) => ({ path })),
      })
    );
    // const transformedNewPosts = newUniquePosts.map<InternalMenuBookPost>(
    //   ({ picturesList, picturesDataList: _, ...post }) => ({
    //     ...post,
    //     pictures: picturesList.map((path) => ({ path })),
    //   })
    // );

    // Combine the existing posts with the new, unique, transformed posts
    const combinedPosts = [...(state.data ?? []), ...transformedNewPosts];

    return {
      ...state,
      ...loadedState,
      data: combinedPosts,
    };
  }),
  on(actions.getPostsFromMenuBookFailure, (state, { message }) => ({
    ...state,
    ...errorState(message),
  })),
  //---------------ADD IMAGES---------------------
  // on(actions.addImages, (state) => ({ ...state, ...loadingState })),
  // on(actions.addImagesSuccess, (state) => ({ ...state, ...loadedState })),
  // on(actions.addImagesFailure, (state, { message }) => ({
  //   ...state,
  //   ...errorState(message),
  // })),
  //---------------GET IMAGE STREAM---------------------
  on(actions.getImageStream, (state) => ({ ...state })),
  on(
    actions.getImageStreamSuccess,
    (state, { type: _, imageData, postId, picturePath }) => {
      const defaultReturn = { ...state };

      if (isNil(state.data)) {
        return defaultReturn;
      }

      const post = state.data.find((post) => post.originalPostId === postId);

      if (isNil(post)) {
        return defaultReturn;
      }

      const updatedPost = {
        ...post,
        pictures: post.pictures.map(({ path, data }) => ({
          path,
          data: path === picturePath ? imageData : data,
        })),
      };

      return {
        ...state,
        data: [
          ...new Map(
            [...(state.data ?? []), updatedPost].map((post) => [post.id, post])
          ).values(),
        ],
      };
    }
  ),
  on(actions.getImageStreamFailure, (state, { message }) => ({
    ...state,
    ...errorState(message),
  }))
);
