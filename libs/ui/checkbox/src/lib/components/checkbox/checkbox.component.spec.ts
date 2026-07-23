import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { CheckboxComponent } from './checkbox.component';

@Component({
  imports: [CheckboxComponent, ReactiveFormsModule],
  template: `<ui-checkbox [formControl]="control">Done</ui-checkbox>`,
})
class CheckboxHostComponent {
  readonly control = new FormControl(false, { nonNullable: true });
}

describe(CheckboxComponent.name, () => {
  let fixture: ComponentFixture<CheckboxHostComponent>;
  let host: CheckboxHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckboxHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckboxHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should update the form control when clicked', () => {
    const checkbox = fixture.debugElement.query(
      By.directive(CheckboxComponent),
    );

    checkbox.triggerEventHandler('click');

    expect(host.control.value).toBe(true);
  });

  it('should reflect external form control changes', () => {
    host.control.setValue(true);
    fixture.detectChanges();

    const checkbox = fixture.debugElement.query(
      By.directive(CheckboxComponent),
    );

    expect(checkbox.attributes['aria-checked']).toBe('true');
  });

  it('should not toggle when disabled', () => {
    host.control.disable();
    fixture.detectChanges();

    const checkbox = fixture.debugElement.query(
      By.directive(CheckboxComponent),
    );
    checkbox.triggerEventHandler('click');

    expect(host.control.value).toBe(false);
  });
});
