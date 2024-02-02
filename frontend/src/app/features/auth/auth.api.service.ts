import { Injectable } from '@angular/core';
import { AuthClient } from '../../proto/AuthServiceClientPb';
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../../proto/auth_pb';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private authServiceClient: AuthClient;

  constructor() {
    // Initialize the client with the service URL
    this.authServiceClient = new AuthClient('http://localhost:8082', null, null);
  }

  register(name: string, surname: string, email: string, password: string): Observable<RegisterResponse> {
    const request = new RegisterRequest();
    request.setName(name);
    request.setSurname(surname);
    request.setEmail(email);
    request.setPassword(password);

    return new Observable<RegisterResponse>((observer) => {
      this.authServiceClient.register(request, {}, (err, response) => {
        if (err) {
          observer.error(err.message);
          return;
        }
        observer.next(response);
        observer.complete();
      });
    });
  }

  login(email: string, password: string) {
    const request = new LoginRequest();
    request.setEmail(email);
    request.setPassword(password);

    return new Observable<LoginResponse>((observer) => {
      this.authServiceClient.login(request, {}, (err, response) => {
        if(err) {
          observer.error(err.message);
          return;
        }
        observer.next(response);
        observer.complete();
      })
    })
  }
}
