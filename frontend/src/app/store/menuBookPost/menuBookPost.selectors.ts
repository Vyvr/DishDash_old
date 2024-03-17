import { createSelector } from '@ngrx/store';
import { AppState } from '..';
import { MenuBookPostsState } from './menuBookPost.model';

const selectBase = (state: AppState): MenuBookPostsState => state.menuBook;

export const selectMenuBookPostsState = createSelector(selectBase, (state) => state);
