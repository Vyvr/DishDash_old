import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {  Socket, io } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class SocketApiService {
  private serverUrl = 'http://localhost:8083'; // Update with your server URL
  socket: Socket;

  constructor() {
    this.socket = io(this.serverUrl, {
      withCredentials: false, // Try adjusting this
      reconnectionAttempts: 5,
      timeout: 20000, // 20 seconds
    });

    this.setupListeners();
  }

  sendFriendRequest(data: any): void {
    this.socket.emit('friend-request', data);
  }

  getMessages(): Observable<void> {
    return new Observable(observer => {
      this.socket.on('message', (message) => {
        observer.next(message);
      });
    });
  }

  private setupListeners(): void {
    this.socket.on('connect', () => {
      console.log('Connected to the socket.io server');
    });

    this.socket.on('disconnect', (reason) => {
      console.log(`Disconnected: ${reason}`);
    });

    this.socket.on('reply', (data: any) => {
      console.log('Event received:', data);
    });
  }
}
