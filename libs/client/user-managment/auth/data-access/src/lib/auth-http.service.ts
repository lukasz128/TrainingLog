import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
}

@Injectable()
export class AuthHttpService {
  private readonly _http = inject(HttpClient);

  login$(credentials: LoginCredentials): Observable<unknown> {
    return this._http.post<unknown>(`/api/auth/login`, credentials);
  }

  register$(credentials: RegisterCredentials): Observable<unknown> {
    return this._http.post<unknown>(`/api/auth/register`, credentials);
  }
}
