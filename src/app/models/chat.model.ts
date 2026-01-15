export interface ChatUser {
  userId: number;
  firstName: string;
  lastName: string;
}

export interface Chat {
  chatId: number;
  reservationId: number;
  owner: ChatUser;
  walker: ChatUser;
}

export interface ChatMessage {
  senderId: number;
  content: string;
  sentAt: Date | string;
}

export interface SendMessageDto {
  senderId: number;
  content: string;
}

export interface ChatSessionData {
  chat: Chat;
  messages: ChatMessage[];
}
