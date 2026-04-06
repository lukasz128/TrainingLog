import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ContentContainerComponent } from 'auth/ui';
import { AuthHttpService, RegisterCredentials } from 'ui/data-access';
import { RegisterFormComponent } from '../register-form/register-form.component';

@Component({
  selector: 'auth-register-page',
  imports: [ContentContainerComponent, RegisterFormComponent],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss',
})
export class RegisterPageComponent {
  private readonly http = inject(AuthHttpService);
  private readonly router = inject(Router);

  protected register(model: RegisterCredentials) {
    return this.http.register$(model).subscribe(() => {
      this.router.navigate(['/auth/login']);
    });
  }
}
