import { createAction, props } from '@ngrx/store';
import { LoginRequest, LoginResponse } from 'src/app/proto/auth_pb';

const moduleName = 'Auth';

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
