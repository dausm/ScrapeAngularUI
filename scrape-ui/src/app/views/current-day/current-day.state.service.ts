import { computed, inject, Injectable, Signal, signal } from '@angular/core';
import { catchError, Observable, of, tap} from 'rxjs';
import { CurrentDataService } from '../../core/services/current-data.service';
import { GymLocations } from '../../shared/enums/gym-locations';
import { DailyDataDto } from '../../shared/models/daily-data.dto.interface';
import { ComponentStates } from '../../shared/enums/component-states';
import { HttpErrorResponse } from '@angular/common/http';
import { makeUpdater, setErrorMessage } from '../../shared/utility/utilities';
import { BaseChartOptions } from '../../shared/constants/baseChartOptions';
import { Options } from 'highcharts';

@Injectable({
  providedIn: 'root',
})
export class CurrentDayStateService {
  private currentDataService: CurrentDataService = inject(CurrentDataService);

  private baseChartOptions: Highcharts.Options = {
    ...BaseChartOptions,
    time: {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    title: {
      text: "Current Day's Occupancy",
    },
    xAxis: {
      title: {
        text: 'Time of Day',
      },
      type: 'datetime',
      crosshair: true,
      dateTimeLabelFormats: {
        second: '%H:%M %P',
      },
      startOfWeek: 0,
      accessibility: {
        description: 'Time of current day',
      },
      labels: {
        rotation: -45,
        style: {
          fontSize: '.875rem',
        },
      },
    },
  };

  // Signal that holds the state (initial state)
  private state = signal<CurrentDayState>({
    state: ComponentStates.Loading,
    chartOptions: this.baseChartOptions,
    lastUpdate: '',
    error: null,
  });

  stateUpdater = makeUpdater(this.state);

  // Selectors (slices of state)
  errorMessage: Signal<string | null> = computed(() => this.state().error);
  chartOptions: Signal<Options> = computed(() => this.state().chartOptions);
  componentState: Signal<ComponentStates> = computed(() => this.state().state);
  lastUpdate: Signal<string>  = computed(() => this.state().lastUpdate);

  // Reducers
  constructor() {
    this.chartOptions$
      .pipe(tap(() => this.stateUpdater('state', ComponentStates.Loading)))
      .subscribe((options) => this.setChartOptions(options));
  }

  private chartOptions$: Observable<DailyDataDto[]> =
    this.currentDataService.currentDayData$.pipe(
      catchError((err) => this.setError(err))
    );

  private setError(err: HttpErrorResponse) {
    const errorMessage = setErrorMessage(err);
    this.stateUpdater('error', errorMessage)
    this.stateUpdater('state', ComponentStates.Error)
    return of([]);
  }

  private setChartOptions(currentDays: DailyDataDto[]): void {
    let newSeries: Highcharts.SeriesSplineOptions[] = [];
    let lastUpdateTime: Date | undefined;

    if(currentDays.length > 0){
      currentDays.forEach((value: DailyDataDto) => {
        let counts: Array<number | [number | string, number | null] | null> = [];
        for (const gym of value.data) {
          const date = new Date(gym.scrapeDateTime);
          lastUpdateTime = !lastUpdateTime || date > lastUpdateTime ? date : lastUpdateTime;
          const milliseconds = date.getTime();
          counts.push([milliseconds, gym.count]);
        }

        newSeries.push({
          name: GymLocations.has(value.name)
            ? GymLocations.get(value.name)
            : value.name,
          data: counts,
          type: 'spline',
        });
      });
    }

    this.stateUpdater('chartOptions', { ...this.baseChartOptions, series: newSeries })
    this.stateUpdater('lastUpdate', lastUpdateTime ? `Last scrape: ${lastUpdateTime!.toLocaleTimeString()}` : '')
    this.stateUpdater('state', ComponentStates.Ready)
  }
}

export interface CurrentDayState {
  state: ComponentStates;
  chartOptions: Highcharts.Options;
  lastUpdate: string,
  error: string | null;
}
