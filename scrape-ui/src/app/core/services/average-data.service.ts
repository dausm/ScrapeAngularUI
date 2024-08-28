import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, of, shareReplay, switchMap } from 'rxjs';
import { WeeklyDataDto } from '../../shared/models/weekly-data.dto.interface';
import { WeeklyAverageByLocation } from '../../shared/models/weekly-average-location.interface';

@Injectable({
  providedIn: 'root'
})
export class AverageDataService {
  private fetchWeeklyData$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private fetchCurrentMonthData$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  baseUrl: string = "https://localhost:44362";

  constructor(private readonly http: HttpClient) { }

  weeklyAveragesData$: Observable<WeeklyAverageByLocation[]> = this.fetchWeeklyData$.pipe(
    switchMap((_) => this.http.get<WeeklyAverageByLocation[]>(`${this.baseUrl}/api/Averages/weekly`)
      .pipe(catchError((_) => of(_)))),
    shareReplay()
  );

  currentMonthData$: Observable<WeeklyDataDto[]> = this.fetchCurrentMonthData$.pipe(
    switchMap((_) => this.http.get<WeeklyDataDto[]>(`${this.baseUrl}/api/Averages/daily`)
      .pipe(catchError((_) => of(_)))),
    shareReplay()
  );
}
