import {Component, OnDestroy, OnInit} from '@angular/core';
import {ChartDataSets, ChartOptions, ChartType} from 'chart.js';
import {Label} from 'ng2-charts';
import {Subscription} from 'rxjs';
import {CountedPacketsService} from '../_services/counted-packets.service';
import {AlertService} from '../_services/alert.service';
import {DataRequestService} from '../_services/data-request.service';
import {DataRequest} from '../_models/dataRequest';
import * as moment from 'moment';

@Component({
  selector: 'app-compare-chart',
  templateUrl: './compare-chart.component.html',
  styleUrls: ['./compare-chart.component.css']
})
export class CompareChartComponent implements OnInit, OnDestroy {

  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: {xAxes: [{
      }], yAxes: [{
        ticks: {
          min: 0
        }
      }]}
  };
  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartData: ChartDataSets[] = [];
  public barChartPlugins = [];
  dataReady = false;
  private subscription: Subscription;
  private resetChartSubscription: Subscription;
  private colorIndex = 0;
  private colorList: string[] = [
    'rgba(255, 0, 0, 1)', 'rgba(0, 255, 0, 1)', 'rgba(0, 0, 255, 1)'
    , 'rgba(255, 255, 0, 1)', 'rgba(0, 128, 128, 1)', 'rgba(128, 0, 0, 1)'
  ];


  constructor(
    private countedPacketsService: CountedPacketsService,
    private alertService: AlertService,
    private dataRequestService: DataRequestService
  ) { }

  ngOnInit() {
    this.subscription = this.dataRequestService.getDataRequestSubject().subscribe(
      req => {
        if (req.valid) {
          this.loadData(req);
        }
      }, error => {
        console.log('errore!');
      });
    this.resetChartSubscription = this.dataRequestService.getResetChart()
      .subscribe(
        req => {
          this.barChartData = [];
          this.barChartLabels = [];
          this.dataReady = false;
        }
      );
  }

  loadData(req: DataRequest) {
    console.log(req);
    this.countedPacketsService.getCountedPacketsBySniffer(req.buildingId, req.roomId, req.snifferId, req.fromTimestamp, req.toTimestamp, req.resolution).subscribe(
      next => {
        this.barChartData.push(
          {
            data: next.map(item => item.distinctMacAddresses + item.distinctFingerprints)
            , label: req.snifferId
            , backgroundColor : this.colorList[this.colorIndex % 6]
            , borderColor : this.colorList[this.colorIndex++ % 6]
            , hoverBackgroundColor: undefined
            , hoverBorderColor: undefined
          });
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

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.resetChartSubscription.unsubscribe();
  }
}
