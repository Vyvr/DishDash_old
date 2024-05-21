// chat.component.ts
import { Component, OnInit } from '@angular/core';
import {
  OnDestroyMixin,
  untilComponentDestroyed,
} from '@w11k/ngx-componentdestroyed';
import { isNil } from 'lodash-es';
import { BehaviorSubject, combineLatest, take } from 'rxjs';
import { WebSocketService } from 'src/app/core/api/socket-api.service';
import { AuthFacade } from 'src/app/store/auth';
import { ChatFacade, ChatMessage } from 'src/app/store/chat';
import { FriendData, SocialFacade } from 'src/app/store/social';

interface SelectedFriend {
  id: string;
  name: string;
  surname: string;
}

type FriendWithPendingMessages = FriendData & { hasPendingMessages: boolean };

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

  friendsWithPendingMessages$ = new BehaviorSubject<
    FriendWithPendingMessages[] | null
  >(null);

  selectedFriend: SelectedFriend = {
    id: '',
    name: '',
    surname: '',
  };

  constructor(
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

    combineLatest([this.socialState$, this.chatState$])
      .pipe(untilComponentDestroyed(this))
      .subscribe(([socialState, chatState]) => {
        if (isNil(socialState?.data?.friends) || isNil(chatState?.messages)) {
          this.friendsWithPendingMessages$.next(null);
          return;
        }

        const friendsWithPendingMessages = socialState.data.friends.map(
          ({ id, ...rest }) => ({
            id,
            ...rest,
            hasPendingMessages:
              !(this.selectedFriend?.id === id) &&
              this._hasPendingMessages(id, chatState.messages),
          })
        );

        this.friendsWithPendingMessages$.next(friendsWithPendingMessages);
      });
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

  selectFriend(friend: FriendData): void {
    if (friend.id === this.selectedFriend?.id) {
      return;
    }

    this.selectedFriend = friend;

    const friendsWithPendingMessages =
      this.friendsWithPendingMessages$.getValue();

    if (!isNil(friendsWithPendingMessages)) {
      this.friendsWithPendingMessages$.next(
        friendsWithPendingMessages.map((friend) => {
          if (friend.id === this.selectedFriend.id) {
            friend.hasPendingMessages = false;
          }

          return friend;
        })
      );
    }

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
        this.chatFacade.clearMessages();
        this.webSocketService.selectFriend(payload.sender, payload.receiver);
      });
  }

  private _hasPendingMessages(
    friendId: string,
    messages: ChatMessage[]
  ): boolean {
    return !!messages.find(({ senderId }) => senderId === friendId);
  }
}
