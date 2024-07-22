export const BaseTimeChart: Highcharts.Options = {
    chart: {
      type: 'scatter',
      style: {
        fontFamily: 'serif',
        fontSize: '1.5rem',
      },
    },
    time: {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    title: {
      text: "Current Day's Occupancy",
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
          fontFamily: 'Verdana, sans-serif',
        },
      },
      type: 'datetime',
      crosshair: true,
      dateTimeLabelFormats: {
        second: '%H:%M %P',
      },
      startOfWeek: 0,
      accessibility: {
        description: 'Time',
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
