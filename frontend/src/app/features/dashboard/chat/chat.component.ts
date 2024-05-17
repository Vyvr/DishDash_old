// chat.component.ts
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  OnDestroyMixin,
  untilComponentDestroyed,
} from '@w11k/ngx-componentdestroyed';
import { isNil } from 'lodash-es';
import { combineLatest, map, take } from 'rxjs';
import { WebSocketService } from 'src/app/core/api/socket-api.service';
import { AppState } from 'src/app/store';
import { AuthFacade } from 'src/app/store/auth';
import { ChatFacade, ChatMessage } from 'src/app/store/chat';
import { SocialFacade } from 'src/app/store/social';

interface SelectedFriend {
  id: string;
  name: string;
  surname: string;
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
  friendsWithPendingMessages$ = combineLatest([this.chatState$, this.socialState$]).pipe(
    untilComponentDestroyed(this),
    map(([chatState, socialState]) => {
      const friendsWithnotifications = socialState?.data?.friends.map(
        ({ id, ...rest }) => {
          return {
            id,
            hasPendingMessages: this.hasPendingMessages(id, chatState.messages),
            ...rest,
          };
        }
      );

      return {
        ...socialState,
        data: { ...socialState.data, friends: friendsWithnotifications },
      };
    })
  );

  selectedFriend: SelectedFriend = {
    id: '',
    name: '',
    surname: '',
  };

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

  hasPendingMessages(friendId: string, messages: ChatMessage[]): boolean {
    return !!messages.find(({ senderId }) => senderId === friendId);
  }

  send(): void {
    this.authState$
      .pipe(untilComponentDestroyed(this), take(1))
      .subscribe((authState) => {
        const payload = {
          sender: authState?.data?.id,
          receiver: this.selectedFriend.id,
        };
        if (
          isNil(payload.sender) ||
          isNil(payload.receiver) ||
          isNil(this.selectedFriend.id) ||
          this.selectedFriend.id === '' ||
          this.message === ''
        ) {
          return;
        }

        this.chatFacade.sendMessage({
          message: this.message,
          senderId: authState.data.id,
          senderName: authState.data.name,
          senderSurname: authState.data.surname,
          receiverId: this.selectedFriend.id,
        });

        this.message = '';
      });
  }

  selectFriend(
    friendId: string,
    friendName: string,
    friendSurname: string
  ): void {
    if (friendId === this.selectedFriend?.id) return;

    if (this.selectedFriend?.id !== '') {
      // disconnect from receiver
    }

    this.selectedFriend.id = friendId;
    this.selectedFriend.name = friendName;
    this.selectedFriend.surname = friendSurname;

    this.authState$
      .pipe(untilComponentDestroyed(this), take(1))
      .subscribe((authState) => {
        const payload = {
          sender: authState?.data?.id,
          receiver: this.selectedFriend.id,
        };
        if (isNil(payload.sender) || isNil(payload.receiver)) {
          return;
        }

        this.webSocketService.selectFriend(payload.sender, payload.receiver);
      });
  }
}
