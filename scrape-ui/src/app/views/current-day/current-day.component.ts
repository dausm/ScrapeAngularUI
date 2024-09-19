import { Component, inject, Signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import Highcharts from 'highcharts';
import HC_Accessibility from 'highcharts/modules/accessibility';
import { HighchartsChartModule } from 'highcharts-angular';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { CurrentDayStateService } from './current-day.state.service';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { ComponentStates } from '../../shared/enums/component-states';
HC_Accessibility(Highcharts);

@Component({
  selector: 'app-current-day',
  standalone: true,
  template: `
    <div class="stretch-layout">
      <router-outlet name="nav"></router-outlet>
      <main class="flex flex-col grow h-full py-4 mx-6">
        @switch(componentState$$()){
          @case(ComponentStates.Loading){
            <div class="bg-white rounded grow flex justify-center content-center">
              <app-loading></app-loading>
            </div>
          }
          @case(ComponentStates.Ready){
            <highcharts-chart
              class="bg-white rounded w-full grow block"
              [Highcharts]="highcharts"
              [options]="chartOptions$$()!"
              [callbackFunction]="callbackFunction"
            ></highcharts-chart>
          }
          @case(ComponentStates.Error){
            <div class="bg-white rounded w-full grow block">
              <p>{{error$$()}}</p>
            </div>
          }
        }
      </main>

      <app-footer [lastUpdate]="lastUpdate$$()"></app-footer>
    </div>
  `,
  imports: [RouterOutlet, FooterComponent, LoadingComponent, HighchartsChartModule],
})

export class CurrentDayComponent {
  ComponentStates: typeof ComponentStates = ComponentStates;
  currentDayStateService: CurrentDayStateService = inject(CurrentDayStateService);
  loading = true;
  highcharts: typeof Highcharts = Highcharts;
  callbackFunction = () => {}; // this cancels the click event

  chartOptions$$: Signal<Highcharts.Options> = this.currentDayStateService.chartOptions;
  componentState$$: Signal<ComponentStates> = this.currentDayStateService.componentState;
  error$$: Signal<string | null> = this.currentDayStateService.errorMessage;
  lastUpdate$$: Signal<string> = this.currentDayStateService.lastUpdate;
}
