import { ActionReducer, MetaReducer } from '@ngrx/store';
import { AuthFacade, AuthEffects, AuthState, authReducer } from './auth';
import { localStorageSync } from 'ngrx-store-localstorage';
import { PostsState } from './post/post.model';
import { postReducer } from './post/post.reducer';
import { PostEffects } from './post/post.effects';
import { PostFacade } from './post/post.facade';
import {
  SearchEffects,
  SearchFacade,
  SearchState,
  searchReducer,
} from './search';
import {
  SocialEffects,
  SocialFacade,
  SocialState,
  socialReducer,
} from './social';

export interface AppState {
  auth: AuthState;
  search: SearchState;
  post: PostsState;
  social: SocialState;
}

export const reducers = {
  auth: authReducer,
  search: searchReducer,
  post: postReducer,
  social: socialReducer,
};

export const effects = [AuthEffects, SearchEffects, PostEffects, SocialEffects];

export const facades = [AuthFacade, SearchFacade, PostFacade, SocialFacade];

export function localStorageSyncReducer(
  reducer: ActionReducer<any>
): ActionReducer<any> {
  return localStorageSync({ keys: [{ auth: ['data'] }], rehydrate: true })(
    reducer
  );
}

export const metaReducers: Array<MetaReducer<any, any>> = [
  localStorageSyncReducer,
];
