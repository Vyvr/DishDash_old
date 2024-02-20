import { createReducer, on } from '@ngrx/store';
import { initialState } from './social.model';

import * as actions from './social.actions';
import { errorState, loadedState, loadingState } from '../utils';
import { isNil } from 'lodash-es';

export const socialReducer = createReducer(
  initialState,
  //---------------ADD TO FRIENDS---------------------
  on(actions.addToFriends, (state) => ({ ...state, ...loadingState })),
  on(actions.addToFriendsSuccess, (state, { friend }) => {
    const updatedFriends = [...(state.data?.friends ?? [])];

    if (!isNil(friend)) {
      updatedFriends.push(friend);
    }

    return {
      ...state,
      ...loadedState,
      data: {
        ...state.data,
        friendRequests: [...(state.data?.friendRequests ?? [])],
        friends: updatedFriends,
      },
    };
  }),
  on(actions.addToFriendsFailure, (state, { message }) => {
    return {
      ...state,
      ...errorState(message),
    };
  }),
  //---------------DELETE FROM FRIENDS---------------------
  on(actions.deleteFromFriends, (state) => {
    return {
      ...state,
      ...loadingState,
    };
  }),
  on(actions.deleteFromFriendsSuccess, (state, { friend }) => {
    const updatedFriends = [
      ...(state.data?.friends.filter((f) => f.id !== friend?.id) ?? []),
    ];

    return {
      ...state,
      ...loadedState,
      data: {
        ...state.data,
        friends: updatedFriends,
        friendRequests: [...(state.data?.friendRequests ?? [])],
      },
    };
  }),
  on(actions.deleteFromFriendsFailure, (state, { message }) => {
    return {
      ...state,
      ...errorState(message),
    };
  }),
  //---------------GET FRIENDS---------------------
  on(actions.getFriends, (state) => ({ ...state, ...loadingState })),
  on(actions.getFriendsSuccess, (state, { usersList }) => {
    return {
      ...state,
      ...loadedState,
      data: {
        ...state.data,
        friends: usersList,
        friendRequests: [...(state.data?.friendRequests ?? [])],
      },
    };
  }),
  on(actions.getFriendsFailure, (state, { message }) => {
    return {
      ...state,
      ...errorState(message),
    };
  })
);
