import { computed, Injectable, signal, Signal } from '@angular/core';
import {
  SeriesSplineOptions,
  SeriesScatterOptions,
  PointOptionsObject,
  Options,
  TitleOptions,
} from 'highcharts';
import { distinctUntilChanged, of, Subject } from 'rxjs';
import { FilterOptions } from '../../shared/models/filter-options.interface';
import { ComponentStates } from '../../shared/enums/component-states';
import { DisplayValueTypes } from '../../shared/enums/display-value-type.enum';
import {
  contains,
  formatMonthDayFromDate,
  getTimeInMilliseconds,
  isDailyAverage,
  makeUpdater,
  setErrorMessage,
} from '../../shared/utility/utilities';
import { HttpErrorResponse } from '@angular/common/http';
import { DateOptions } from '../../shared/constants/highchart-settings';
import { GymLocations } from '../../shared/enums/gym-locations';
import { DailyAverage } from '../../shared/models/daily-average.interface';
import { WeeklyDataDto } from '../../shared/models/weekly-data.dto.interface';
import { BaseScatterChartOptions } from '../../shared/constants/base-scatter-chart-options';
import { BaseChartOptions } from '../../shared/constants/baseChartOptions';
import { DefaultFilterOptions } from '../../shared/constants/default-filter-options';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { WeeklyAverageByLocation } from '../../shared/models/weekly-average-location.interface';
import { WeeklyAverage } from '../../shared/models/weekly-average.interface';

@Injectable({
  providedIn: 'root',
})
export class FilteringBaseService {
  // Signal that holds the state (initial state)
  private state = signal<FilteringBaseState>({
    state: ComponentStates.Initial,
    chartOptions: BaseChartOptions,
    error: null,
    lastUpdate: '',
    filterOptions: DefaultFilterOptions,
  });

  stateUpdater = makeUpdater(this.state);

  // Selectors (slices of state)
  errorMessage: Signal<string | null> = computed(() => this.state().error);
  chartOptions: Signal<Options> = computed(() => this.state().chartOptions);
  componentState: Signal<ComponentStates> = computed(() => this.state().state);
  filterOptions: Signal<FilterOptions> = computed(
    () => this.state().filterOptions
  );
  lastUpdate: Signal<string> = computed(() => this.state().lastUpdate);

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

  constructor() {
    this.updateFilter$
      .pipe(takeUntilDestroyed(), distinctUntilChanged())
      .subscribe((options) => {
        if (!options) {
          return;
        }

        this.stateUpdater('filterOptions', options)
        this.stateUpdater('chartOptions', this.getBaseChartOptions(options))
        this.stateUpdater('state', ComponentStates.Ready)
      });
  }

  getBaseChartOptions(options: FilterOptions): Options {
    return options.displayValueType === DisplayValueTypes.Average
      ? {
          ...BaseChartOptions,
          series: this.getFilteredOptions(options),
          title: this.getChartTitle(options),
        }
      : {
          ...BaseScatterChartOptions,
          series: this.getFilteredOptions(options),
          title: this.getChartTitle(options),
        };
  }

  getChartTitle(options: FilterOptions): TitleOptions {
    return  {
      ...BaseChartOptions.title,
      text: '',
    }
  }

  private getFilteredOptions(
    options: FilterOptions
  ): (SeriesSplineOptions | SeriesScatterOptions)[] {
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

    const multiSelect = this.state().filterOptions.multiSelectSelected;
    if(multiSelect
      && multiSelect.length > 0){
        splineOptions = splineOptions.filter(x => multiSelect.indexOf(x.name!) > -1);
      }

    if (options.weekDays?.length === 7) {
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

  setError(err: HttpErrorResponse) {
    this.stateUpdater('error', setErrorMessage(err))
    this.stateUpdater('state', ComponentStates.Error)
    return of([]);
  }

  setOptionByLocation(
    currentDays: WeeklyDataDto[] | WeeklyAverageByLocation[],
    isLargeSeries: boolean = false,
    isMultiSelectData: boolean = false): void {
    let newAverageSeries: Highcharts.SeriesSplineOptions[] = [];
    let mins: Array<PointOptionsObject> = [];
    let maximums: Array<PointOptionsObject> = [];
    let multiSelectOptions: Set<string> = new Set();
    let lastUpdateTime: Date | undefined;

    currentDays.forEach((value: WeeklyDataDto | WeeklyAverageByLocation) => {
      if(value.data.length > 0 && isDailyAverage(value.data[0]))
        {
        value.data.forEach((day, index: number) => {
          day = day as DailyAverage;
          const seriesName = isLargeSeries
            ? `${day.dayOfWeek}-${formatMonthDayFromDate(day.dateCalculated)}`
            : `${day.dayOfWeek}`;
          let minDate = new Date(day.minimumTime);
          let minMilliseconds = getTimeInMilliseconds(day.minimumTime);
          let maxDate = new Date(day.maxTime);
          let maxMilliseconds = getTimeInMilliseconds(day.maxTime);
          const date = new Date(day.dateCalculated);
          lastUpdateTime = !lastUpdateTime || date > lastUpdateTime
            ? date
            : lastUpdateTime;

          newAverageSeries.push({
            id: `avg-${seriesName}-${index}`,
            name: seriesName,
            data: isLargeSeries
              ? day.averagesByHour
              : day.averagesByHour.map((x) => {
                  return {
                    id: `avg-${day.dayOfWeek}-point`,
                    name: day.dayOfWeek,
                    y: x,
                  };
                }),
            type: 'spline',
          });
          maximums.push({
            id: `max-${day.dayOfWeek}-${index}`,
            name: `${maxDate.toLocaleDateString( undefined, DateOptions )} ${maxDate.toLocaleTimeString()}`,
            x: maxMilliseconds,
            y: day.maxCount,
          });
          mins.push({
            id: `min-${day.dayOfWeek}-${index}`,
            name: `${minDate.toLocaleDateString( undefined, DateOptions )} ${minDate.toLocaleTimeString()}`,
            x: minMilliseconds,
            y: day.minimumCount,
          });
          multiSelectOptions.add(seriesName);
        });
      }
      else
      {
        value.data.forEach((week) => {
          week = week as WeeklyAverage;
          const formattedStartDate = formatMonthDayFromDate(week.startDate);
          const formattedEndDate = formatMonthDayFromDate(week.endDate);
          const seriesName = `${formattedStartDate}-${formattedEndDate}`;
          const date = new Date(week.endDate);

          let minDate = new Date(week.minimumTime);
          let minMilliseconds = getTimeInMilliseconds(week.minimumTime);
          let maxDate = new Date(week.maxTime);
          let maxMilliseconds = getTimeInMilliseconds(week.maxTime);
          lastUpdateTime = !lastUpdateTime || date > lastUpdateTime ? date : lastUpdateTime;

          newAverageSeries.push({
            id: `weekly-avg-${week.id}`,
            name: seriesName,
            data: week.averagesByHour,
            type: 'spline',
          });
          maximums.push({
            id: `weekly-max-${week.id}`,
            name: `${maxDate.toLocaleDateString( undefined, DateOptions )} ${maxDate.toLocaleTimeString()}`,
            x: maxMilliseconds,
            y: week.maxCount,
          });
          mins.push({
            id: `weekly-min-${week.id}`,
            name: `${minDate.toLocaleDateString( undefined, DateOptions )} ${minDate.toLocaleTimeString()}`,
            x: minMilliseconds,
            y: week.minimumCount,
          });
          multiSelectOptions.add(seriesName);
      });
    }


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

    this.stateUpdater('lastUpdate', lastUpdateTime
      ? `Last calculated: ${lastUpdateTime?.toLocaleDateString( undefined, DateOptions)}`
      : '',)
    this.stateUpdater('state', ComponentStates.Ready);
    this.stateUpdater('filterOptions', {...this.state().filterOptions, multiSelectOptions: [...multiSelectOptions]})
  }
}

export interface FilteringBaseState {
  state: ComponentStates;
  chartOptions: Highcharts.Options;
  error: string | null;
  lastUpdate: string;
  filterOptions: FilterOptions;
}
