import { createAction, props } from '@ngrx/store';
import {
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RegisterRequest,
  RegisterResponse,
} from 'src/app/pb/auth_pb';

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
