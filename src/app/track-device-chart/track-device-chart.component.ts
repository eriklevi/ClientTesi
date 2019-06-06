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
          , map( x => x.snifferBuilding + ', ' + x.snifferRoom + ', ' + x.snifferName)
        ).subscribe(
          y => {
            this.positionsLabels.push(y);
          }
        );
        const positions = e.map( x => x.snifferId);
        const timestamps = e.map( x => x.timestamp);
        const cRed: ChartDataSets = {
          data: e.map(
            e1 => {
              if (e1.rssi > -60) {
                return {
                  x: e1.timestamp,
                  y: this.positionsLabels.indexOf(e1.snifferBuilding + ', ' + e1.snifferRoom + ', ' + e1.snifferName)
                };
              }
            }
          ),
          pointBackgroundColor: 'rgba(255, 0, 0, 0.5 )',
          pointBorderColor: 'rgba(255, 0, 0, 0.5 )',
          pointRadius: 5,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: 'rgba(255, 0, 0, 0.5 )',
          pointHoverBorderColor: 'rgba(255, 0, 0, 0.5 )'
        }
        const cGreen: ChartDataSets = {
          data: e.map(
            e1 => {
              if (e1.rssi > -90 && e1.rssi <= -75) {
                return {
                  x: e1.timestamp,
                  y: this.positionsLabels.indexOf(e1.snifferBuilding + ', ' + e1.snifferRoom + ', ' + e1.snifferName)
                };
              }
            }
          ),
          pointBackgroundColor: 'rgba(0, 255, 0, 0.5 )',
          pointBorderColor: 'rgba(0, 255, 0, 0.5 )',
          pointRadius: 5,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: 'rgba(0, 255, 0, 0.5 )',
          pointHoverBorderColor: 'rgba(0, 255, 0, 0.5 )'
        }
        const cYellow: ChartDataSets = {
          data: e.map(
            e1 => {
              if (e1.rssi > -75 && e1.rssi <= -60) {
                return {
                  x: e1.timestamp,
                  y: this.positionsLabels.indexOf(e1.snifferBuilding + ', ' + e1.snifferRoom + ', ' + e1.snifferName)
                };
              }
            }
          ),
          pointBackgroundColor: 'rgba(255, 255, 0, 0.5 )',
          pointBorderColor: 'rgba(255, 255, 0, 0.5 )',
          pointRadius: 5,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: 'rgba(255, 255, 0, 0.5 )',
          pointHoverBorderColor: 'rgba(255, 255, 0, 0.5 )'
        }
        const cBlue: ChartDataSets = {
          data: e.map(
            e1 => {
              if (e1.rssi <= -90) {
                return {
                  x: e1.timestamp,
                  y: this.positionsLabels.indexOf(e1.snifferBuilding + ', ' + e1.snifferRoom + ', ' + e1.snifferName)
                };
              }
            }
          ),
          pointBackgroundColor: 'rgba(0, 0, 255, 0.5 )',
          pointBorderColor: 'rgba(0, 0, 255, 0.5 )',
          pointRadius: 5,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: 'rgba(0, 0, 255, 0.5 )',
          pointHoverBorderColor: 'rgba(0, 0, 255, 0.5 )'
        }
        /*
        const c: ChartDataSets = {
          data: e.map(
            e1 => {
              return {
                x: e1.timestamp,
                y: this.positionsLabels.indexOf(e1.snifferBuilding + ', ' + e1.snifferRoom + ', ' + e1.snifferId)
              };
            }
          ),
          pointBackgroundColor: 'rgba(0, 0, 255, 0.5 )',
          pointBorderColor: 'rgba(0, 0, 255, 0.5 )',
          pointRadius: 5,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: 'rgba(0, 0, 255, 0.5 )',
          pointHoverBorderColor: 'rgba(0, 0, 255, 0.5 )'
        };*/
        if (!cRed.data) {
          cRed.data = [];
        }
        if (!cYellow.data) {
          cYellow.data = [];
        }
        if (!cGreen.data) {
          cGreen.data = [];
        }
        if (!cBlue.data) {
          cBlue.data = [];
        }
        this.scatterChartData = [cRed, cBlue, cGreen, cYellow];
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
                max: this.positionsLabels.length,
                callback: ( x => this.positionsLabels[x])
              }
            }]
          },
          tooltips: {
            callbacks: {
              label: (tooltipItem) => {
                return moment(tooltipItem.xLabel).locale('it').format('llll').toString();
            }
          }
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
