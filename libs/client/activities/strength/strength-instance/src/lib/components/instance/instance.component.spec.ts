import { Location } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InstanceComponent } from './instance.component';

describe('InstanceComponent', () => {
  let component: InstanceComponent;
  let fixture: ComponentFixture<InstanceComponent>;

  afterEach(() => {
    fixture?.destroy();
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstanceComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InstanceComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the training footer controls', () => {
    fixture.detectChanges();

    const footer = fixture.nativeElement as HTMLElement;

    expect(footer.textContent).toContain('Training time');
    expect(footer.textContent).toContain('Pause');
    expect(footer.textContent).toContain('Stop');
  });

  it('should navigate back when stopping the training', () => {
    const location = TestBed.inject(Location);
    const backSpy = spyOn(location, 'back');

    fixture.detectChanges();

    const stopButton = Array.from(
      fixture.nativeElement.querySelectorAll('button'),
    ).find((button) => button.textContent?.includes('Stop')) as HTMLButtonElement;

    stopButton.click();

    expect(backSpy).toHaveBeenCalled();
  });
});
