import { Component, effect, inject, Signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import HC_Accessibility from 'highcharts/modules/accessibility';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { ComponentStates } from '../../shared/enums/component-states';
import { CurrentMonthStateService } from './current-month-state.service';
import { FilteringComponent } from '../../shared/components/filtering/filtering.component';
import { FilterOptions } from '../../shared/models/filter-options.interface';
HC_Accessibility(Highcharts);

@Component({
  selector: 'app-current-month',
  standalone: true,
  template: `
  @defer (prefetch on idle) {
    <div class="stretch-layout">
      <router-outlet name="nav"></router-outlet>
      <main class="flex flex-col grow h-full py--4 mx-6">
        @switch(componentState$$()){
          @case(ComponentStates.loading){
          <div
            class="bg-white rounded grow flex justify-center content-center"
          >
            <app-loading></app-loading>
          </div>
          } @case(ComponentStates.ready){
            <app-filtering
              [filterOptions]="filterOptions$$()"
              (filterOptionsChange)="this.currentMonthStateService.updateFilter$.next($event)"
            ></app-filtering>
            @if(filterOptions$$().locationName != ''){
              <highcharts-chart
                class="bg-white rounded w-full grow block"
                [Highcharts]="highcharts"
                [options]="chartOptions$$()"
                [callbackFunction]="callbackFunction"
                [oneToOne]="true"
              ></highcharts-chart>
            }
          } @case(ComponentStates.error){
          <div class="bg-white rounded w-full grow block">
            <p>{{ this.currentMonthStateService.errorMessage() }}</p>
          </div>
          }
        }
      </main>

      <app-footer [lastUpdate]="lastUpdate$$()"></app-footer>
    </div>
  }
  `,
  imports: [
    RouterOutlet,
    FooterComponent,
    LoadingComponent,
    FilteringComponent,
    HighchartsChartModule,
  ],
})
export class CurrentMonthComponent {
  ComponentStates: typeof ComponentStates = ComponentStates;
  highcharts: typeof Highcharts = Highcharts;
  chartRef!: Highcharts.Chart;
  callbackFunction: Highcharts.ChartCallbackFunction = (chart) => {
    this.chartRef = chart;
  };

  currentMonthStateService: CurrentMonthStateService = inject(
    CurrentMonthStateService
  );

  chartOptions$$: Signal<Highcharts.Options> =
    this.currentMonthStateService.chartOptions;
    
  componentState$$: Signal<ComponentStates> =
    this.currentMonthStateService.componentState;
  filterOptions$$: Signal<FilterOptions> =
    this.currentMonthStateService.filterOptions;
  lastUpdate$$: Signal<string> = this.currentMonthStateService.lastUpdate;

  constructor(){
    effect(() => {
      if (this.chartOptions$$() && this.chartRef) {
        this.chartRef.showLoading();
        this.chartRef.update(this.chartOptions$$(), true, true);
        this.chartRef.hideLoading();
      }
    })
  }
}
