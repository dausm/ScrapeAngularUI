import { Injectable, inject } from "@angular/core";
import { AverageDataService } from "../../core/services/average-data.service";
import { ComponentStates } from "../../shared/enums/component-states";
import { FilterOptions } from "../../shared/models/filter-options.interface";
import { TitleOptions } from "highcharts";
import { catchError, tap } from "rxjs";
import { BaseChartOptions } from "../../shared/constants/baseChartOptions";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FilteringBaseService } from "../../core/services/filtering-base.service";
import { DisplayValueTypes } from "../../shared/enums/display-value-type.enum";

@Injectable({
  providedIn: 'root',
})
export class WeeklyAveragesStateService extends FilteringBaseService {
  private averageDataService: AverageDataService = inject(AverageDataService);

  constructor() {
    super();

    this.averageDataService.weeklyAveragesData$
      .pipe(
        takeUntilDestroyed(),
        tap((_) => this.stateUpdater('state', ComponentStates.Loading)),
        catchError((err) => super.setError(err))
      )
      .subscribe((options) => super.setOptionByLocation(options, false));

      this.stateUpdater('filterOptions', {
        locationName: '',
        displayValueType: DisplayValueTypes.Average
      })
  }

  override getChartTitle(options: FilterOptions): TitleOptions {
    return  {
      ...BaseChartOptions.title,
      text: `${options.locationName} ${options.displayValueType} For Weeks Selected`,
    }
  }
}
