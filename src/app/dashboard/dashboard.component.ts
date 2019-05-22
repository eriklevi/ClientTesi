import { Component, OnInit } from '@angular/core';
import {SnifferService} from '../_services/sniffer.service';
import {AlertService} from '../_services/alert.service';
import {CountedPacketsService} from '../_services/counted-packets.service';
import {Sniffer} from '../_models/sniffer';
import {ChartOptions, ChartType} from 'chart.js';
import {Label} from 'ng2-charts';
import {CountResult} from '../_models/countResult';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  mqttConnectedClients: string;
  totalParsedPackets: number;
  totalLocalParsedPackets: number;
  totalGlobalParsedPackets: number;
  snifferList: Sniffer[];
  loadingComplete = 0;
  selectorValue = 'Total';
  public loadingStats = false;
  displayedColumns = ['name', 'building', 'room', 'total'];
  lastCountedPackets: CountResult[];
  mqttClientsLoaded = false;

  /*
  ------------- chart variables
   */

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
    private snifferService: SnifferService,
    private alertService: AlertService,
    private countedPacketsService: CountedPacketsService
  ) { }

  ngOnInit() {
    this.fetchConnectedClients();
    this.fetchGeneralStats();
    this.fetchSniffers();
  }

  private fetchConnectedClients() {
    this.snifferService.getConnectedSniffers().subscribe( data => {
        this.mqttConnectedClients = data;
        this.loadingComplete++;
        this.mqttClientsLoaded = true;
      }, error => {
        this.alertService.error('Unable to fetch connected clients!');
        this.loadingComplete++;
        this.mqttClientsLoaded = true;
    });
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
          this.loadingComplete++;
          this.loadingStats = false;
        }, error1 => {
          this.alertService.error('Impossible to retrieve packets statistics');
          this.loadingComplete++;
          this.loadingStats = false;
        }
      );
  }

  private fetchSniffers() {
    this.snifferService.getSniffers()
      .subscribe(
        data => {
          this.snifferList = data;
          this.loadingComplete++;
          //this.fetchLastEstimation();
        },
        error1 => {
          this.alertService.error('Impossible to fetch sniffer data');
          this.loadingComplete++;
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
          this.pieChartData = [data.local, data.global];
          this.loadingStats = false;
        }, error1 => {
          this.alertService.error('Impossible to retrieve packets statistics');
          this.loadingStats = false;
        }
      );
  }
/*
  private fetchLastEstimation() {
    for (const s of this.snifferList) {
      this.countedPacketsService.getLastEstimationBySnifferId(s.id)
        .subscribe(
          data => {
            this.lastCountedPackets.push(data);
          }, error1 => {
            this.alertService.error('Impossible to fetch last estimation');
          }
        );
    }
  }*/
}
