export interface ChatData {
  messages: ChatMessage[];
}

export interface ChatMessage {
  senderId: string;
  receiverId: string;
  senderName: string;
  senderSurname: string;
  message: string;
}

export interface ChatState extends ChatData {}

export const initialState: ChatState = {
  messages: [],
};
