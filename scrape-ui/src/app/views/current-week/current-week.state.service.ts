import { HttpErrorResponse } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { CurrentDataService } from '../../core/services/current-data.service';
import { ComponentStates } from '../../shared/enums/component-states';
import { CurrentWeekDto } from '../../shared/models/current-week.dto.interface';
import { setErrorMessage } from '../../shared/utility/errorHandling';

@Injectable({
  providedIn: 'root'
})
export class CurrentWeekStateService {
  private currentDataService: CurrentDataService = inject(CurrentDataService);

  private baseChartOptions: Highcharts.Options = {
    chart: {
      type: 'spline',
      style: {
        fontFamily: 'serif',
        fontSize: '1.5rem'
      }
    },
    time: {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    },
    title: {
      text: "Current Week's Occupancy Trends",
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
            fontFamily: 'Verdana, sans-serif'
        }
      },
      categories: [
        '12AM', '1AM', '2AM', '3AM', '4AM', '5AM', '6AM', '7AM', '8AM',
        '9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM',
        '5PM', '6PM', '7PM', '8PM', '9PM', '10PM', '11PM'
      ],
      crosshair: true,
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
  private state = signal<CurrentWeekState>({
    state: ComponentStates.Initial,
    chartOptions: this.baseChartOptions,
    error: null,
  });

  // Selectors (slices of state)
  errorMessage = computed(() => this.state().error);
  chartOptions = computed(() => this.state().chartOptions);
  componentState = computed(() => this.state().state);

  // Reducers
  constructor() {
    // this.chartOptions$
    //   .pipe(tap(() => this.setLoadingIndicator(true)))
    //   .subscribe((options) => this.setChartOptions(options));
  }

  private chartOptions$: Observable<CurrentWeekDto[]> =
    this.currentDataService.currentWeekData$.pipe(
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

  private setChartOptions(currentDays: CurrentWeekDto[]): void {
    let newSeries: Highcharts.SeriesSplineOptions[] = [];

    if(currentDays.length > 0){
      const first = currentDays[0];

        if(first){
          for (const gym of first.data) {
            newSeries.push({
                name: gym.dayOfWeek,
                data: gym.averagesByHour,
                type: 'spline',
            })
          }
        }
    }

      this.state.update((state) => ({
        ...state,
        state: ComponentStates.Ready,
        chartOptions: { ...this.baseChartOptions, series: newSeries },
      }));
    }

  private setLoadingIndicator(isLoading: boolean) {
    this.state.update((state) => ({
      ...state,
      state: ComponentStates.Loading,
    }));
  }
}

export interface CurrentWeekState {
  state: ComponentStates;
  chartOptions: Highcharts.Options;
  error: string | null;
}
