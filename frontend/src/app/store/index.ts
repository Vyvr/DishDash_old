import { AuthFacade, AuthEffects, AuthState, authReducer } from './auth';

export interface AppState {
  auth: AuthState;
}

export const reducers = {
  auth: authReducer,
};

export const effects = [AuthEffects];

export const facades = [AuthFacade];
