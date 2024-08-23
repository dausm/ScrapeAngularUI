import { HttpErrorResponse } from '@angular/common/http';
import { computed, inject, Injectable, Signal, signal } from '@angular/core';
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
import { DailyAverage } from '../../shared/models/daily-average.interface';
import {
  contains,
  getTimeInMilliseconds,
  setErrorMessage,
} from '../../shared/utility/utilities';
import { DisplayValueTypes } from '../../shared/enums/display-value-type.enum';
import { FilterOptions } from '../../shared/models/filter-options.interface';
import {
  Options,
  PointOptionsObject,
  SeriesScatterOptions,
  SeriesSplineOptions,
  TitleOptions,
} from 'highcharts';
import { BaseChartOptions } from '../../shared/constants/baseChartOptions';
import Highcharts from 'highcharts';
import {  DateOptions } from '../../shared/constants/highchart-settings';
import { BaseScatterChartOptions } from '../../shared/constants/base-scatter-chart-options';
import { DefaultFilterOptions } from '../../shared/constants/default-filter-options';
import { WeeklyDataDto } from '../../shared/models/weekly-data.dto.interface';

@Injectable({
  providedIn: 'root',
})
export class CurrentWeekStateService {
  private currentDataService: CurrentDataService = inject(CurrentDataService);

  // Signal that holds the state (initial state)
  private state = signal<CurrentWeekState>({
    state: ComponentStates.Initial,
    chartOptions: BaseChartOptions,
    error: null,
    lastUpdate: '',
    filterOptions: DefaultFilterOptions
  });

  // Selectors (slices of state)
  errorMessage: Signal<string | null> = computed(() => this.state().error);
  chartOptions: Signal<Options> = computed(() => this.state().chartOptions);
  componentState: Signal<ComponentStates> = computed(() => this.state().state);
  filterOptions: Signal<FilterOptions> = computed(() => this.state().filterOptions);
  lastUpdate: Signal<string>  = computed(() => this.state().lastUpdate);

  // Sources
  private averagesByLocation: Map<string, SeriesSplineOptions[]> = new Map<
    string,
    SeriesSplineOptions[]
  >();
  private maximumByLocation: Map<string, SeriesScatterOptions[]> = new Map<
    string,
    SeriesScatterOptions[]
  >();
  private minimumByLocation: Map<string, SeriesScatterOptions[]> = new Map<
    string,
    SeriesScatterOptions[]
  >();
  updateFilter$: Subject<FilterOptions> = new Subject<FilterOptions>();

  // Reducers
  constructor() {
    this.chartOptions$
      .pipe(
        takeUntilDestroyed(),
        tap((_) => this.setStateToLoading())
      )
      .subscribe((options) => this.setOptionByLocation(options));

    this.updateFilter$
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
    return options.displayValueType === DisplayValueTypes.Average
      ? {
          ...BaseChartOptions,
          series: seriesOpts,
          title: this.getChartTitle(options),
        }
      : {
          ...BaseScatterChartOptions,
          series: seriesOpts,
          title: this.getChartTitle(options),
          legend: { enabled: false}
        };
  }

  getFilteredOptions(
    options: FilterOptions
  ): (SeriesSplineOptions | Highcharts.SeriesScatterOptions)[] {
    let splineOptions:
      Highcharts.SeriesSplineOptions[]
      | Highcharts.SeriesScatterOptions[] = [];

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

    if (options.weekDays.length === 7) {
      return splineOptions;
    }

    if (options.displayValueType == DisplayValueTypes.Average) {
      return splineOptions?.filter((option) =>
        contains(option.name!, options.weekDays)
      );
    }

    let copy: (SeriesSplineOptions | Highcharts.SeriesScatterOptions)[] =
      JSON.parse(JSON.stringify(splineOptions));
    copy[0].data = copy[0].data?.filter((x) => {
      return (<Highcharts.PointOptionsObject>x).name
        ? contains((<Highcharts.PointOptionsObject>x).name!, options.weekDays)
        : x;
    });
    return copy;
  }

  getChartTitle(options: FilterOptions): TitleOptions {
    return {
      ...BaseChartOptions.title,
      text: `${options.locationName} Previous 7 Day ${options.displayValueType}`,
    };
  }

  private chartOptions$: Observable<WeeklyDataDto[]> =
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

  private setOptionByLocation(currentDays: WeeklyDataDto[]): void {
    let newAverageSeries: SeriesSplineOptions[] = [];
    let mins: Array<PointOptionsObject> = [];
    let maximums: Array<PointOptionsObject> = [];
    let lastUpdateTime: Date | null = null;

    currentDays.forEach((value: WeeklyDataDto) => {
      value.data.forEach((gym: DailyAverage) => {
        let minDate = new Date(gym.minimumTime);
        let minMilliseconds = getTimeInMilliseconds(gym.minimumTime);
        let maxDate = new Date(gym.maxTime);
        let maxMilliseconds = getTimeInMilliseconds(gym.maxTime);
        const date = new Date(gym.dateCalculated);
        lastUpdateTime = !lastUpdateTime || date > lastUpdateTime ? date : lastUpdateTime;

        newAverageSeries.push({
          id: `avg-${gym.dayOfWeek}`,
          name: gym.dayOfWeek,
          data: gym.averagesByHour.map((x) => {
            return {
              id: `avg-${gym.dayOfWeek}-point`,
              name: gym.dayOfWeek,
              y: x,
            };
          }),
          type: 'spline',
        });
        maximums.push({
          id: `max-${gym.dayOfWeek}`,
          name: `${maxDate.toLocaleDateString(
            undefined,
            DateOptions
          )} ${maxDate.toLocaleTimeString()}`,
          x: maxMilliseconds,
          y: gym.maxCount,
        });
        mins.push({
          id: `min-${gym.dayOfWeek}`,
          name: `${minDate.toLocaleDateString(
            undefined,
            DateOptions
          )} ${minDate.toLocaleTimeString()}`,
          x: minMilliseconds,
          y: gym.minimumCount,
        });
      });
      const name = GymLocations.get(value.name);

      if (name) {
        this.averagesByLocation.set(name, newAverageSeries);
        maximums.sort((a, b) => a.x! - b.x!);
        mins.sort((a, b) => a.x! - b.x!);
        this.maximumByLocation.set(name, [
          {
            id: `max-${name}`,
            type: 'scatter',
            data: maximums,
          },
        ]);
        this.minimumByLocation.set(name, [
          {
            id: `min-${name}`,
            type: 'scatter',
            data: mins,
          },
        ]);
      }

      newAverageSeries = [];
      maximums = [];
      mins = [];
    });

    this.state.update((state) => ({
      ...state,
      state: ComponentStates.Ready,
      lastUpdate: lastUpdateTime
          ? `Last calculated: ${lastUpdateTime?.toLocaleDateString(
            undefined,
            DateOptions
          )}`
          : '',
    }));
  }

  private setStateToLoading() {
    this.state.update((state) => ({
      ...state,
      state: ComponentStates.Loading,
    }));
  }
}

export interface CurrentWeekState {
  state: ComponentStates,
  chartOptions: Highcharts.Options,
  error: string | null,
  lastUpdate: string,
  filterOptions: FilterOptions
}
