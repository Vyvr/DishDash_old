import { createSelector } from '@ngrx/store';
import { AppState } from '..';
import { AuthState } from './auth.model';

const selectBase = (state: AppState): AuthState => state.auth;

export const selectAuthState = createSelector(selectBase, (state) => state);
