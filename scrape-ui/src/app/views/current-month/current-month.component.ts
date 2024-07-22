import { Component, effect, inject, NgZone, Signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { ComponentStates } from '../../shared/enums/component-states';
import { CurrentMonthStateService } from './current-month-state.service';
import { FilteringComponent } from '../../shared/components/filtering/filtering.component';
import { FilterOptions } from '../../shared/models/filter-options.interface';

@Component({
  selector: 'app-current-month',
  standalone: true,
  template: `
    <div class="stretch-layout">
      <router-outlet name="nav"></router-outlet>
      <main class="flex flex-col grow h-full py--4 mx-6">
        <div>
          <app-filtering
            [filterOptions]="filterOptions$$()"
            (filterOptionsChange)="this.currentWeekStateService.updateFilter.next($event)"
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

      <app-footer></app-footer>
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
export class CurrentMonthComponent {
  ComponentStates: typeof ComponentStates = ComponentStates;
  highcharts: typeof Highcharts = Highcharts;
  callbackFunction = () => {}; // this cancels the click event

  currentWeekStateService: CurrentMonthStateService = inject(
    CurrentMonthStateService
  );

  chartOptions$$: Signal<Highcharts.Options> =
    this.currentWeekStateService.chartOptions;
  componentState$$: Signal<ComponentStates> =
    this.currentWeekStateService.componentState;
  error$$: Signal<string | null> = this.currentWeekStateService.errorMessage;
  filterOptions$$: Signal<FilterOptions> = this.currentWeekStateService.filterOptions;
}
