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
    Highcharts.SeriesScatterOptions[]
  >();
  private minimumByLocation = new Map<
    string,
    Highcharts.SeriesScatterOptions[]
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
        let newChartOptions = {
          ...this.getBaseChartOptions(options),
          series: this.getFilteredOptions(options),
          title: this.getChartTitle(options),
        };

        this.state.update((state) => ({
          ...state,
          filterOptions: options,
          chartOptions: newChartOptions,
          state: ComponentStates.Ready,
        }));
      });
  }

  getBaseChartOptions(options: FilterOptions): Options {
    return options.displayValueType === DisplayValueTypes.Average
      ? {...BaseChartOptions,
        legend: {...BaseChartOptions.legend, enabled: true},
        xAxis: {...BaseChartOptions.xAxis},
        tooltip: {...BaseChartOptions.tooltip}
      }
      : {...BaseTimeChart,
          chart: { type: 'scatter' },
          // legend: {...BaseTimeChart.legend, enabled: false},
          tooltip: {
            ...BaseTimeChart.tooltip,
            pointFormatter: function() {
              let point: Point = this,
                series = point.series;
                return `${options.displayValueType}: ${series.data[0].y}`;
            }
          },
          xAxis: {
            type: 'datetime',
            labels: {
              format: '{value:%m/%e}'
            }
          }
        };
  }

  getFilteredOptions(options: FilterOptions): (SeriesSplineOptions | SeriesScatterOptions)[] {
    let splineOptions: Highcharts.SeriesSplineOptions[] | SeriesScatterOptions[] = [];

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
    let newMaximumSeries: Highcharts.SeriesScatterOptions[] = [];
    let newMinimumSeries: Highcharts.SeriesScatterOptions[] = [];

    currentDays.forEach((value: CurrentWeekDto) => {
      value.data.forEach((day: DailyAverage) => {
        const seriesName = `${day.dayOfWeek} ${formatMonthDayFromDate(day.dateCalculated)}`;
        newAverageSeries.push({
          name: seriesName,
          data: day.averagesByHour,
          type: 'spline',
        });
        newMaximumSeries.push({
          name: seriesName,
          type: 'scatter',
          data: [[new Date(day.maxTime).getTime(), day.maxCount]]
        });
        newMinimumSeries.push({
          name: seriesName,
          type: 'scatter',
          data: [[new Date(day.minimumTime).getTime(), day.minimumCount]]
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
