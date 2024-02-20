import { createReducer, on } from '@ngrx/store';
import { initialState } from './search.model';

import * as actions from './search.actions';
import { errorState, loadedState, loadingState } from '../utils';

export const searchReducer = createReducer(
  initialState,
    //---------------SEARCH BY QUERY---------------------
  on(actions.searchByQuery, (state) => ({ ...state, ...loadingState })),
  on(
    actions.searchByQuerySuccess,
    (state, { usersList, noMoreUsersToLoad }) => {
      return {
        ...state,
        ...loadedState,
        data: {
          users: usersList,
          noMoreUsersToLoad,
        },
      };
    }
  ),
  on(actions.searchByQueryFailure, (state, { message }) => {
    return {
      ...state,
      ...errorState(message),
    };
  }),
  //---------------SEARCH BY QUERY AND APPEND---------------------
  on(actions.searchByQueryAndAppend, (state) => ({ ...state, ...loadingState })),
  on(
    actions.searchByQueryAndAppendSuccess,
    (state, { usersList, noMoreUsersToLoad }) => {
      return {
        ...state,
        ...loadedState,
        data: {
          users: [...(state.data?.users ?? []), ...usersList],
          noMoreUsersToLoad,
        },
      };
    }
  ),
  on(actions.searchByQueryAndAppendFailure, (state, { message }) => {
    return {
      ...state,
      ...errorState(message),
    };
  }),
);
