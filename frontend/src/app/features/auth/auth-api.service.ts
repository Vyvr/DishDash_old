import { Injectable } from '@angular/core';
import { AuthClient } from '../../proto/AuthServiceClientPb';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from '../../proto/auth_pb';
import { Observable } from 'rxjs';
import { ClientReadableStream, Metadata, RpcError } from 'grpc-web';

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
  ): Observable<RegisterResponse> {
    const request = new RegisterRequest();
    request.setName(name);
    request.setSurname(surname);
    request.setEmail(email);
    request.setPassword(password);

    return handleRequest<RegisterRequest, RegisterResponse>(
      request,
      this.authServiceClient.register
    );
  }

  login(email: string, password: string): Observable<LoginResponse> {
    const request = new LoginRequest();
    request.setEmail(email);
    request.setPassword(password);

    return handleRequest<LoginRequest, LoginResponse>(
      request,
      this.authServiceClient.login
    );
  }
}

type HandleRequestFunc<Request, Response> = (
  request: Request,
  metadata: Metadata | null,
  callback: (err: RpcError, response: Response) => void
) => ClientReadableStream<Response>;

function handleRequest<Request, Response>(
  request: Request,
  func: HandleRequestFunc<Request, Response>,
  metadata: Metadata | null = null
): Observable<Response> {
  return new Observable<Response>((observer) => {
    func(request, metadata, (err, response) => {
      if (err) {
        observer.error(err.message);
      } else {
        observer.next(response);
      }
      observer.complete();
    });
  });
}
