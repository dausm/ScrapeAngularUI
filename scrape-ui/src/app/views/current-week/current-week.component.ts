import { Component, inject, Signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import * as Highcharts from 'highcharts';
import HC_Accessibility from 'highcharts/modules/accessibility';
import { HighchartsChartModule } from 'highcharts-angular';
import { ComponentStates } from '../../shared/enums/component-states';
import { CurrentWeekStateService } from './current-week.state.service';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { GymLocations } from '../../shared/enums/gym-locations';
HC_Accessibility(Highcharts);

@Component({
  selector: 'app-current-week',
  standalone: true,
  template: `
    <div class="stretch-layout">
      <router-outlet name="nav"></router-outlet>
      <main class="flex flex-col grow h-full p-4 mx-6">
        @switch(componentState$$()){
          @case(ComponentStates.Initial){
            <div class="bg-white rounded-xl grow justify-center content-center text-black">
              <label>
                <span class="block">Select a location to view:</span>
              <select class="py-3 rounded-full">
                @for(location of GymLocations.keys(); track $index){
                  <option>{{ GymLocations.get(location)}}</option>
                }
              </select>
              </label>
            </div>
          }
          @case(ComponentStates.Loading){
            <div class="bg-white rounded-xl grow flex justify-center content-center">
              <app-loading></app-loading>
            </div>
          }
          @case(ComponentStates.Ready){
            <highcharts-chart
              class="bg-white rounded-xl w-full grow block"
              [Highcharts]="highcharts"
              [options]="chartOptions$$()!"
              [callbackFunction]="callbackFunction"
            ></highcharts-chart>
          }
          @case(ComponentStates.Error){
            <div class="bg-white rounded-xl w-full grow block">
              <p>{{error()}}</p>
            </div>
          }
        }
      </main>

      <app-footer></app-footer>
    </div>
  `,
  imports: [RouterOutlet, FooterComponent, LoadingComponent, HighchartsChartModule]
})
export class CurrentWeekComponent {
  ComponentStates: typeof ComponentStates = ComponentStates;
  GymLocations: typeof GymLocations = GymLocations;
  currentWeekStateService: CurrentWeekStateService = inject(CurrentWeekStateService);
  loading = true;
  highcharts: typeof Highcharts = Highcharts;
  callbackFunction = () => {}; // this cancels the click event

  chartOptions$$: Signal<Highcharts.Options> = this.currentWeekStateService.chartOptions;
  componentState$$: Signal<ComponentStates> = this.currentWeekStateService.componentState;
  error: Signal<string | null> = this.currentWeekStateService.errorMessage;
}
