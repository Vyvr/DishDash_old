import { ActionReducer, MetaReducer } from '@ngrx/store';
import { AuthFacade, AuthEffects, AuthState, authReducer } from './auth';
import { localStorageSync } from 'ngrx-store-localstorage';

export interface AppState {
  auth: AuthState;
}

export const reducers = {
  auth: authReducer,
};

export const effects = [AuthEffects];

export const facades = [AuthFacade];

export function localStorageSyncReducer(
  reducer: ActionReducer<any>
): ActionReducer<any> {
  return localStorageSync({ keys: ['auth'], rehydrate: true })(reducer);
}

export const metaReducers: Array<MetaReducer<any, any>> = [localStorageSyncReducer];
