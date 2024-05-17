// chat.reducer.ts
import { createReducer, on } from '@ngrx/store';
import * as actions from './chat.actions';
import { initialState } from './chat.model';
import { errorState } from '../utils';

export const chatReducer = createReducer(
  initialState,
  //---------------SEND MESSAGE---------------------
  on(actions.sendMessage, (state) => ({ ...state })),
  on(actions.sendMessageSuccess, (state, { type: _, ...payload }) => {
    return {
      ...state,
      messages: [...state.messages, payload],
    };
  }),
  on(actions.sendMessageFailure, (state, { message }) => ({
    ...state,
    ...errorState(message),
  })),

  //---------------RECIVE MESSAGE---------------------
  on(actions.reciveMessage, (state) => ({ ...state })),
  on(
    actions.reciveMessageSuccess,
    (
      state,
      {
        senderId: sender,
        receiverId: receiver,
        message,
        senderName,
        senderSurname,
      }
    ) => {
      return {
        ...state,
        messages: [
          ...state.messages,
          {
            senderId: sender,
            receiverId: receiver,
            message,
            senderName,
            senderSurname,
          },
        ],
      };
    }
  ),
  on(actions.reciveMessageFailure, (state, { message }) => ({
    ...state,
    ...errorState(message),
  }))
);
