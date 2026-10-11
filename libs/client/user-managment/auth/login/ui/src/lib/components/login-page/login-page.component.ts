import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  AuthFacadeService,
  AuthHttpService,
  LoginCredentials,
} from 'auth/data-access';
import { ContentContainerComponent } from 'auth/ui';
import { LoginFormComponent } from '../login-form/login-form.component';

@Component({
  selector: 'auth-login-page',
  imports: [ContentContainerComponent, LoginFormComponent],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent {
  private readonly http = inject(AuthHttpService);
  private readonly root = inject(AuthFacadeService);
  private readonly router = inject(Router);

  protected login(model: LoginCredentials) {
    return this.http.login$(model).subscribe(({ access_token }) => {
      this.root.token = access_token;
      this.router.navigate(['/instance']);
    });
  }
}
