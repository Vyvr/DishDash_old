import { createSelector } from '@ngrx/store';
import { AppState } from '..';
import { PostsState } from './post.model';

const selectBase = (state: AppState): PostsState => state.post;

export const selectPostsState = createSelector(selectBase, (state) => state);

export const selectStopLoading = createSelector(
  selectBase,
  (state: PostsState) => state.stopLoading
);
