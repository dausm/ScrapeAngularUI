import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import * as Highcharts from 'highcharts';
import HC_Accessibility from 'highcharts/modules/accessibility';
import { HighchartsChartModule } from 'highcharts-angular';
HC_Accessibility(Highcharts);

@Component({
  selector: 'app-current-week',
  standalone: true,
  template: `
    <div class="stretch-layout">
      <router-outlet name="nav"></router-outlet>
      <main class="flex flex-col grow h-full p-4 mx-6">
        <highcharts-chart
          class="bg-white rounded-xl w-full grow block"
          [Highcharts]="highcharts"
          [options]="chartOptions"
          [callbackFunction]="callbackFunction"
        ></highcharts-chart>
      </main>

      <app-footer></app-footer>
    </div>
  `,
  styleUrl: './current-week.component.scss',
  imports: [RouterOutlet, FooterComponent, HighchartsChartModule],
})
export class CurrentWeekComponent {
  highcharts: typeof Highcharts = Highcharts;
  callbackFunction = () => {};
  chartOptions: Highcharts.Options = {
    series: [
      {
        name: "Walker's Point",
        data: [
          0, 0, 0, 0, 5, 10, 12, 12, 50, 70, 30, 20, 5, 9, 19, 37, 83, 29, 0, 0,
        ],
        type: 'spline',
      },
      {
        name: 'Brookfield',
        data: [1, 2, 3],
        type: 'spline',
      },
      {
        name: 'East Side',
        data: [1, 2, 3],
        type: 'spline',
      },
    ],
    chart: {
      type: 'spline',
      style: {
        fontFamily: 'serif',
        fontSize: '1.5rem'
      }
    },
    title: {
      text: "Current Day's Occupancy",
    },
    subtitle: {
      text: 'A subtitle or maybe caption here',
    },
    legend: {
      align: 'right',
      verticalAlign: 'middle',
      layout: 'vertical',
    },
    xAxis: {
      title: {
        text: 'Hour',
      },
      categories: [
        '12',
        '1:00',
        '2:00',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        '11',
        '12',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        '11',
      ],
      accessibility: {
        description: 'Hour of current day',
      },
    },
    yAxis: {
      title: {
        text: 'Occupancy',
      },
      accessibility: {
        description: 'Occupancy',
      },
    },
    tooltip: {
      stickOnContact: true,
    },
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 600,
            minHeight: 500,
          },
          chartOptions: {
            legend: {
              align: 'center',
              verticalAlign: 'bottom',
              layout: 'horizontal',
            },
          },
        },
      ],
    },
  };
}
