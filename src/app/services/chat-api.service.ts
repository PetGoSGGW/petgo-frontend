import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Chat, ChatMessage, SendMessageDto } from '../models/chat.model';

@Injectable({
  providedIn: 'root',
})
export class ChatApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  // 1. Pobierz ID czatu na podstawie rezerwacji
  public getChatByReservationId(reservationId: number): Observable<Chat> {
    return this.http.get<Chat>(`${this.apiUrl}/chats/reservation/${reservationId}`);
    // return this.http.get<Chat>(`${this.apiUrl}/users/${reservationId}`);
  }

  // 2. Pobierz wiadomości dla danego czatu
  public getMessages(chatId: number | undefined): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(`${this.apiUrl}/chats/${chatId}/messages`);
  }

  // 3. Wyślij wiadomość
  public sendMessage(chatId: number, body: SendMessageDto): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/chats/${chatId}/messages`, body);
  }
}
