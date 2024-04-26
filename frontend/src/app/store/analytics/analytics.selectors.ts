import { createSelector } from '@ngrx/store';
import { AppState } from '..';
import { AnalyticsState } from './analytics.model';

const selectBase = (state: AppState): AnalyticsState => state.analytics;

export const selectAnalyticsState = createSelector(
  selectBase,
  (state) => state
);
