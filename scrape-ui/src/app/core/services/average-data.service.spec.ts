import { TestBed } from '@angular/core/testing';

import { AverageDataService } from './average-data.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('AverageDataService', () => {
  let service: AverageDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({providers: [provideHttpClient(withInterceptorsFromDi())]});
    service = TestBed.inject(AverageDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
