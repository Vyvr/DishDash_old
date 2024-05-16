// chat.effects.ts
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as actions from './chat.actions';
import { catchError, map, switchMap } from 'rxjs/operators';
import { WebSocketService } from 'src/app/core/api/socket-api.service';
import { of } from 'rxjs';
import { ChatMessage } from './chat.model';

@Injectable()
export class ChatEffects {
  constructor(
    private actions$: Actions,
    private webSocketService: WebSocketService
  ) {}

  sendMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.sendMessage),
      switchMap((action) =>
        of(this.webSocketService.sendMessage(action)).pipe(
          map((message: ChatMessage) =>
            actions.sendMessageSuccess({
              sender: message.sender,
              receiver: message.receiver,
              message: message.message,
            })
          ),
          catchError((error) =>
            of(actions.sendMessageFailure({ message: error.message }))
          )
        )
      )
    )
  );

  receiveMessage$ = createEffect(() =>
    this.webSocketService.getMessages().pipe(
      map((message: ChatMessage) =>
        actions.reciveMessageSuccess({
          sender: message.sender,
          receiver: message.receiver,
          message: message.message,
        })
      ),
      catchError((error) =>
        of(actions.reciveMessageFailure({ message: error.message }))
      )
    )
  );
}