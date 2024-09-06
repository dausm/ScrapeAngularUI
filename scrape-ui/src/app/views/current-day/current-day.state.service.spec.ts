import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { CurrentDayStateService } from './current-day.state.service';

describe('CurrentWeekStateService', () => {
  let service: CurrentDayStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({providers: [provideHttpClient(withInterceptorsFromDi())]});
    service = TestBed.inject(CurrentDayStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // it('should call getChartTitle when filter option change', () => {
  //   service.updateFilter$.next()
  // })
});
