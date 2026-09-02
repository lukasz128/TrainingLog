import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import {
  StrengthActivity,
  StrengthActivityFacadeService,
} from 'strength/data-access';
import { ActivityListComponent } from './activity-list.component';

const activities: StrengthActivity[] = [
  {
    id: 'activity-id',
    name: 'FBW A',
    subtitle: 'Training Session',
    items: [
      {
        id: 'exercise-id',
        exerciseId: 'dictionary-id',
        title: 'Bench press',
        description: 'Barbell bench press.',
        phase: 'progress',
        details: '3×4-6',
        sets: [],
      },
    ],
  },
];

describe(ActivityListComponent.name, () => {
  let fixture: ComponentFixture<ActivityListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivityListComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        {
          provide: StrengthActivityFacadeService,
          useValue: {
            activitiesState: signal({ state: 'LOADED', data: activities }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ActivityListComponent);
    fixture.detectChanges();
    TestBed.inject(HttpTestingController)
      .match((request) => request.url.startsWith('/assets/icons/'))
      .forEach((request) => request.flush('<svg></svg>'));
    await fixture.whenStable();
  });

  it('should render activity cards', () => {
    const cards = fixture.debugElement.queryAll(By.css('.activity-card'));

    expect(cards).toHaveLength(1);
    expect(cards[0].nativeElement.textContent).toContain('FBW A');
    expect(cards[0].nativeElement.textContent).toContain('1 exercises');
  });
});
