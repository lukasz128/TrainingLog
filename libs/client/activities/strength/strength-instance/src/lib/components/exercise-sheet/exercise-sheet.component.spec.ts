import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  ExerciseSheetComponent,
  ExerciseSet,
} from './exercise-sheet.component';

describe(ExerciseSheetComponent.name, () => {
  let fixture: ComponentFixture<ExerciseSheetComponent>;

  const sets: ExerciseSet[] = [
    { done: true, weight: '60', reps: '6' },
    { done: false, weight: '70', reps: '5' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExerciseSheetComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExerciseSheetComponent);
    fixture.componentRef.setInput('sets', sets);
    fixture.detectChanges();
  });

  it('should render a row for each set', () => {
    const rows = fixture.debugElement.queryAll(By.css('.exercise-sheet__row'));

    expect(rows).toHaveLength(2);
  });

  it('should add a new series', () => {
    const addButton = fixture.debugElement.query(
      By.css('.exercise-sheet__add'),
    );

    addButton.triggerEventHandler('click');
    fixture.detectChanges();

    expect(sets).toHaveLength(3);
  });
});
