import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
}

@Injectable()
export class AuthHttpService {
  private readonly _http = inject(HttpClient);

  login$(credentials: LoginCredentials): Observable<LoginResponse> {
    return this._http.post<LoginResponse>(`/api/auth/login`, credentials);
  }

  register$(credentials: RegisterCredentials): Observable<unknown> {
    return this._http.post<unknown>(`/api/auth/register`, credentials);
  }

  getLoginUser$(): Observable<unknown> {
    return this._http.get<unknown>(`/api/auth/me`);
  }
}
