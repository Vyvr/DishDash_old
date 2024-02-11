import { createReducer, on } from '@ngrx/store';
import { initialState } from './post.model';

import * as actions from './post.actions';
import { errorState, loadedState, loadingState } from '../utils';

export const postReducer = createReducer(
  initialState,
  //---------------CREATE---------------------
  on(actions.createPost, (state) => ({ ...state, ...loadingState })),
  on(actions.createPostSuccess, (state, { message }) => {
    return {
      ...state,
      loadedState,
    };
  }),
  on(actions.createPostFailure, (state, { message }) => {
    return {
      ...state,
      ...errorState(message),
    };
  })
);
