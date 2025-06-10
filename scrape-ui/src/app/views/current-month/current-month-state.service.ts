import { inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, tap } from 'rxjs';
import { ComponentStates } from '../../shared/enums/component-states';
import { FilterOptions } from '../../shared/models/filter-options.interface';
import { TitleOptions } from 'highcharts';
import { BaseChartOptions } from '../../shared/constants/baseChartOptions';
import { AverageDataService } from '../../core/services/average-data.service';
import { FilteringBaseService } from '../../core/services/filtering-base.service';
import { DefaultFilterOptions } from '../../shared/constants/default-filter-options';

@Injectable({
  providedIn: 'root',
})
export class CurrentMonthStateService extends FilteringBaseService {
  private averageDataService: AverageDataService = inject(AverageDataService);

  constructor() {
    super();

    this.averageDataService.currentMonthData$
      .pipe(
        takeUntilDestroyed(),
        tap((_) => this.stateUpdater('state', ComponentStates.loading)),
        catchError((err) => super.setError(err))
      )
      .subscribe((options) => super.setOptionByLocation(options, true));

    this.stateUpdater('filterOptions', {
      ...DefaultFilterOptions,
      isWeekDaysEnabled: true
    })
  }

  override getChartTitle(options: FilterOptions): TitleOptions {
    return  {
      ...BaseChartOptions.title,
      text: `${options.locationName} Previous 30 Day ${options.displayValueType}`,
    }
  }
}
