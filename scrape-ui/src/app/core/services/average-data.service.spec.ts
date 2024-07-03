import { TestBed } from '@angular/core/testing';

import { AverageDataService } from './average-data.service';

describe('AverageDataService', () => {
  let service: AverageDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AverageDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
