import { createReducer, on } from '@ngrx/store';
import { initialState } from './auth.model';

import * as actions from './auth.actions';
import { errorState, loadedState, loadingState } from '../utils';

export const authReducer = createReducer(
  initialState,
  //---------------LOGIN---------------------
  on(actions.login, actions.refreshToken, (state) => ({
    ...state,
    ...loadingState,
  })),
  on(
    actions.loginSuccess,
    actions.refreshTokenSuccess,
    (state, { type: _, ...payload }) => ({
      ...state,
      ...loadedState,
      data: {
        ...state.data,
        ...payload,
      },
      refreshSuccessful: true,
    })
  ),
  on(
    actions.loginFailure,
    actions.refreshTokenFailure,
    (state, { message }) => ({
      ...state,
      ...errorState(message),
      refreshSuccessful: false,
    })
  ),

  //---------------LOGOUT---------------------
  on(actions.logout, (state) => ({ ...state, ...loadingState })),
  on(actions.logoutSuccess, (state) => ({
    ...state,
    ...loadedState,
    data: null,
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
