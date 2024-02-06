import { Injectable } from '@angular/core';
import { AuthClient } from '../../proto/AuthServiceClientPb';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from '../../proto/auth_pb';
import { Observable } from 'rxjs';
import { handleRequest } from './utils';

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
    name: string,
    surname: string,
    email: string,
    password: string
  ): Observable<RegisterResponse.AsObject> {
    const request = new RegisterRequest();
    request.setName(name);
    request.setSurname(surname);
    request.setEmail(email);
    request.setPassword(password);

    return handleRequest<
      RegisterRequest,
      RegisterResponse,
      RegisterResponse.AsObject
    >(request, this.authServiceClient.register.bind(this.authServiceClient));
  }

  login(email: string, password: string): Observable<LoginResponse.AsObject> {
    const request = new LoginRequest();
    request.setEmail(email);
    request.setPassword(password);

    return handleRequest<LoginRequest, LoginResponse, LoginResponse.AsObject>(
      request,
      this.authServiceClient.login.bind(this.authServiceClient)
    );
  }
}
