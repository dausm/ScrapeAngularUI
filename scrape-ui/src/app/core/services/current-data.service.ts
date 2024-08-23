import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, of, shareReplay, switchMap } from 'rxjs';
import { DailyDataDto } from '../../shared/models/daily-data.dto.interface';
import { WeeklyDataDto } from '../../shared/models/weekly-data.dto.interface';

@Injectable({
  providedIn: 'root'
})
export class CurrentDataService {
  private fetchCurrentDayData$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private fetchCurrentWeekData$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  baseUrl: string = "https://localhost:44362";

  constructor(private readonly http: HttpClient) { }

  currentDayData$: Observable<DailyDataDto[]> = this.fetchCurrentDayData$.pipe(
    switchMap((_) => this.http.get<DailyDataDto[]>(`${this.baseUrl}/api/Averages/current-day`)
      .pipe(catchError((_) => of(_)))),
    shareReplay()
  );

  currentWeekData$: Observable<WeeklyDataDto[]> = this.fetchCurrentWeekData$.pipe(
    switchMap((_) => this.http.get<WeeklyDataDto[]>(`${this.baseUrl}/api/Averages/current-week`)
      .pipe(catchError((_) => of(_)))),
    shareReplay()
  );
}
