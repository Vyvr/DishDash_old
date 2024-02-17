import { createReducer, on } from '@ngrx/store';
import { initialState } from './post.model';

import * as actions from './post.actions';
import { errorState, loadedState, loadingState } from '../utils';

export const postReducer = createReducer(
  initialState,
  //---------------CREATE---------------------
  on(actions.createPost, (state) => ({ ...state, ...loadingState })),
  on(actions.createPostSuccess, (state, { type: _, ...post }) => {
    return {
      ...state,
      data: [
        ...(state.data ?? []),
        {
          // @TODO: correct postId to just id
          id: post.postId,
          ...post,
          pictures: [],
        },
      ],
      loadedState,
    };
  }),
  on(actions.createPostFailure, (state, { message }) => {
    return {
      ...state,
      ...errorState(message),
    };
  }),

  on(actions.addImages, (state) => ({ ...state, ...loadingState })),
  on(actions.addImagesSuccess, (state) => ({ ...state, ...loadedState })),
  on(actions.addImagesFailure, (state, { message }) => ({
    ...state,
    ...errorState(message),
  }))
);
