import { HttpErrorResponse } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, Observable, of, Subject, distinctUntilChanged, tap } from 'rxjs';
import { CurrentDataService } from '../../core/services/current-data.service';
import { ComponentStates } from '../../shared/enums/component-states';
import { GymLocations } from '../../shared/enums/gym-locations';
import { CurrentWeekDto } from '../../shared/models/current-week.dto.interface';
import { DailyAverage } from '../../shared/models/daily-average.interface';
import { setErrorMessage } from '../../shared/utility/utilities';

@Injectable({
  providedIn: 'root'
})
export class CurrentWeekStateService {
  private currentDataService: CurrentDataService = inject(CurrentDataService);

  private baseChartOptions: Highcharts.Options = {
    chart: {
      type: 'spline',
      style: {
        fontFamily: '"Montserrat", sans-serif',
        fontSize: '1.5rem'
      }
    },
    time: {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    },
    title: {
      text: "Current Week's Occupancy Trends",
      style: {
        fontFamily: '"Montserrat", sans-serif'
      }
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
            fontFamily: '"Montserrat", sans-serif'
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
    location: ''
  });

  // Selectors (slices of state)
  errorMessage = computed(() => this.state().error);
  chartOptions = computed(() => this.state().chartOptions);
  componentState = computed(() => this.state().state);
  location = computed(() => this.state().location);

  // Sources
  locationName$ = new Subject<Event | null>();
  optionsByLocation = new Map<string, Highcharts.SeriesSplineOptions[]>();

  // Reducers
  constructor() {
    this.chartOptions$
      .pipe(
        takeUntilDestroyed()
      )
      .subscribe((options) => this.setOptionByLocation(options));

    this.locationName$.pipe(
      takeUntilDestroyed(),
      distinctUntilChanged(),
      tap(_ => this.setStateToLoading())
    ).subscribe((locationName) => {
      if(!locationName){
        return;
      }
      const element = locationName.target as HTMLSelectElement;
      let splineOptions = [];

      if(this.optionsByLocation.has(element.value)){
        const options = this.optionsByLocation.get(element.value);
        splineOptions = JSON.parse(JSON.stringify(options));
        splineOptions.length = options?.length;
      }

      const newTitle = {...this.baseChartOptions.title, text: `${element.value} Current Week's Hourly Averages` }
      const newChartOptions = {...this.baseChartOptions, series: splineOptions, title: newTitle};

      this.state.update((state) => ({
        ...state,
        location: element.value,
        chartOptions: newChartOptions,
        state: ComponentStates.Ready,
      }))
  });

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
      state: ComponentStates.Error
    }));
    return of([]);
  }

  private setOptionByLocation(currentDays: CurrentWeekDto[]): void {
    let newMap = new Map<string, Highcharts.SeriesSplineOptions[]>();
    let newSeries: Highcharts.SeriesSplineOptions[] = [];

    currentDays.forEach((value: CurrentWeekDto) => {
      value.data.forEach((gym: DailyAverage) => newSeries.push({
          name: gym.dayOfWeek,
          data: gym.averagesByHour,
          type: 'spline',
      }))
      const name = GymLocations.get(value.name);

      if(name){
        newMap.set(name, newSeries);
      }
      newSeries = [];
    })

    this.optionsByLocation = newMap;
  }

  private setStateToLoading() {
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
  location: string;
}
