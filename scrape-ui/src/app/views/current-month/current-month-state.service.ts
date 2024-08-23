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
import { DailyAverage } from '../../shared/models/daily-average.interface';
import { contains, formatMonthDayFromDate, getTimeInMilliseconds, setErrorMessage } from '../../shared/utility/utilities';
import { FilterOptions } from '../../shared/models/filter-options.interface';
import { DisplayValueTypes } from '../../shared/enums/display-value-type.enum';
import { Options, PointOptionsObject, SeriesScatterOptions, SeriesSplineOptions, TitleOptions } from 'highcharts';
import { BaseChartOptions } from '../../shared/constants/baseChartOptions';
import { BaseScatterChartOptions } from '../../shared/constants/base-scatter-chart-options';
import { DateOptions } from '../../shared/constants/highchart-settings';
import { DefaultFilterOptions } from '../../shared/constants/default-filter-options';
import { WeeklyDataDto } from '../../shared/models/weekly-data.dto.interface';
import { AverageDataService } from '../../core/services/average-data.service';

@Injectable({
  providedIn: 'root',
})
export class CurrentMonthStateService {
  private averageDataService: AverageDataService = inject(AverageDataService);

  // Signal that holds the state (initial state)
  private state = signal<CurrentMonthState>({
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
    this.averageDataService.currentMonthData$
      .pipe(
        takeUntilDestroyed(),
        tap((_) => this.setStateToLoading()),
        catchError((err) => this.setError(err))
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

  getFilteredOptions(options: FilterOptions): (SeriesSplineOptions | SeriesScatterOptions)[] {
    let splineOptions: (SeriesSplineOptions | SeriesScatterOptions)[] = [];

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

    let copy: (SeriesSplineOptions | Highcharts.SeriesScatterOptions)[] = JSON.parse(JSON.stringify(splineOptions));
    copy[0].data = copy[0].data?.filter((x) => {
      return (<Highcharts.PointOptionsObject>x).name
        ? contains((<Highcharts.PointOptionsObject>x).name!, options.weekDays)
        : x;
    });
    return copy;
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

  private setOptionByLocation(currentDays: WeeklyDataDto[]): void {
    let newAverageSeries: Highcharts.SeriesSplineOptions[] = [];
    let mins: Array<PointOptionsObject> = [];
    let maximums: Array<PointOptionsObject> = [];
    let lastUpdateTime: Date | null = null;

    currentDays.forEach((value: WeeklyDataDto) => {
      value.data.forEach((day: DailyAverage, index: number) => {
        const formattedDate = formatMonthDayFromDate(day.dateCalculated);
        const seriesName = `${day.dayOfWeek}-${formattedDate}`;
        let minDate = new Date(day.minimumTime);
        let minMilliseconds = getTimeInMilliseconds(day.minimumTime);
        let maxDate = new Date(day.maxTime);
        let maxMilliseconds = getTimeInMilliseconds(day.maxTime);
        const date = new Date(day.dateCalculated);
        lastUpdateTime = !lastUpdateTime || date > lastUpdateTime ? date : lastUpdateTime;

        newAverageSeries.push({
          id: `avg-${seriesName}-${index}`,
          name: seriesName,
          data: day.averagesByHour,
          type: 'spline',
        });
        maximums.push({
          id: `max-${day.dayOfWeek}-${index}`,
          name: `${maxDate.toLocaleDateString(
            undefined,
            DateOptions
          )} ${maxDate.toLocaleTimeString()}`,
          x: maxMilliseconds,
          y: day.maxCount,
        });
        mins.push({
          id: `min-${day.dayOfWeek}-${index}`,
          name: `${minDate.toLocaleDateString(
            undefined,
            DateOptions
          )} ${minDate.toLocaleTimeString()}`,
          x: minMilliseconds,
          y: day.minimumCount,
        });
      });

      const gymName = GymLocations.get(value.name);

      if (gymName) {
        this.averagesByLocation.set(gymName, newAverageSeries);
        maximums.sort((a, b) => a.x! - b.x!);
        mins.sort((a, b) => a.x! - b.x!);
        this.maximumByLocation.set(gymName, [
          {
            id: `max-${gymName}`,
            type: 'scatter',
            data: maximums,
          },
        ]);
        this.minimumByLocation.set(gymName, [
          {
            id: `min-${gymName}`,
            type: 'scatter',
            data: mins,
          },
        ]);
      }

      newAverageSeries = [];
      mins = [];
      maximums = [];
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

// State Interface
export interface CurrentMonthState {
  state: ComponentStates,
  chartOptions: Highcharts.Options,
  error: string | null,
  lastUpdate: string,
  filterOptions: FilterOptions
}
