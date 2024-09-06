import { CurrentDataService } from './current-data.service';
import { HttpClient, HttpErrorResponse, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('CurrentDataService', () => {
  let service: CurrentDataService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);

    service = new CurrentDataService(httpClientSpy);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('currentDayData$ should return an error when the server returns a 404', (done: DoneFn) => {
    const errorResponse = new HttpErrorResponse({
      error: 'test 404 error',
      status: 404,
      statusText: 'Not Found',
    });

    httpClientSpy.get.and.throwError(errorResponse);

    service.currentDayData$.subscribe({
      next: (heroes) => done.fail('expected an error, not data'),
      error: (error) => {
        expect(error.statusText).toContain('Not Found');
        done();
      },
    });
  })

  it('currentWeekData$ should return an error when the server returns a 404', (done: DoneFn) => {
    const errorResponse = new HttpErrorResponse({
      error: 'test 404 error',
      status: 404,
      statusText: 'Not Found',
    });

    httpClientSpy.get.and.throwError(errorResponse);

    service.currentWeekData$.subscribe({
      next: (heroes) => done.fail('expected an error, not data'),
      error: (error) => {
        expect(error.statusText).toContain('Not Found');
        done();
      },
    });
  })
});
