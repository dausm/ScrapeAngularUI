import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyAveragesComponent } from './weekly-averages.component';
import { Spy, createSpyFromClass } from 'jasmine-auto-spies';
import { WeeklyAveragesStateService } from './weekly-averages.state.service';
import { ComponentStates } from '../../shared/enums/component-states';
import { BaseChartOptions } from '../../shared/constants/baseChartOptions';
import { DefaultFilterOptions } from '../../shared/constants/default-filter-options';
import { Chart } from 'highcharts';

describe('WeeklyAveragesComponent', () => {
  let component: WeeklyAveragesComponent;
  let fixture: ComponentFixture<WeeklyAveragesComponent>;
  let mockCurrentDayStateService: Spy<WeeklyAveragesStateService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeeklyAveragesComponent],
      providers: [
        {
          provide: WeeklyAveragesStateService,
          useValue: createSpyFromClass(WeeklyAveragesStateService, {
            methodsToSpyOn: [
              'chartOptions',
              'errorMessage',
              'filterOptions',
              'componentState',
              'lastUpdate'
            ],
          })
          // provide: WeeklyAveragesStateService,
          // useValue: {
          //   chartOptions = jasmine.
          // }
        }
      ]
    })
    .compileComponents();

    mockCurrentDayStateService = TestBed.inject<any>(WeeklyAveragesStateService);
    fixture = TestBed.createComponent(WeeklyAveragesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // xit('should update the chartRef when update chartOptions are passed', () => {
  //   mockCurrentDayStateService.componentState.call(() => ComponentStates.Ready);
  //   mockCurrentDayStateService.filterOptions.call(() => { return {...DefaultFilterOptions, locationName: 'WKP'}});

  //   fixture.autoDetectChanges();

  //   console.log(component.componentState$$());
  //   mockCurrentDayStateService.chartOptions.call(() => {return {...BaseChartOptions, series: [
  //     {
  //       data: 1,
  //       type: 'spline',
  //     },
  //     {
  //       data: 2,
  //       type: 'spline',
  //     },
  //     {
  //       data: 3,
  //       type: 'spline',
  //     },
  //   ]}});

  //   TestBed.flushEffects();
  //   fixture.detectChanges();

  //   expect(component).toBeTruthy();
  // })
});
