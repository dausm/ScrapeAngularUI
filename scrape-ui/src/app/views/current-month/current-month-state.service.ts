import { HttpErrorResponse } from '@angular/common/http';
import { computed, inject, Injectable, Signal, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  catchError,
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
import { contains, formatMonthDayFromDate, setErrorMessage } from '../../shared/utility/utilities';
import { WeekDays } from '../../shared/enums/week-days.map';
import { FilterOptions } from '../../shared/models/filter-options.interface';
import { DisplayValueTypes } from '../../shared/enums/display-value-type.enum';
import { Options, Point, SeriesScatterOptions, SeriesSplineOptions, TitleOptions } from 'highcharts';
import { BaseChartOptions } from '../../shared/constants/baseChartOptions';
import { BaseTimeChart } from '../../shared/constants/baseTimeChartOptions';

@Injectable({
  providedIn: 'root',
})
export class CurrentMonthStateService {
  private currentDataService: CurrentDataService = inject(CurrentDataService);

  // Signal that holds the state (initial state)
  private state = signal<CurrentMonthState>({
    state: ComponentStates.Initial,
    chartOptions: BaseChartOptions,
    error: null,
    filterOptions: {
      locationName: '',
      weekDays: Array.from(WeekDays.values()),
      displayValueType: DisplayValueTypes.Average
    }
  });

  // Selectors (slices of state)
  errorMessage = computed(() => this.state().error);
  chartOptions = computed(() => this.state().chartOptions);
  componentState = computed(() => this.state().state);
  filterOptions: Signal<FilterOptions> = computed(() => this.state().filterOptions);

  // Sources
  updateFilter = new Subject<FilterOptions>();
  private averagesByLocation = new Map<
    string,
    Highcharts.SeriesSplineOptions[]
  >();
  private maximumByLocation = new Map<
    string,
    Highcharts.SeriesLollipopOptions[]
  >();
  private minimumByLocation = new Map<
    string,
    Highcharts.SeriesLollipopOptions[]
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

    this.updateFilter
      .pipe(takeUntilDestroyed(), distinctUntilChanged())
      .subscribe((options) => {
        if (!options) {
          return;
        }

        this.state.update((state) => ({
          ...state,
          filterOptions: options,
          chartOptions: this.getBaseChartOptions(options),
          state: ComponentStates.Ready,
        }));
      });
  }

  getBaseChartOptions(options: FilterOptions): Options {
    let seriesOpts = this.getFilteredOptions(options);
    let min = new Date();
    min.setMonth(-1);

    return options.displayValueType === DisplayValueTypes.Average
      ? {
          ...BaseChartOptions,
          series: seriesOpts,
          title: this.getChartTitle(options),
        }
      : {
          chart: { type: 'lollipop' },
          time: {
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          },
          xAxis: {
            type: 'category',
            crosshair: false,
            // ceiling: new Date().getTime(),
            // floor: min.getTime()
          },
          series: seriesOpts,
          title: this.getChartTitle(options),
        };
  }

  getFilteredOptions(options: FilterOptions): (SeriesSplineOptions | Highcharts.SeriesLollipopOptions)[] {
    let splineOptions: Highcharts.SeriesSplineOptions[] | Highcharts.SeriesLollipopOptions[] = [];

    switch (options.displayValueType) {
      case DisplayValueTypes.Average:
        splineOptions = this.averagesByLocation.has(options.locationName)
          ? this.averagesByLocation.get(options.locationName)!
          : splineOptions;
        break;
      case DisplayValueTypes.Maximum:
          splineOptions = this.maximumByLocation.has(options.locationName)
            ? this.maximumByLocation.get(options.locationName)!
            : splineOptions;
          break;
      case DisplayValueTypes.Minimum:
        splineOptions = this.minimumByLocation.has(options.locationName)
          ? this.minimumByLocation.get(options.locationName)!
          : splineOptions;
        break;
      default:
        break;
    }

    let filteredOptions = options.weekDays.length === 7
      ? splineOptions
      : splineOptions?.filter((option) => contains(option.name!, options.weekDays));

    return filteredOptions;
  }

  getChartTitle(options: FilterOptions): TitleOptions {
    return  {
      ...BaseChartOptions.title,
      text: `${options.locationName} Previous 30 Day ${options.displayValueType}`,
    }
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
    let newAverageSeries: Highcharts.SeriesSplineOptions[] = [];
    let newMaximumSeries: Highcharts.SeriesLollipopOptions[] = [];
    let newMinimumSeries: Highcharts.SeriesLollipopOptions[] = [];

    currentDays.forEach((value: CurrentWeekDto) => {
      value.data.forEach((day: DailyAverage) => {
        const formattedDate = formatMonthDayFromDate(day.dateCalculated);
        const seriesName = `${day.dayOfWeek} ${formattedDate}`;
        newAverageSeries.push({
          id: seriesName,
          name: seriesName,
          data: day.averagesByHour,
          type: 'spline',
        });
        newMaximumSeries.push({
          id: seriesName,
          name: seriesName,
          type: 'lollipop',
          data: [day.maxCount]
        });
        newMinimumSeries.push({
          id: seriesName,
          name: seriesName,
          type: 'lollipop',
          data: [day.minimumCount]
        });
      });

      const gymName = GymLocations.get(value.name);

      if (gymName) {
        this.averagesByLocation.set(gymName, newAverageSeries);
        this.maximumByLocation.set(gymName, newMaximumSeries);
        this.minimumByLocation .set(gymName, newMinimumSeries);
      }

      newAverageSeries = [];
      newMaximumSeries = [];
      newMinimumSeries = [];
    });

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

// State Interface
export interface CurrentMonthState {
  state: ComponentStates,
  chartOptions: Highcharts.Options,
  error: string | null,
  filterOptions: FilterOptions
}
