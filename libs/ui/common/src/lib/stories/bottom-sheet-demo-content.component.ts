import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ui-bottom-sheet-demo-content',
  standalone: true,
  template: `
    <div class="exercise-sheet">
      @for (item of rows; track $index) {
        <div class="exercise-sheet__row">
          <span class="exercise-sheet__index">{{ $index + 1 }}</span>
          <button class="exercise-sheet__status" type="button">
            {{ item.done ? 'OK' : '-' }}
          </button>
          <span class="exercise-sheet__chip">{{ item.weight }}</span>
          <span class="exercise-sheet__chip">{{ item.reps }}</span>
        </div>
      }

      <button class="exercise-sheet__add" type="button">+ Add series</button>
      <button class="exercise-sheet__close" type="button">Close</button>
    </div>
  `,
  styles: [
    `
      .exercise-sheet {
        display: flex;
        flex-direction: column;
        gap: 14px;
      }

      .exercise-sheet__row {
        display: grid;
        grid-template-columns: 22px 62px 1fr 1fr;
        align-items: center;
        gap: 12px;
      }

      .exercise-sheet__index {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 22px;
        height: 22px;
        border-radius: 50%;
        border: 1px solid rgb(255 255 255 / 54%);
        font-size: 1.2rem;
        color: rgb(255 255 255 / 86%);
      }

      .exercise-sheet__status {
        width: 62px;
        height: 62px;
        border-radius: 16px;
        border: 2px solid rgb(255 255 255 / 72%);
        background: rgb(255 255 255 / 3%);
        color: #fff;
        font-size: 3.4rem;
        line-height: 1;
      }

      .exercise-sheet__chip {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 14px;
        min-height: 52px;
        padding: 0 16px;
        background: rgb(255 255 255 / 10%);
        color: rgb(255 255 255 / 90%);
        font-size: 3rem;
      }

      .exercise-sheet__add {
        margin-top: 14px;
        align-self: start;
        border: 0;
        background: transparent;
        color: #fff;
        font-size: 2.8rem;
      }

      .exercise-sheet__close {
        margin-top: 18px;
        min-height: 44px;
        border: 0;
        background: #f1f1f1;
        color: #111;
        font-size: 2.4rem;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BottomSheetDemoContentComponent {
  readonly rows = [
    { done: true, weight: '60kg', reps: '6powt' },
    { done: true, weight: '70kg', reps: '6powt' },
    { done: false, weight: '80kg', reps: '6powt' },
    { done: false, weight: '90kg', reps: '4powt' },
  ];
}
