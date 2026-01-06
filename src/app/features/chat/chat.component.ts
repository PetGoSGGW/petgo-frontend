import { Component, computed, ElementRef, inject, input, signal, viewChild } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop'; // <--- WAŻNY IMPORT
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { map, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ChatApiService } from '../../services/chat-api.service';
import { ChatSessionData } from '../../models/chat.model';
import { AuthService } from '../../core/auth/services/auth.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent {
  private readonly chatService = inject(ChatApiService);
  private readonly authService = inject(AuthService);

  public readonly reservationId = input.required<number>();
  public readonly newMessageText = signal<string>('');
  public readonly currentUserId = computed(() => this.authService.session()?.userId);

  public readonly messagesContainer = viewChild<ElementRef>('messagesContainer');
  public readonly chatResource = rxResource({
    params: () => ({
      id: this.reservationId(),
    }),
    stream: ({ params: { id } }): Observable<ChatSessionData | undefined> =>
      this.chatService.getChatByReservationId(id).pipe(
        switchMap((chat) =>
          this.chatService.getMessages(chat.chatId).pipe(
            map((messages) => ({
              chatId: chat.chatId,
              messages,
            })),
          ),
        ),
      ),
  });

  public sendMessage(): void {
    const text = this.newMessageText().trim();
    // Pobieramy aktualną wartość z zasobu
    const currentData = this.chatResource.value();
    const senderId = this.currentUserId();
    if (!text || !currentData?.chatId || !senderId) return;

    const payload = {
      senderId,
      content: text,
      sentAt: new Date(),
    };

    // Optymistyczna aktualizacja (lokalna)
    this.chatResource.update((state) => {
      if (!state) return state;
      return {
        ...state,
        messages: [...state.messages, { ...payload }],
      };
    });

    this.newMessageText.set('');
    this.scrollToBottom();

    // Wysyłka do API
    this.chatService.sendMessage(currentData.chatId, payload).subscribe({
      error: () => {
        this.chatResource.reload(); // W razie błędu przywróć stan z serwera
        // Tu można dodać Toast/SnackBar z informacją o błędzie
      },
    });
  }

  public refreshMessages(): void {
    // rxResource ma wbudowaną metodę reload()
    this.chatResource.reload();
  }

  // Helper do scrollowania (wywoływany w HTML po załadowaniu)
  public onMessagesLoaded(): void {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    // setTimeout jest nadal potrzebny, aby dać przeglądarce czas na przerysowanie DOM
    setTimeout(() => {
      // 1. Odczytujemy wartość sygnału przez nawiasy ()
      const container = this.messagesContainer();

      // 2. Sprawdzamy czy element istnieje (sygnał może zwrócić undefined)
      if (container) {
        const el = container.nativeElement;
        el.scrollTop = el.scrollHeight;
      }
    }, 100);
  }
}
