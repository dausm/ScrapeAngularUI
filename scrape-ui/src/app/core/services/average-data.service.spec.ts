import { AverageDataService } from './average-data.service';
import { HttpClient, HttpErrorResponse, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';


describe('AverageDataService', () => {
  let service: AverageDataService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);

    service = new AverageDataService(httpClientSpy);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('weeklyAveragesData$ should return an error when the server returns a 404', (done: DoneFn) => {
    const errorResponse = new HttpErrorResponse({
      error: 'test 404 error',
      status: 404,
      statusText: 'Not Found',
    });

    httpClientSpy.get.and.throwError(errorResponse);

    service.weeklyAveragesData$.subscribe({
      next: (heroes) => done.fail('expected an error, not data'),
      error: (error) => {
        expect(error.statusText).toContain('Not Found');
        done();
      },
    });
  })

  it('currentMonthData$ should return an error when the server returns a 404', (done: DoneFn) => {
    const errorResponse = new HttpErrorResponse({
      error: 'test 404 error',
      status: 404,
      statusText: 'Not Found',
    });

    httpClientSpy.get.and.throwError(errorResponse);

    service.currentMonthData$.subscribe({
      next: (heroes) => done.fail('expected an error, not data'),
      error: (error) => {
        expect(error.statusText).toContain('Not Found');
        done();
      },
    });
  })
});
