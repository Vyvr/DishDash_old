import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable, Subject } from 'rxjs';
import { ChatMessage } from 'src/app/store/chat';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private socket: Socket | undefined;
  private messagesSubject: Subject<ChatMessage> = new Subject<ChatMessage>();

  constructor() {
    console.log('WebSocketService initialized.');
  }

  public connect(userId: string): void {
    if (this.socket) {
      console.warn('WebSocket connection already exists.');
      return;
    }

    console.log('Initializing WebSocket connection...');
    this.socket = io('http://localhost:3000', {
      query: { user_id: userId }
    });

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });

    this.socket.on('connect_timeout', (timeout) => {
      console.error('Connection timeout:', timeout);
    });

    this.socket.on('chat_message', (msg: ChatMessage) => {
      console.log('Message from server:', msg);
      this.messagesSubject.next(msg);
    });

    this.socket.on('users_list', (users) => {
      console.log('Received users list:', users);
      // Handle the received users list (e.g., store it in a service or state)
    });

    this.socket.on('friend_selected', (data) => {
      console.log('Friend selected:', data);
      // Handle friend selected notification
    });
  }

  public disconnect(): void {
    if (!this.socket) {
      console.warn('No WebSocket connection to disconnect.');
      return;
    }

    this.socket.disconnect();
    this.socket = undefined;
    console.log('WebSocket connection disconnected.');
  }

  public sendMessage(message: ChatMessage): ChatMessage {
    if (!this.socket) {
      console.error('Cannot send message. No WebSocket connection.');
      return message;
    }

    console.log('Sending message:', message);
    this.socket.emit('chat_message', message);
    return message;
  }

  public getMessages(): Observable<ChatMessage> {
    return this.messagesSubject.asObservable();
  }

  public selectFriend(sender: string, receiver: string): void {
    if (!this.socket) {
      console.error('Cannot select friend. No WebSocket connection.');
      return;
    }

    console.log('Selecting friend:', { sender, receiver });
    this.socket.emit('select_friend', { sender, receiver });
  }
}
