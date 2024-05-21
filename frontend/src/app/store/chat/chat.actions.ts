// chat.actions.ts
import { createAction, props } from '@ngrx/store';
import { ChatMessage } from './chat.model';

const moduleName = 'Chat';

//---------------SEND MESSAGE---------------------

export const sendMessage = createAction(
  `[${moduleName}] Send message`,
  props<ChatMessage>()
);

export const sendMessageSuccess = createAction(
  `[${moduleName}] Send message success`,
  props<ChatMessage>()
);

export const sendMessageFailure = createAction(
  `[${moduleName}] Send message failure`,
  props<{ message: string }>()
);

//---------------RECIVE MESSAGE---------------------

export const reciveMessage = createAction(
  `[${moduleName}] Receive Message`,
  props<ChatMessage>()
);

export const reciveMessageSuccess = createAction(
  `[${moduleName}] Receive Message success`,
  props<ChatMessage>()
);

export const reciveMessageFailure = createAction(
  `[${moduleName}] Receive Message failure`,
  props<{ message: string }>()
);

//---------------CLEAR MESSAGES---------------------

export const clearMessages = createAction(`[${moduleName}] Clear messages`);
