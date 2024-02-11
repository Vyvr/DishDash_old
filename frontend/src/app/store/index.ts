import { ActionReducer, MetaReducer } from '@ngrx/store';
import { AuthFacade, AuthEffects, AuthState, authReducer } from './auth';
import { localStorageSync } from 'ngrx-store-localstorage';
import { PostsState } from './post/post.model';
import { postReducer } from './post/post.reducer';
import { PostEffects } from './post/post.effects';
import { PostFacade } from './post/post.facade';

export interface AppState {
  auth: AuthState;
  posts: PostsState;
}

export const reducers = {
  auth: authReducer,
  post: postReducer,
};

export const effects = [AuthEffects, PostEffects];

export const facades = [AuthFacade, PostFacade];

export function localStorageSyncReducer(
  reducer: ActionReducer<any>
): ActionReducer<any> {
  return localStorageSync({ keys: ['auth'], rehydrate: true })(reducer);
}

export const metaReducers: Array<MetaReducer<any, any>> = [
  localStorageSyncReducer,
];
