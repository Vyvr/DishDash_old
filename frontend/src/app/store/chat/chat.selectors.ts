import { createSelector } from "@ngrx/store";
import { AppState } from "..";
import { ChatState } from "./chat.model";

const selectBase = (state: AppState): ChatState => state.chat;

export const selectChatState = createSelector(selectBase, (state) => state)