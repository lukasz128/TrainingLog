import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ContentContainerComponent } from 'auth/ui';
import { AuthHttpService, LoginCredentials } from 'ui/data-access';
import { LoginFormComponent } from '../login-form/login-form.component';

@Component({
  selector: 'auth-login-page',
  imports: [ContentContainerComponent, LoginFormComponent],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent {
  private readonly http = inject(AuthHttpService);
  private readonly router = inject(Router);

  protected login(model: LoginCredentials) {
    return this.http.login$(model).subscribe(() => {
      this.router.navigate(['/instance']);
    });
  }
}
