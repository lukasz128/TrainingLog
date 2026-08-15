import { fakeAsync, tick } from '@angular/core/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrainingPanelComponent } from './training-panel.component';

describe('TrainingPanelComponent', () => {
  let component: TrainingPanelComponent;
  let fixture: ComponentFixture<TrainingPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrainingPanelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TrainingPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the current training state', () => {
    expect(fixture.nativeElement.textContent).toContain('00:00:00');
    expect(fixture.nativeElement.textContent).toContain('Running');
    expect(fixture.nativeElement.textContent).toContain('Pause');
    expect(fixture.nativeElement.textContent).toContain('Stop');
  });

  it('should tick the timer forward', fakeAsync(() => {
    tick(1000);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('00:00:01');
  }));

  it('should emit stop when requested', () => {
    const stoppedSpy = spyOn(component.stopped, 'emit');
    const stopButton = Array.from(
      fixture.nativeElement.querySelectorAll('button'),
    ).find((button) => button.textContent?.includes('Stop')) as HTMLButtonElement;

    stopButton.click();

    expect(stoppedSpy).toHaveBeenCalled();
  });
});
