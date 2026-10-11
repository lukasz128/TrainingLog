import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthFacadeService {
  private tokenStore: string | null = null;

  set token(token: string | null) {
    if (token === null) {
      this.tokenStore = null;
      return;
    }
    this.tokenStore = `Bearer ${token}`;
  }

  get token(): string | null {
    return this.tokenStore;
  }
}
