import { createAction, props } from '@ngrx/store';
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from 'src/app/proto/auth_pb';

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