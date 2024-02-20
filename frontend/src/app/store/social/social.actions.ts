import { createAction, props } from '@ngrx/store';
import {
  AddToFriendsRequest,
  AddToFriendsResponse,
  DeleteFromFriendsRequest,
  DeleteFromFriendsResponse,
  GetFriendsRequest,
  GetFriendsResponse,
} from 'src/app/pb/user_pb';

const moduleName = 'Social';

export const getFriends = createAction(
  `[${moduleName} Get friends]`,
  props<GetFriendsRequest.AsObject>()
);
export const getFriendsSuccess = createAction(
  `[${moduleName} Get friends success]`,
  props<GetFriendsResponse.AsObject>()
);
export const getFriendsFailure = createAction(
  `[${moduleName} Get friends failure]`,
  props<{ message: string }>()
);
export const addToFriends = createAction(
  `[${moduleName} Add to friends]`,
  props<AddToFriendsRequest.AsObject>()
);
export const addToFriendsSuccess = createAction(
  `[${moduleName} Add to friends success]`,
  props<AddToFriendsResponse.AsObject>()
);
export const addToFriendsFailure = createAction(
  `[${moduleName} Add to friends failure]`,
  props<{ message: string }>()
);
export const deleteFromFriends = createAction(
  `[${moduleName} Delete from friends]`,
  props<DeleteFromFriendsRequest.AsObject>()
);
export const deleteFromFriendsSuccess = createAction(
  `[${moduleName} Delete from friends success]`,
  props<DeleteFromFriendsResponse.AsObject>()
);
export const deleteFromFriendsFailure = createAction(
  `[${moduleName} Delete from friends failure]`,
  props<{ message: string }>()
);
