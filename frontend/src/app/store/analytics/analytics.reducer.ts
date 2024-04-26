import { createReducer, on } from '@ngrx/store';
import { initialState } from './analytics.model';

import * as actions from './analytics.actions';
import { errorState, loadedState, loadingState } from '../utils';

export const analyticsReducer = createReducer(
  initialState,

  //---------------GET POSTS FROM MENU BOOK---------------------
  on(actions.GetAllPostLikesAnaliticsLikesData, (state) => ({
    ...state,
    ...loadingState,
  })),
  on(
    actions.GetAllPostLikesAnaliticsLikesDataSuccess,
    (state, { dataList }) => {
      return {
        ...state,
        ...loadedState,
        data: {
          likesList: dataList,
          commentsList: [],
        },
      };
    }
  ),
  on(
    actions.GetAllPostLikesAnaliticsLikesDataFailure,
    (state, { message }) => ({
      ...state,
      ...errorState(message),
    })
  )
);
