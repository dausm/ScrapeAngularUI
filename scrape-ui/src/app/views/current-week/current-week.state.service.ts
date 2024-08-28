import { inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, tap } from 'rxjs';
import { CurrentDataService } from '../../core/services/current-data.service';
import { ComponentStates } from '../../shared/enums/component-states';
import { FilterOptions } from '../../shared/models/filter-options.interface';
import { TitleOptions } from 'highcharts';
import { BaseChartOptions } from '../../shared/constants/baseChartOptions';
import { FilteringBaseService } from '../../core/services/filtering-base.service';

@Injectable({
  providedIn: 'root',
})
export class CurrentWeekStateService extends FilteringBaseService {
  private currentDataService: CurrentDataService = inject(CurrentDataService);

  constructor() {
    super();

      this.currentDataService.currentWeekData$
      .pipe(
        takeUntilDestroyed(),
        tap((_) => this.stateUpdater('state', ComponentStates.Loading)),
        catchError((err) => super.setError(err))
      )
      .subscribe((options) => super.setOptionByLocation(options, false));
  }

  override getChartTitle(options: FilterOptions): TitleOptions {
    return {
      ...BaseChartOptions.title,
      text: `${options.locationName} Previous 7 Day ${options.displayValueType}`,
    };
  }
}
