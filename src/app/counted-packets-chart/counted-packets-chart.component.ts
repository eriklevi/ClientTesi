import { Component, OnInit } from '@angular/core';
import {ChartDataSets, ChartOptions, ChartType} from 'chart.js';
import {Label} from 'ng2-charts';
import {CountedPacketsService} from '../_services/counted-packets.service';
import {AlertService} from '../_services/alert.service';
import {DataRequestService} from '../_services/data-request.service';
import {Subscription} from 'rxjs';
import {DataRequest} from '../_models/dataRequest';
import * as moment from 'moment';

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
  public barChartLegend = false;
  public barChartData: ChartDataSets[];
  dataReady = false;
  private subscription: Subscription;
  colors: Array<any> = [
    { // first color
      backgroundColor: 'rgba(0,255,0,1)',
      borderColor: 'rgba(225,10,24,0.2)',
      pointBackgroundColor: 'rgba(225,10,24,0.2)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(225,10,24,0.2)'
    }];

  constructor(
    private countedPacketsService: CountedPacketsService,
    private alertService: AlertService,
    private dataRequestService: DataRequestService
  ) { }

  ngOnInit() {
    this.subscription = this.dataRequestService.getRequestBehaviourSubject().subscribe(
      req => {
        if (req.valid) {
          this.loadData(req);
        }
      }, error => {
        console.log('errore!');
    });
  }

  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }


  loadData(req: DataRequest) {
    console.log(req);
    this.countedPacketsService.getCountedPacketsBySniffer(req.buildingId
      , req.roomId
      , req.snifferName
      , req.fromTimestamp
      , req.toTimestamp
      , req.resolution).subscribe(
        next => {
          this.barChartData = [{data: next.map(item => item.avgEstimatedDevices)}];
          this.barChartLabels = next.map( item => {
            return moment(item.startTimestamp).locale('it').format('llll').toString();
          });
          this.dataReady = true;
        },
      error => {
          this.alertService.error('Unable to fetch data!');
      }
    );
    console.log(this.barChartData);
  }
}
