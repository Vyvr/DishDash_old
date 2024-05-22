import { createReducer, on } from '@ngrx/store';
import { initialState } from './analytics.model';

import * as actions from './analytics.actions';
import { errorState, loadedState, loadingState } from '../utils';

export const analyticsReducer = createReducer(
  initialState,

  //---------------GET POSTS FROM MENU BOOK---------------------
  on(actions.GetAllPostAnaliticsData, (state) => ({
    ...state,
    ...loadingState,
  })),
  on(
    actions.GetAllPostAnaliticsDataSuccess,
    (state, { likesCountList, commentsCountList }) => {
      return {
        ...state,
        ...loadedState,
        data: {
          likesList: likesCountList,
          commentsList: commentsCountList,
        },
      };
    }
  ),
  on(actions.GetAllPostAnaliticsDataFailure, (state, { message }) => ({
    ...state,
    ...errorState(message),
  }))
);
