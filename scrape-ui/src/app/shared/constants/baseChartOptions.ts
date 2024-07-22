export const BaseChartOptions: Highcharts.Options = {
  chart: {
    type: 'scatter',
    style: {
      fontFamily: '"Montserrat", sans-serif',
      fontSize: '1.5rem',
    },
    displayErrors: true,
  },
  time: {
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  },
  title: {
    text: "Month's Occupancy Trends",
    style: {
      fontFamily: '"Montserrat", sans-serif',
    },
  },
  legend: {
    align: 'right',
    verticalAlign: 'middle',
    layout: 'vertical',
  },
  xAxis: {
    title: {
      text: 'Time',
    },
    labels: {
      rotation: -65,
      style: {
        fontSize: '9px',
        fontFamily: '"Montserrat", sans-serif',
      },
    },
    categories: [
      '12AM',
      '1AM',
      '2AM',
      '3AM',
      '4AM',
      '5AM',
      '6AM',
      '7AM',
      '8AM',
      '9AM',
      '10AM',
      '11AM',
      '12PM',
      '1PM',
      '2PM',
      '3PM',
      '4PM',
      '5PM',
      '6PM',
      '7PM',
      '8PM',
      '9PM',
      '10PM',
      '11PM',
    ],
    crosshair: true,
    startOfWeek: 0,
    accessibility: {
      description: 'Time of current day',
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
  }
};
