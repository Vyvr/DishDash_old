import { createReducer, on } from '@ngrx/store';
import { initialState } from './auth.model';

import * as actions from './auth.actions';
import { errorState, loadedState, loadingState } from '../utils';

export const authReducer = createReducer(
  initialState,
  on(actions.login, (state) => ({ ...state, ...loadingState })),
  on(actions.loginSuccess, (state, { token }) => ({
    ...state,
    ...loadedState,
    data: {
      ...state.data,
      token,
    },
  })),
  on(actions.loginFailure, (state, { message }) => ({
    ...state,
    ...errorState(message),
  }))
);
