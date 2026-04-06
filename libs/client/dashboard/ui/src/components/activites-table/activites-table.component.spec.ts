import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivitesTableComponent } from './activites-table.component';

describe('ActivitesTableComponent', () => {
  let component: ActivitesTableComponent;
  let fixture: ComponentFixture<ActivitesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivitesTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ActivitesTableComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
