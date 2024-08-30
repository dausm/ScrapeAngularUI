import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentMonthComponent } from './current-month.component';
import { Spy, createSpyFromClass } from 'jasmine-auto-spies';
import { CurrentMonthStateService } from './current-month-state.service';

describe('CurrentMonthComponent', () => {
  let component: CurrentMonthComponent;
  let fixture: ComponentFixture<CurrentMonthComponent>;
  let mockCurrentDayStateService: Spy<CurrentMonthStateService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrentMonthComponent],
      providers: [
        {
          provide: CurrentMonthStateService,
          useValue: createSpyFromClass(CurrentMonthStateService, {
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

    mockCurrentDayStateService = TestBed.inject<any>(CurrentMonthStateService);
    fixture = TestBed.createComponent(CurrentMonthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
