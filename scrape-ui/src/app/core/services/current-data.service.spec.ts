import { TestBed } from '@angular/core/testing';

import { CurrentDataService } from './current-data.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('CurrentDataService', () => {
  let service: CurrentDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({providers: [provideHttpClient(withInterceptorsFromDi())]});
    service = TestBed.inject(CurrentDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
