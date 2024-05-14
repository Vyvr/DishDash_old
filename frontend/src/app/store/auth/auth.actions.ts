import { createAction, props } from '@ngrx/store';
import {
  AddUserPictureRequest,
  AddUserPictureResponse,
  GetUserPictureRequest,
  GetUserPictureResponse,
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RegisterRequest,
  RegisterResponse,
} from 'src/app/pb/auth_pb';
import { UpdateRequest, UpdateResponse } from 'src/app/pb/user_pb';

const moduleName = 'Auth';

//---------------LOGIN---------------------

export const login = createAction(
  `[${moduleName}] Login`,
  props<LoginRequest.AsObject>()
);

export const loginSuccess = createAction(
  `[${moduleName}] Login success`,
  props<LoginResponse.AsObject>()
);

export const loginFailure = createAction(
  `[${moduleName}] Login failure`,
  props<{ message: string }>()
);

//---------------LOGOUT---------------------

export const logout = createAction(`[${moduleName}] Logout`);

export const logoutSuccess = createAction(`[${moduleName}] Logout success`);

export const logoutFailure = createAction(
  `[${moduleName}] Logout failure`,
  props<{ error: string }>()
);

//---------------REGISTER---------------------

export const register = createAction(
  `[${moduleName}] Register`,
  props<RegisterRequest.AsObject>()
);

export const registerSuccess = createAction(
  `[${moduleName}] Register success`,
  props<RegisterResponse.AsObject>()
);

export const registerFailure = createAction(
  `[${moduleName}] Register failure`,
  props<{ message: string }>()
);

//---------------REFRESH TOKEN---------------------

export const refreshToken = createAction(
  `[${moduleName}] Refresh token`,
  props<RefreshTokenRequest.AsObject>()
);

export const refreshTokenSuccess = createAction(
  `[${moduleName}] Refresh token success`,
  props<LoginResponse.AsObject>()
);

export const refreshTokenFailure = createAction(
  `[${moduleName}] Refresh token failure`,
  props<{ message: string }>()
);

//---------------GET USER PICTURE---------------------

export const getUserPicture = createAction(
  `[${moduleName}] Get user picture`,
  props<GetUserPictureRequest.AsObject>()
);

export const getUserPictureSuccess = createAction(
  `[${moduleName}] Get user picture success`,
  props<GetUserPictureResponse.AsObject>()
);

export const getUserPictureFailure = createAction(
  `[${moduleName}] Get user picture failure`,
  props<{ message: string }>()
);

//---------------ADD USER PICTURE---------------------

export const addUserPicture = createAction(
  `[${moduleName}] Add user picture`,
  props<AddUserPictureRequest.AsObject>()
);

export const addUserPictureSuccess = createAction(
  `[${moduleName}] Add user picture success`,
  props<AddUserPictureResponse.AsObject>()
);

export const addUserPictureFailure = createAction(
  `[${moduleName}] Add user picture failure`,
  props<{ message: string }>()
);

//---------------UPDATE USER DATA---------------------

export const updateUserData = createAction(
  `[${moduleName}] Update user data`,
  props<UpdateRequest.AsObject>()
);

export const updateUserDataSuccess = createAction(
  `[${moduleName}] Update user data success`,
  props<UpdateResponse.AsObject>()
);

export const updateUserDataFailure = createAction(
  `[${moduleName}] Update user data failure`,
  props<{ message: string }>()
);
