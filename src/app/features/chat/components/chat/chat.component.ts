import {
  Component,
  computed,
  ElementRef,
  inject,
  input,
  signal,
  viewChild,
  effect,
  untracked,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { map, switchMap } from 'rxjs/operators';
import { timer } from 'rxjs';
import { ChatApiService } from '../../../../services/chat-api.service';
import { ChatUser } from '../../../../models/chat.model';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

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
export default class ChatComponent {
  private readonly chatService = inject(ChatApiService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly matSnackBar = inject(MatSnackBar);

  public readonly reservationId = input.required<number>();

  public readonly newMessageText = signal<string>('');
  public readonly messagesContainer = viewChild<ElementRef>('messagesContainer');
  public readonly currentUserId = computed(() => this.authService.session()?.userId);

  public readonly chatResource = rxResource({
    params: () => ({ id: this.reservationId() }),
    stream: ({ params: { id } }) =>
      timer(0, 3000).pipe(
        switchMap(() =>
          this.chatService
            .getChatByReservationId(id)
            .pipe(
              switchMap((chat) =>
                this.chatService
                  .getMessages(chat.chatId)
                  .pipe(map((messages) => ({ chat, messages }))),
              ),
            ),
        ),
      ),
  });

  // --- OBLICZANIE ROZMÓWCY (Interlocutor) ---
  // To computed automatycznie określa, z kim rozmawiamy
  public readonly interlocutor = computed<ChatUser | null>(() => {
    if (this.chatResource.error()) {
      return null;
    }
    const data = this.chatResource.value();
    const myId = this.currentUserId();

    if (!data || !myId) return null;
    return myId === data.chat.walker.userId ? data.chat.owner : data.chat.walker;
  });

  constructor() {
    effect(async () => {
      if (this.chatResource.error()) {
        this.matSnackBar.open('Wystąpił błąd!', 'OK');
        await this.router.navigate(['/czat']);
      }
    });

    effect(() => {
      if (this.chatResource.error()) return;
      const data = this.chatResource.value();
      untracked(() => {
        if (data?.messages) {
          this.scrollToBottom();
        }
      });
    });
  }

  public sendMessage(): void {
    const text = this.newMessageText().trim();
    const currentData = this.chatResource.value();
    const senderId = this.currentUserId();

    if (!text || !currentData?.chat.chatId || !senderId) return;

    const payload = {
      senderId,
      content: text,
      sentAt: new Date(),
    };

    this.chatResource.update((state) => {
      if (!state) return state;
      return {
        ...state,
        messages: [...state.messages, payload],
      };
    });

    this.newMessageText.set('');
    this.scrollToBottom();

    this.chatService.sendMessage(currentData.chat.chatId, payload).subscribe({
      error: () => this.chatResource.reload(),
    });
  }
  private scrollToBottom(): void {
    setTimeout(() => {
      const container = this.messagesContainer();
      if (container) {
        container.nativeElement.scrollTop = container.nativeElement.scrollHeight;
      }
    }, 100);
  }

  public getAvatarUrl(firstName: string, lastName: string): string {
    return `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=random&color=fff`;
  }
}
