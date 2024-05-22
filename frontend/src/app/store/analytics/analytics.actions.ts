import { createAction, props } from '@ngrx/store';
import {
  GetAllPostLikesAnaliticsDataRequest,
  GetAllPostLikesAnaliticsDataResponse,
} from 'src/app/pb/post_pb';

const moduleName = 'Analytics';

//---------------GET ALL POSTS LIKES ANALYTICS DATA---------------------

export const GetAllPostLikesAnaliticsData = createAction(
  `[${moduleName}] Get likes analytics data`,
  props<GetAllPostLikesAnaliticsDataRequest.AsObject>()
);

export const GetAllPostLikesAnaliticsDataSuccess = createAction(
  `[${moduleName}] Get likes analytics data success`,
  props<GetAllPostLikesAnaliticsDataResponse.AsObject>()
);

export const GetAllPostLikesAnaliticsDataFailure = createAction(
  `[${moduleName}] Get likes analytics data failure`,
  props<{ message: string }>()
);
