import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentWeekComponent } from './current-week.component';
import { Spy, createSpyFromClass } from 'jasmine-auto-spies';
import { CurrentWeekStateService } from './current-week.state.service';

describe('CurrentWeekComponent', () => {
  let component: CurrentWeekComponent;
  let fixture: ComponentFixture<CurrentWeekComponent>;
  let mockCurrentDayStateService: Spy<CurrentWeekStateService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrentWeekComponent],
      providers: [
        {
          provide: CurrentWeekStateService,
          useValue: createSpyFromClass(CurrentWeekStateService, {
            methodsToSpyOn: [
              'chartOptions',
              'errorMessage',
              'filterOptions',
              'componentState',
              'lastUpdate'
            ]
          })
        }
      ]
    })
    .compileComponents();

    mockCurrentDayStateService = TestBed.inject<any>(CurrentWeekStateService);
    fixture = TestBed.createComponent(CurrentWeekComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
