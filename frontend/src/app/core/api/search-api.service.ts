import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserClient } from 'src/app/pb/UserServiceClientPb';
import { GetByQueryRequest, GetUsersResponse } from 'src/app/pb/user_pb';
import { bindPayloadToRequest, handleRequest } from './utils';

@Injectable({
  providedIn: 'root',
})
export class SearchApiService {
  private searchServiceClient: UserClient;

  constructor() {
    this.searchServiceClient = new UserClient(
      'http://localhost:8082',
      null,
      null
    );
  }

  searchUsersByQuery(
    payload: GetByQueryRequest.AsObject
  ): Observable<GetUsersResponse.AsObject> {
    const request = new GetByQueryRequest();

    bindPayloadToRequest(request, payload);

    return handleRequest<
    GetByQueryRequest,
    GetUsersResponse,
    GetUsersResponse.AsObject>(request, this.searchServiceClient.getByQuery.bind(this.searchServiceClient));
  }
}
