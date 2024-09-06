import { TestBed } from '@angular/core/testing';
import { CurrentWeekStateService } from './current-week.state.service';
import { createSpyFromClass, Spy } from 'jasmine-auto-spies';
import { CurrentDataService } from '../../core/services/current-data.service';
import { DefaultFilterOptions } from '../../shared/constants/default-filter-options';
import { WeeklyDataDto } from '../../shared/models/weekly-data.dto.interface';

describe('CurrentWeekStateService', () => {
  let service: CurrentWeekStateService;
  let mockCurrentDataService: Spy<CurrentDataService>;

  beforeEach(() => {
    TestBed.configureTestingModule({providers: [
      {
        provide: CurrentDataService,
        useValue: createSpyFromClass(CurrentDataService, {
          observablePropsToSpyOn: ['currentWeekData$']
        })
      }
    ]});
    service = TestBed.inject(CurrentWeekStateService);
    spyOn(service, 'getChartTitle').and.callThrough();

    mockCurrentDataService = TestBed.inject<any>(CurrentDataService);
    mockCurrentDataService.currentWeekData$.nextWith([{
      name: 'WKP',
      data: [{
        id: 123,
        name: 'Walker\'s Point',
        dateCalculated: '2024-03-10 00:00:00.0000000',
        dayOfWeek: 'Saturday',
        averageCount: 40,
        maxCount: 95,
        minimumCount: 2,
        maxTime: '2024-03-14 18:43:14.6266667',
        minimumTime: '2024-03-11 09:59:30.9066667',
        averagesByHour: [0,0,0,0,0,2,4,6,9,13,14,31,38,20,13,50,55,68,100,100,60,30,1,0,0]
      }]
    }] as WeeklyDataDto[]);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getChartTitle when updateFilter$ change', () => {
    service.updateFilter$.next(DefaultFilterOptions)

    expect(service.getChartTitle).toHaveBeenCalled();
  })
});
