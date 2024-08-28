import { DateTimeMaximum, DateTimeMinimum } from "./highchart-settings";

export const BaseScatterChartOptions: Highcharts.Options = {
  chart: {
    type: 'scatter',
    allowMutatingData: false,
    style: {
      fontFamily: '"Montserrat", sans-serif',
      fontSize: '1.5rem',
    },
    displayErrors: true
  },
  title: {
    text: "Month's Occupancy Trends",
  },
  legend: {
    enabled: false,
  },
  xAxis: {
    id: 'xAxis-scatter',
    title: {
      text: 'Time of Day',
    },
    startOfWeek: 0,
    type: 'datetime',
    crosshair: true,
    dateTimeLabelFormats: {
      second: '%H:%M %P',
    },
    min: DateTimeMinimum,
    max: DateTimeMaximum,
    showLastLabel: false,
    showFirstLabel: false,
  },
  plotOptions: {
    scatter: {
      color: '#b2292e',
    },
  },
  tooltip: {
    stickOnContact: true,
    headerFormat: '<strong>{point.point.name}</strong>',
    pointFormat: '<br/>Count: {point.y}',
  },
  yAxis: {
    title: {
      text: 'Occupancy',
    },
    accessibility: {
      description: 'Occupancy',
    },
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
  time: {
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  },
};
