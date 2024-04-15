import { createReducer, on } from '@ngrx/store';
import { initialState } from './menuBookPost.model';

import * as actions from './menuBookPost.actions';
import { errorState, loadedState, loadingState } from '../utils';
import { isNil } from 'lodash-es';
import { environment } from 'src/app/environments/environment';
import { MenuBookPost } from 'src/app/pb/menu_book_post_pb';
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

    const updatedPathsPosts: MenuBookPost.AsObject[] = newUniquePosts.map(
      (post) => {
        const updatedPaths = post.picturePathList.map(
          (path) => environment.picturesServer + path
        );
        const updatedPost: MenuBookPost.AsObject = {
          ...post,
          picturePathList: updatedPaths,
        };

        return updatedPost;
      }
    );

    // Combine the existing posts with the new, unique, transformed posts
    const combinedPosts = [...(state.data ?? []), ...updatedPathsPosts];

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
  //---------------DELETE FROM MENU BOOK---------------------
  on(actions.deleteFromMenuBook, (state) => ({ ...state })),
  on(actions.deleteFromMenuBookSuccess, (state, { type: _, postId }) => {
    const defaultReturn = { ...state };

    if (isNil(state.data)) {
      return defaultReturn;
    }

    const postIndex = state.data.findIndex(
      (post) => post.originalPostId === postId
    );

    if (isNil(postIndex)) {
      return defaultReturn;
    }

    const updatedData = [
      ...state.data.slice(0, postIndex),
      ...state.data.slice(postIndex + 1),
    ];

    return {
      ...state,
      ...loadedState,
      data: updatedData,
    };
  }),
  on(actions.deleteFromMenuBookFailure, (state, { message }) => ({
    ...state,
    ...errorState(message),
  })),
  //---------------EDIT MENU BOOK POST---------------------
  on(actions.editMenuBookPost, (state) => ({ ...state })),
  on(
    actions.editMenuBookPostSuccess,
    (
      state,
      { type: _, postId, title, ingredients, preparation, portionQuantity }
    ) => {
      const defaultReturn = { ...state };

      if (isNil(state.data)) {
        return defaultReturn;
      }

      const postIndex = state.data.findIndex((post) => post.id === postId);

      if (isNil(postIndex) || postIndex === -1) {
        return defaultReturn;
      }

      const updatedPost = { ...state.data[postIndex] };
      updatedPost.title = title;
      updatedPost.ingredients = ingredients;
      updatedPost.preparation = preparation;
      updatedPost.portionQuantity = portionQuantity;

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
  ),
  on(actions.editMenuBookPostFailure, (state, { message }) => ({
    ...state,
    ...errorState(message),
  }))
);
