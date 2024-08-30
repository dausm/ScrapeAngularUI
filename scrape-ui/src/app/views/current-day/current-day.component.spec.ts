import { ComponentFixture, TestBed } from '@angular/core/testing';
import { createSpyFromClass, Spy } from 'jasmine-auto-spies';
import { CurrentDayComponent } from './current-day.component';
import { CurrentDayStateService } from './current-day.state.service';
import { BaseChartOptions } from '../../shared/constants/baseChartOptions';
import { ComponentStates } from '../../shared/enums/component-states';

describe('CurrentDayComponent', () => {
  let component: CurrentDayComponent;
  let fixture: ComponentFixture<CurrentDayComponent>;
  let mockCurrentDayStateService: Spy<CurrentDayStateService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrentDayComponent],
      providers: [
        {
          provide: CurrentDayStateService,
          useValue: createSpyFromClass(CurrentDayStateService, {
            methodsToSpyOn: [
              'chartOptions',
              'errorMessage',
              'componentState',
              'lastUpdate'
            ]
          })
        }
      ]
    })
    .compileComponents();

    mockCurrentDayStateService = TestBed.inject<any>(CurrentDayStateService);
    fixture = TestBed.createComponent(CurrentDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
