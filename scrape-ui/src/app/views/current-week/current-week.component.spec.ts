import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentWeekComponent } from './current-week.component';
import { Spy, createSpyFromClass } from 'jasmine-auto-spies';
import { CurrentWeekStateService } from './current-week.state.service';
import { WritableSignal, signal } from '@angular/core';
import { Options } from 'highcharts';
import { BaseChartOptions } from '../../shared/constants/baseChartOptions';
import { ComponentStates } from '../../shared/enums/component-states';
import { DefaultFilterOptions } from '../../shared/constants/default-filter-options';

describe('CurrentWeekComponent', () => {
  let component: CurrentWeekComponent;
  let fixture: ComponentFixture<CurrentWeekComponent>;
  let mockCurrentDayStateService: Spy<CurrentWeekStateService>;
  let mockChartOptions: WritableSignal<Options> = signal(BaseChartOptions);
  let componentState: WritableSignal<ComponentStates> = signal(ComponentStates.ready);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrentWeekComponent],
      providers: [
        {
          provide: CurrentWeekStateService,
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

    mockCurrentDayStateService = TestBed.inject<any>(CurrentWeekStateService);
    fixture = TestBed.createComponent(CurrentWeekComponent);
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
