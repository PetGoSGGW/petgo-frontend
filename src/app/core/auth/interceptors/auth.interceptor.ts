import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  const { accessToken, tokenType } = inject(AuthService);

  const clonedRequest = request.clone({
    headers: request.headers.set('Authorization', `${tokenType} ${accessToken}`),
  });

  return next(clonedRequest);
};
