import { Action, ActionReducer, MetaReducer } from '@ngrx/store';
import {
  AuthFacade,
  AuthEffects,
  AuthState,
  authReducer,
  logoutSuccess,
} from './auth';
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
import {
  MenuBookPostEffects,
  MenuBookPostFacade,
  MenuBookPostsState,
  menubookPostReducer,
} from './menuBookPost';
import {
  UserPostsEffects,
  UserPostsFacade,
  UserPostsState,
  userPostsReducer,
} from './user-posts';
import {
  AnalyticsEffects,
  AnalyticsFacade,
  AnalyticsState,
  analyticsReducer,
} from './analytics';
import { ChatEffects, ChatFacade, ChatState, chatReducer } from './chat';

export interface AppState {
  auth: AuthState;
  search: SearchState;
  post: PostsState;
  userPosts: UserPostsState;
  menuBook: MenuBookPostsState;
  social: SocialState;
  analytics: AnalyticsState;
  chat: ChatState;
}

export const reducers = {
  auth: authReducer,
  search: searchReducer,
  post: postReducer,
  userPosts: userPostsReducer,
  menuBook: menubookPostReducer,
  social: socialReducer,
  analytics: analyticsReducer,
  chat: chatReducer,
};

export const effects = [
  AuthEffects,
  SearchEffects,
  PostEffects,
  UserPostsEffects,
  MenuBookPostEffects,
  SocialEffects,
  AnalyticsEffects,
  ChatEffects,
];

export const facades = [
  AuthFacade,
  SearchFacade,
  PostFacade,
  UserPostsFacade,
  MenuBookPostFacade,
  SocialFacade,
  AnalyticsFacade,
  ChatFacade,
];

export function localStorageSyncReducer(
  reducer: ActionReducer<any>
): ActionReducer<any> {
  return localStorageSync({ keys: [{ auth: ['data'] }], rehydrate: true })(
    reducer
  );
}

function logoutMetaReducer(reducer: ActionReducer<any>) {
  return function (state: AppState, action: Action) {
    return reducer(
      action.type === logoutSuccess.type ? undefined : state,
      action
    );
  };
}

export const metaReducers: Array<MetaReducer<any, any>> = [
  localStorageSyncReducer,
  logoutMetaReducer,
];
