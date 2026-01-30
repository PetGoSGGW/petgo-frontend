import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-payment-success',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatButton, RouterLink],
  template: `
    <div class="payment-container">
      <div class="card">
        <div class="success-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 class="title">Płatność się udała!</h1>
        <p class="message">
          Twoja transakcja została pomyślnie przetworzona. Dziękujemy za zakupy.
        </p>

        <div class="image-wrapper">
          <img
            src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=1739&auto=format&fit=crop"
            alt="Uśmiechnięty pies"
            class="dog-image"
          />
          <div class="ok-badge">OK</div>
        </div>

        <a matButton="tonal" [routerLink]="['/']">Wróć do strony głównej</a>
      </div>
    </div>
  `,
  styles: [
    `
      .payment-container {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
      }

      .card {
        text-align: center;
        width: 100%;
        margin-inline: auto;
      }

      .success-icon {
        width: 60px;
        height: 60px;
        background-color: #d1fae5;
        color: #10b981;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 1.5rem auto;
      }
      .success-icon svg {
        width: 32px;
        height: 32px;
      }

      .title {
        color: #111827;
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
      }
      .message {
        color: #6b7280;
        font-size: 0.95rem;
        margin-bottom: 2rem;
        line-height: 1.5;
      }

      .image-wrapper {
        position: relative;
        width: 150px;
        height: 150px;
        margin: 0 auto 2rem auto;
      }

      .dog-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50%;
        border: 4px solid #fff;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }

      .ok-badge {
        position: absolute;
        bottom: 5px;
        right: 5px;
        background-color: #10b981;
        color: white;
        font-weight: bold;
        padding: 8px 12px;
        border-radius: 12px;
        font-size: 0.8rem;
        border: 3px solid white;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
        transform: rotate(-10deg);
      }

      .btn-home {
        background-color: #111827;
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        width: 100%;
        transition: background-color 0.2s;
      }
      .btn-home:hover {
        background-color: #374151;
      }
    `,
  ],
})
export default class PaymentSuccessComponent {}
