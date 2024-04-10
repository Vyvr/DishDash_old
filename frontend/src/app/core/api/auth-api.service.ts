import { Injectable } from '@angular/core';
import { AuthClient } from '../../pb/AuthServiceClientPb';
import {
  AddUserPictureRequest,
  AddUserPictureResponse,
  GetUserPictureRequest,
  GetUserPictureResponse,
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RegisterRequest,
  RegisterResponse,
} from '../../pb/auth_pb';
import { Observable, Subscriber } from 'rxjs';
import { bindPayloadToRequest, handleRequest } from './utils';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  private authServiceClient: AuthClient;

  constructor() {
    // Initialize the client with the service URL
    this.authServiceClient = new AuthClient(
      'http://localhost:8082',
      null,
      null
    );
  }

  register(
    payload: RegisterRequest.AsObject
  ): Observable<RegisterResponse.AsObject> {
    const request = new RegisterRequest();

    bindPayloadToRequest(request, payload);

    return handleRequest<
      RegisterRequest,
      RegisterResponse,
      RegisterResponse.AsObject
    >(request, this.authServiceClient.register.bind(this.authServiceClient));
  }

  login(payload: LoginRequest.AsObject): Observable<LoginResponse.AsObject> {
    const request = new LoginRequest();

    bindPayloadToRequest(request, payload);

    return handleRequest<LoginRequest, LoginResponse, LoginResponse.AsObject>(
      request,
      this.authServiceClient.login.bind(this.authServiceClient)
    );
  }

  refreshToken(
    payload: RefreshTokenRequest.AsObject
  ): Observable<LoginResponse.AsObject> {
    const request = new RefreshTokenRequest();

    bindPayloadToRequest(request, payload);

    return handleRequest<
      RefreshTokenRequest,
      LoginResponse,
      LoginResponse.AsObject
    >(
      request,
      this.authServiceClient.refreshToken.bind(this.authServiceClient)
    );
  }

  addUserPicture(
    payload: AddUserPictureRequest.AsObject
  ): Observable<AddUserPictureResponse.AsObject> {
    const request = new AddUserPictureRequest();

    bindPayloadToRequest(request, payload);

    return handleRequest<
      AddUserPictureRequest,
      AddUserPictureResponse,
      AddUserPictureResponse.AsObject
    >(
      request,
      this.authServiceClient.addUserPicture.bind(this.authServiceClient)
    );
  }

  getUserPicture(
      payload: GetUserPictureRequest.AsObject
    ): Observable<GetUserPictureResponse.AsObject> {
      const request = new GetUserPictureRequest();
  
      bindPayloadToRequest(request, payload);
  
      return new Observable(
        (observer: Subscriber<GetUserPictureResponse.AsObject>) => {
          const call = this.authServiceClient.getUserPicture(request, {});
  
          call.on('data', (response) => {
            const imageDataBase64 = response.getImageData_asB64();
  
            observer.next({
              imageData: imageDataBase64,
            });
          });
  
          call.on('error', (err) => {
            console.error('Stream error:', err);
            observer.error(err);
          });
  
          call.on('end', () => {
            observer.complete();
          });
        }
      );
    }
}
