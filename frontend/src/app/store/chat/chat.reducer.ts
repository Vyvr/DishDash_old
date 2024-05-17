// chat.reducer.ts
import { createReducer, on } from '@ngrx/store';
import * as actions from './chat.actions';
import { initialState } from './chat.model';
import { errorState } from '../utils';

export const chatReducer = createReducer(
  initialState,
  //---------------SEND MESSAGE---------------------
  on(actions.sendMessage, (state) => ({ ...state })),
  on(
    actions.sendMessageSuccess,
    (state, { sender, receiver, message, senderName, senderSurname }) => {
      return {
        ...state,
        messages: [
          ...state.messages,
          { sender, receiver, message, senderName, senderSurname },
        ],
      };
    }
  ),
  on(actions.sendMessageFailure, (state, { message }) => ({
    ...state,
    ...errorState(message),
  })),

  //---------------RECIVE MESSAGE---------------------
  on(actions.reciveMessage, (state) => ({ ...state })),
  on(
    actions.reciveMessageSuccess,
    (state, { sender, receiver, message, senderName, senderSurname }) => {
      return {
        ...state,
        messages: [
          ...state.messages,
          { sender, receiver, message, senderName, senderSurname },
        ],
      };
    }
  ),
  on(actions.reciveMessageFailure, (state, { message }) => ({
    ...state,
    ...errorState(message),
  }))
);
