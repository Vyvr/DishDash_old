import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserClient } from 'src/app/pb/UserServiceClientPb';
import {
  AddToFriendsRequest,
  AddToFriendsResponse,
  DeleteFromFriendsRequest,
  DeleteFromFriendsResponse,
  GetFriendsRequest,
  GetFriendsResponse,
} from 'src/app/pb/user_pb';
import { bindPayloadToRequest, handleRequest } from './utils';

@Injectable({
  providedIn: 'root',
})
export class SocialApiService {
  private socialServiceClient: UserClient;

  constructor() {
    this.socialServiceClient = new UserClient(
      'http://localhost:8082',
      null,
      null
    );
  }

  addToFriends(
    payload: AddToFriendsRequest.AsObject
  ): Observable<AddToFriendsResponse.AsObject> {
    const request = new AddToFriendsRequest();

    bindPayloadToRequest(request, payload);

    return handleRequest<
      AddToFriendsRequest,
      AddToFriendsResponse,
      AddToFriendsResponse.AsObject
    >(
      request,
      this.socialServiceClient.addToFriends.bind(this.socialServiceClient)
    );
  }

  deleteFromFriends(
    payload: DeleteFromFriendsRequest.AsObject
  ): Observable<DeleteFromFriendsResponse.AsObject> {
    const request = new DeleteFromFriendsRequest();

    bindPayloadToRequest(request, payload);

    return handleRequest<
      DeleteFromFriendsRequest,
      DeleteFromFriendsResponse,
      DeleteFromFriendsResponse.AsObject
    >(
      request,
      this.socialServiceClient.deleteFromFriends.bind(this.socialServiceClient)
    );
  }

  getFriends(
    payload: GetFriendsRequest.AsObject
  ): Observable<GetFriendsResponse.AsObject> {
    const request = new GetFriendsRequest();

    bindPayloadToRequest(request, payload);

    return handleRequest<
      GetFriendsRequest,
      GetFriendsResponse,
      GetFriendsResponse.AsObject
    >(
      request,
      this.socialServiceClient.getFriends.bind(this.socialServiceClient)
    );
  }
}
