import { TestBed } from '@angular/core/testing';
import { WeeklyAveragesStateService } from './weekly-averages.state.service';
import { DefaultFilterOptions } from '../../shared/constants/default-filter-options';
import { createSpyFromClass, Spy } from 'jasmine-auto-spies';
import { AverageDataService } from '../../core/services/average-data.service';
import { WeeklyAverageByLocation } from '../../shared/models/weekly-average-location.interface';

describe('WeeklyAveragesStateService', () => {
  let service: WeeklyAveragesStateService;
  let mockAverageDataService: Spy<AverageDataService>;

  beforeEach(() => {
    TestBed.configureTestingModule({providers: [
      {
        provide: AverageDataService,
        useValue: createSpyFromClass(AverageDataService, {
          observablePropsToSpyOn: ['weeklyAveragesData$']
        })
      }
    ]});
    service = TestBed.inject(WeeklyAveragesStateService);
    spyOn(service, 'getChartTitle').and.callThrough();

    mockAverageDataService = TestBed.inject<any>(AverageDataService);
    mockAverageDataService.weeklyAveragesData$.nextWith([{
      name: 'WKP',
      data: [{
        id: 123,
        name: 'Walker\'s Point',
        weekRange: '',
        startDate: '2024-03-10 00:00:00.0000000',
        endDate: '2024-03-16 00:00:00.0000000',
        averageCount: 40,
        maxCount: 95,
        minimumCount: 2,
        maxTime: '2024-03-14 18:43:14.6266667',
        minimumTime: '2024-03-11 09:59:30.9066667',
        averagesByHour: [0,0,0,0,0,2,4,6,9,13,14,31,38,20,13,50,55,68,100,100,60,30,1,0,0]
      }]
    }] as WeeklyAverageByLocation[]);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getChartTitle when updateFilter$ change', () => {
    service.updateFilter$.next(DefaultFilterOptions)

    expect(service.getChartTitle).toHaveBeenCalled();
  })
});
