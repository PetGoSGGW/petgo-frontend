export interface Chat {
  chatId: number;
  reservationId: number;
}

export interface ChatMessage {
  senderId: number;
  content: string;
}

export interface SendMessageDto {
  senderId: number;
  content: string;
}

export interface ChatSessionData {
  chatId: number;
  messages: ChatMessage[];
}
