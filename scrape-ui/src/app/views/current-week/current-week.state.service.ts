import { HttpErrorResponse } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, Observable, of, Subject, distinctUntilChanged, tap } from 'rxjs';
import { CurrentDataService } from '../../core/services/current-data.service';
import { ComponentStates } from '../../shared/enums/component-states';
import { GymLocations } from '../../shared/enums/gym-locations';
import { CurrentWeekDto } from '../../shared/models/current-week.dto.interface';
import { DailyAverage } from '../../shared/models/daily-average.interface';
import { contains, setErrorMessage } from '../../shared/utility/utilities';
import { WeekDays } from '../../shared/enums/week-days.map';
import { DisplayValueTypes } from '../../shared/enums/display-value-type.enum';
import { FilterOptions } from '../../shared/models/filter-options.interface';
import { Options, SeriesSplineOptions, TitleOptions } from 'highcharts';
import { BaseChartOptions } from '../../shared/constants/baseChartOptions';

@Injectable({
  providedIn: 'root'
})
export class CurrentWeekStateService {
  private currentDataService: CurrentDataService = inject(CurrentDataService);

  // Signal that holds the state (initial state)
  private state = signal<CurrentWeekState>({
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
  filterOptions = computed(() => this.state().filterOptions);

  // Sources
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
  updateFilter$ = new Subject<FilterOptions>();

  // Reducers
  constructor() {
    this.chartOptions$
      .pipe(
        takeUntilDestroyed(),
        tap((_) => this.setStateToLoading()),
      )
      .subscribe((options) => this.setOptionByLocation(options));

    this.updateFilter$.pipe(
      takeUntilDestroyed(),
      distinctUntilChanged()
    ).subscribe((options) => {
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
        ...BaseChartOptions,
          chart: { type: 'lollipop' },
          xAxis: {
            id: 'xAxis-lollipop',
            type: 'category',
            title: {
              text: 'Day',
            },
          },
          plotOptions: {
            line: {
              color: '#b2292e',
            },
            lollipop: {
              color: '#b2292e',
            }
          },
          legend: {
            enabled: false
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
      text: `${options.locationName} Previous 7 Day ${options.displayValueType}`,
    }
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
    let newAverageSeries: Highcharts.SeriesSplineOptions[] = [];
    let mins: Array<(number|[(number|string), (number|null)]|null|Highcharts.PointOptionsObject)> = [];
    let maxs: Array<(number|[(number|string), (number|null)]|null|Highcharts.PointOptionsObject)> = [];

    currentDays.forEach((value: CurrentWeekDto) => {
      value.data.forEach((gym: DailyAverage) => {
        newAverageSeries.push({
          id: `avg-${gym.dayOfWeek}`,
          name: gym.dayOfWeek,
          data: gym.averagesByHour.map( x => {
            return {
              id: `avg-${gym.dayOfWeek}-point`,
              name: gym.dayOfWeek,
              y: x
            }}),
          type: 'spline'
        })
        maxs.push({
          id: `max-${gym.dayOfWeek}`,
          name: gym.dayOfWeek,
          y: gym.maxCount})
        mins.push({
          id: `min-${gym.dayOfWeek}`,
          name: gym.dayOfWeek,
          y: gym.minimumCount})
      })
      const name = GymLocations.get(value.name);

      if(name){
        this.averagesByLocation.set(name, newAverageSeries);
        this.maximumByLocation.set(name, [{
          id: `max-${name}`,
          type: 'lollipop',
          data: maxs
        }]);
        this.minimumByLocation.set(name, [{
          id: `min-${name}`,
          type: 'lollipop',
          data: mins
        }]);
      }

      newAverageSeries = [];
      maxs = [];
      mins = [];
    })

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

export interface CurrentWeekState {
  state: ComponentStates;
  chartOptions: Highcharts.Options;
  error: string | null;
  filterOptions: FilterOptions;
}
