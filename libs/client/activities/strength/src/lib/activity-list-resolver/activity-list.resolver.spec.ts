import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { firstValueFrom, Observable, of, throwError } from 'rxjs';
import { StrengthActivityFacadeService } from 'strength/data-access';
import { activityListResolver } from './activity-list.resolver';

describe('activityListResolver', () => {
  const loadActivities = jest.fn();

  beforeEach(() => {
    loadActivities.mockReset();
    TestBed.configureTestingModule({
      providers: [
        {
          provide: StrengthActivityFacadeService,
          useValue: { loadActivities },
        },
      ],
    });
  });

  it('loads strength activities before route activation', async () => {
    const activities = [
      {
        id: 'activity-id',
        name: 'FBW A',
        subtitle: 'Training Session',
        items: [],
      },
    ];
    loadActivities.mockReturnValue(of(activities));

    const result = TestBed.runInInjectionContext(() =>
      activityListResolver(
        {} as ActivatedRouteSnapshot,
        {} as RouterStateSnapshot,
      ),
    );

    await expect(firstValueFrom(result as Observable<unknown>)).resolves.toBe(
      activities,
    );
  });

  it('resolves null when loading fails', async () => {
    loadActivities.mockReturnValue(throwError(() => new Error('Boom')));

    const result = TestBed.runInInjectionContext(() =>
      activityListResolver(
        {} as ActivatedRouteSnapshot,
        {} as RouterStateSnapshot,
      ),
    );

    await expect(firstValueFrom(result as Observable<unknown>)).resolves.toBe(
      null,
    );
  });
});
