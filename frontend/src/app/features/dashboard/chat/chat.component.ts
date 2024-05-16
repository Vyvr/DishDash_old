// chat.component.ts
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  OnDestroyMixin,
  untilComponentDestroyed,
} from '@w11k/ngx-componentdestroyed';
import { isNil } from 'lodash-es';
import { take } from 'rxjs';
import { WebSocketService } from 'src/app/core/api/socket-api.service';
import { AuthFacade } from 'src/app/store/auth';
import { ChatFacade } from 'src/app/store/chat';
import { SocialFacade } from 'src/app/store/social';

interface AppState {
  chat: { messages: string[] };
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent extends OnDestroyMixin implements OnInit {
  message = '';

  socialState$ = this.socialFacade.socialState$;
  chatState$ = this.chatFacade.chatState$;
  authState$ = this.authFacade.authState$;

  selectedFriendId: string = '';

  constructor(
    private store: Store<AppState>,
    private chatFacade: ChatFacade,
    private socialFacade: SocialFacade,
    private authFacade: AuthFacade,
    private webSocketService: WebSocketService
  ) {
    super();
  }

  ngOnInit(): void {
    this.authState$
      .pipe(untilComponentDestroyed(this), take(1))
      .subscribe((authState) => {
        if (isNil(authState) || isNil(authState.data)) return;
      });
  }

  send(): void {
    this.authState$
      .pipe(untilComponentDestroyed(this), take(1))
      .subscribe((authState) => {
        const payload = {
          sender: authState?.data?.id,
          receiver: this.selectedFriendId,
        };
        if (
          isNil(payload.sender) ||
          isNil(payload.receiver) ||
          isNil(this.selectedFriendId) ||
          this.selectedFriendId === ''
        ) {
          return;
        }

        this.chatFacade.sendMessage({
          message: this.message,
          sender: authState.data.id,
          receiver: this.selectedFriendId,
        });

        this.message = '';
      });
  }

  selectFriend(friendId: string): void {
    if (friendId === this.selectedFriendId) return;

    if (this.selectedFriendId !== '' || this.selectedFriendId !== null) {
      // disconnect from receiver
    }

    this.selectedFriendId = friendId;

    this.authState$
      .pipe(untilComponentDestroyed(this), take(1))
      .subscribe((authState) => {
        const payload = {
          sender: authState?.data?.id,
          receiver: this.selectedFriendId,
        };
        if (isNil(payload.sender) || isNil(payload.receiver)) {
          return;
        }

        this.webSocketService.selectFriend(payload.sender, payload.receiver);
      });
  }
}
