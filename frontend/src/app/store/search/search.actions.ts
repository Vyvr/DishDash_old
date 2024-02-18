import { createAction, props } from '@ngrx/store';
import { GetByQueryRequest, GetUsersResponse } from 'src/app/pb/user_pb';

const moduleName = 'Search';

export const searchByQuery = createAction(
  `[${moduleName} Search by query]`,
  props<GetByQueryRequest.AsObject>()
);

export const searchByQuerySuccess = createAction(
  `[${moduleName} Search by query success]`,
  props<GetUsersResponse.AsObject>()
);

export const searchByQueryFailure = createAction(
  `[${moduleName} Search by query failure]`,
  props<{ message: string }>()
);
