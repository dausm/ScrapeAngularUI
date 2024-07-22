import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, Observable, of, tap} from 'rxjs';
import { CurrentDataService } from '../../core/services/current-data.service';
import { GymLocations } from '../../shared/enums/gym-locations';
import { CurrentDayDto } from '../../shared/models/current-day.dto.interface';
import { ComponentStates } from '../../shared/enums/component-states';
import { HttpErrorResponse } from '@angular/common/http';
import { setErrorMessage } from '../../shared/utility/utilities';

@Injectable({
  providedIn: 'root',
})
export class CurrentDayStateService {
  private currentDataService: CurrentDataService = inject(CurrentDataService);

  private baseChartOptions: Highcharts.Options = {
    chart: {
      type: 'spline',
      style: {
        fontFamily: 'serif',
        fontSize: '1.5rem',
      },
    },
    time: {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    title: {
      text: "Current Day's Occupancy",
    },
    subtitle: {
      text: 'A subtitle or maybe caption here',
    },
    legend: {
      align: 'right',
      verticalAlign: 'middle',
      layout: 'vertical',
    },
    xAxis: {
      title: {
        text: 'Time',
      },
      labels: {
        rotation: -65,
        style: {
          fontSize: '9px',
          fontFamily: 'Verdana, sans-serif',
        },
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
    },
    yAxis: {
      title: {
        text: 'Occupancy',
      },
      accessibility: {
        description: 'Occupancy',
      },
    },
    tooltip: {
      stickOnContact: true,
    },
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 600,
            minHeight: 500,
          },
          chartOptions: {
            legend: {
              align: 'center',
              verticalAlign: 'bottom',
              layout: 'horizontal',
            },
          },
        },
      ],
    },
  };

  // Signal that holds the state (initial state)
  private state = signal<CurrentDayState>({
    state: ComponentStates.Loading,
    chartOptions: this.baseChartOptions,
    error: null,
  });

  // Selectors (slices of state)
  errorMessage = computed(() => this.state().error);
  chartOptions = computed(() => this.state().chartOptions);
  componentState = computed(() => this.state().state);

  // Reducers
  constructor() {
    this.chartOptions$
      .pipe(tap(() => this.setLoadingIndicator(true)))
      .subscribe((options) => this.setChartOptions(options));
  }

  private chartOptions$: Observable<CurrentDayDto[]> =
    this.currentDataService.currentDayData$.pipe(
      catchError((err) => this.setError(err))
    );

  private setError(err: HttpErrorResponse) {
    const errorMessage = setErrorMessage(err);
    this.state.update((state) => ({
      ...state,
      error: errorMessage,
      state: ComponentStates.Error,
    }));
    return of([]);
  }

  private setChartOptions(currentDays: CurrentDayDto[]): void {
    let newSeries: Highcharts.SeriesSplineOptions[] = [];

    if(currentDays.length > 0){
      currentDays.forEach((value: CurrentDayDto) => {
        let counts: Array<number | [number | string, number | null] | null> = [];
        for (const gym of value.data) {
          const date = new Date(gym.scrapeDateTime);
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

      this.state.update((state) => ({
        ...state,
        state: ComponentStates.Ready,
        chartOptions: { ...this.baseChartOptions, series: newSeries },
      }));
    }
  }

  private setLoadingIndicator(isLoading: boolean) {
    this.state.update((state) => ({
      ...state,
      state: ComponentStates.Loading,
    }));
  }
}

export interface CurrentDayState {
  state: ComponentStates;
  chartOptions: Highcharts.Options;
  error: string | null;
}
