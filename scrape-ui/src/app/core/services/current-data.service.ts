import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, of, shareReplay, switchMap } from 'rxjs';
import { CurrentDayDto } from '../../shared/models/current-day.dto.interface';
import { CurrentWeekDto } from '../../shared/models/current-week.dto.interface';

@Injectable({
  providedIn: 'root'
})
export class CurrentDataService {
  private fetchCurrentDayData$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private fetchCurrentWeekData$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  baseUrl: string = "https://localhost:44362";

  constructor(private readonly http: HttpClient) { }

  currentDayData$: Observable<CurrentDayDto[]> = this.fetchCurrentDayData$.pipe(
    switchMap((_) => this.http.get<CurrentDayDto[]>(`${this.baseUrl}/api/Averages/current-day`)
      .pipe(catchError((_) => of(_)))),
    shareReplay()
  );

  currentWeekData$: Observable<CurrentWeekDto[]> = this.fetchCurrentWeekData$.pipe(
    switchMap((_) => this.http.get<CurrentWeekDto[]>(`${this.baseUrl}/api/Averages/current-week`)
      .pipe(catchError((_) => of(_)))),
    shareReplay()
  );
}
