import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { SetInputComponent } from './set-input.component';

@Component({
  imports: [ReactiveFormsModule, SetInputComponent],
  template: `
    <strength-set-input
      suffix="kg"
      ariaLabel="Weight"
      [formControl]="control"
    />
  `,
})
class SetInputHostComponent {
  readonly control = new FormControl('60', { nonNullable: true });
}

describe(SetInputComponent.name, () => {
  let fixture: ComponentFixture<SetInputHostComponent>;
  let host: SetInputHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetInputHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SetInputHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should update the form control when typed into', () => {
    const input = fixture.debugElement.query(By.css('input'));
    input.nativeElement.value = '70';
    input.triggerEventHandler('input', { target: input.nativeElement });

    expect(host.control.value).toBe('70');
  });

  it('should render the suffix', () => {
    const suffix = fixture.debugElement.query(
      By.css('.strength-set-input__suffix'),
    );

    expect(suffix.nativeElement.textContent.trim()).toBe('kg');
  });

  it('should reflect external form control changes', () => {
    host.control.setValue('80');
    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('input'));

    expect(input.nativeElement.value).toBe('80');
  });
});
