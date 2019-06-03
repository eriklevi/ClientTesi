import {Component, OnDestroy, OnInit} from '@angular/core';
import {ChartDataSets, ChartOptions, ChartType} from 'chart.js';
import {Label} from 'ng2-charts';
import {TrackingServiceService} from '../_services/tracking-service.service';
import {DeviceData} from '../_models/device-data';
import {AlertService} from '../_services/alert.service';
import {DataRequestService} from '../_services/data-request.service';
import {from, Subscription} from 'rxjs';
import {TrackDataRequest} from '../_models/track-data-request';
import {distinct, map} from 'rxjs/operators';
import * as moment from 'moment';


@Component({
  selector: 'app-track-device-chart',
  templateUrl: './track-device-chart.component.html',
  styleUrls: ['./track-device-chart.component.css']
})
export class TrackDeviceChartComponent implements OnInit, OnDestroy {

  public scatterChartOptions: ChartOptions = {};
  public scatterChartLabels: Label[] = [];

  public scatterChartData: ChartDataSets[] = [];
  public scatterChartType: ChartType = 'scatter';
  dataReady = false;
  subscription: Subscription;
  private loadingDataToDisplay = false;
  private positionsLabels: string[] = [];


  constructor(
    private trackingService: TrackingServiceService,
    private alertService: AlertService,
    private dataRequestService: DataRequestService
  ) { }

  ngOnInit() {
    this.subscription = this.dataRequestService.getTrackrequestSubject()
      .subscribe(
        x => {
          this.fetchData(x);
        }
      );
  }

  fetchData(request: TrackDataRequest) {
    this.positionsLabels = [];
    this.loadingDataToDisplay = true;
    this.scatterChartData = [];
    this.trackingService.trackDeviceByDayAndMac(request.mac, request.timestampFrom, request.timestampTo).subscribe(
      e => {
        this.positionsLabels.push('');
        from(e as DeviceData[]).pipe(
          distinct( x => x.snifferName)
          , map( x => x.snifferName)
        ).subscribe(
          y => {
            this.positionsLabels.push(y);
          }
        )
        const positions = e.map( x => x.snifferName);
        const timestamps = e.map( x => x.timestamp);
        const c: ChartDataSets = {
          data: e.map(
            e1 => {
              return {
                x: e1.timestamp,
                y: this.positionsLabels.indexOf(e1.snifferName)
              };
            }
          )
        }
       this.scatterChartData.push(c);
        this.scatterChartOptions = {
          responsive: true,
          legend: {
            display: false
          },
          scales: {
            xAxes: [{
              ticks: {
                callback: (value => moment(value).locale('it').format('llll').toString())
              }
            }],
            yAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'Sniffer'
              },
              ticks: {
                min: 0,
                callback: ( x => this.positionsLabels[x])
              }
            }]
          }};
        this.dataReady = true;
      }, error1 => {
        this.alertService.error('Impossible to fetch device data!');
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


}
