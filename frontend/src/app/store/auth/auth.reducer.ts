import { createReducer, on } from '@ngrx/store';
import { initialState } from './auth.model';

import * as actions from './auth.actions';
import { errorState, loadedState, loadingState } from '../utils';

export const authReducer = createReducer(
  initialState,
  //---------------LOGIN---------------------
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
  })),

  //---------------LOGOUT---------------------
  on(actions.logout, (state) => ({ ...state, ...loadingState })),
  on(actions.logoutSuccess, (state) => ({
    ...state,
    ...loadedState,
    data: {
      ...state.data,
      token: null,
    },
  })),
  on(actions.logoutFailure, (state, { error }) => ({
    ...state,
    ...errorState(error),
  })),

  //---------------REGISTER---------------------
  on(actions.register, (state) => ({ ...state, ...loadingState })),
  on(actions.registerSuccess, (state) => ({ ...state, ...loadedState })),
  on(actions.registerFailure, (state, { message }) => ({
    ...state,
    ...errorState(message),
  }))
);
