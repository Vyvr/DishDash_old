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

export const searchByQueryAndAppend = createAction(
  `[${moduleName} Search by query and append]`,
  props<GetByQueryRequest.AsObject>()
);

export const searchByQueryAndAppendSuccess = createAction(
  `[${moduleName} Search by query and append success]`,
  props<GetUsersResponse.AsObject>()
);

export const searchByQueryAndAppendFailure = createAction(
  `[${moduleName} Search by query and append failure]`,
  props<{ message: string }>()
);
