export interface ChatData {
  messages: ChatMessage[];
}

export interface ChatMessage {
  [x: string]: any;
  sender: string;
  receiver: string;
  message: string;
}

export interface ChatState extends ChatData {}

export const initialState: ChatState = {
  messages: [],
};
