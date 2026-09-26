import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExerciseTemplateFormComponent } from './exercise-template-form.component';

describe('ExerciseTemplateFormComponent', () => {
  let component: ExerciseTemplateFormComponent;
  let fixture: ComponentFixture<ExerciseTemplateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExerciseTemplateFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExerciseTemplateFormComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
