import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal, WritableSignal } from '@angular/core';
import { WeeklyAveragesComponent } from './weekly-averages.component';
import { Spy } from 'jasmine-auto-spies';
import { WeeklyAveragesStateService } from './weekly-averages.state.service';
import { ComponentStates } from '../../shared/enums/component-states';
import { BaseChartOptions } from '../../shared/constants/baseChartOptions';
import { DefaultFilterOptions } from '../../shared/constants/default-filter-options';
import { Options } from 'highcharts';

describe('WeeklyAveragesComponent', () => {
  let component: WeeklyAveragesComponent;
  let fixture: ComponentFixture<WeeklyAveragesComponent>;
  let mockCurrentDayStateService: Spy<WeeklyAveragesStateService>;
  let mockChartOptions: WritableSignal<Options> = signal(BaseChartOptions);
  let componentState: WritableSignal<ComponentStates> = signal(ComponentStates.Ready);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeeklyAveragesComponent],
      providers: [
        {
          provide: WeeklyAveragesStateService,
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

    mockCurrentDayStateService = TestBed.inject<any>(WeeklyAveragesStateService);
    fixture = TestBed.createComponent(WeeklyAveragesComponent);
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
  })
});
