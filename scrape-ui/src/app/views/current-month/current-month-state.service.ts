import { HttpErrorResponse } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  catchError,
  Observable,
  of,
  Subject,
  distinctUntilChanged,
  tap,
} from 'rxjs';
import { CurrentDataService } from '../../core/services/current-data.service';
import { ComponentStates } from '../../shared/enums/component-states';
import { GymLocations } from '../../shared/enums/gym-locations';
import { CurrentWeekDto } from '../../shared/models/current-week.dto.interface';
import { DailyAverage } from '../../shared/models/daily-average.interface';
import { contains, setErrorMessage } from '../../shared/utility/errorHandling';
import { WeekDays } from '../../shared/enums/week-days.map';

@Injectable({
  providedIn: 'root',
})
export class CurrentMonthStateService {
  private currentDataService: CurrentDataService = inject(CurrentDataService);

  private baseChartOptions: Highcharts.Options = {
    chart: {
      type: 'spline',
      style: {
        fontFamily: '"Montserrat", sans-serif',
        fontSize: '1.5rem',
      },
      displayErrors: true,
    },
    time: {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    title: {
      text: "Month's Occupancy Trends",
      style: {
        fontFamily: '"Montserrat", sans-serif',
      },
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
          fontFamily: '"Montserrat", sans-serif',
        },
      },
      categories: [
        '12AM',
        '1AM',
        '2AM',
        '3AM',
        '4AM',
        '5AM',
        '6AM',
        '7AM',
        '8AM',
        '9AM',
        '10AM',
        '11AM',
        '12PM',
        '1PM',
        '2PM',
        '3PM',
        '4PM',
        '5PM',
        '6PM',
        '7PM',
        '8PM',
        '9PM',
        '10PM',
        '11PM',
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
  private state = signal<CurrentMonthState>({
    state: ComponentStates.Initial,
    chartOptions: this.baseChartOptions,
    error: null,
    location: '',
    weekDaysToFilter: Array.from(WeekDays.values())
  });

  // Selectors (slices of state)
  errorMessage = computed(() => this.state().error);
  chartOptions = computed(() => this.state().chartOptions);
  componentState = computed(() => this.state().state);
  location = computed(() => this.state().location);

  // Sources
  locationName$ = new Subject<string>();
  filterWeekDays$ = new Subject<string[]>();
  optionsByLocation = new Map<
    string,
    readonly Highcharts.SeriesSplineOptions[]
  >();

  // Reducers
  constructor() {
    this.currentDataService.currentMonthData$
      .pipe(
        takeUntilDestroyed(),
        tap((_) => this.setStateToLoading()),
        catchError((err) => this.setError(err))
      )
      .subscribe((options) => this.setOptionByLocation(options));

    this.locationName$
      .pipe(takeUntilDestroyed())
      .subscribe((locationName) => {
        if (!locationName) {
          return;
        }

        let splineOptions: Highcharts.SeriesSplineOptions[] =
          this.optionsByLocation.has(locationName)
          ? JSON.parse(JSON.stringify(this.optionsByLocation.get(locationName)))
          : [];

        let filteredOptions = this.state().weekDaysToFilter.length === 7
          ? splineOptions
          : splineOptions?.filter((option) => contains(option.name!, this.state().weekDaysToFilter));

        let newTitle = {
          ...this.baseChartOptions.title,
          text: `${locationName} Current 30 Day Averages By Hour`,
        };
        let newChartOptions = {
          ...this.baseChartOptions,
          series: filteredOptions,
          title: newTitle,
        };

        this.state.update((state) => ({
          ...state,
          location: locationName,
          chartOptions: newChartOptions,
          state: ComponentStates.Ready,
        }));
      });

    this.filterWeekDays$
      .pipe(takeUntilDestroyed(), distinctUntilChanged())
      .subscribe((days) => {
        this.state.update((state) => ({
          ...state,
          weekDaysToFilter: days
        }));

        this.locationName$.next(this.state().location);
      });
  }

  private setError(err: HttpErrorResponse) {
    const errorMessage = setErrorMessage(err);
    this.state.update((state) => ({
      ...state,
      error: errorMessage,
      state: ComponentStates.Error,
    }));
    return of([]);
  }

  private setOptionByLocation(currentDays: CurrentWeekDto[]): void {
    let newMap = new Map<string, readonly Highcharts.SeriesSplineOptions[]>();
    let newSeries: Highcharts.SeriesSplineOptions[] = [];

    currentDays.forEach((value: CurrentWeekDto) => {
      value.data.forEach((gym: DailyAverage) => {
        const date = new Date(gym.dateCalculated);
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
        const day = date.getDate().toString().padStart(2, '0');

        newSeries.push({
          name: `${gym.dayOfWeek} ${month}/${day}`,
          data: gym.averagesByHour,
          type: 'spline',
        });
      });
      const name = GymLocations.get(value.name);

      if (name) {
        newMap.set(name, newSeries);
      }
      newSeries = [];
    });

    this.optionsByLocation = newMap;

    this.state.update((state) => ({
      ...state,
      state: ComponentStates.Initial,
    }));
  }

  private setStateToLoading() {
    this.state.update((state) => ({
      ...state,
      state: ComponentStates.Loading,
    }));
  }
}

export interface CurrentMonthState {
  state: ComponentStates;
  chartOptions: Highcharts.Options;
  error: string | null;
  location: string;
  weekDaysToFilter: string[]
}
