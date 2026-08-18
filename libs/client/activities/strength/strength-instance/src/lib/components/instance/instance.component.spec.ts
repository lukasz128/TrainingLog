import { Location } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { StrengthActivityFacadeService } from 'strength/data-access';
import { StrengthSessionService } from '../../services/strength-session.service';
import { InstanceComponent } from './instance.component';

describe('InstanceComponent', () => {
  let component: InstanceComponent;
  let fixture: ComponentFixture<InstanceComponent>;
  const loadActiveActivity = jest.fn();
  const completeWorkout = jest.fn();

  afterEach(() => {
    fixture?.destroy();
  });

  beforeEach(async () => {
    loadActiveActivity.mockReset();
    completeWorkout.mockReset();
    completeWorkout.mockReturnValue(of(undefined));

    await TestBed.configureTestingModule({
      imports: [InstanceComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        {
          provide: StrengthActivityFacadeService,
          useValue: {
            activity: signal(null),
            error: signal(null),
            loading: signal(false),
            savingExerciseId: signal(null),
            saveError: signal(null),
            loadActiveActivity,
            completeWorkout,
          },
        },
        {
          provide: StrengthSessionService,
          useValue: {
            timer: signal(0),
            state: signal('ACTIVE'),
            start: jest.fn(),
            togglePause: jest.fn(),
            finish: jest.fn(),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InstanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    flushIconRequests();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the training footer controls', () => {
    fixture.detectChanges();
    flushIconRequests();

    const footer = fixture.nativeElement as HTMLElement;

    expect(footer.textContent).toContain('Training time');
    expect(footer.textContent).toContain('Pause');
    expect(footer.textContent).toContain('Stop');
  });

  it('should navigate back when stopping the training', () => {
    const location = TestBed.inject(Location);
    const backSpy = jest.spyOn(location, 'back');

    fixture.detectChanges();
    flushIconRequests();

    const stopButton = Array.from(
      fixture.nativeElement.querySelectorAll('button'),
    ).find((button) => button.textContent?.includes('Stop')) as HTMLButtonElement;

    stopButton.click();

    expect(backSpy).toHaveBeenCalled();
  });

  function flushIconRequests(): void {
    TestBed.inject(HttpTestingController)
      .match((request) => request.url.startsWith('/assets/icons/'))
      .forEach((request) => request.flush('<svg></svg>'));
  }
});
