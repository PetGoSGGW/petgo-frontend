import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { DogReview, CreateReviewRequest } from '../models/review.model';

@Injectable({ providedIn: 'root' })
export class ReviewApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  public getDogReview(dogId: number): Observable<DogReview> {
    const params = new HttpParams().set('dogId', dogId);
    return this.http.get<DogReview>(`${this.apiUrl}/reviews/dog`, { params });
  }

  public createReview(payload: CreateReviewRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/reviews`, payload);
  }
}
