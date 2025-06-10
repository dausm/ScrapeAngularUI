import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentMonthComponent } from './current-month.component';
import { Spy } from 'jasmine-auto-spies';
import { CurrentMonthStateService } from './current-month-state.service';
import { WritableSignal, signal } from '@angular/core';
import { Options } from 'highcharts';
import { BaseChartOptions } from '../../shared/constants/baseChartOptions';
import { DefaultFilterOptions } from '../../shared/constants/default-filter-options';
import { ComponentStates } from '../../shared/enums/component-states';

describe('CurrentMonthComponent', () => {
  let component: CurrentMonthComponent;
  let fixture: ComponentFixture<CurrentMonthComponent>;
  let mockCurrentDayStateService: Spy<CurrentMonthStateService>;
  let mockChartOptions: WritableSignal<Options> = signal(BaseChartOptions);
  let componentState: WritableSignal<ComponentStates> = signal(ComponentStates.ready);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrentMonthComponent],
      providers: [
        {
          provide: CurrentMonthStateService,
          useValue: {
            chartOptions: mockChartOptions,
            errorMessage: signal(''),
            filterOptions: signal({...DefaultFilterOptions, locationName: 'WKP'}),
            componentState: componentState,
            lastUpdate: signal(''),
          }
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

  it('should update the chartRef when update chartOptions are passed', () => {
    let spy = spyOn(component.chartRef, 'update')
    mockChartOptions.set({...BaseChartOptions, series: [
      {
        id: '123b',
        data: [1,2,3],
        type: 'spline',
      },
      {
        id: '123bc',
        data: [2,3,4],
        type: 'spline',
      },
      {
        id: '123bcd',
        data: [3,4,5,6],
        type: 'spline',
      },
    ]})

    fixture.detectChanges();

    expect(spy).toHaveBeenCalled();
  });
});
