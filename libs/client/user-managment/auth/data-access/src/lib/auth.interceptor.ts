import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthFacadeService } from './auth-facade.service';

export function authInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  const token = inject(AuthFacadeService).token;

  if (token === null) return next(req);

  const newReq = req.clone({
    headers: req.headers.append('authorization', token),
  });

  return next(newReq);
}
