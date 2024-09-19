import { Component, effect, inject, Signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { WeeklyAveragesStateService } from './weekly-averages.state.service';
import { FilterOptions } from '../../shared/models/filter-options.interface';
import { ComponentStates } from '../../shared/enums/component-states';
import Highcharts from 'highcharts';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { FilteringComponent } from '../../shared/components/filtering/filtering.component';
import { HighchartsChartModule } from 'highcharts-angular';

@Component({
  selector: 'app-weekly-averages',
  standalone: true,
  imports: [
    RouterOutlet,
    FooterComponent,
    LoadingComponent,
    FilteringComponent,
    HighchartsChartModule],
  template: `
  <div class="stretch-layout">
      <router-outlet name="nav"></router-outlet>
      <main class="flex flex-col grow h-full py--4 mx-6">
        @switch(componentState$$()){
          @case(ComponentStates.Loading){
          <div
            class="bg-white rounded grow flex justify-center content-center"
          >
            <app-loading></app-loading>
          </div>
          } @case(ComponentStates.Ready){
            <app-filtering
              [filterOptions]="filterOptions$$()"
              (filterOptionsChange)="this.weeklyAveragesStateService.updateFilter$.next($event)"
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
          } @case(ComponentStates.Error){
          <div class="bg-white rounded w-full grow block">
            <p>{{ error$$() }}</p>
          </div>
          }
        }
      </main>

      <app-footer [lastUpdate]="lastUpdate$$()"></app-footer>
    </div>
  `
})

export class WeeklyAveragesComponent {
  ComponentStates: typeof ComponentStates = ComponentStates;
  highcharts: typeof Highcharts = Highcharts;
  chartRef!: Highcharts.Chart;
  callbackFunction: Highcharts.ChartCallbackFunction = (chart) => {
    this.chartRef = chart;
  };

  weeklyAveragesStateService: WeeklyAveragesStateService = inject(
    WeeklyAveragesStateService
  );

  chartOptions$$: Signal<Highcharts.Options> =
    this.weeklyAveragesStateService.chartOptions;
  componentState$$: Signal<ComponentStates> =
    this.weeklyAveragesStateService.componentState;
  error$$: Signal<string | null> = this.weeklyAveragesStateService.errorMessage;
  filterOptions$$: Signal<FilterOptions> =
    this.weeklyAveragesStateService.filterOptions;
  lastUpdate$$: Signal<string> = this.weeklyAveragesStateService.lastUpdate;

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
