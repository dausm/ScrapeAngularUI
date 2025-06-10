import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Spy } from 'jasmine-auto-spies';
import { CurrentDayComponent } from './current-day.component';
import { CurrentDayStateService } from './current-day.state.service';
import { BaseChartOptions } from '../../shared/constants/baseChartOptions';
import { ComponentStates } from '../../shared/enums/component-states';
import { WritableSignal, signal } from '@angular/core';
import { Options } from 'highcharts';
import { DefaultFilterOptions } from '../../shared/constants/default-filter-options';

describe('CurrentDayComponent', () => {
  let component: CurrentDayComponent;
  let fixture: ComponentFixture<CurrentDayComponent>;
  let mockCurrentDayStateService: Spy<CurrentDayStateService>;
  let mockChartOptions: WritableSignal<Options> = signal(BaseChartOptions);
  let componentState: WritableSignal<ComponentStates> = signal(ComponentStates.ready);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrentDayComponent],
      providers: [
        {
          provide: CurrentDayStateService,
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

    mockCurrentDayStateService = TestBed.inject<any>(CurrentDayStateService);
    fixture = TestBed.createComponent(CurrentDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
