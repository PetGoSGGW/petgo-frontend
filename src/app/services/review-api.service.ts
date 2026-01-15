import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ReviewType } from '../models/review-type.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReviewApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  public addReview(body: {
    reservationId: number;
    reviewType: ReviewType;
    rating: number;
    comment?: string;
  }): Observable<unknown> {
    return this.http.post<unknown>(`${this.apiUrl}/reviews`, body);
  }
}
