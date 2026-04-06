import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthHttpService } from 'ui/data-access';

@Component({
  selector: 'auth-shell',
  imports: [RouterModule],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
  providers: [AuthHttpService],
})
export class ShellComponent {}
