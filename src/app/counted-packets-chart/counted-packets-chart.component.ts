import { Component, OnInit } from '@angular/core';
import {ChartDataSets, ChartOptions, ChartType} from 'chart.js';
import {Label} from 'ng2-charts';
import {CountedPacketsService} from '../_services/counted-packets.service';
import {map} from 'rxjs/operators';
import {AlertService} from '../_services/alert.service';

@Component({
  selector: 'app-counted-packets-chart',
  templateUrl: './counted-packets-chart.component.html',
  styleUrls: ['./counted-packets-chart.component.css']
})
export class CountedPacketsChartComponent implements OnInit {

  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: {xAxes: [{}], yAxes: [{}]}
  };
  public barChartLabels: Label[];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartData: ChartDataSets[];
  dataReady = false;

  constructor(
    private countedPacketsService: CountedPacketsService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
  }

  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }


  loadData() {
    this.countedPacketsService.getCountedPacketsBySniffer('5c5989848d07418ded788aea'
      , '5c59bae38d07419256f6326d'
      , '5c64309d8d074152f93b5231'
      , Math.floor(Date.now()) - 3600000
      , Math.floor(Date.now())
      , 'fifteenMinute').subscribe(
        next => {
          this.barChartData = [{data: next.map(item => item.avgEstimatedDevices)}];
          this.barChartLabels = next.map(item => item.startTimestamp.toString());
          this.dataReady = true;
        },
      error => {
          this.alertService.error('Unable to fetch data!');
      }
    );
    console.log(this.barChartData);
  }
}
