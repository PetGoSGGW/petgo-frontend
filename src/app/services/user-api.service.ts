import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { UserReview } from '../models/userReview.model';

@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  public getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }
  public getUser(id: User['id']): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${id}`);
  }

  public getUserReviews(id: User['id']): Observable<UserReview[]> {
    return this.http.get<UserReview[]>(`${this.apiUrl}/reviews/walker`, {
      params: { walkerId: id },
    });
  }
}
