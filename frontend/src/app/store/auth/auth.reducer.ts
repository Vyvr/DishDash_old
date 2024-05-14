import { createReducer, on } from '@ngrx/store';
import { initialState } from './auth.model';

import * as actions from './auth.actions';
import { errorState, loadedState, loadingState } from '../utils';
import { isNil } from 'lodash-es';
import { environment } from 'src/app/environments/environment';

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
    (state, { type: _, ...payload }) => {
      if (!isNil(payload.picturePath) && payload.picturePath.length !== 0) {
        payload.picturePath = environment.picturesServer + payload.picturePath;
      } else {
        payload.picturePath = undefined;
      }

      return {
        ...state,
        ...loadedState,
        data: {
          ...state.data,
          ...payload,
        },
        refreshSuccessful: true,
      };
    }
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
  })),

  //---------------GET USER PICTURE---------------------
  on(actions.getUserPicture, (state) => ({ ...state, ...loadingState })),
  on(actions.getUserPictureSuccess, (state, { type: _, imageData }) => {
    const defaultReturn = { ...state };

    if (isNil(state.data) || isNil(state.data.token)) {
      return defaultReturn;
    }

    return {
      ...state,
      ...loadedState,
      pictureData: imageData,
    };
  }),
  on(actions.getUserPictureFailure, (state, { message }) => ({
    ...state,
    ...errorState(message),
  })),

  //---------------ADD USER PICTURE---------------------
  on(actions.addUserPicture, (state) => ({ ...state, ...loadingState })),
  on(actions.addUserPictureSuccess, (state, { userImage }) => {
    const defaultReturn = { ...state };

    if (isNil(state.data)) {
      return defaultReturn;
    }

    const path = environment.picturesServer + userImage;

    return {
      ...state,
      ...loadedState,
      data: {
        ...state.data,
        picturePath: path,
      },
    };
  }),
  on(actions.addUserPictureFailure, (state, { message }) => ({
    ...state,
    ...errorState(message),
  })),

  //---------------UPDATE USER DATA---------------------
  on(actions.updateUserData, (state) => ({ ...state, ...loadingState })),
  on(
    actions.updateUserDataSuccess,
    (state, { name, surname, email, description }) => {
      const defaultReturn = { ...state };

      if (isNil(state.data)) {
        return defaultReturn;
      }

      return {
        ...state,
        ...loadedState,
        data: {
          ...state.data,
          name: name,
          surname: surname,
          email: email,
          description: description,
        },
      };
    }
  ),
  on(actions.updateUserDataFailure, (state, { message }) => ({
    ...state,
    ...errorState(message),
  }))
);
