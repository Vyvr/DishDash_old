import { createReducer, on } from '@ngrx/store';
import { initialState } from './search.model';

import * as actions from './search.actions';
import { loadedState, loadingState } from '../utils';

export const searchReducer = createReducer(
  initialState,
  on(actions.searchByQuery, (state) => ({ ...state, ...loadingState })),
  on(actions.searchByQuerySuccess, (state, { usersList }) => {
    return {
      ...state,
      ...loadedState,
      data: {
        users: usersList,
      },
    };
  })
);
