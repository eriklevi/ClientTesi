import { Component, OnInit } from '@angular/core';
import {ChartOptions, ChartType} from 'chart.js';
import {Label} from 'ng2-charts';
import {AlertService} from '../_services/alert.service';
import {CountedPacketsService} from '../_services/counted-packets.service';
import {Sniffer} from '../_models/sniffer';
import {SnifferService} from '../_services/sniffer.service';

@Component({
  selector: 'app-statistics-chart',
  templateUrl: './statistics-chart.component.html',
  styleUrls: ['./statistics-chart.component.css']
})
export class StatisticsChartComponent implements OnInit {


  totalParsedPackets: number;
  totalLocalParsedPackets: number;
  totalGlobalParsedPackets: number;
  globalPercent: number;
  localPercent: number;
  public loadingStats = false;
  selectorValue = 'Total';
  snifferList: Sniffer[];
  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'top',
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return label;
        },
      },
    }
  };
  public pieChartLabels: Label[] = ['Local', 'Global'];
  public pieChartData: number[];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartColors = [
    {
      backgroundColor: ['rgba(0,255,0,0.3)', 'rgba(0,0,255,0.3)'],
    },
  ];

  constructor(
    private alertService: AlertService,
    private snifferService: SnifferService,
    private countedPacketsService: CountedPacketsService
  ) { }

  ngOnInit() {
    this.fetchSniffers();
    this.fetchGeneralStats();
  }

  private fetchSniffers() {
    this.snifferService.getSniffers()
      .subscribe(
        data => {
          this.snifferList = data;
          // this.fetchLastEstimation();
        },
        error1 => {
          this.alertService.error('Impossible to fetch sniffer data');
        }
      );
  }

  private fetchGeneralStats() {
    this.loadingStats = true;
    this.countedPacketsService.getTotalParsedPackets()
      .subscribe(
        data => {
          this.totalLocalParsedPackets = data.local;
          this.totalGlobalParsedPackets = data.global;
          this.pieChartData = [data.local, data.global];
          this.totalParsedPackets = data.local + data.global;
          this.globalPercent = (data.global / (data.local + data.global)) * 100;
          this.localPercent = (data.local / (data.local + data.global)) * 100;
          this.loadingStats = false;
        }, error1 => {
          this.alertService.error('Impossible to retrieve packets statistics');
          this.loadingStats = false;
        }
      );
  }

  fetchStatsOnChange() {
    if (this.selectorValue === 'Total') {
      this.fetchGeneralStatsOnChange();
    } else {
      this.fetchStatsBySnifferId(this.selectorValue);
    }
  }

  private fetchStatsBySnifferId(selectorValue: string) {
    this.loadingStats = true;
    this.countedPacketsService.getTotalParsedPacketsBySnifferName(selectorValue)
      .subscribe(
        data => {
          this.totalLocalParsedPackets = data.local;
          this.totalGlobalParsedPackets = data.global;
          this.totalParsedPackets = data.local + data.global;
          this.globalPercent = (data.global / (data.local + data.global)) * 100;
          this.localPercent = (data.local / (data.local + data.global)) * 100;
          this.pieChartData = [data.local, data.global];
          this.loadingStats = false;
        },
        error1 => {
          this.alertService.error('Impossible to retrieve packet statistics');
          this.loadingStats = false;
        }
      );
  }

  private fetchGeneralStatsOnChange() {
    this.loadingStats = true;
    this.countedPacketsService.getTotalParsedPackets()
      .subscribe(
        data => {
          this.totalLocalParsedPackets = data.local;
          this.totalGlobalParsedPackets = data.global;
          this.totalParsedPackets = data.local + data.global;
          this.globalPercent = (data.global / (data.local + data.global)) * 100;
          this.localPercent = (data.local / (data.local + data.global)) * 100;
          this.pieChartData = [data.local, data.global];
          this.loadingStats = false;
        }, error1 => {
          this.alertService.error('Impossible to retrieve packets statistics');
          this.loadingStats = false;
        }
      );
  }

  private getColor(): string{

  }

}
