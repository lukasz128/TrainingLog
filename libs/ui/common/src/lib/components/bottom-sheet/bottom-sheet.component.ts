import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

@Component({
  selector: 'ui-bottom-sheet',
  imports: [],
  templateUrl: './bottom-sheet.component.html',
  styleUrl: './bottom-sheet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.ui-bottom-sheet--open]': 'open()',
  },
})
export class BottomSheetComponent {
  readonly open = input(false);
  readonly title = input<string | null>(null);
  readonly showBackdrop = input(true);
  readonly closeOnBackdrop = input(true);
  // readonly maxWidth = input('540px');

  readonly closed = output<void>();

  emitClose(): void {
    this.closed.emit();
  }

  handleBackdropClick(): void {
    if (this.closeOnBackdrop()) {
      this.emitClose();
    }
  }
}
