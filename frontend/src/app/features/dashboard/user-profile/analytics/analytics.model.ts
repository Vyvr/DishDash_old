import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTooltip,
  ApexFill,
  ApexLegend,
  ApexPlotOptions,
  ApexStroke,
  ApexYAxis,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
};

export class ChartBuilder {
  private _series: ApexAxisChartSeries;
  private _chart: ApexChart;
  private _dataLabels: ApexDataLabels;
  private _plotOptions: ApexPlotOptions;
  private _yaxis: ApexYAxis;
  private _xaxis: ApexXAxis;
  private _fill: ApexFill;
  private _tooltip: ApexTooltip;
  private _stroke: ApexStroke;
  private _legend: ApexLegend;

  get series(): ApexAxisChartSeries {
    return this._series;
  }
  set series(value: ApexAxisChartSeries) {
    this._series = value;
  }

  get chart(): ApexChart {
    return this._chart;
  }
  set chart(value: ApexChart) {
    this._chart = value;
  }

  get dataLabels(): ApexDataLabels {
    return this._dataLabels;
  }
  set dataLabels(value: ApexDataLabels) {
    this._dataLabels = value;
  }

  get plotOptions(): ApexPlotOptions {
    return this._plotOptions;
  }
  set plotOptions(value: ApexPlotOptions) {
    this._plotOptions = value;
  }

  get yaxis(): ApexYAxis {
    return this._yaxis;
  }
  set yaxis(value: ApexYAxis) {
    this._yaxis = value;
  }

  get xaxis(): ApexXAxis {
    return this._xaxis;
  }
  set xaxis(value: ApexXAxis) {
    this._xaxis = value;
  }

  get fill(): ApexFill {
    return this._fill;
  }
  set fill(value: ApexFill) {
    this._fill = value;
  }

  get tooltip(): ApexTooltip {
    return this._tooltip;
  }
  set tooltip(value: ApexTooltip) {
    this._tooltip = value;
  }

  get stroke(): ApexStroke {
    return this._stroke;
  }
  set stroke(value: ApexStroke) {
    this._stroke = value;
  }

  get legend(): ApexLegend {
    return this._legend;
  }
  set legend(value: ApexLegend) {
    this._legend = value;
  }

  constructor() {
    this.series = [
      {
        name: 'Net Profit',
        data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
      },
    ];
    this.chart = {
      type: 'bar',
      height: 350,
    };
    this.plotOptions = {
      bar: {
        horizontal: false,
        columnWidth: '55%',
      },
    };
    this.dataLabels = {
      enabled: false,
    };
    this.stroke = {
      show: true,
      width: 2,
      colors: ['transparent'],
    };
    this.xaxis = {
      categories: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
    };
    this.fill = {
      opacity: 1,
    };
    this.tooltip = {
      y: {
        formatter: function (val) {
          return val.toString();
        },
      },
    };
  }
}
