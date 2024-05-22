import { createAction, props } from '@ngrx/store';
import {
  GetAllPostAnaliticsDataRequest,
  GetAllPostAnaliticsDataResponse,
} from 'src/app/pb/post_pb';

const moduleName = 'Analytics';

//---------------GET ALL POSTS LIKES ANALYTICS DATA---------------------

export const GetAllPostAnaliticsData = createAction(
  `[${moduleName}] Get likes analytics data`,
  props<GetAllPostAnaliticsDataRequest.AsObject>()
);

export const GetAllPostAnaliticsDataSuccess = createAction(
  `[${moduleName}] Get likes analytics data success`,
  props<GetAllPostAnaliticsDataResponse.AsObject>()
);

export const GetAllPostAnaliticsDataFailure = createAction(
  `[${moduleName}] Get likes analytics data failure`,
  props<{ message: string }>()
);
