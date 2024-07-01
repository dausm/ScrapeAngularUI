import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../../layout/footer/footer.component';
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
      <main class="bg-white rounded-xl mx-6 mt-4 p-4">
      <highcharts-chart
        class="w-full grow block"
        [Highcharts]="highcharts"
        [options]="chartOptions"
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
  chartOptions: Highcharts.Options = {
    series: [{
      name: 'Christmas Eve',
      data: [1,2,3],
      type: 'spline'
    }],
    chart: {
      type: 'spline'
    },
    title: {
      text: 'Highcharts responsive chart'
    },
    subtitle: {
      text: 'Resize the frame to see the legend position change'
    },
    legend: {
      align: 'right',
      verticalAlign: 'middle',
      layout: 'vertical'
    },
    xAxis: {
      title: {
        text: 'Fruits'
    },
      categories: ['Apples', 'Oranges', 'Bananas'],
      accessibility: {
        description: 'Fruits eaten during Christmas'
      }
    },
    yAxis: {
      title: {
        text: 'Amount'
      },
      accessibility: {
        description: 'Amount'
      }
    },
    tooltip: {
      stickOnContact: true
  },
    responsive: {
      rules: [{
        condition: {
          maxWidth: 600,
          minHeight: 500
        },
        chartOptions: {
          legend: {
            align: 'center',
            verticalAlign: 'bottom',
            layout: 'horizontal'
          }
        }
      }]
    }
  };
  // HC_Accessibility(Highcharts);
}
