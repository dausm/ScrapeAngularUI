import { Component, effect, inject, Signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import * as Highcharts from 'highcharts';
import HC_Accessibility from 'highcharts/modules/accessibility';
import { HighchartsChartModule } from 'highcharts-angular';
import { ComponentStates } from '../../shared/enums/component-states';
import { CurrentWeekStateService } from './current-week.state.service';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { FilteringComponent } from '../../shared/components/filtering/filtering.component';
import { FilterOptions } from '../../shared/models/filter-options.interface';
HC_Accessibility(Highcharts);

@Component({
  selector: 'app-current-week',
  standalone: true,
  template: `
    <div class="stretch-layout">
      <router-outlet name="nav"></router-outlet>
      <main class="flex flex-col grow h-full py--4 mx-6">
        <div>
          <app-filtering
            [filterOptions]="filterOptions$$()"
            (filterOptionsChange)="this.currentWeekStateService.updateFilter$.next($event)"
          ></app-filtering>
        </div>
        @switch(componentState$$()){
          @case(ComponentStates.Loading){
          <div
            class="bg-white rounded-xl grow flex justify-center content-center"
          >
            <app-loading></app-loading>
          </div>
          } @case(ComponentStates.Ready){
          <highcharts-chart
            class="bg-white rounded-xl w-full grow block"
            [Highcharts]="highcharts"
            [options]="chartOptions$$()"
            [callbackFunction]="callbackFunction"
            [oneToOne]="true"
          ></highcharts-chart>
          } @case(ComponentStates.Error){
          <div class="bg-white rounded-xl w-full grow block">
            <p>{{ error$$() }}</p>
          </div>
          }
        }
      </main>

      <app-footer [lastUpdate]="lastUpdate$$()"></app-footer>
    </div>
  `,
  imports: [
    RouterOutlet,
    FooterComponent,
    LoadingComponent,
    FilteringComponent,
    HighchartsChartModule,
  ],
})
export class CurrentWeekComponent {
  ComponentStates: typeof ComponentStates = ComponentStates;
  highcharts: typeof Highcharts = Highcharts;
  chartRef!: Highcharts.Chart;
  callbackFunction: Highcharts.ChartCallbackFunction = (chart) => {
    this.chartRef = chart;
  };

  currentWeekStateService: CurrentWeekStateService = inject(
    CurrentWeekStateService
  );

  chartOptions$$: Signal<Highcharts.Options> =
    this.currentWeekStateService.chartOptions;
  componentState$$: Signal<ComponentStates> =
    this.currentWeekStateService.componentState;
  error$$: Signal<string | null> = this.currentWeekStateService.errorMessage;
  filterOptions$$: Signal<FilterOptions> =
    this.currentWeekStateService.filterOptions;
  lastUpdate$$: Signal<string> = this.currentWeekStateService.lastUpdate;

  constructor() {
    effect(() => {
      if (this.chartOptions$$() && this.chartRef) {
        this.chartRef.showLoading();
        this.chartRef.update(this.chartOptions$$(), true, true);
        this.chartRef.hideLoading();
      }
    });
  }
}
