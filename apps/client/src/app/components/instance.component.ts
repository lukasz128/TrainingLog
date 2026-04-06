import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { NavbarComponent } from 'ui/navbar';

@Component({
  selector: 'app-instance',
  imports: [RouterOutlet, NgOptimizedImage, NavbarComponent],
  templateUrl: './instance.component.html',
  styleUrl: './instance.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstanceComponent {
  private readonly activatedRouter = inject(ActivatedRoute);

  protected readonly title = toSignal(this.activatedRouter.title);
}
