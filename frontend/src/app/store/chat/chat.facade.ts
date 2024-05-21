import { Injectable } from '@angular/core';
import { AppState } from '..';
import { Store } from '@ngrx/store';

import * as actions from './chat.actions';
import * as selectors from './chat.selectors';
import { ChatMessage } from './chat.model';

@Injectable()
export class ChatFacade {
  chatState$ = this.store.select(selectors.selectChatState);

  constructor(private store: Store<AppState>) {}

  sendMessage(payload: ChatMessage): void {
    this.store.dispatch(actions.sendMessage(payload));
  }

  reciveMessage(payload: ChatMessage): void {
    this.store.dispatch(actions.reciveMessage(payload));
  }

  clearMessages(): void {
    this.store.dispatch(actions.clearMessages());
  }
}
